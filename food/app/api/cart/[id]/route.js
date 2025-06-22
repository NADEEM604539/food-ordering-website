import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req, { params }) {
  const itemId = params.id;

  try {
    await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cart DELETE Error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
