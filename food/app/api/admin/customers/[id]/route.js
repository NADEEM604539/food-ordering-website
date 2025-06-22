import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(req, { params }) {
  const c =await cookies();
  if (c.get('role')?.value !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const customerId = params.id;
  try {
    await pool.query(`DELETE FROM users WHERE id = ? AND role_id = 3`, [customerId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
