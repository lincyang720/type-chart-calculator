import TypeChart from '@/components/TypeChart';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { WebApplicationSchema } from '@/components/SEO/JsonLd';

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
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Type Chart Calculator
        </h1>
        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Master type effectiveness with our interactive type chart, dual-type calculator, and battle simulator.
          Perfect for competitive battles and team building strategies.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/calculator"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Dual Type Calculator
          </Link>
          <Link
            href="/battle-simulator"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
          >
            Battle Simulator
          </Link>
        </div>
      </section>

      {/* Type Chart Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Complete Type Effectiveness Chart</h2>
        <p className="text-gray-600 mb-6">
          This comprehensive type chart shows how each attacking type performs against defending types.
          Use this to quickly identify super effective moves and resistances.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TypeChart />
        </div>
      </section>

      {/* Quick Type Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">All Types</h2>
        <p className="text-gray-600 mb-6">
          Click on any type to see detailed information about its strengths, weaknesses, and best matchups.
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
        <h2 className="text-3xl font-bold mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Type Chart</h3>
            <p className="text-gray-600">
              Complete 18×18 type effectiveness matrix showing all offensive and defensive matchups at a glance.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Dual Type Calculator</h3>
            <p className="text-gray-600">
              Calculate weaknesses and resistances for any single or dual-type combination, including 4× and ¼× multipliers.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Battle Simulator</h3>
            <p className="text-gray-600">
              Simulate type matchups in battle with STAB calculations to plan your strategy effectively.
            </p>
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
