'use client';

import { useState } from 'react';
import { TypeId } from '@/lib/types';
import { calculateTypeMatchup, formatMultiplier } from '@/lib/typeCalculations';
import TypeBadge from './TypeBadge';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function BattleSimulator() {
  const [attackingType, setAttackingType] = useState<TypeId>('fire');
  const [defendingType1, setDefendingType1] = useState<TypeId>('grass');
  const [defendingType2, setDefendingType2] = useState<TypeId | ''>('');
  const [includeSTAB, setIncludeSTAB] = useState(false);

  const defendingTypes = defendingType2
    ? [defendingType1, defendingType2 as TypeId]
    : [defendingType1];

  const matchup = calculateTypeMatchup(attackingType, defendingTypes, includeSTAB);

  const getEffectivenessMessage = () => {
    const { effectiveness, multiplier } = matchup;

    if (effectiveness === 'no-effect') {
      return {
        message: "It doesn't affect the opponent...",
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
    }

    if (effectiveness === 'super-effective') {
      return {
        message: "It's super effective!",
        color: 'text-green-700',
        bgColor: 'bg-green-100'
      };
    }

    if (effectiveness === 'not-very-effective') {
      return {
        message: "It's not very effective...",
        color: 'text-red-700',
        bgColor: 'bg-red-100'
      };
    }

    return {
      message: "It's normally effective.",
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    };
  };

  const effectivenessInfo = getEffectivenessMessage();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Battle Simulator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Attacking Side */}
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Attacking Move</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Move Type</label>
              <select
                value={attackingType}
                onChange={(e) => setAttackingType(e.target.value as TypeId)}
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
              <div className="mt-3">
                <TypeBadge typeId={attackingType} size="lg" />
              </div>
            </div>
          </div>

          {/* Defending Side */}
          <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
            <h3 className="text-lg font-semibold mb-4 text-red-800">Defending Type(s)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Type</label>
                <select
                  value={defendingType1}
                  onChange={(e) => setDefendingType1(e.target.value as TypeId)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  value={defendingType2}
                  onChange={(e) => setDefendingType2(e.target.value as TypeId | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              <div className="flex gap-2">
                <TypeBadge typeId={defendingType1} size="lg" />
                {defendingType2 && <TypeBadge typeId={defendingType2 as TypeId} size="lg" />}
              </div>
            </div>
          </div>
        </div>

        {/* STAB Option */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSTAB}
              onChange={(e) => setIncludeSTAB(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Include STAB (Same Type Attack Bonus - 1.5× multiplier)
            </span>
          </label>
        </div>

        {/* Result */}
        <div className={`p-6 rounded-lg ${effectivenessInfo.bgColor}`}>
          <div className="text-center">
            <p className={`text-2xl font-bold mb-2 ${effectivenessInfo.color}`}>
              {effectivenessInfo.message}
            </p>
            <p className="text-4xl font-bold text-gray-800 mb-2">
              {formatMultiplier(matchup.multiplier)}
            </p>
            <p className="text-sm text-gray-600">
              Damage Multiplier
            </p>
            {includeSTAB && matchup.multiplier > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                (Includes STAB bonus)
              </p>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Select the attacking move's type</li>
            <li>Select the defending type(s)</li>
            <li>The calculator shows the damage multiplier</li>
            <li>STAB adds a 1.5× bonus when the move type matches the attacker's type</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
