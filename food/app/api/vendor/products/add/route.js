import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import  pool  from '@/lib/db';           // adjust if your export differs
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ─────────────────────────────── POST /api/vendor/products/add */
export async function POST(req) {
  try {
    /* 1️⃣  parse multipart form ----------------------------- */
    const form = await req.formData();

    const file       = form.get('image');             // File object
    const name       = form.get('name')       ?? form.get('item_name');
    const description= form.get('description') ?? '';
    const price      = form.get('price');
    const category   = form.get('category')   ?? '';
    const resName    = form.get('res_name')   ?? '';

    if (!name || !price || !file || typeof file === 'string')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    /* 2️⃣  save image into /public/uploads ------------------ */
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filename  = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const buffer    = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);
    const imageUrl  = `/uploads/${filename}`;

    /* 3️⃣  vendor authentication ---------------------------- */
    const email = cookies().get('email')?.value;
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const conn = await pool.getConnection();
    try {
      /*   vendor id from user email  */
      const [[vendor]] = await conn.query(
        `SELECT v.id
           FROM users u
           JOIN vendors v ON v.user_id = u.id
          WHERE u.email = ?`,
        [email]
      );
      if (!vendor) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

      /*   restaurant chosen by its name  */
      const [[rest]] = await conn.query(
        `SELECT id FROM restaurants
          WHERE vendor_id = ? AND name = ?
          LIMIT 1`,
        [vendor.id, resName]
      );
      if (!rest) return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 });

      /* 4️⃣  insert new menu item --------------------------- */
      await conn.query(
        `INSERT INTO menu_items
           (restaurant_id, name, description, price, category, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rest.id, name, description, price, category, imageUrl]
      );

      return NextResponse.json({ message: 'Product added', image_url: imageUrl });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('[PRODUCT_ADD_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
