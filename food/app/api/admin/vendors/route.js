import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const c =await cookies();
    if (c.get('role')?.value !== 'admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows] = await pool.query(`
      SELECT v.id, v.business_name, v.description, v.location,
             u.name, u.email
        FROM vendors v
        JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
    `);

    return NextResponse.json({ vendors: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
