export async function GET() {
  try {
    /* 1️⃣  Auth via cookies */
    const c = await cookies();                           // sync in Next 15+
    const email = c.get('email')?.value;
    const role  = c.get('role')?.value;

    if (!email || role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* 2️⃣  Resolve vendor_id from user email */
    const [[{ id: vendorId } = {}]] = await pool.query(
      `SELECT v.id
         FROM vendors v
         JOIN users u ON v.user_id = u.id
        WHERE u.email = ?`,
      [email]
    );

    if (!vendorId) {
      return NextResponse.json({ restaurants: [] });   // no vendor profile yet
    }

    /* 3️⃣  Fetch restaurant names for that vendor */
    const [rows] = await pool.query(
      `SELECT name FROM restaurants WHERE vendor_id = ?`,
      [vendorId]
    );

    const names = rows.map(r => r.name);

    return NextResponse.json({ restaurants: names });
  } catch (err) {
    console.error('GET /vendor/restaurants error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}