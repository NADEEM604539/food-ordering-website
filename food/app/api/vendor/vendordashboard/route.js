import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const c = await cookies();
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;
    if (!email || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* Get vendor id */
    const [[{ id: vendorId } = {}]] = await pool.query(`
      SELECT v.id
        FROM vendors v
        JOIN users u ON v.user_id = u.id
       WHERE u.email = ?
    `, [email]);

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    /* Fetch stats: product count, order count, revenue */
    const [[statsRow] = [{}]] = await pool.query(`
      SELECT
        COUNT(DISTINCT mi.id) AS productCount,
        COUNT(DISTINCT o.id)  AS orderCount,
        IFNULL(SUM(o.total_price), 0) AS revenue
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      LEFT JOIN orders o ON o.restaurant_id = r.id
     WHERE r.vendor_id = ?
    `, [vendorId]);

    /* Vendor profile details */
    const [[vendorRow] = [{}]] = await pool.query(`
      SELECT business_name, description, location
        FROM vendors WHERE id = ?
    `, [vendorId]);

    return NextResponse.json({
      vendor: vendorRow,
      stats: {
        productCount: statsRow.productCount || 0,
        orderCount: statsRow.orderCount || 0,
        revenue: statsRow.revenue || 0
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
