'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Vnavbar from '@/components/Vnavbar';

export default function VendorRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    image_url: ''
  });

   useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');

        const { role, login } = await res.json();

        console.log('Role:', role);
        console.log('Login:', login);

        // Redirect if not admin or not logged in
        if (role !== 'vendor' || login !== 'true') {
          router.push('/not-found');
        }

      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/not-found'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/vendor/restaurants/create', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.refresh();
      setForm({ name: '', location: '', description: '', image_url: '' });
    } else {
      alert('❌ Failed to create restaurant');
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/vendor/restaurants');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.restaurants)) {
            setRestaurants(data.restaurants);
          } else {
            console.error('Expected array in `restaurants`, got:', data);
            setRestaurants([]);
          }
        } else {
          console.error('❌ Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setRestaurants([]);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
                <Vnavbar/>
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#111] text-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* CREATE RESTAURANT FORM */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">🍽️ Create New Restaurant</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm text-gray-300">Restaurant Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="e.g., Nadeem Biryani House"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="e.g., Lahore, Pakistan"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="What makes this restaurant special?"
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Image URL</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition-all py-2 rounded-xl font-semibold text-white shadow-md"
            >
              ➕ Create Restaurant
            </button>
          </form>
        </div>

        {/* RESTAURANT LISTING */}
        <div>
          <h2 className="text-3xl font-bold text-orange-400 mb-6 text-center">📋 Your Restaurants</h2>
          {restaurants.length === 0 ? (
            <p className="text-center text-gray-400">No restaurants created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {restaurants.map((r) => (
                <div
                  key={r.id ?? `${r.name}-${Math.random()}`}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-md hover:shadow-orange-400/30 transition-shadow"
                >
                  <img
                    src={r.image_url || '/placeholder.png'}
                    alt={r.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-orange-300">{r.name}</h3>
                    <p className="text-sm text-gray-400">{r.location}</p>
                    <p className="mt-2 text-sm text-gray-300 line-clamp-3">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
