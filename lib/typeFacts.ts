import { TypeId } from './types';

/** Shared, canonical facts about the 18 types, used by the MCP and A2A servers. */
export const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const TYPE_NAMES: Record<TypeId, string> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass', ice: 'Ice',
  fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying', psychic: 'Psychic',
  bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark', steel: 'Steel', fairy: 'Fairy',
};

export const TYPE_DESCRIPTIONS: Record<TypeId, string> = {
  normal: 'Balanced and versatile; only walled by Rock and Steel, and cannot touch Ghost.',
  fire: 'Strong against Grass, Ice, Bug and Steel; resisted by Fire, Water, Rock and Dragon.',
  water: 'Strong against Fire, Ground and Rock; resisted by Water, Grass and Dragon.',
  electric: 'Strong against Water and Flying; useless against Ground.',
  grass: 'Strong against Water, Ground and Rock; resisted by a wide spread of types.',
  ice: 'Strong against Grass, Ground, Flying and Dragon; resisted by Fire, Water, Ice and Steel.',
  fighting: 'Strong against Normal, Ice, Rock, Dark and Steel; cannot touch Ghost.',
  poison: 'Strong against Grass and Fairy; useless against Steel.',
  ground: 'Strong against Fire, Electric, Poison, Rock and Steel; cannot touch Flying.',
  flying: 'Strong against Grass, Fighting and Bug; resisted by Electric, Rock and Steel.',
  psychic: 'Strong against Fighting and Poison; useless against Dark.',
  bug: 'Strong against Grass, Psychic and Dark; resisted by a wide spread of types.',
  rock: 'Strong against Fire, Ice, Flying and Bug; resisted by Fighting, Ground and Steel.',
  ghost: 'Strong against Psychic and Ghost; useless against Normal.',
  dragon: 'Strong only against Dragon; resisted by Steel and useless against Fairy.',
  dark: 'Strong against Psychic and Ghost; resisted by Fighting, Dark and Fairy.',
  steel: 'Strong against Ice, Rock and Fairy; resisted by Fire, Water, Electric and Steel.',
  fairy: 'Strong against Fighting, Dragon and Dark; resisted by Fire, Poison and Steel.',
};

export function isTypeId(value: unknown): value is TypeId {
  return typeof value === 'string' && (ALL_TYPES as string[]).includes(value);
}

export function typeName(id: TypeId): string {
  return TYPE_NAMES[id];
}

export function typeNames(ids: TypeId[]): string[] {
  return ids.map(typeName);
}

/**
 * Pull the type ids mentioned in free text, in the order they appear.
 * Used by the A2A endpoint to work out what a caller is asking about.
 */
export function findTypesInText(text: string): TypeId[] {
  // Normalise punctuation and separators to spaces first, otherwise a trailing
  // "?" or a "/" glued to a type name ("Dragon/Flying?") would not match.
  const normalised = ` ${text.toLowerCase().replace(/[^a-z]+/g, ' ')} `;
  const hits: Array<{ id: TypeId; at: number }> = [];
  for (const id of ALL_TYPES) {
    // Longest-first de-duplication is unnecessary: no type name contains another.
    const at = normalised.indexOf(` ${id} `);
    if (at !== -1) hits.push({ id, at });
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.id);
}
