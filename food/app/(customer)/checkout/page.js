'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();

  /* ─── UI state ───────────────────────────── */
  const [cart, setCart]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [method, setMethod]   = useState('COD');           // default payment method
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(true);

  /* ─── Auth + cart fetch ───────────────────── */
  useEffect(() => {
    (async () => {
      try {
        /* 1️⃣ check token */
        const tok = await fetch('/api/token');
        if (!tok.ok) throw new Error('Unauthorized');
        const { role, login } = await tok.json();
        if (role !== 'customer' || login !== 'true') {
          router.push('/login');
          return;
        }

        /* 2️⃣ fetch cart */
        const res  = await fetch('/api/checkout');   // GET handler below
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load cart');
        setCart(json.cart);
        setTotal(json.cart.reduce((s, i) => s + i.price * i.quantity, 0));
      } catch (err) {
        setMsg(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  /* ─── Place order ─────────────────────────── */
  const placeOrder = async () => {
    try {
      setMsg('');
      const res  = await fetch('/api/checkout', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ paymentMethod: method }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to place order');
      router.push('/payment-success');
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  /* ─── Loading state ───────────────────────── */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading…
      </div>
    );

  /* ─── Page ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-orange-400 mb-8">🛒 Checkout</h1>

        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {/* Cart list */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-gray-700 pb-3"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-orange-200">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-green-400">
                    Rs.&nbsp;{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 text-xl font-semibold text-right">
              Total:&nbsp;
              <span className="text-green-400">Rs.&nbsp;{total.toFixed(2)}</span>
            </div>

            {/* Payment method */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3 text-orange-300">
                Choose Payment Method
              </h2>

              <div className="space-y-3">
                {['COD', 'Credit Card'].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 bg-gray-900 p-4 rounded-xl cursor-pointer ${
                      method === opt ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt}
                      checked={method === opt}
                      onChange={(e) => setMethod(e.target.value)}
                    />
                    <span className="text-white">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10 text-right">
              <button
                onClick={placeOrder}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                disabled={cart.length === 0}
              >
                ✅ Confirm &amp; Pay
              </button>
              {msg && <p className="mt-4 text-sm">{msg}</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
