// app/api/vendor/restaurants/create/route.js

import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { name, location, description, image_url } = await req.json();
    const email = await cookies().get('email')?.value;

    if (!email) return new Response('Unauthorized', { status: 401 });

    const [[{ id: user_id }]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    const [[{ id: vendor_id }]] = await pool.query('SELECT id FROM vendors WHERE user_id = ?', [user_id]);

    await pool.query(
      'INSERT INTO restaurants (name, location, description, image_url, vendor_id) VALUES (?, ?, ?, ?, ?)',
      [name, location, description, image_url, vendor_id]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
