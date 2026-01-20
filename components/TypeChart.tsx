'use client';

import { TypeId } from '@/lib/types';
import { calculateMultiplier, formatMultiplier } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function TypeChart() {
  const getEffectivenessColor = (multiplier: number): string => {
    if (multiplier === 0) return 'bg-gray-400 text-white';
    if (multiplier >= 2) return 'bg-green-500 text-white';
    if (multiplier < 1) return 'bg-red-500 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 text-xs font-semibold sticky left-0 z-10">
                ATK →<br />DEF ↓
              </th>
              {ALL_TYPES.map(type => {
                const typeData = typesData.types.find(t => t.id === type);
                return (
                  <th
                    key={type}
                    className="border border-gray-300 p-2 text-xs font-semibold text-white min-w-[60px]"
                    style={{ backgroundColor: typeData?.color }}
                  >
                    {typeData?.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ALL_TYPES.map(defendingType => {
              const typeData = typesData.types.find(t => t.id === defendingType);
              return (
                <tr key={defendingType}>
                  <th
                    className="border border-gray-300 p-2 text-xs font-semibold text-white sticky left-0 z-10 min-w-[80px]"
                    style={{ backgroundColor: typeData?.color }}
                  >
                    {typeData?.name}
                  </th>
                  {ALL_TYPES.map(attackingType => {
                    const multiplier = calculateMultiplier(attackingType, [defendingType]);
                    const colorClass = getEffectivenessColor(multiplier);
                    return (
                      <td
                        key={`${attackingType}-${defendingType}`}
                        className={`border border-gray-300 p-2 text-center text-xs font-semibold ${colorClass}`}
                        title={`${typesData.types.find(t => t.id === attackingType)?.name} vs ${typeData?.name}: ${formatMultiplier(multiplier)}`}
                      >
                        {formatMultiplier(multiplier)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Super Effective (2×)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span>Normal (1×)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span>Not Very Effective (½×)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <span>No Effect (0×)</span>
        </div>
      </div>
    </div>
  );
}
