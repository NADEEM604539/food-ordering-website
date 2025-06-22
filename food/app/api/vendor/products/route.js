import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('email')?.value;
    const role = cookieStore.get('role')?.value;

    if (!email || !role || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userRows[0].id;

    const [vendorRows] = await pool.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );

    if (!vendorRows.length) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const vendorId = vendorRows[0].id;

    const [products] = await pool.query(
      `SELECT 
         m.id AS menu_item_id,
         m.name AS item_name,
         m.description,
         m.price,
         m.image_url,
         m.category,
         r.name AS restaurant_name
       FROM menu_items m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE r.vendor_id = ?`,
      [vendorId]
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Vendor product fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
