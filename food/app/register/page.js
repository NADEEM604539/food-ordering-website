'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        alert('Registration successful!');
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nnavbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-20 px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-orange-400">Register - NADEEM FOODS</h2>

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl placeholder-gray-400"
          />
          <select
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl"
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-orange-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}
