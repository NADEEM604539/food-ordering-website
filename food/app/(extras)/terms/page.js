import Nnavbar from '@/components/Nnavbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-6">📜 Terms & Conditions</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            These Terms govern your use of the NADEEM FOODS website and services. By accessing or
            ordering, you agree to be bound by them.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">1. Orders & Payments</h2>
          <p>
            All prices are displayed in PKR and include applicable taxes. Orders are considered
            confirmed once payment is successfully processed.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">2. Cancellations & Refunds</h2>
          <p>
            You may cancel within five minutes of placing an order for a full refund. After
            preparation begins, refunds are at our discretion.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">3. Delivery</h2>
          <p>
            Estimated delivery windows are provided for convenience; actual times may vary due to
            traffic, weather, or high demand.
          </p>

          <h2 className="text-2xl font-semibold text-orange-300">4. Limitation of Liability</h2>
          <p>
            NADEEM FOODS is not liable for indirect or consequential damages arising from the use of
            our services.
          </p>

          <p className="text-sm text-gray-500">
            Last updated: 16 June 2025. Continued use constitutes acceptance of any revisions.
          </p>
        </div>
      </section>
    </div>
  );
}
