import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/**
 * GET /api/orders
 * Returns every order that belongs to the currently-logged-in customer.
 *
 * Cookie requirements:
 *   - email   : set at login
 *   - role    : should be "customer" (optional check)
 */
export async function GET() {
  try {
    /* ── identify customer from cookie ─────────────────── */
    const cookieStore = await cookies();                 // ✅ must await
    const email = cookieStore.get('email')?.value;
    const role  = cookieStore.get('role')?.value;

    if (!email || role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* ── find user_id ──────────────────────────────────── */
    const [[user] = []] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    /* ── fetch customer orders with restaurant names ──── */
    const [orders] = await pool.query(
      `SELECT o.id,
              o.total_price,
              o.status,
              o.created_at,
              r.name AS restaurant_name
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[API /api/orders] ', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
