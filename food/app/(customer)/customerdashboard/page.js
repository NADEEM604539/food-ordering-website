'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);

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
        router.push('/not-found'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setCustomer(data.user || null);
      } catch (err) {
        console.error('Failed to fetch customer profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-6 py-14 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-400 mb-4">👤 Welcome to Your Dashboard</h1>

        {customer ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10 shadow-md">
            <p className="text-xl font-semibold text-orange-300">Hello, {customer.name}</p>
            <p className="text-sm text-gray-400 mt-1">📧 {customer.email}</p>
            <p className="text-sm text-gray-400 mt-1">🆔 Role: Customer</p>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">Loading your profile...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            onClick={() => router.push('/orders')}
            className="bg-orange-500 hover:bg-orange-600 rounded-xl p-6 cursor-pointer text-white shadow-md transition"
          >
            <h2 className="text-xl font-bold">🧾 Your Orders</h2>
            <p className="text-sm mt-2">Track and manage your food orders here.</p>
          </div>

          <div
            onClick={() => router.push('/cart')}
            className="bg-purple-500 hover:bg-purple-600 rounded-xl p-6 cursor-pointer text-white shadow-md transition"
          >
            <h2 className="text-xl font-bold">🛒 Your Cart</h2>
            <p className="text-sm mt-2">Check or update your cart items.</p>
          </div>

          <div
            onClick={() => router.push('/restaurants')}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl p-6 cursor-pointer text-white shadow-md transition"
          >
            <h2 className="text-xl font-bold">🍴 Browse Restaurants</h2>
            <p className="text-sm mt-2">Discover and order from popular places.</p>
          </div>

          <div
            onClick={() => router.push('/profile')}
            className="bg-green-500 hover:bg-green-600 rounded-xl p-6 cursor-pointer text-white shadow-md transition"
          >
            <h2 className="text-xl font-bold">👤 Your Profile</h2>
            <p className="text-sm mt-2">View and manage your account details.</p>
          </div>

          <div
            onClick={() => router.push('/checkout')}
            className="bg-red-500 hover:bg-red-600 rounded-xl p-6 cursor-pointer text-white shadow-md transition"
          >
            <h2 className="text-xl font-bold">💳 Checkout</h2>
            <p className="text-sm mt-2">Review and complete your payment securely.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
