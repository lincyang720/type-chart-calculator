import { Metadata } from 'next';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';

export const metadata: Metadata = {
  title: 'All Types - Complete Type Guide and Matchups',
  description: 'Browse all 18 types with detailed information about strengths, weaknesses, and matchups. Learn about each type\'s characteristics.',
  keywords: 'all types, type list, type guide, type matchups, type strengths, type weaknesses',
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function TypesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">All Types</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        Explore all 18 types and learn about their unique characteristics, strengths, and weaknesses.
        Click on any type to see detailed matchup information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_TYPES.map(typeId => {
          const type = typesData.types.find(t => t.id === typeId);
          if (!type) return null;

          return (
            <Link
              key={typeId}
              href={`/types/${typeId}`}
              className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TypeBadge typeId={typeId} size="lg" />
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                {type.description}
              </p>
              <div className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
                View detailed matchups →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
