import { Metadata } from 'next';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { formatMultiplier, calculateMultiplier } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';

export const metadata: Metadata = {
  title: 'Pokemon Type Chart 2026 - Complete Type Effectiveness Matrix',
  description: 'View the complete Pokemon type chart for all 18 types. Check super effective, not very effective, and immune matchups in an interactive matrix.',
  keywords: 'pokemon type chart, type effectiveness chart, pokemon weakness chart, type matchup chart, gen 9 type chart',
  openGraph: {
    title: 'Pokemon Type Chart 2026 - Complete Type Effectiveness Matrix',
    description: 'View the complete Pokemon type chart for all 18 types. Check super effective, not very effective, and immune matchups.',
    url: 'https://www.typematchup.org/pokemon/type-chart',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Type Chart 2026',
    description: 'Complete type effectiveness matrix for all 18 Pokemon types.',
  },
  alternates: {
    canonical: '/pokemon/type-chart',
  },
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getCellClass(multiplier: number): string {
  if (multiplier === 0) return 'bg-gray-400 text-white font-bold';
  if (multiplier === 0.25) return 'bg-green-700 text-white font-bold';
  if (multiplier === 0.5) return 'bg-green-500 text-white font-bold';
  if (multiplier === 1) return 'bg-gray-100 text-gray-800';
  if (multiplier === 2) return 'bg-red-500 text-white font-bold';
  if (multiplier === 4) return 'bg-red-700 text-white font-bold';
  return 'bg-gray-100 text-gray-800';
}

export default function TypeChartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pokemon Type Chart 2026
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Complete type effectiveness matrix for all 18 Pokemon types. Rows show the defending type,
          columns show the attacking type. Use this chart to quickly find weaknesses, resistances, and immunities.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
          <span className="px-3 py-1 bg-red-700 text-white rounded font-semibold">4× Super Effective</span>
          <span className="px-3 py-1 bg-red-500 text-white rounded font-semibold">2× Super Effective</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded border">1× Normal</span>
          <span className="px-3 py-1 bg-green-500 text-white rounded font-semibold">½× Resisted</span>
          <span className="px-3 py-1 bg-green-700 text-white rounded font-semibold">¼× Resisted</span>
          <span className="px-3 py-1 bg-gray-400 text-white rounded font-semibold">0× Immune</span>
        </div>

        {/* Type Chart Matrix */}
        <div className="overflow-x-auto mb-12 border rounded-lg shadow">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 p-2 border min-w-[80px]">Defending ↓ / Attacking →</th>
                {ALL_TYPES.map(attackingType => {
                  const type = typesData.types.find(t => t.id === attackingType);
                  return (
                    <th key={attackingType} className="p-2 border min-w-[48px] text-center bg-gray-50">
                      <TypeBadge typeId={attackingType} size="sm" />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ALL_TYPES.map(defendingType => {
                const type = typesData.types.find(t => t.id === defendingType);
                return (
                  <tr key={defendingType}>
                    <th className="sticky left-0 z-10 bg-gray-50 p-2 border text-left">
                      <TypeBadge typeId={defendingType} size="sm" />
                    </th>
                    {ALL_TYPES.map(attackingType => {
                      const multiplier = calculateMultiplier(attackingType, [defendingType]);
                      return (
                        <td key={`${defendingType}-${attackingType}`} className={`p-2 border text-center ${getCellClass(multiplier)}`}>
                          {formatMultiplier(multiplier)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Explanation */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Read the Pokemon Type Chart</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The table above is read from the perspective of the <strong>defending type</strong> (rows) against the
              <strong> attacking type</strong> (columns). For example, find Water in the left column and Electric in the
              top row — the cell shows <strong>2×</strong>, meaning Electric-type moves are super effective against Water-type Pokemon.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>2× (red):</strong> The defending type is weak to the attacking type.</li>
              <li><strong>½× (green):</strong> The defending type resists the attacking type.</li>
              <li><strong>0× (gray):</strong> The defending type is immune to the attacking type.</li>
              <li><strong>1× (white):</strong> Normal damage with no type advantage.</li>
            </ul>
            <p>
              For dual-type Pokemon, multiply the values from both types. A Fire/Flying Pokemon takes 4× damage from
              Rock-type moves because both Fire and Flying are weak to Rock (2× × 2× = 4×).
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Try the Interactive Type Matchup Calculator</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Skip the manual lookup. Select any single or dual-type combination and instantly see weaknesses, resistances, and immunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Open Type Calculator
            </Link>
            <Link href="/battle-simulator" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Battle Simulator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
