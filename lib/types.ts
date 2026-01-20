export type TypeId =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface Type {
  id: TypeId;
  name: string;
  color: string;
  description: string;
}

export interface TypeEffectiveness {
  superEffective: TypeId[];
  notVeryEffective: TypeId[];
  noEffect: TypeId[];
}

export interface DefensiveTypeEffectiveness {
  weakTo: TypeId[];
  resistsTo: TypeId[];
  immuneTo: TypeId[];
}

export interface TypeMatchup {
  attackingType: TypeId;
  defendingTypes: TypeId[];
  multiplier: number;
  effectiveness: 'super-effective' | 'effective' | 'not-very-effective' | 'no-effect';
}

export interface DualTypeWeaknesses {
  quadrupleWeak: TypeId[];    // 4x damage
  doubleWeak: TypeId[];        // 2x damage
  normal: TypeId[];            // 1x damage
  doubleResist: TypeId[];      // 0.5x damage
  quadrupleResist: TypeId[];   // 0.25x damage
  immune: TypeId[];            // 0x damage
}

export type TypeChart = Record<TypeId, TypeEffectiveness>;
export type DefensiveTypeChart = Record<TypeId, DefensiveTypeEffectiveness>;
