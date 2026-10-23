'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { calculateMultiplier } from '@/lib/typeCalculations';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

type TeamMember = {
  name: string;
  type1: TypeId | '';
  type2: TypeId | '';
};

const INITIAL_TEAM: TeamMember[] = [
  { name: 'Charizard', type1: 'fire', type2: 'flying' },
  { name: 'Swampert', type1: 'water', type2: 'ground' },
  { name: 'Klefki', type1: 'steel', type2: 'fairy' },
  { name: '', type1: '', type2: '' },
  { name: '', type1: '', type2: '' },
  { name: '', type1: '', type2: '' },
];

function getTypeName(typeId: TypeId) {
  return typesData.types.find(type => type.id === typeId)?.name ?? typeId;
}

function findPokemon(name: string) {
  const query = name.trim().toLowerCase();
  return pokemonData.pokemon.find(pokemon => pokemon.name.toLowerCase() === query);
}

export default function TeamTypeCalculator() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const activeTeam = team.filter(member => member.type1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedType1 = params.get('type1') as TypeId | null;
    const requestedType2 = params.get('type2') as TypeId | null;
    if (!requestedType1 || !ALL_TYPES.includes(requestedType1)) return;
    setTeam(current => current.map((member, index) => index === 0 ? {
      name: '',
      type1: requestedType1,
      type2: requestedType2 && ALL_TYPES.includes(requestedType2) && requestedType2 !== requestedType1 ? requestedType2 : '',
    } : member));
  }, []);

  const updateMember = (index: number, field: keyof TeamMember, value: TypeId | '') => {
    setTeam(current => current.map((member, memberIndex) => {
      if (memberIndex !== index) return member;

      if (field === 'type1') {
        return {
          ...member,
          name: '',
          type1: value,
          type2: value === '' || member.type2 === value ? '' : member.type2,
        };
      }

      return { ...member, type2: value };
    }));
  };

  const updatePokemonName = (index: number, name: string) => {
    const pokemon = findPokemon(name);
    setTeam(current => current.map((member, memberIndex) => {
      if (memberIndex !== index) return member;
      if (!pokemon) return { ...member, name };
      return {
        name: pokemon.name,
        type1: pokemon.types[0] as TypeId,
        type2: (pokemon.types[1] as TypeId | undefined) ?? '',
      };
    }));
  };

  const analysis = ALL_TYPES.map(attackingType => {
    let weak = 0;
    let resistant = 0;
    let immune = 0;

    activeTeam.forEach(member => {
      const defendingTypes = [member.type1, member.type2].filter(Boolean) as TypeId[];
      const multiplier = calculateMultiplier(attackingType, defendingTypes);

      if (multiplier > 1) weak += 1;
      if (multiplier > 0 && multiplier < 1) resistant += 1;
      if (multiplier === 0) immune += 1;
    });

    return { attackingType, weak, resistant, immune };
  });

  const threats = analysis
    .filter(result => result.weak > 0)
    .sort((a, b) => b.weak - a.weak || (b.resistant + b.immune) - (a.resistant + a.immune));
  const unguardedThreats = threats.filter(result => result.resistant + result.immune === 0);

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-bold">Build Your Team</h2>
            <p className="text-gray-600 mt-1">Search a Pokémon to fill its types automatically, or choose types manually.</p>
          </div>
          <button
            type="button"
            onClick={() => setTeam(team.map(() => ({ name: '', type1: '', type2: '' })))}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Clear team
          </button>
        </div>

        <div className="space-y-3">
          {team.map((member, index) => (
            <div key={index} className="grid gap-3 bg-gray-50 p-3 rounded-lg sm:grid-cols-[7rem_1fr_1fr_1fr] sm:items-center">
              <span className="font-semibold text-gray-800">Member {index + 1}</span>
              <label className="sr-only" htmlFor={`team-pokemon-${index}`}>Member {index + 1} Pokémon name</label>
              <input
                id={`team-pokemon-${index}`}
                list="team-pokemon-names"
                value={member.name}
                onChange={event => updatePokemonName(index, event.target.value)}
                placeholder="Search Pokémon"
                className="w-full min-h-11 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
              <label className="sr-only" htmlFor={`team-primary-${index}`}>Member {index + 1} primary type</label>
              <select
                id={`team-primary-${index}`}
                value={member.type1}
                onChange={event => updateMember(index, 'type1', event.target.value as TypeId | '')}
                className="w-full min-h-11 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Empty slot</option>
                {ALL_TYPES.map(type => <option key={type} value={type}>{getTypeName(type)}</option>)}
              </select>
              <label className="sr-only" htmlFor={`team-secondary-${index}`}>Member {index + 1} secondary type</label>
              <select
                id={`team-secondary-${index}`}
                value={member.type2}
                disabled={!member.type1}
                onChange={event => updateMember(index, 'type2', event.target.value as TypeId | '')}
                className="w-full min-h-11 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No secondary type</option>
                {ALL_TYPES.map(type => (
                  <option key={type} value={type} disabled={type === member.type1}>{getTypeName(type)}</option>
                ))}
              </select>
            </div>
          ))}
          <datalist id="team-pokemon-names">
            {pokemonData.pokemon.map(pokemon => <option key={pokemon.id} value={pokemon.name} />)}
          </datalist>
        </div>
      </section>

      <section aria-live="polite" className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Team Weakness Analysis</h2>
        <p className="text-gray-600 mb-6">
          Analyzing {activeTeam.length} of 6 team slots. A weakness means that member takes 2x or 4x damage.
        </p>

        {activeTeam.length === 0 ? (
          <p className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-700">
            Select at least one primary type to generate a team report.
          </p>
        ) : (
          <>
            {unguardedThreats.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-red-800 mb-2">Coverage gaps</h3>
                <p className="text-red-900 mb-3">
                  Your team has weaknesses to these attack types without any listed resistance or immunity.
                </p>
                <div className="flex flex-wrap gap-2">
                  {unguardedThreats.map(result => (
                    <TypeBadge key={result.attackingType} typeId={result.attackingType} size="sm" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-900">
                Every shared weakness has at least one resistance or immunity elsewhere on the team.
              </div>
            )}

            <div className="overflow-x-auto mb-6">
              <table className="w-full min-w-[36rem] text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="sticky left-0 bg-white py-3 pr-3">Attack type</th>
                    <th className="py-3 px-3">Weak members</th>
                    <th className="py-3 px-3">Resistant members</th>
                    <th className="py-3 pl-3">Immune members</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.map(result => (
                    <tr key={result.attackingType} className="border-b border-gray-100">
                      <td className="py-3 pr-3"><TypeBadge typeId={result.attackingType} size="sm" /></td>
                      <td className={`py-3 px-3 font-semibold ${result.weak > 1 ? 'text-red-700' : 'text-gray-800'}`}>{result.weak}</td>
                      <td className="py-3 px-3 text-green-700 font-semibold">{result.resistant}</td>
                      <td className="py-3 pl-3 text-blue-700 font-semibold">{result.immune}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold mb-2">How to improve this team</h3>
              <p className="text-gray-700">
                Prioritize attack types that threaten multiple members, especially when the team has no resistance or
                immunity to create a safe switch. Base stats, abilities, moves, items, and battle format still affect the
                final matchup, so use this report as a defensive type check rather than a complete battle prediction.
              </p>
            </div>
          </>
        )}
      </section>

      <div className="flex flex-wrap gap-x-6 gap-y-3 font-semibold">
        <Link href="/type-effectiveness-calculator" className="text-blue-700 hover:underline">
          Check exact type multipliers →
        </Link>
        <Link href="/dual-type-chart" className="text-blue-700 hover:underline">
          Explore all dual-type combinations →
        </Link>
        <Link href="/pokemon/best-type-combinations" className="text-blue-700 hover:underline">
          Compare strong dual-type combinations →
        </Link>
        <Link href="/pokemon/type-chart-with-abilities" className="text-blue-700 hover:underline">
          Check ability-adjusted matchups →
        </Link>
      </div>
    </div>
  );
}
