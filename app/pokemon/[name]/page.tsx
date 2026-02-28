import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';
import Link from 'next/link';

// Pre-generate all pokemon pages at build time
export async function generateStaticParams() {
  return pokemonData.pokemon.map((p) => ({ name: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    return { title: 'Pokemon Not Found' };
  }

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name).join('/');
  const weaknesses = pokemon.types.length === 2
    ? calculateDualTypeWeaknesses(pokemon.types[0] as TypeId, pokemon.types[1] as TypeId)
    : null;

  return {
    title: `${pokemon.name} Weakness & Counters - ${typeNames} Type Guide`,
    description: `${pokemon.name} (${typeNames}) weakness guide. ${pokemon.strategy.slice(0, 120)}. Best counters, moveset, and battle strategy.`,
    keywords: `${pokemon.name} weakness, ${pokemon.name} counters, ${pokemon.name} best moveset, ${pokemon.name} type, ${pokemon.name} strategy`,
    openGraph: {
      title: `${pokemon.name} - Weakness, Counters & Strategy Guide`,
      description: `Complete ${pokemon.name} guide: weaknesses, best counters, recommended moveset, and competitive strategy.`,
      url: `https://www.typematchup.org/pokemon/${pokemon.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pokemon.name} Weakness & Counters`,
      description: `${pokemon.name} (${typeNames}) - weaknesses, counters, and strategy guide.`,
    },
    alternates: {
      canonical: `/pokemon/${pokemon.id}`,
    },
  };
}

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    notFound();
  }

  const type1 = pokemon.types[0] as TypeId;
  const type2 = pokemon.types.length > 1 ? pokemon.types[1] as TypeId : null;

  const weaknesses = type2
    ? calculateDualTypeWeaknesses(type1, type2)
    : null;

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name);

  // Build FAQ data for JSON-LD
  const faqItems = [
    {
      '@type': 'Question' as const,
      name: `What is ${pokemon.name} weak to?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: weaknesses
          ? `${pokemon.name} (${typeNames.join('/')}) is ${weaknesses.quadrupleWeak.length > 0 ? `4× weak to ${weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} and ` : ''}weak to ${weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.`
          : `${pokemon.name} is a ${typeNames[0]} type. Check the type page for detailed matchups.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `What is the best moveset for ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `The recommended moveset for ${pokemon.name} is: ${pokemon.recommendedMoves.join(', ')}. ${pokemon.strategy}`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `How to counter ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `Best counters for ${pokemon.name}: ${pokemon.counters.join(', ')}.`,
      },
    },
  ];

  const statTotal = pokemon.baseStats.hp + pokemon.baseStats.attack + pokemon.baseStats.defense +
    pokemon.baseStats.spAtk + pokemon.baseStats.spDef + pokemon.baseStats.speed;
  const maxStat = Math.max(pokemon.baseStats.hp, pokemon.baseStats.attack, pokemon.baseStats.defense,
    pokemon.baseStats.spAtk, pokemon.baseStats.spDef, pokemon.baseStats.speed);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems,
          }),
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/pokemon" className="hover:text-blue-600">Pokemon</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{pokemon.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {pokemon.name}
            </span>
          </h1>
          <div className="flex items-center gap-3 mb-4">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`}>
                <TypeBadge typeId={t as TypeId} size="lg" clickable />
              </Link>
            ))}
            <span className="text-sm text-gray-500 ml-2">Gen {pokemon.generation} · {pokemon.category}</span>
          </div>
          <p className="text-lg text-gray-600">{pokemon.strengths}</p>
        </div>

        {/* Type Weaknesses */}
        {weaknesses && (
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Type Weaknesses & Resistances</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-red-600 mb-3">⚠️ Weaknesses</h3>
                {weaknesses.quadrupleWeak.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-red-700 block mb-1">4× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleWeak.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-red-600 block mb-1">2× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-3">✓ Resistances</h3>
                {weaknesses.quadrupleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-700 block mb-1">¼× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-600 block mb-1">½× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.immune.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">0× Immune:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.immune.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type2 && (
              <div className="mt-4 text-center">
                <Link href={`/combo/${type1}-${type2}`} className="text-blue-600 hover:underline text-sm">
                  View full {typeNames.join('/')} type matchup →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Base Stats */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Base Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'HP', value: pokemon.baseStats.hp, color: 'bg-green-500' },
              { label: 'Attack', value: pokemon.baseStats.attack, color: 'bg-red-500' },
              { label: 'Defense', value: pokemon.baseStats.defense, color: 'bg-orange-500' },
              { label: 'Sp. Atk', value: pokemon.baseStats.spAtk, color: 'bg-blue-500' },
              { label: 'Sp. Def', value: pokemon.baseStats.spDef, color: 'bg-purple-500' },
              { label: 'Speed', value: pokemon.baseStats.speed, color: 'bg-pink-500' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-600">{stat.label}</span>
                <span className="w-10 text-sm font-bold text-right">{stat.value}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`${stat.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(stat.value / 255) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t">
              <span className="w-16 text-sm font-bold text-gray-800">Total</span>
              <span className="w-10 text-sm font-bold text-right">{statTotal}</span>
            </div>
          </div>
        </section>

        {/* Recommended Moveset */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Moveset</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {pokemon.recommendedMoves.map(move => (
              <div key={move} className="bg-gray-50 rounded-lg p-3 text-center font-medium">
                {move}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(ability => (
                <span key={ability} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Strategy */}
        <section className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Competitive Strategy</h2>
          <p className="text-gray-700 leading-relaxed">{pokemon.strategy}</p>
        </section>

        {/* Counters */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Best Counters</h2>
          <ul className="space-y-2">
            {pokemon.counters.map(counter => (
              <li key={counter} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-700">{counter}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is {pokemon.name} weak to?</h3>
              <p className="text-gray-700">
                {weaknesses && weaknesses.quadrupleWeak.length > 0 && (
                  <>{pokemon.name} is 4× weak to {weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}. </>
                )}
                {weaknesses && weaknesses.doubleWeak.length > 0 && (
                  <>{pokemon.name} is 2× weak to {weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.</>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is the best moveset for {pokemon.name}?</h3>
              <p className="text-gray-700">
                The recommended moveset is: {pokemon.recommendedMoves.join(', ')}.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How to counter {pokemon.name}?</h3>
              <p className="text-gray-700">
                Best counters: {pokemon.counters.join(', ')}.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Explore More</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm">
                {typesData.types.find(td => td.id === t)?.name} Type Guide
              </Link>
            ))}
            <Link href="/calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
              Type Calculator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
