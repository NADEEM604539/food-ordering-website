// app/api/vendor/products/[id]/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/* helper: verify vendor owns the item */
async function vendorOwnsItem(vendorId, itemId, conn) {
  const [[row] = []] = await conn.query(
    `SELECT 1
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE mi.id = ? AND r.vendor_id = ?`,
    [itemId, vendorId]
  );
  return !!row;
}

/* get vendorId from cookie email */
async function getVendorId(email, conn) {
  const [[row] = []] = await conn.query(
    `SELECT v.id
       FROM users u
       JOIN vendors v ON v.user_id = u.id
       WHERE u.email = ?`,
    [email]
  );
  return row?.id || null;
}

/* ────────────── DELETE */
export async function DELETE(_req, { params }) {
  const conn = await pool.getConnection();
  try {
    const email = cookies().get('email')?.value;
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const vendorId = await getVendorId(email, conn);
    if (!vendorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const ok = await vendorOwnsItem(vendorId, params.id, conn);
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await conn.query(`DELETE FROM menu_items WHERE id = ?`, [params.id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[PRODUCT_DELETE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}

/* ────────────── PUT (update) */
export async function PUT(req, { params }) {
  const body = await req.json();
  const { item_name, description, price, category, image_url } = body;

  if (!item_name || !price)
    return NextResponse.json({ error: 'Name and price required' }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    const email = cookies().get('email')?.value;
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const vendorId = await getVendorId(email, conn);
    if (!vendorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const ok = await vendorOwnsItem(vendorId, params.id, conn);
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await conn.query(
      `UPDATE menu_items
          SET name = ?, description = ?, price = ?, category = ?, image_url = ?
        WHERE id   = ?`,
      [item_name, description, price, category, image_url, params.id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    console.error('[PRODUCT_UPDATE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
