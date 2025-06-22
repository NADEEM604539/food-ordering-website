import  db  from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT mi.id, mi.name, mi.price, mi.description, mi.image_url,
             r.name AS restaurant_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
    `);
    return Response.json({ products: rows });
  } catch (err) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
