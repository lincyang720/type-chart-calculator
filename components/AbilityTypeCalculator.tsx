'use client';

import { useMemo, useState } from 'react';
import TypeBadge from './TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateMultiplier } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

type AbilityId =
  | 'none'
  | 'levitate'
  | 'flash-fire'
  | 'water-absorb'
  | 'storm-drain'
  | 'dry-skin'
  | 'volt-absorb'
  | 'lightning-rod'
  | 'motor-drive'
  | 'sap-sipper'
  | 'earth-eater'
  | 'well-baked-body'
  | 'thick-fat'
  | 'heatproof'
  | 'purifying-salt'
  | 'filter'
  | 'solid-rock'
  | 'prism-armor'
  | 'wonder-guard';

interface AbilityRule {
  id: AbilityId;
  name: string;
  description: string;
  apply: (attackingType: TypeId, baseMultiplier: number) => number;
}

const immuneTo = (immuneType: TypeId) => (attackingType: TypeId, baseMultiplier: number) =>
  attackingType === immuneType ? 0 : baseMultiplier;

const ABILITIES: AbilityRule[] = [
  { id: 'none', name: 'No ability', description: 'Standard type effectiveness only.', apply: (_type, base) => base },
  { id: 'levitate', name: 'Levitate', description: 'Grants immunity to Ground-type moves.', apply: immuneTo('ground') },
  { id: 'flash-fire', name: 'Flash Fire', description: 'Grants immunity to Fire-type moves.', apply: immuneTo('fire') },
  { id: 'water-absorb', name: 'Water Absorb', description: 'Grants immunity to Water-type moves.', apply: immuneTo('water') },
  { id: 'storm-drain', name: 'Storm Drain', description: 'Grants immunity to Water-type moves.', apply: immuneTo('water') },
  {
    id: 'dry-skin',
    name: 'Dry Skin',
    description: 'Grants Water immunity but increases Fire damage by 25%.',
    apply: (type, base) => type === 'water' ? 0 : type === 'fire' ? base * 1.25 : base,
  },
  { id: 'volt-absorb', name: 'Volt Absorb', description: 'Grants immunity to Electric-type moves.', apply: immuneTo('electric') },
  { id: 'lightning-rod', name: 'Lightning Rod', description: 'Grants immunity to Electric-type moves.', apply: immuneTo('electric') },
  { id: 'motor-drive', name: 'Motor Drive', description: 'Grants immunity to Electric-type moves.', apply: immuneTo('electric') },
  { id: 'sap-sipper', name: 'Sap Sipper', description: 'Grants immunity to Grass-type moves.', apply: immuneTo('grass') },
  { id: 'earth-eater', name: 'Earth Eater', description: 'Grants immunity to Ground-type moves.', apply: immuneTo('ground') },
  { id: 'well-baked-body', name: 'Well-Baked Body', description: 'Grants immunity to Fire-type moves.', apply: immuneTo('fire') },
  {
    id: 'thick-fat',
    name: 'Thick Fat',
    description: 'Halves damage from Fire- and Ice-type moves.',
    apply: (type, base) => type === 'fire' || type === 'ice' ? base * 0.5 : base,
  },
  { id: 'heatproof', name: 'Heatproof', description: 'Halves damage from Fire-type moves.', apply: (type, base) => type === 'fire' ? base * 0.5 : base },
  { id: 'purifying-salt', name: 'Purifying Salt', description: 'Halves damage from Ghost-type moves.', apply: (type, base) => type === 'ghost' ? base * 0.5 : base },
  { id: 'filter', name: 'Filter', description: 'Reduces super-effective damage by 25%.', apply: (_type, base) => base > 1 ? base * 0.75 : base },
  { id: 'solid-rock', name: 'Solid Rock', description: 'Reduces super-effective damage by 25%.', apply: (_type, base) => base > 1 ? base * 0.75 : base },
  { id: 'prism-armor', name: 'Prism Armor', description: 'Reduces super-effective damage by 25%.', apply: (_type, base) => base > 1 ? base * 0.75 : base },
  { id: 'wonder-guard', name: 'Wonder Guard', description: 'Blocks damaging moves that are not super effective.', apply: (_type, base) => base > 1 ? base : 0 },
];

function formatMultiplier(multiplier: number): string {
  return `${Number.isInteger(multiplier) ? multiplier : Number(multiplier.toFixed(3))}x`;
}

function resultClass(multiplier: number): string {
  if (multiplier === 0) return 'border-gray-300 bg-gray-100';
  if (multiplier > 1) return 'border-red-200 bg-red-50';
  if (multiplier < 1) return 'border-green-200 bg-green-50';
  return 'border-gray-200 bg-white';
}

export default function AbilityTypeCalculator() {
  const [type1, setType1] = useState<TypeId>('electric');
  const [type2, setType2] = useState<TypeId | ''>('steel');
  const [abilityId, setAbilityId] = useState<AbilityId>('levitate');
  const ability = ABILITIES.find(item => item.id === abilityId) ?? ABILITIES[0];

  const matchups = useMemo(() => {
    const defendingTypes = type2 ? [type1, type2] : [type1];
    return ALL_TYPES.map(attackingType => {
      const base = calculateMultiplier(attackingType, defendingTypes as TypeId[]);
      return { attackingType, base, adjusted: ability.apply(attackingType, base) };
    });
  }, [ability, type1, type2]);

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg sm:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-gray-800">
          Primary type
          <select
            value={type1}
            onChange={event => {
              const nextType = event.target.value as TypeId;
              setType1(nextType);
              if (type2 === nextType) setType2('');
            }}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {typesData.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-800">
          Secondary type
          <select value={type2} onChange={event => setType2(event.target.value as TypeId | '')} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">None</option>
            {typesData.types.map(type => <option key={type.id} value={type.id} disabled={type.id === type1}>{type.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-800">
          Defensive ability
          <select value={abilityId} onChange={event => setAbilityId(event.target.value as AbilityId)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2">
            {ABILITIES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>

      <div className="my-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-gray-800">
        <strong>{ability.name}:</strong> {ability.description}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {matchups.map(({ attackingType, base, adjusted }) => (
          <div key={attackingType} className={`rounded-md border p-3 text-center ${resultClass(adjusted)}`}>
            <TypeBadge typeId={attackingType} size="sm" />
            <p className="mt-2 font-bold text-gray-900">{formatMultiplier(adjusted)}</p>
            {base !== adjusted && <p className="text-xs text-gray-500">Base {formatMultiplier(base)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
