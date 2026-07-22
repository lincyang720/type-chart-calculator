import { Metadata } from 'next';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import pokemonData from '@/data/pokemon.json';

export const metadata: Metadata = {
  title: 'Pokemon Weakness Guide - All Pokemon Counters & Strategy',
  description: 'Complete Pokemon weakness and counter guide. Find weaknesses, best movesets, and competitive strategies for every popular Pokemon.',
  keywords: 'pokemon weakness, pokemon counters, pokemon strategy, pokemon guide, competitive pokemon',
  alternates: {
    canonical: '/pokemon',
  },
};

export default function PokemonListPage() {
  const categories = [
    { key: 'pseudo-legendary', label: 'Pseudo-Legendaries' },
    { key: 'starter', label: 'Starters' },
    { key: 'competitive-staple', label: 'Competitive Staples' },
    { key: 'popular', label: 'Popular Pokemon' },
    { key: 'mythical', label: 'Mythical & Legendary' },
    { key: 'iconic', label: 'Iconic' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pokemon Weakness & Counter Guide
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find weaknesses, best movesets, and competitive strategies for popular Pokemon.
          Click any Pokemon to see its full guide.
        </p>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h2 className="text-xl font-bold mb-2">Best Pokemon Type Combinations</h2>
          <p className="text-gray-700 mb-3">
            Compare strong dual types for defensive balance, offensive pressure, immunities, and team roles.
          </p>
          <Link href="/pokemon/best-type-combinations" className="text-blue-700 font-semibold hover:underline">
            Explore the best dual-type combinations →
          </Link>
        </section>

        {categories.map(cat => {
          const filtered = pokemonData.pokemon.filter(p => p.category === cat.key);
          if (filtered.length === 0) return null;
          return (
            <section key={cat.key} className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{cat.label}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(pokemon => (
                  <Link
                    key={pokemon.id}
                    href={`/pokemon/${pokemon.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4"
                  >
                    <h3 className="font-bold text-lg mb-2">{pokemon.name}</h3>
                    <div className="flex gap-2 mb-2">
                      {pokemon.types.map(t => (
                        <TypeBadge key={t} typeId={t as TypeId} size="sm" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Gen {pokemon.generation}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mt-8">
          <h2 className="text-xl font-bold mb-3">More Tools</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <Link href="/types" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
              All Types
            </Link>
            <Link href="/calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center">
              Type Calculator
            </Link>
            <Link href="/battle-simulator" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
              Battle Simulator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
