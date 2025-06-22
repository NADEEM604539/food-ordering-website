import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/* ─────────────────────────── GET: list orders ─────────────────────────── */
export async function GET() {
  try {
    const c = await cookies();
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;
    if (!email || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* resolve vendor → restaurants */
    const [[{ id: vendorId } = {}]] = await pool.query(
      `SELECT v.id FROM vendors v JOIN users u ON v.user_id = u.id
       WHERE u.email = ? LIMIT 1`,
      [email]
    );
    if (!vendorId) return NextResponse.json({ orders: [] });

    const [orders] = await pool.query(
      `SELECT o.id               AS order_id,
              o.total_price      AS total_price,
              o.status,
              o.created_at,
              u.name             AS customer_name,
              u.email            AS customer_email,
              p.payment_method,
              p.status           AS payment_status,
              p.transaction_id
       FROM orders o
       JOIN restaurants r  ON o.restaurant_id = r.id
       JOIN users       u  ON o.user_id      = u.id
       LEFT JOIN payments p ON p.order_id    = o.id
       WHERE r.vendor_id = ?
       ORDER BY o.created_at DESC`,
      [vendorId]
    );

    if (!orders.length) return NextResponse.json({ orders: [] });

    const ids = orders.map(o => o.order_id);
    const [items] = await pool.query(
      `SELECT oi.order_id, mi.name, oi.quantity, oi.price
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id IN (?)`,
      [ids]
    );

    const map = Object.fromEntries(orders.map(o => [o.order_id, { ...o, items: [] }]));
    items.forEach(it => map[it.order_id]?.items.push({
      name: it.name, quantity: it.quantity, price: it.price,
    }));

    return NextResponse.json({ orders: Object.values(map) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ─────────────────────────── PATCH: update status ─────────────────────── */
export async function PATCH(req) {
  try {
    const c =await cookies();
    if (c.get('role')?.value !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get('id');
    const { newStatus } = await req.json();
    const allowed = ['pending', 'preparing', 'delivered', 'cancelled'];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ─────────────────────────── DELETE: remove order ─────────────────────── */
export async function DELETE(req) {
  try {
    const c =await cookies();
    if (c.get('role')?.value !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Order id required' }, { status: 400 });

    /* clean child tables first */
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    await pool.query('DELETE FROM payments    WHERE order_id = ?', [id]);
    await pool.query('DELETE FROM orders      WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
