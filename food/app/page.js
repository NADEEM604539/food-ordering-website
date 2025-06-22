'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

   useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/token');
        const { role, login } = await r.json();
        if (role == 'vendor' && login == 'true') router.push('/vendordashboard');
        if (role == 'customer' && login == 'true') router.push('/homepage');
        if (role == 'admin' && login == 'true') router.push('/admindashboard');
      } catch {
        router.push('/');
      }
    })();
  }, [router]);



  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (err) {
        console.error('Error loading restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Nnavbar/>
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-orange-400 mb-4 drop-shadow-lg">
          🍽️ Welcome to NADEEM FOODS
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover your favorite meals from top-rated restaurants, delivered right to your doorstep. Order now and enjoy premium food experiences.
        </p>
        <button
          onClick={() => router.push('/nrestaurants')}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold transition"
        >
          Browse Restaurants
        </button>
      </section>

      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-300 mb-6 text-center">🔥 Popular Restaurants</h2>
        {restaurants.length === 0 ? (
          <p className="text-center text-gray-400">No restaurants available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map(r => (
              <div
                key={r.id}
                onClick={() => router.push(`/nrestaurants/${r.id}`)}
                className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-600 hover:border-orange-500 transition cursor-pointer"
              >
                <img
                  src={r.image_url || '/no-image.png'}
                  alt={r.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-orange-200">{r.name}</h3>
                <p className="text-sm text-gray-400">{r.description?.slice(0, 80) || 'No description provided.'}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {r.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-950 text-gray-300 py-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">🚀 Fast Delivery</h3>
            <p>Enjoy lightning-fast food delivery from your favorite local spots.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">🍔 Premium Quality</h3>
            <p>All meals are cooked with care and served fresh, hot, and hygienic.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">🛒 Easy Checkout</h3>
            <p>Secure payment, order tracking, and one-click reordering built-in.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
