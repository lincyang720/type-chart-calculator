'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import TypeBadge from './TypeBadge';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';
import { EDITORIAL_COMBINATIONS } from '@/lib/editorialCombinations';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getCombinationSlug(type1: TypeId, type2: TypeId) {
  return ALL_TYPES.indexOf(type1) < ALL_TYPES.indexOf(type2)
    ? `${type1}-${type2}`
    : `${type2}-${type1}`;
}

export default function DualTypeCalculator() {
  // Default to Fire/Flying (like Charizard) as an example
  const [type1, setType1] = useState<TypeId>('fire');
  const [type2, setType2] = useState<TypeId | ''>('flying');

  const weaknesses = calculateDualTypeWeaknesses(
    type1,
    type2 ? (type2 as TypeId) : undefined
  );
  const selectedTypes = type2 ? [type1, type2] : [type1];
  const matchingPokemon = pokemonData.pokemon
    .filter(pokemon => (
      pokemon.types.length === selectedTypes.length &&
      selectedTypes.every(type => pokemon.types.includes(type))
    ))
    .slice(0, 6);
  const relatedMatchups = Array.from(EDITORIAL_COMBINATIONS)
    .filter(slug => slug !== (type2 ? getCombinationSlug(type1, type2 as TypeId) : ''))
    .map(slug => {
      const [first, second] = slug.split('-') as [TypeId, TypeId];
      const sharedSelected = Number(first === type1 || second === type1) + Number(Boolean(type2) && (first === type2 || second === type2));
      const relevantAttackTypes = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak, ...weaknesses.immune];
      const tacticalOverlap = Number(relevantAttackTypes.includes(first)) + Number(relevantAttackTypes.includes(second));
      return { slug, first, second, score: sharedSelected * 3 + tacticalOverlap };
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, 9);

  const renderTypeList = (types: TypeId[], label: string, multiplier: string, bgColor: string) => {
    if (types.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-2 ${bgColor} text-white px-3 py-2 rounded`}>
          {label} ({multiplier})
        </h3>
        <div className="flex flex-wrap gap-2">
          {types.map(typeId => (
            <TypeBadge key={typeId} typeId={typeId} />
          ))}
        </div>
      </div>
    );
  };

  const quickExamples = [
    { name: 'Fire/Flying', type1: 'fire' as TypeId, type2: 'flying' as TypeId },
    { name: 'Water/Ground', type1: 'water' as TypeId, type2: 'ground' as TypeId },
    { name: 'Steel/Fairy', type1: 'steel' as TypeId, type2: 'fairy' as TypeId },
    { name: 'Dragon/Ground', type1: 'dragon' as TypeId, type2: 'ground' as TypeId },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Dual Type Calculator</h2>

        {/* Quick Examples */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Try these popular combinations:</p>
          <div className="flex flex-wrap gap-2">
            {quickExamples.map((example) => (
              <button
                key={example.name}
                onClick={() => {
                  setType1(example.type1);
                  setType2(example.type2);
                }}
                className="px-3 py-1 bg-white border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Type</label>
            <select
              value={type1}
              onChange={(e) => {
                const nextType = e.target.value as TypeId;
                setType1(nextType);
                if (type2 === nextType) setType2('');
              }}
                className="w-full min-h-11 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ALL_TYPES.map(typeId => {
                const type = typesData.types.find(t => t.id === typeId);
                return (
                  <option key={typeId} value={typeId}>
                    {type?.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Type (Optional)</label>
            <select
              value={type2}
              onChange={(e) => setType2(e.target.value as TypeId | '')}
              className="w-full min-h-11 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
              {ALL_TYPES.map(typeId => {
                const type = typesData.types.find(t => t.id === typeId);
                return (
                  <option key={typeId} value={typeId} disabled={typeId === type1}>
                    {type?.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Type Combination:</h3>
          <div className="flex gap-2">
            <TypeBadge typeId={type1} size="lg" />
            {type2 && <TypeBadge typeId={type2 as TypeId} size="lg" />}
          </div>
        </div>

        <div className="space-y-4">
          {renderTypeList(weaknesses.quadrupleWeak, 'Quadruple Weak', '4×', 'bg-red-700')}
          {renderTypeList(weaknesses.doubleWeak, 'Weak', '2×', 'bg-red-500')}
          {renderTypeList(weaknesses.doubleResist, 'Resistant', '½×', 'bg-green-500')}
          {renderTypeList(weaknesses.quadrupleResist, 'Double Resistant', '¼×', 'bg-green-700')}
          {renderTypeList(weaknesses.immune, 'Immune', '0×', 'bg-gray-600')}
        </div>

        {weaknesses.normal.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
              Show Normal Effectiveness Types ({weaknesses.normal.length})
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {weaknesses.normal.map(typeId => (
                <TypeBadge key={typeId} typeId={typeId} size="sm" />
              ))}
            </div>
          </details>
        )}

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold mb-3">What This Matchup Means</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              This selection has {weaknesses.quadrupleWeak.length + weaknesses.doubleWeak.length} damaging type
              {weaknesses.quadrupleWeak.length + weaknesses.doubleWeak.length === 1 ? ' weakness' : ' weaknesses'} and{' '}
              {weaknesses.doubleResist.length + weaknesses.quadrupleResist.length + weaknesses.immune.length} defensive
              resistances or immunities. Prioritize any 4x weakness first because both defending types amplify that attack.
            </p>
            <p>
              Type effectiveness is the foundation of the matchup, but abilities, stats, moves, items, and battle format
              can change the best decision. Check whether the rest of your team can safely switch into the attack types
              listed as weaknesses above.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 font-semibold">
            {type2 && (
              <Link href={`/types/${getCombinationSlug(type1, type2 as TypeId)}`} className="text-blue-700 hover:underline">
                Open the complete combination guide →
              </Link>
            )}
            <Link href="/pokemon/team-calculator" className="text-blue-700 hover:underline">
              Check this type in a full team →
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
          <h3 className="text-xl font-bold mb-2">Related Type Matchups</h3>
          <p className="text-gray-700 mb-4">
            Continue from this result with combinations that share one of your selected types or help explore its main
            weaknesses, resistances, and immunities.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            {relatedMatchups.map(matchup => (
              <Link key={matchup.slug} href={`/types/${matchup.slug}`} className="bg-white border border-blue-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-sm transition">
                <span className="flex flex-wrap gap-2 mb-2">
                  <TypeBadge typeId={matchup.first} size="sm" />
                  <TypeBadge typeId={matchup.second} size="sm" />
                </span>
                <span className="block font-bold text-gray-900">
                  {typesData.types.find(type => type.id === matchup.first)?.name}/{typesData.types.find(type => type.id === matchup.second)?.name}
                </span>
                <span className="mt-3 block rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white">
                  Check {typesData.types.find(type => type.id === matchup.first)?.name}/{typesData.types.find(type => type.id === matchup.second)?.name} weaknesses →
                </span>
              </Link>
            ))}
          </div>

          {matchingPokemon.length > 0 && (
            <div className="mb-5">
              <h4 className="font-semibold text-gray-800 mb-2">Pokemon with this typing</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchingPokemon.map(pokemon => (
                  <Link
                    key={pokemon.id}
                    href={`/pokemon/${pokemon.id}`}
                    className="bg-white border border-blue-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition"
                  >
                    <span className="block font-bold text-gray-900">{pokemon.name}</span>
                    <span className="block text-sm text-blue-700 mt-1">View complete weaknesses →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <Link href="/pokemon/team-calculator" className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 no-underline">
              Check your full team coverage →
            </Link>
            <Link href="/pokemon/type-chart" className="text-blue-700 hover:underline">
              Full type effectiveness chart →
            </Link>
            <Link href="/pokemon/type-chart-with-abilities" className="text-blue-700 hover:underline">
              Matchups with abilities →
            </Link>
            <Link href="/pokemon/type-quiz" className="text-blue-700 hover:underline">
              Practice with the type quiz →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
