import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { WebApplicationSchema } from '@/components/SEO/JsonLd';
import DualTypeCalculator from '@/components/DualTypeCalculator';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function Home() {
  return (
    <>
      <WebApplicationSchema />
      <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Type Chart Calculator
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
          Instantly calculate type effectiveness for any combination. See weaknesses, resistances, and immunities in seconds.
        </p>
      </section>

      {/* Interactive Calculator Preview */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Try It Now</h2>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Live Example</span>
          </div>
          <DualTypeCalculator />
        </div>

        <div className="text-center">
          <Link
            href="/battle-simulator"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
          >
            Try Battle Simulator →
          </Link>
        </div>
      </section>

      {/* Quick Type Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Explore All Types</h2>
        <p className="text-gray-600 mb-6">
          Click any type to see detailed strengths, weaknesses, and matchups.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ALL_TYPES.map(typeId => (
            <Link
              key={typeId}
              href={`/types/${typeId}`}
              className="block transform hover:scale-105 transition-transform"
            >
              <TypeBadge typeId={typeId} size="lg" clickable />
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">More Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Battle Simulator</h3>
            <p className="text-gray-600 mb-4">
              Simulate type matchups in battle with STAB calculations to plan your strategy effectively.
            </p>
            <Link href="/battle-simulator" className="text-purple-600 font-semibold hover:underline">
              Try Battle Simulator →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Complete Type Chart</h3>
            <p className="text-gray-600 mb-4">
              View the full 18×18 type effectiveness matrix for comprehensive reference.
            </p>
            <Link href="/types" className="text-blue-600 font-semibold hover:underline">
              View Full Chart →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="mb-12 prose max-w-none">
        <h2 className="text-3xl font-bold mb-6">Understanding Type Effectiveness</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
          <p className="mb-4">
            Type effectiveness is a fundamental mechanic that determines how much damage moves deal based on their type
            and the defending type(s). Understanding these matchups is crucial for competitive battles and building
            balanced teams.
          </p>
          <h3 className="text-xl font-semibold mb-3">Damage Multipliers Explained</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Super Effective (2×):</strong> The attacking type is strong against the defending type</li>
            <li><strong>Not Very Effective (0.5×):</strong> The attacking type is weak against the defending type</li>
            <li><strong>No Effect (0×):</strong> The attacking type cannot damage the defending type at all</li>
            <li><strong>Normal (1×):</strong> Standard damage with no type advantage or disadvantage</li>
          </ul>
          <h3 className="text-xl font-semibold mb-3">Dual-Type Interactions</h3>
          <p className="mb-4">
            When facing dual-type opponents, multipliers stack multiplicatively. This can result in:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>4× damage:</strong> Super effective against both types (2× × 2×)</li>
            <li><strong>0.25× damage:</strong> Not very effective against both types (0.5× × 0.5×)</li>
            <li><strong>Neutralized effectiveness:</strong> Super effective against one type but not very effective against the other (2× × 0.5× = 1×)</li>
          </ul>
        </div>
      </section>
    </div>
    </>
  );
}
