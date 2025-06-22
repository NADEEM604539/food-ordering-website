import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (cookieStore.get('role')?.value !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vendorId = params.id;
  if (!vendorId) {
    return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
  }

  try {
    /* 1️⃣ Find the vendor’s user_id */
    const [[vendor] = []] = await pool.query(
      'SELECT user_id FROM vendors WHERE id = ? LIMIT 1',
      [vendorId]
    );

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    /* 2️⃣ Delete the user row.
          ON DELETE CASCADE on vendors.user_id  → vendors row vanishes,
          and all restaurants/menu_items/orders linked to that vendor are
          cleaned up automatically. */
    await pool.query('DELETE FROM users WHERE id = ?', [vendor.user_id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE_VENDOR_ADMIN]', err);
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
