import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const c =await cookies();
  if (c.get('role')?.value !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.query(
    `SELECT id, name, email FROM users WHERE role_id = 3`
  );

  return NextResponse.json({ customers: rows });
}
