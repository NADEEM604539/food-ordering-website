'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');

        const { role, login } = await res.json();

        console.log('Role:', role);
        console.log('Login:', login);

        // Redirect if not admin or not logged in
        if (role !== 'customer' || login !== 'true') {
          router.push('/login');
        }

      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/login'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-orange-400 mb-6 text-center">🛒 Your Cart</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg shadow border border-gray-700"
                >
                  <img
                    src={item.image_url || '/no-image.png'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-orange-200">{item.name}</h2>
                    <p className="text-sm text-gray-400">Rs {item.price} × {item.quantity}</p>
                    <p className="text-sm text-orange-400">Total: Rs {item.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Total: Rs {totalPrice}
              </h2>
              <button
                onClick={() => router.push('/checkout')}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full text-white font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
