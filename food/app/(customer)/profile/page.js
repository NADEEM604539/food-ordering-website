// app/profile/page.js

'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');
        const { role, login } = await res.json();
        if (role !== 'customer' || login !== 'true') {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/login');
      }
    }
    fetchToken();
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setUser(data.user || null);
        setFormData({ name: data.user.name, email: data.user.email });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Profile updated');
        setEditMode(false);
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-orange-400 mb-8 text-center">👤 Your Profile</h1>

        {user ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            {!editMode && !passwordMode && (
              <>
                <div className="mb-6">
                  <p className="text-lg font-semibold text-orange-300">Name:</p>
                  <p className="text-gray-300">{user.name}</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold text-orange-300">Email:</p>
                  <p className="text-gray-300">{user.email}</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold text-orange-300">Role:</p>
                  <p className="text-gray-300 capitalize">{user.role}</p>
                </div>
              </>
            )}

            {editMode && (
              <div className="space-y-4">
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 rounded bg-gray-800 text-white" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 rounded bg-gray-800 text-white" />
                <button onClick={handleUpdateProfile} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Save Changes</button>
              </div>
            )}


            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => { setEditMode(true); setPasswordMode(false); }} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">✏️ Edit Profile</button>
              <button onClick={() => router.push('/logout')} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white">🚪 Logout</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Loading profile...</p>
        )}
      </section>
    </div>
  );
}