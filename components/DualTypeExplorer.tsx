'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import { TypeId } from '@/lib/types';
import pokemonData from '@/data/pokemon.json';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
type SortMode = 'chart' | 'fewest' | 'most';

export default function DualTypeExplorer() {
  const [sort, setSort] = useState<SortMode>('chart');
  const [fourXOnly, setFourXOnly] = useState(false);
  const [immunityOnly, setImmunityOnly] = useState(false);
  const [selected, setSelected] = useState<string>('fire-flying');

  const combinations = useMemo(() => {
    const rows = [];
    for (let i = 0; i < ALL_TYPES.length; i++) for (let j = i + 1; j < ALL_TYPES.length; j++) {
      const first = ALL_TYPES[i]; const second = ALL_TYPES[j];
      const result = calculateDualTypeWeaknesses(first, second);
      rows.push({ slug: `${first}-${second}`, first, second, result, weaknessCount: result.quadrupleWeak.length + result.doubleWeak.length });
    }
    return rows.filter(row => (!fourXOnly || row.result.quadrupleWeak.length > 0) && (!immunityOnly || row.result.immune.length > 0))
      .sort((a, b) => sort === 'fewest' ? a.weaknessCount - b.weaknessCount : sort === 'most' ? b.weaknessCount - a.weaknessCount : 0);
  }, [sort, fourXOnly, immunityOnly]);

  const active = combinations.find(row => row.slug === selected) ?? combinations[0];
  const names = (values: TypeId[]) => values.map(id => typesData.types.find(type => type.id === id)?.name).join(', ') || 'None';
  const pokemon = active ? pokemonData.pokemon.filter(item => item.types.length === 2 && item.types.includes(active.first) && item.types.includes(active.second)).slice(0, 4) : [];
  const color = (count: number) => count <= 2 ? 'border-green-300 bg-green-50' : count <= 4 ? 'border-yellow-300 bg-yellow-50' : count <= 6 ? 'border-orange-300 bg-orange-50' : 'border-red-300 bg-red-50';

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="font-semibold text-gray-800">Sort combinations
            <select value={sort} onChange={event => setSort(event.target.value as SortMode)} className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3">
              <option value="chart">Chart order</option><option value="fewest">Fewest weaknesses</option><option value="most">Most weaknesses</option>
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-gray-200 px-4"><input type="checkbox" checked={fourXOnly} onChange={event => setFourXOnly(event.target.checked)} /> Has a 4× weakness</label>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-gray-200 px-4"><input type="checkbox" checked={immunityOnly} onChange={event => setImmunityOnly(event.target.checked)} /> Has an immunity</label>
        </div>
        <p className="mt-4 text-sm text-gray-600">Showing {combinations.length} of 153 combinations. Green has 0–2 weaknesses; yellow 3–4; orange 5–6; red 7+.</p>
      </section>

      {active && <section className="rounded-xl border-2 border-blue-300 bg-blue-50 p-5 sm:p-6" aria-live="polite">
        <div className="flex flex-wrap items-center gap-3"><TypeBadge typeId={active.first} size="lg" /><TypeBadge typeId={active.second} size="lg" /><h2 className="text-2xl font-bold">Selected combination</h2></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
          <div><strong className="text-red-800">4× weak</strong><p>{names(active.result.quadrupleWeak)}</p></div>
          <div><strong className="text-orange-800">2× weak</strong><p>{names(active.result.doubleWeak)}</p></div>
          <div><strong className="text-blue-800">½× resistant</strong><p>{names(active.result.doubleResist)}</p></div>
          <div><strong className="text-indigo-800">¼× resistant</strong><p>{names(active.result.quadrupleResist)}</p></div>
          <div><strong className="text-gray-800">Immune</strong><p>{names(active.result.immune)}</p></div>
        </div>
        {pokemon.length > 0 && <p className="mt-5"><strong>Pokémon with this typing:</strong> {pokemon.map((item, index) => <span key={item.id}>{index > 0 && ', '}<Link className="text-blue-700 hover:underline" href={`/pokemon/${item.id}`}>{item.name}</Link></span>)}</p>}
        <Link href={`/?type1=${active.first}&type2=${active.second}#calculator`} className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Calculate this combination’s complete matchup →</Link>
      </section>}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {combinations.map(row => <button key={row.slug} type="button" onClick={() => setSelected(row.slug)} className={`rounded-lg border p-3 text-left transition hover:shadow ${color(row.weaknessCount)} ${selected === row.slug ? 'ring-2 ring-blue-600' : ''}`}>
          <span className="flex flex-wrap gap-1"><TypeBadge typeId={row.first} size="sm" /><TypeBadge typeId={row.second} size="sm" /></span>
          <span className="mt-2 block text-xs font-semibold text-gray-800">{row.weaknessCount} weaknesses{row.result.quadrupleWeak.length ? ` · ${row.result.quadrupleWeak.length} at 4×` : ''}</span>
        </button>)}
      </div>
    </div>
  );
}
