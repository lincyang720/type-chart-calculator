'use client';

import { useState } from 'react';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import TypeBadge from './TypeBadge';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function DualTypeCalculator() {
  const [type1, setType1] = useState<TypeId>('normal');
  const [type2, setType2] = useState<TypeId | ''>('');

  const weaknesses = calculateDualTypeWeaknesses(
    type1,
    type2 ? (type2 as TypeId) : undefined
  );

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dual Type Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Type</label>
            <select
              value={type1}
              onChange={(e) => setType1(e.target.value as TypeId)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
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
      </div>
    </div>
  );
}
