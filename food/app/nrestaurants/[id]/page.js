'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';
import Footer from '@/components/Footer';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchRestaurantDetails = async () => {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        const data = await res.json();
        if (res.ok) {
          setRestaurant(data.restaurant);
          setMenuItems(data.menu || []);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Error fetching restaurant menu:', err);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  if (!restaurant) return <div className="text-center text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Nnavbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-orange-400">{restaurant.name}</h1>
          <p className="text-gray-300">{restaurant.description}</p>
          <p className="text-sm text-gray-500 mt-1">📍 {restaurant.location}</p>
        </div>

        <h2 className="text-2xl text-orange-300 font-semibold mb-6">🍱 Menu</h2>

        {menuItems.length === 0 ? (
          <p className="text-gray-400">No menu items available for this restaurant.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#1e1e2e] p-4 rounded-xl shadow-md border border-gray-700"
              >
                <img
                  src={item.image_url || '/no-image.png'}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold text-orange-200">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
                <p className="text-orange-400 mt-2 font-bold">Rs. {item.price}</p>
                <button
                  onClick={() => router.push(`/nitem/${item.id}`)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2 rounded"
                >
                  View Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
