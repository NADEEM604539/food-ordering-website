// app/api/vendor/restaurants/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const c =await cookies();
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;
    if (!email || role !== 'vendor')
      return NextResponse.json({ restaurants: [] }, { status: 401 });

    // resolve vendor -> id
    const [[{ id: vendorId } = {}]] = await pool.query(
      `SELECT v.id FROM vendors v JOIN users u ON v.user_id = u.id
       WHERE u.email = ?`,
      [email]
    );
    if (!vendorId) return NextResponse.json({ restaurants: [] });

    // fetch full restaurant objects
    const [rows] = await pool.query(
      `SELECT id, name, location, description, image_url
         FROM restaurants
        WHERE vendor_id = ?`,
      [vendorId]
    );

    return NextResponse.json({ restaurants: rows });
  } catch (err) {
    console.error('GET /vendor/restaurants error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
