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
      return NextResponse.json({ restaurants: [] });
    }

    // Get vendor ID
    const [[{ id: vendorId } = {}]] = await pool.query(`
      SELECT v.id
        FROM vendors v
        JOIN users u ON v.user_id = u.id
       WHERE u.email = ?
    `, [email]);

    if (!vendorId) return NextResponse.json({ restaurants: [] });

    // Fetch restaurant names
    const [rows] = await pool.query(
      `SELECT name FROM restaurants WHERE vendor_id = ?`, 
      [vendorId]
    );
    const names = rows.map(r => r.name);
    
    return NextResponse.json({ restaurants: names });
  } catch (err) {
    console.error('GET vendor restaurants error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
