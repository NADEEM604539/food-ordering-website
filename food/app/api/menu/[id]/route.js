import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/**
 * GET  /api/menu/[id]
 * Returns full menu-item detail.
 */
export async function GET(_req, ctx) {
  const { id } = await ctx.params;            // 🔑 await params in Next 15+

  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, price, image_url FROM menu_items WHERE id = ?',
      [id]
    );

    if (rows.length === 0)
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({ item: rows[0] });
  } catch (err) {
    console.error('[MENU_ITEM_GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
