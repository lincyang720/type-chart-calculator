import { Metadata } from 'next';

import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';
import { EDITORIAL_COMBINATIONS } from '@/lib/editorialCombinations';

export const metadata: Metadata = {
  title: 'All Types - Complete Type Guide and Matchups',
  description: 'Browse all 18 types with detailed information about strengths, weaknesses, and matchups. Learn about each type\'s characteristics.',
  keywords: 'all types, type list, type guide, type matchups, type strengths, type weaknesses',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'All Types - Complete Type Guide and Matchups',
    description: 'Browse all 18 types with detailed information about strengths, weaknesses, and matchups.',
    url: 'https://www.typematchup.org/types',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Types Guide',
    description: 'Browse all 18 types with detailed information about strengths, weaknesses, and matchups.',
  },
  alternates: {
    canonical: '/types',
  },
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getTypeName(typeId: string) {
  return typesData.types.find(typeItem => typeItem.id === typeId)?.name ?? typeId;
}

export default function TypesPage() {
  const dualTypeGuides = Array.from(EDITORIAL_COMBINATIONS).sort((a, b) => a.localeCompare(b));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">All Types</h1>
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

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Dual Type Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dualTypeGuides.map(slug => {
            const [type1, type2] = slug.split('-') as [TypeId, TypeId];

            return (
              <Link
                key={slug}
                href={`/types/${slug}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-2 mb-2">
                  <TypeBadge typeId={type1} size="sm" />
                  <TypeBadge typeId={type2} size="sm" />
                </div>
                <span className="font-semibold text-gray-800">
                  {getTypeName(type1)}/{getTypeName(type2)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
