'use client';

import { useMemo, useState, type DragEvent } from 'react';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { calculateMultiplier } from '@/lib/typeCalculations';
import type { TypeId } from '@/lib/types';

export type TeamBuilderPokemon = { id: string; name: string; types: TypeId[] };

const TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];
const EMPTY_TEAM: (string | null)[] = [null, null, null, null, null, null];

function titleCase(type: TypeId) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function PokemonTeamBuilder({ pokemon }: { pokemon: TeamBuilderPokemon[] }) {
  const [team, setTeam] = useState<(string | null)[]>(EMPTY_TEAM);
  const [search, setSearch] = useState<string[]>(['', '', '', '', '', '']);
  const [focusedSlot, setFocusedSlot] = useState<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const byId = useMemo(() => new Map(pokemon.map(p => [p.id, p])), [pokemon]);
  const members = team.map(id => id ? byId.get(id) ?? null : null);
  const filled = members.filter((member): member is TeamBuilderPokemon => Boolean(member));

  function assign(index: number, id: string) {
    const selected = byId.get(id);
    if (!selected) return;
    setTeam(current => current.map((oldId, i) => i === index ? id : oldId));
    setSearch(current => current.map((value, i) => i === index ? '' : value));
    setFocusedSlot(null);
  }

  function clear(index: number) {
    setTeam(current => current.map((id, i) => i === index ? null : id));
    setSearch(current => current.map((value, i) => i === index ? '' : value));
  }

  function suggestions(index: number) {
    const term = search[index].trim().toLocaleLowerCase();
    if (!term) return [];
    return pokemon.filter(p => p.name.toLocaleLowerCase().includes(term) || p.id.includes(term)).slice(0, 8);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    setDropSlot(null);
    const id = event.dataTransfer.getData('text/plain');
    if (byId.has(id)) assign(index, id);
  }

  const matrix = TYPES.map(attack => {
    const multipliers = members.map(member => member ? calculateMultiplier(attack, member.types) : null);
    const weak2 = multipliers.filter(x => x === 2).length;
    const weak4 = multipliers.filter(x => x === 4).length;
    const resist = multipliers.filter(x => x !== null && x > 0 && x < 1).length;
    const immune = multipliers.filter(x => x === 0).length;
    return { attack, multipliers, weak2, weak4, resist, immune, weak: weak2 + weak4, answers: resist + immune };
  });
  const threats = matrix.filter(row => row.weak > 0)
    .sort((a, b) => (b.weak - a.weak) || (b.weak4 - a.weak4) || (a.answers - b.answers));
  const topThree = threats.slice(0, 3);
  const gaps = matrix.filter(row => row.answers === 0);
  const exposed = gaps.filter(row => row.weak > 0);
  const formatMultiplier = (value: number | null) => {
    if (value === null) return '—';
    if (value === 0) return '0×';
    if (value === 0.25) return '¼×';
    if (value === 0.5) return '½×';
    return String(value) + '×';
  };

  return (
    <div className="space-y-5">
      <section aria-labelledby="roster-heading" className="rounded-xl border border-blue-200 bg-white p-3 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="roster-heading" className="text-xl font-bold text-gray-900">Your team · {filled.length}/6</h2>
            <p className="text-sm text-gray-600">Search and tap a Pokémon, or drag a search result into a slot on desktop.</p>
          </div>
          <button type="button" onClick={() => { setTeam([...EMPTY_TEAM]); setSearch(['', '', '', '', '', '']); setFocusedSlot(null); }}
            className="min-h-11 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Clear team</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} onDragOver={event => { event.preventDefault(); setDropSlot(index); }}
              onDragLeave={() => setDropSlot(null)} onDrop={event => handleDrop(event, index)}
              className={'relative min-w-0 rounded-lg border p-3 ' +
                (dropSlot === index ? 'border-blue-600 bg-blue-50 ' : 'border-gray-200 bg-gray-50 ')}>
              <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
                <span className="text-sm font-bold text-gray-700">Slot {index + 1}</span>
                {member && <button type="button" aria-label={'Remove ' + member.name + ' from slot ' + (index + 1)}
                  onClick={() => clear(index)} className="min-h-9 rounded px-2 text-sm font-medium text-red-700 hover:bg-red-50">Remove</button>}
              </div>
              {member && (
                <div className="mb-2 rounded-md border border-gray-200 bg-white p-2">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {member.types.map(type => <TypeBadge key={type} typeId={type} size="sm" />)}
                  </div>
                </div>
              )}
              <label htmlFor={'team-builder-search-' + index} className="sr-only">Search Pokémon for slot {index + 1}</label>
              <input id={'team-builder-search-' + index} type="search" autoComplete="off"
                placeholder={member ? 'Replace Pokémon…' : 'Search Pokémon…'}
                value={search[index]}
                onFocus={() => setFocusedSlot(index)}
                onChange={event => {
                  const value = event.target.value;
                  setSearch(current => current.map((old, i) => i === index ? value : old));
                  setFocusedSlot(index);
                }}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {focusedSlot === index && search[index].trim() !== '' && (
                <div className="absolute left-3 right-3 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg"
                  role="listbox" aria-label={'Pokémon choices for slot ' + (index + 1)}>
                  {suggestions(index).length ? suggestions(index).map(choice => (
                    <button key={choice.id} type="button" role="option" aria-selected="false" draggable
                      onDragStart={event => event.dataTransfer.setData('text/plain', choice.id)}
                      onClick={() => assign(index, choice.id)}
                      className="flex min-h-11 w-full items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50">
                      <span>{choice.name}</span><span className="text-xs text-gray-500">{choice.types.map(titleCase).join(' / ')}</span>
                    </button>
                  )) : <p className="p-3 text-sm text-gray-600">No match in this site's Pokémon data.</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-600">Only Pokémon and types already listed in TypeMatchup's local data are selectable. Duplicate selections are allowed.</p>
      </section>

      <section aria-live="polite" aria-labelledby="coverage-heading" className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
        <h2 id="coverage-heading" className="text-xl font-bold text-gray-900">Team weakness and resistance coverage</h2>
        {filled.length === 0 ? (
          <p className="mt-3 rounded-lg bg-blue-50 p-4 text-sm text-gray-800">Choose your first Pokémon above to see the 18-type matrix and coverage gaps.</p>
        ) : (
          <>
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-900">
              <p className="font-semibold">Team snapshot ({filled.length}/6)</p>
              <p className="mt-1">
                {topThree.length ? 'Most threatening attack types: ' + topThree.map(row => titleCase(row.attack)).join(', ') + '.' : 'No super-effective attack types in the current team.'}
                {' '}{exposed.length ? 'No resistant or immune switch for: ' + exposed.map(row => titleCase(row.attack)).join(', ') + '.' : 'Each current weakness has at least one resistant or immune teammate.'}
              </p>
            </div>
            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200" tabIndex={0} aria-label="Scroll the team coverage matrix horizontally">
              <table className="w-full min-w-[650px] border-collapse text-center text-xs sm:text-sm">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th scope="col" className="sticky left-0 z-10 min-w-28 border-b border-r bg-gray-100 px-2 py-3 text-left">Attack</th>
                    {members.map((member, i) => <th key={i} scope="col" className="min-w-14 border-b px-1 py-3" title={member?.name ?? 'Empty slot'}>{member ? member.name : '—'}</th>)}
                    <th scope="col" className="border-b px-2">2×</th>
                    <th scope="col" className="border-b px-2">4×</th>
                    <th scope="col" className="border-b px-2">Resist</th>
                    <th scope="col" className="border-b px-2">Immune</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map(row => (
                    <tr key={row.attack} className="border-b border-gray-100">
                      <th scope="row" className="sticky left-0 z-10 border-r bg-white px-2 py-2 text-left">
                        <TypeBadge typeId={row.attack} size="sm" />
                      </th>
                      {row.multipliers.map((value, i) => (
                        <td key={i} className={'px-1 py-2 font-semibold ' +
                          (value !== null && value > 1 ? 'bg-red-50 text-red-800' :
                            value !== null && value < 1 ? 'bg-green-50 text-green-800' : 'text-gray-600')}>
                          {formatMultiplier(value)}
                        </td>
                      ))}
                      <td className="px-2 py-2 font-bold text-red-800">{row.weak2}</td>
                      <td className="px-2 py-2 font-bold text-red-800">{row.weak4}</td>
                      <td className="px-2 py-2 font-bold text-green-800">{row.resist}</td>
                      <td className="px-2 py-2 font-bold text-blue-800">{row.immune}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">Swipe sideways on mobile to see all six slots. 2× and 4× count affected members; Resist includes ½× and ¼×; Immune counts 0×.</p>
            <div className="mt-4 rounded-lg border border-gray-200 p-3">
              <h3 className="font-bold text-gray-900">Coverage gaps</h3>
              <p className="mt-1 text-sm text-gray-700">
                {exposed.length ? 'Attack types with a team weakness and no resisting or immune Pokémon: ' + exposed.map(row => titleCase(row.attack)).join(', ') + '.' :
                  'No unguarded weaknesses in the currently selected team.'}
              </p>
              <p className="mt-2 text-xs text-gray-600">No resistance or immunity from any selected Pokémon: {gaps.length ? gaps.map(row => titleCase(row.attack)).join(', ') : 'none'}.</p>
            </div>
          </>
        )}
      </section>
      <p className="text-xs leading-relaxed text-gray-600">This is a defensive type-only analysis. Moves, abilities, items, forms not included in our local data, Tera types, and battle format rules are not modeled. Use the <Link href="/pokemon/team-calculator" className="text-blue-700 underline">type-based team calculator</Link> for manual combinations.</p>
    </div>
  );
}
