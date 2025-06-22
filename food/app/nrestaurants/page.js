'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';
import Footer from '@/components/Footer';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Nnavbar />

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-400 text-center mb-8">
          🍽️ Explore Restaurants
        </h1>

        {restaurants.length === 0 ? (
          <p className="text-center text-gray-400">No restaurants found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map(r => (
              <div
                key={r.id}
                onClick={() => router.push(`/nrestaurants/${r.id}`)}
                className="bg-gray-900 border border-gray-700 hover:border-orange-500 rounded-xl p-5 shadow-md hover:shadow-orange-600 transition cursor-pointer"
              >
                <img
                  src={r.image_url || '/no-image.png'}
                  alt={r.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold text-orange-300">{r.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{r.description?.slice(0, 100) || 'No description available.'}</p>
                <p className="text-xs text-gray-500 mt-2">📍 {r.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
