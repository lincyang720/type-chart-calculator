import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { WebApplicationSchema } from '@/components/SEO/JsonLd';
import DualTypeCalculator from '@/components/DualTypeCalculator';
import { Metadata } from 'next';

// Static generation for better SEO and performance

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Type Chart Calculator
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto px-4">
          Instantly calculate type effectiveness for any combination. See weaknesses, resistances, and immunities in seconds.
        </p>
      </section>

      {/* Interactive Calculator Preview */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 border-2 border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Try It Now</h2>
            <span className="text-xs sm:text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Live Example</span>
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Explore All Types</h2>
        <p className="text-gray-600 mb-6">
          Click any type to see detailed strengths, weaknesses, and matchups.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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

      {/* Popular Combinations Section */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Popular Type Combinations</h2>
        <p className="text-gray-600 mb-6">
          Explore the most common dual-type combinations and their strengths.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/combo/fire-flying" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="fire" size="sm" />
              <TypeBadge typeId="flying" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Fire/Flying</h3>
            <p className="text-sm text-gray-600">Charizard, Moltres, Talonflame</p>
          </Link>
          <Link href="/combo/water-ground" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="water" size="sm" />
              <TypeBadge typeId="ground" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Water/Ground</h3>
            <p className="text-sm text-gray-600">Swampert, Gastrodon, Quagsire</p>
          </Link>
          <Link href="/combo/steel-fairy" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="steel" size="sm" />
              <TypeBadge typeId="fairy" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Steel/Fairy</h3>
            <p className="text-sm text-gray-600">Magearna, Zacian, Klefki</p>
          </Link>
          <Link href="/combo/dragon-flying" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="dragon" size="sm" />
              <TypeBadge typeId="flying" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Dragon/Flying</h3>
            <p className="text-sm text-gray-600">Dragonite, Salamence, Rayquaza</p>
          </Link>
          <Link href="/combo/grass-poison" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="grass" size="sm" />
              <TypeBadge typeId="poison" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Grass/Poison</h3>
            <p className="text-sm text-gray-600">Venusaur, Vileplume, Roserade</p>
          </Link>
          <Link href="/combo/electric-steel" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-2 mb-2">
              <TypeBadge typeId="electric" size="sm" />
              <TypeBadge typeId="steel" size="sm" />
            </div>
            <h3 className="font-semibold text-gray-800">Electric/Steel</h3>
            <p className="text-sm text-gray-600">Magnezone, Togedemaru</p>
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link href="/types" className="text-blue-600 font-semibold hover:underline">
            View All 153 Combinations →
          </Link>
        </div>
      </section>

      {/* Popular Pokemon Section */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Popular Pokemon</h2>
        <p className="text-gray-600 mb-6">
          Check detailed type matchups for your favorite Pokemon.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link href="/pokemon/charizard" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Charizard</p>
            <p className="text-xs text-gray-600">Fire/Flying</p>
          </Link>
          <Link href="/pokemon/pikachu" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Pikachu</p>
            <p className="text-xs text-gray-600">Electric</p>
          </Link>
          <Link href="/pokemon/mewtwo" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Mewtwo</p>
            <p className="text-xs text-gray-600">Psychic</p>
          </Link>
          <Link href="/pokemon/garchomp" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Garchomp</p>
            <p className="text-xs text-gray-600">Dragon/Ground</p>
          </Link>
          <Link href="/pokemon/lucario" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Lucario</p>
            <p className="text-xs text-gray-600">Fighting/Steel</p>
          </Link>
          <Link href="/pokemon/greninja" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
            <p className="font-semibold text-gray-800">Greninja</p>
            <p className="text-xs text-gray-600">Water/Dark</p>
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link href="/pokemon" className="text-blue-600 font-semibold hover:underline">
            View All Pokemon →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">More Tools</h2>
        <div className="grid sm:grid-cols-2 gap-6">
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
