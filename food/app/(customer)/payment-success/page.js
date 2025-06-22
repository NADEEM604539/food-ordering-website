'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentSuccessPage() {
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
    const clearCart = async () => {
      try {
        await fetch('/api/cart', { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to clear cart after payment success:', err);
      }
    };
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-green-800 border border-green-600 p-10 rounded-2xl shadow-xl max-w-lg">
          <h1 className="text-4xl font-bold text-green-300 mb-4">🎉 Payment Successful!</h1>
          <p className="text-lg mb-6">
            Thank you for your order! Your food is being prepared and will be delivered soon.
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-full font-semibold"
          >
            View My Orders
          </button>
        </div>
      </main>
    </div>
  );
}
