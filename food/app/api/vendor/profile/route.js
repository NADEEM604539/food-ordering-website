// app/api/vendor/profile/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/* ─────────── GET: read profile ─────────── */
export async function GET() {
  try {
    const c = await cookies();                       // await required
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;
    if (!email || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [[vendor] = [{}]] = await pool.query(
      `SELECT v.business_name, v.description, v.location
         FROM vendors v
         JOIN users u ON v.user_id = u.id
        WHERE u.email = ?`,
      [email]
    );

    if (!vendor.business_name) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ─────────── PUT: update profile ─────────── */
export async function PUT(req) {
  try {
    const c = await cookies();
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;
    if (!email || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { business_name, description, location } = await req.json();
    if (!business_name) {
      return NextResponse.json({ error: 'Business name required' }, { status: 400 });
    }

    await pool.query(
      `UPDATE vendors v
         JOIN users u ON v.user_id = u.id
        SET v.business_name = ?, v.description = ?, v.location = ?
       WHERE u.email = ?`,
      [business_name, description, location, email]
    );

    return NextResponse.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
