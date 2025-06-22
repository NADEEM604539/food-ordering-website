import Nnavbar from '@/components/Nnavbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-6">🍽️ About NADEEM FOODS</h1>
        <p className="text-gray-300 leading-relaxed">
          NADEEM FOODS began with a single goal: bring truly authentic taste to your table, fast.
          Every recipe is crafted from fresh, locally sourced ingredients and time-honored techniques.
          From midnight snacks to family feasts, we deliver passion, flavor, and consistency you can trust.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-6 space-y-2 shadow-xl">
            <h2 className="text-xl font-semibold text-orange-300">Our Mission</h2>
            <p className="text-gray-400">
              Cultivate happiness through food that is honest, hearty, and delivered with care.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 space-y-2 shadow-xl">
            <h2 className="text-xl font-semibold text-orange-300">Core Values</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Authenticity</li>
              <li>Speed & Precision</li>
              <li>Sustainable Sourcing</li>
              <li>Community Engagement</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
