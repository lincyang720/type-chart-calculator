import { Metadata } from 'next';
import DualTypeCalculator from '@/components/DualTypeCalculator';

export const metadata: Metadata = {
  title: 'Dual Type Calculator - Calculate Type Weaknesses and Resistances',
  description: 'Calculate weaknesses, resistances, and immunities for any single or dual-type combination. Find 4× weaknesses and ¼× resistances instantly.',
  keywords: 'dual type calculator, type weakness calculator, type resistance, type combination, 4x weakness',
  openGraph: {
    title: 'Dual Type Calculator - Calculate Type Weaknesses and Resistances',
    description: 'Calculate type weaknesses and resistances for any combination',
    url: 'https://www.typematchup.org/calculator',
    type: 'website',
  },
  alternates: {
    canonical: '/calculator',
  },
};

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Dual Type Calculator</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Select one or two types to see all weaknesses, resistances, and immunities.
          Perfect for team building and understanding defensive matchups.
        </p>

        <DualTypeCalculator />

        <section className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Use the Dual Type Calculator</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Select Primary Type</h3>
              <p>Choose the first type from the dropdown menu. This is required.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 2: Add Secondary Type (Optional)</h3>
              <p>
                Select a second type to calculate dual-type effectiveness. Leave as "None" for single-type calculations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 3: Review Results</h3>
              <p>
                The calculator shows all attacking types organized by effectiveness:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Quadruple Weak (4×):</strong> Takes 4× damage - avoid these matchups!</li>
                <li><strong>Weak (2×):</strong> Takes double damage</li>
                <li><strong>Resistant (½×):</strong> Takes half damage</li>
                <li><strong>Double Resistant (¼×):</strong> Takes only quarter damage - excellent defense!</li>
                <li><strong>Immune (0×):</strong> Takes no damage at all</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Popular Type Combinations</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Excellent Defensive Types:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Steel/Fairy - Only 2 weaknesses</li>
                <li>• Water/Ground - Great coverage</li>
                <li>• Steel/Flying - 10 resistances</li>
                <li>• Ghost/Dark - 3 immunities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Types with Many Weaknesses:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Grass/Ice - 7 weaknesses</li>
                <li>• Rock/Fighting - 7 weaknesses</li>
                <li>• Grass/Psychic - 7 weaknesses</li>
                <li>• Ice/Flying - 5 weaknesses</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
