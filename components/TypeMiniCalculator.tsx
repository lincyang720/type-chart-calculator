'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TypeId } from '@/lib/types';
import { calculateMultiplier } from '@/lib/typeCalculations';
import { TYPE_ORDER, displayType, formatChartMultiplier, formatTypeList } from '@/lib/typeLabels';

const MULTIPLIER_CLASS: Record<string, string> = {
  '4': 'bg-red-700 text-white',
  '2': 'bg-red-100 text-red-900',
  '1': 'bg-gray-100 text-gray-800',
  '0.5': 'bg-green-100 text-green-900',
  '0.25': 'bg-green-300 text-green-950',
  '0': 'bg-gray-800 text-white',
};

export default function TypeMiniCalculator({
  typeId,
  typeName,
}: {
  typeId: TypeId;
  typeName: string;
}) {
  const [secondType, setSecondType] = useState<TypeId | ''>('');
  const defendingTypes = secondType ? [typeId, secondType] : [typeId];
  const rows = TYPE_ORDER.map(attackingType => ({
    attackingType,
    multiplier: calculateMultiplier(attackingType, defendingTypes),
  }));
  const quad = rows.filter(row => row.multiplier === 4).map(row => row.attackingType);
  const weak = rows.filter(row => row.multiplier === 2).map(row => row.attackingType);
  const immune = rows.filter(row => row.multiplier === 0).map(row => row.attackingType);
  const defenderLabel = secondType ? `${typeName}/${displayType(secondType)}` : `pure ${typeName}`;
  const calculatorHref = secondType
    ? `/calculator?type1=${typeId}&type2=${secondType}`
    : `/calculator?type1=${typeId}`;

  return (
    <div id="type-calculator" className="scroll-mt-6 rounded-lg border border-blue-200 bg-white p-4 shadow-lg sm:p-6">
      <h2 className="text-2xl font-bold text-gray-900">Interactive {typeName} weakness calculator</h2>
      <p className="mt-2 text-gray-700">
        Add a second type to see 4× stacks, cancelled weaknesses, and immunities. The grid uses the Generation 6–9 chart, before abilities, items, or Terastallization.
      </p>
      <label htmlFor={`${typeId}-second-type`} className="mt-4 block text-sm font-semibold text-gray-800">
        Second type on the defender
      </label>
      <select
        id={`${typeId}-second-type`}
        value={secondType}
        onChange={event => setSecondType(event.target.value as TypeId | '')}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-sm"
      >
        <option value="">Pure {typeName}</option>
        {TYPE_ORDER.filter(option => option !== typeId).map(option => (
          <option key={option} value={option}>{displayType(option)}</option>
        ))}
      </select>

      <p className="mt-4 text-gray-800">
        <strong>{defenderLabel}:</strong>{' '}
        {quad.length > 0 && <>4× from {formatTypeList(quad)}. </>}
        {weak.length > 0 ? <>2× from {formatTypeList(weak)}. </> : <>No 2× weakness. </>}
        {immune.length > 0 && <>Immune to {formatTypeList(immune)}.</>}
      </p>

      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label={`Damage multiplier from each attacking type against ${defenderLabel}`}>
        {rows.map(row => (
          <li key={row.attackingType} className={`rounded px-2 py-2 text-center ${MULTIPLIER_CLASS[String(row.multiplier)] ?? 'bg-gray-100'}`}>
            <span className="block text-xs font-medium">{displayType(row.attackingType)}</span>
            <span className="block text-sm font-bold">{formatChartMultiplier(row.multiplier)}</span>
          </li>
        ))}
      </ul>
      <Link href={calculatorHref} className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
        Open this matchup in the full type calculator
      </Link>
    </div>
  );
}
