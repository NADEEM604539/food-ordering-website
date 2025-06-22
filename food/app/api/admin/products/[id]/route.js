import  db  from '@/lib/db';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Optional: Check if product exists first
    await db.query(`DELETE FROM menu_items WHERE id = ?`, [id]);
    return Response.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
