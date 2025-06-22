// app/api/checkout/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';          // ← your MySQL pool
import { randomUUID } from 'crypto';



export async function GET() {
  try {
    const email = cookies().get('email')?.value;
    if (!email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    /* find user & role */
    const [[user] = []] = await pool.query(
      `SELECT u.id, r.role_name AS role
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE email = ?`, [email]
    );
    if (!user || user.role !== 'customer')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    /* cart items */
    const [items] = await pool.query(
      `SELECT c.id, c.quantity, m.name, m.price
       FROM cart_items c
       JOIN menu_items m ON c.menu_item_id = m.id
       WHERE c.user_id = ?`, [user.id]
    );

    return NextResponse.json({ cart: items });
  } catch (err) {
    console.error('[CHECKOUT_GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { paymentMethod } = body || {};

  if (!paymentMethod)
    return NextResponse.json({ error: 'Payment method required' }, { status: 400 });

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const email = cookies().get('email')?.value;
    if (!email) throw new Error('Unauthenticated');

    /* user & cart */
    const [[user] = []] = await conn.query(
      `SELECT u.id, r.role_name AS role
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE email = ?`, [email]
    );
    if (!user || user.role !== 'customer') throw new Error('Forbidden');

    const [cart] = await conn.query(
      `SELECT c.menu_item_id, c.quantity, m.price, m.restaurant_id
       FROM cart_items c
       JOIN menu_items m ON c.menu_item_id = m.id
       WHERE c.user_id = ?`, [user.id]
    );
    if (cart.length === 0) throw new Error('Cart is empty');

    /* assume all items from same restaurant */
    const restaurantId = cart[0].restaurant_id;
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    /* 1️⃣ order */
    const [orderRes] = await conn.query(
      `INSERT INTO orders (user_id, restaurant_id, total_price, status)
       VALUES (?, ?, ?, 'pending')`,
      [user.id, restaurantId, total]
    );
    const orderId = orderRes.insertId;

    /* 2️⃣ order_items */
    const orderRows = cart.map((i) => [
      orderId,
      i.menu_item_id,
      i.quantity,
      i.price,
    ]);
    await conn.query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
       VALUES ?`, [orderRows]
    );

    /* 3️⃣ payment */
    await conn.query(
      `INSERT INTO payments (order_id, payment_method, transaction_id, status)
       VALUES (?, ?, ?, 'success')`,
      [orderId, paymentMethod, randomUUID()]
    );

    /* 4️⃣ clear cart */
    await conn.query(`DELETE FROM cart_items WHERE user_id = ?`, [user.id]);

    await conn.commit();
    return NextResponse.json({ orderId, message: 'Order placed' });
  } catch (err) {
    await conn.rollback();
    console.error('[CHECKOUT_POST]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
