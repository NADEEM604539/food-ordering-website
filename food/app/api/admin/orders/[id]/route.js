import db from '@/lib/db';

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    // First delete order_items related to the order
    await db.query(`DELETE FROM order_items WHERE order_id = ?`, [id]);

    // Then delete the order itself
    await db.query(`DELETE FROM orders WHERE id = ?`, [id]);

    return Response.json({ message: 'Order deleted successfully' });
  } catch (err) {
    return Response.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
