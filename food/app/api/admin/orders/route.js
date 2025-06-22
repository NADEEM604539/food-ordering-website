import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.status, o.total_price, o.created_at,
             u.name AS customer_name, u.email AS customer_email,
             r.name AS restaurant_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN restaurants r ON o.restaurant_id = r.id
      ORDER BY o.created_at DESC
    `);
    return Response.json({ orders: rows });
  } catch (err) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
