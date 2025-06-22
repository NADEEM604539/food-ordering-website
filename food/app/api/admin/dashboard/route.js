import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Your MySQL connection

export const runtime = 'nodejs';

export async function GET(request) {
  // ✅ Fix: cookies() must be awaited
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      [[{ userCount }]],
      [[{ vendorCount }]],
      [[{ productCount }]],
      [[{ orderCount }]]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) AS userCount FROM users WHERE role_id = 3'),
      pool.query('SELECT COUNT(*) AS vendorCount FROM users WHERE role_id = 2'),
      pool.query('SELECT COUNT(*) AS productCount FROM menu_items'),
      pool.query('SELECT COUNT(*) AS orderCount FROM orders')
    ]);

    const [statusRows] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM orders GROUP BY status'
    );

    const [recentOrders] = await pool.query(`
      SELECT o.id, o.total_price, o.status, o.created_at,
             u.name AS customer_name, u.email AS customer_email,
             r.name AS restaurant_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN restaurants r ON o.restaurant_id = r.id
        ORDER BY o.created_at DESC
        LIMIT 5
    `);

    return NextResponse.json({
      metrics: {
        customers: userCount,
        vendors: vendorCount,
        products: productCount,
        orders: orderCount
      },
      ordersByStatus: statusRows,
      recentOrders
    });

  } catch (err) {
    console.error('[ADMIN_DASHBOARD_GET_ERROR]', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
