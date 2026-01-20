import { TypeId, TypeMatchup, DualTypeWeaknesses } from './types';
import defensiveTypeChart from '@/data/defensiveTypeChart.json';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

/**
 * Calculate the damage multiplier for an attacking type against defending type(s)
 */
export function calculateMultiplier(
  attackingType: TypeId,
  defendingTypes: TypeId[]
): number {
  let multiplier = 1;

  defendingTypes.forEach(defendingType => {
    const defensive = defensiveTypeChart[defendingType];

    if (defensive.immuneTo.includes(attackingType)) {
      multiplier *= 0;
    } else if (defensive.weakTo.includes(attackingType)) {
      multiplier *= 2;
    } else if (defensive.resistsTo.includes(attackingType)) {
      multiplier *= 0.5;
    }
  });

  return multiplier;
}

/**
 * Get effectiveness label based on multiplier
 */
export function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return 'No Effect';
  if (multiplier >= 4) return 'Super Effective (4x)';
  if (multiplier >= 2) return 'Super Effective (2x)';
  if (multiplier === 1) return 'Normal';
  if (multiplier >= 0.5) return 'Not Very Effective (0.5x)';
  return 'Not Very Effective (0.25x)';
}

/**
 * Calculate all weaknesses and resistances for a single or dual type
 */
export function calculateDualTypeWeaknesses(
  type1: TypeId,
  type2?: TypeId
): DualTypeWeaknesses {
  const defendingTypes = type2 ? [type1, type2] : [type1];

  const result: DualTypeWeaknesses = {
    quadrupleWeak: [],
    doubleWeak: [],
    normal: [],
    doubleResist: [],
    quadrupleResist: [],
    immune: []
  };

  ALL_TYPES.forEach(attackingType => {
    const multiplier = calculateMultiplier(attackingType, defendingTypes);

    if (multiplier === 0) {
      result.immune.push(attackingType);
    } else if (multiplier === 0.25) {
      result.quadrupleResist.push(attackingType);
    } else if (multiplier === 0.5) {
      result.doubleResist.push(attackingType);
    } else if (multiplier === 1) {
      result.normal.push(attackingType);
    } else if (multiplier === 2) {
      result.doubleWeak.push(attackingType);
    } else if (multiplier === 4) {
      result.quadrupleWeak.push(attackingType);
    }
  });

  return result;
}

/**
 * Calculate type matchup for battle simulator
 */
export function calculateTypeMatchup(
  attackingType: TypeId,
  defendingTypes: TypeId[],
  includeSTAB: boolean = false
): TypeMatchup {
  let multiplier = calculateMultiplier(attackingType, defendingTypes);

  // Apply STAB (Same Type Attack Bonus) if applicable
  if (includeSTAB && defendingTypes.includes(attackingType)) {
    multiplier *= 1.5;
  }

  let effectiveness: TypeMatchup['effectiveness'];
  if (multiplier === 0) {
    effectiveness = 'no-effect';
  } else if (multiplier >= 2) {
    effectiveness = 'super-effective';
  } else if (multiplier < 1) {
    effectiveness = 'not-very-effective';
  } else {
    effectiveness = 'effective';
  }

  return {
    attackingType,
    defendingTypes,
    multiplier,
    effectiveness
  };
}

/**
 * Get all type matchups for a given defending type combination
 */
export function getAllMatchups(defendingTypes: TypeId[]): TypeMatchup[] {
  return ALL_TYPES.map(attackingType =>
    calculateTypeMatchup(attackingType, defendingTypes)
  );
}

/**
 * Format multiplier for display
 */
export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0) return '0×';
  if (multiplier === 0.25) return '¼×';
  if (multiplier === 0.5) return '½×';
  if (multiplier === 1) return '1×';
  if (multiplier === 2) return '2×';
  if (multiplier === 4) return '4×';
  return `${multiplier}×`;
}
