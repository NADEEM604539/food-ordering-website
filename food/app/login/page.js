'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // ✅ Correctly parse response

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        if(data.role='customer'){
          router.push(`/homepage`);
        } else{

          router.push(`/${data.role}dashboard`);
        }
        // ✅ Role-based redirect
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };
  return (
    <div>
      <Nnavbar/>
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-20">
      <div className="w-full max-w-md bg-[#1e1e2f] rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-orange-400 mb-6">
          🍽️ NADEEM FOODS
        </h2>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#2b2b40] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#2b2b40] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-orange-600 text-white py-2 rounded-lg text-lg font-semibold transition duration-300 shadow-lg hover:shadow-orange-500/50"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-orange-400 hover:underline font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}
