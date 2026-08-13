'use client';

import { useState } from 'react';
import TypeBadge from '@/components/TypeBadge';
import { calculateMultiplier, formatMultiplier } from '@/lib/typeCalculations';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
const name = (id: TypeId) => typesData.types.find(type => type.id === id)?.name ?? id;
const cellClass = (value: number) => value === 0 ? 'bg-gray-800 text-white' : value === 2 ? 'bg-red-100 text-red-900' : value === .5 ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-700';

export default function EffectivenessExplorer() {
  const [attacking, setAttacking] = useState<TypeId>('fire');
  const [defending1, setDefending1] = useState<TypeId>('grass');
  const [defending2, setDefending2] = useState<TypeId | ''>('steel');
  const first = calculateMultiplier(attacking, [defending1]);
  const second = defending2 ? calculateMultiplier(attacking, [defending2 as TypeId]) : 1;
  const final = first * second;

  return <div className="space-y-8">
    <section className="rounded-xl border border-blue-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="font-semibold">Attacking type<select value={attacking} onChange={e => setAttacking(e.target.value as TypeId)} className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3">{ALL_TYPES.map(type => <option key={type} value={type}>{name(type)}</option>)}</select></label>
        <label className="font-semibold">Defending type 1<select value={defending1} onChange={e => { const value=e.target.value as TypeId; setDefending1(value); if(defending2===value)setDefending2(''); }} className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3">{ALL_TYPES.map(type => <option key={type} value={type}>{name(type)}</option>)}</select></label>
        <label className="font-semibold">Defending type 2 (optional)<select value={defending2} onChange={e => setDefending2(e.target.value as TypeId|'')} className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3"><option value="">None</option>{ALL_TYPES.map(type => <option key={type} value={type} disabled={type===defending1}>{name(type)}</option>)}</select></label>
      </div>
      <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 text-center text-white" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide">Final type multiplier</p><p className="my-2 text-5xl font-black">{formatMultiplier(final)}</p>
        <p className="text-lg">{name(attacking)} into {name(defending1)}: {formatMultiplier(first)}{defending2 && <> × {name(defending2 as TypeId)}: {formatMultiplier(second)}</>} = <strong>{formatMultiplier(final)}</strong></p>
        {final === 0 && <p className="mt-2 text-sm">An immunity in either defending type makes the complete attack deal 0× type effectiveness.</p>}
      </div>
    </section>

    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-2">Complete 18×18 Type Effectiveness Matrix</h2>
      <p className="text-gray-700 mb-5">Rows are attacking types; columns are single defending types. Select any cell to load it into the calculator above.</p>
      <div className="overflow-x-auto"><table className="min-w-[72rem] border-collapse text-center text-xs"><thead><tr><th className="sticky left-0 z-10 bg-white p-2 text-left">Attack ↓ / Defend →</th>{ALL_TYPES.map(type => <th key={type} className="p-2 [writing-mode:vertical-rl] h-24">{name(type)}</th>)}</tr></thead><tbody>{ALL_TYPES.map(attack => <tr key={attack}><th className="sticky left-0 bg-white p-2 text-left"><TypeBadge typeId={attack} size="sm" /></th>{ALL_TYPES.map(defend => { const value=calculateMultiplier(attack,[defend]); return <td key={defend} className="border border-white"><button onClick={()=>{setAttacking(attack);setDefending1(defend);setDefending2('');window.scrollTo({top:0,behavior:'smooth'});}} className={`h-10 w-full font-bold ${cellClass(value)}`} aria-label={`${name(attack)} against ${name(defend)}: ${formatMultiplier(value)}`}>{formatMultiplier(value)}</button></td>})}</tr>)}</tbody></table></div>
    </section>
  </div>;
}
