import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/**
 * GET /api/restaurants/[id]
 * Returns restaurant info + all its menu items.
 */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // 1. Get restaurant
    const [restaurantResult] = await pool.query(
      `SELECT id, name, description, location, image_url
       FROM restaurants
       WHERE id = ?`,
      [id]
    );

    if (restaurantResult.length === 0) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const restaurant = restaurantResult[0];

    // 2. Get its menu
    const [menuItems] = await pool.query(
      `SELECT id, name, description, price, image_url
       FROM menu_items
       WHERE restaurant_id = ?`,
      [id]
    );

    return NextResponse.json({ restaurant, menu: menuItems });
  } catch (err) {
    console.error('[GET_RESTAURANT_MENU_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
