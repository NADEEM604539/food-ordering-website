import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const cookieStore = await cookies();
    const email = cookieStore.get('email')?.value;
    const role = cookieStore.get('role')?.value;

    if (!email || role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [[user] = []] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [[order] = []] = await pool.query(
      `SELECT o.id, o.total_price, o.status, o.created_at, r.name AS restaurant_name
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.id = ? AND o.user_id = ?
        LIMIT 1`,
      [id, user.id]
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const [items] = await pool.query(
      `SELECT oi.id, m.name, oi.quantity, oi.price
         FROM order_items oi
         JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?`,
      [id]
    );

    return NextResponse.json({ order: { ...order, items } });
  } catch (err) {
    console.error('[API /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
