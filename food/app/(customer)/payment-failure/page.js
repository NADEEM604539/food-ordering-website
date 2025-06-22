'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentFailurePage() {
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
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-red-800 border border-red-600 p-10 rounded-2xl shadow-xl max-w-lg">
          <h1 className="text-4xl font-bold text-red-300 mb-4">❌ Payment Failed</h1>
          <p className="text-lg mb-6">
            Something went wrong during the payment process. Please try again or choose a different payment method.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-full font-semibold"
          >
            Return to Checkout
          </button>
        </div>
      </main>
    </div>
  );
}
