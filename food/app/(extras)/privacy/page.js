import Nnavbar from '@/components/Nnavbar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
     
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-6">🔒 Privacy Policy</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Your privacy matters. This policy explains what data we collect, why, and how we protect it.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">1. Data We Collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Account information (name, email, password hash)</li>
            <li>Order history and payment references</li>
            <li>Website usage analytics via cookies</li>
          </ul>

          <h2 className="text-2xl font-semibold text-orange-300">2. Why We Collect It</h2>
          <p>To process orders, improve services, and personalize your experience.</p>

          <h2 className="text-2xl font-semibold text-orange-300">3. Sharing & Disclosure</h2>
          <p>
            Data is never sold. It is shared only with trusted payment and delivery partners under
            strict confidentiality agreements.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">4. Security</h2>
          <p>
            We use industry-standard encryption and secure hosting to safeguard your information.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">5. Your Rights</h2>
          <p>
            You may request deletion or correction of your data at any time by emailing
            privacy@nadeemfoods.pk.
          </p>

          <p className="text-sm text-gray-500">
            Last updated: 16 June 2025.
          </p>
        </div>
      </section>
    </div>
  );
}
