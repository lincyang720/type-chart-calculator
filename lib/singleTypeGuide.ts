import { TypeId } from './types';
import { calculateDualTypeWeaknesses, calculateMultiplier } from './typeCalculations';
import { canonicalDualTypeSlug, isIndexableDualType } from './dualTypeIndexing';
import { MOVE_TYPES } from './moveTypes';
import { TYPE_ORDER, displayType, formatChartMultiplier, formatTypeList } from './typeLabels';
import defensiveTypeChartData from '@/data/defensiveTypeChart.json';
import typeChartData from '@/data/typeChart.json';
import pokemonData from '@/data/pokemon.json';
import dualTypeSpeciesData from '@/data/dualTypeSpecies.json';
import popularCombinationsData from '@/data/popularCombinations.json';

export { displayType, formatChartMultiplier, formatTypeList };

export const GHOST_PURE_WEAKNESS_SENTENCE =
  'Ghost-type Pokémon are weak to Ghost and Dark moves, each dealing 2× damage against a pure Ghost defender.';

type PokemonRecord = {
  id: string;
  name: string;
  types: string[];
  baseStats: { attack: number; spAtk: number };
  recommendedMoves: string[];
};

type DefenseRow = { weakTo: TypeId[]; resistsTo: TypeId[]; immuneTo: TypeId[] };
type OffenseRow = { superEffective: TypeId[]; notVeryEffective: TypeId[]; noEffect: TypeId[] };

const defenseChart = defensiveTypeChartData as Record<TypeId, DefenseRow>;
const offenseChart = typeChartData as Record<TypeId, OffenseRow>;
const pokemon = pokemonData.pokemon as PokemonRecord[];
const speciesBySlug = dualTypeSpeciesData as Record<string, string[]>;
const popularCombinations = popularCombinationsData.combinations as {
  type1: string;
  type2: string;
  examples: string[];
}[];

const pokemonHrefByName = new Map(
  pokemon.map(entry => [entry.name.trim().toLowerCase(), `/pokemon/${entry.id}`]),
);

export type SpeciesRef = { name: string; href?: string };

export type TypingRow = {
  key: string;
  types: TypeId[];
  label: string;
  species: SpeciesRef[];
  quadWeak: TypeId[];
  doubleWeak: TypeId[];
  indexable: boolean;
};

export type CounterRow = {
  id: string;
  name: string;
  href: string;
  types: TypeId[];
  moves: { name: string; type: TypeId }[];
  stabTypes: TypeId[];
  stat: number;
  statLabel: 'Attack' | 'Special Attack';
};

export type ExceptionChange = {
  attack: TypeId;
  total: number;
  partnerFactor: number;
};

export type ExceptionRow = {
  partner: TypeId;
  slug: string;
  indexable: boolean;
  changes: ExceptionChange[];
  examples: SpeciesRef[];
};

export type TypeFaq = { question: string; answer: string };

export type SingleTypeGuideModel = {
  typeId: TypeId;
  typeName: string;
  shortAnswer: string;
  weakTo: TypeId[];
  resistsTo: TypeId[];
  immuneTo: TypeId[];
  superEffective: TypeId[];
  notVeryEffective: TypeId[];
  noEffect: TypeId[];
  counters: CounterRow[];
  typings: TypingRow[];
  exceptions: ExceptionRow[];
  unchangedPartnerCount: number;
};

const BEATS_NOTE: Record<TypeId, string> = {
  normal: 'Ghost moves do not beat a pure Normal defender; Normal is immune to Ghost.',
  fire: 'A resisted Grass or Bug move is not the whole turn if the opponent also carries Ground or Rock.',
  water: 'Freeze-Dry is a move-specific exception and is not part of this base chart.',
  electric: 'There is only one super-effective type, so the exchange turns on whether that Ground move can land.',
  grass: 'Grass attacks are resisted by seven types, so the defensive list is not the only reason a Grass move can fail.',
  ice: 'An Ice move on a non-Ice Pokémon can be the counter without inheriting a pure Ice defender’s weakness list.',
  fighting: 'Ghost is not on the weakness list. Ghost is immune to Fighting moves, so Fighting cannot beat a Ghost switch.',
  poison: 'Steel is immune to Poison moves, so a Poison attack is not the way through a Steel Pokémon.',
  ground: 'Flying is immune to Ground attacks. That immunity is separate from the types that hit a Ground defender super effectively.',
  flying: 'Ground moves do not beat Flying. A pure Flying defender is immune to Ground.',
  psychic: 'Dark is immune to Psychic moves, so a Psychic attack cannot beat a pure Dark switch.',
  bug: 'Seven types resist Bug attacks, so Bug often needs a second move when it is the one attacking.',
  rock: 'Rock still hits Fire, Ice, Flying, and Bug for 2× even though a Rock defender has a long weakness list.',
  ghost: 'Dark resists Ghost attacks while hitting Ghost for 2×, so it is the one-way answer. Normal and Fighting deal 0×.',
  dragon: 'Fairy is immune to Dragon moves and also hits Dragon super effectively.',
  dark: 'Psychic moves do not beat Dark. A pure Dark defender is immune to Psychic.',
  steel: 'Fairy does not beat Steel. Steel resists Fairy moves.',
  fairy: 'Dragon moves do not beat Fairy. Fairy is immune to Dragon.',
};

function isTypeId(value: string): value is TypeId {
  return TYPE_ORDER.includes(value as TypeId);
}

function comboKey(types: TypeId[]): string {
  return [...types]
    .sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b))
    .join('-');
}

function addSpecies(bucket: Map<string, SpeciesRef>, name: string) {
  const trimmed = name.trim();
  const key = trimmed.toLowerCase();
  if (!key) return;
  const href = pokemonHrefByName.get(key);
  const existing = bucket.get(key);
  if (!existing) {
    bucket.set(key, { name: trimmed, href });
    return;
  }
  if (!existing.href && href) existing.href = href;
}

function typingRowsFor(typeId: TypeId): TypingRow[] {
  const groups = new Map<string, { types: TypeId[]; species: Map<string, SpeciesRef> }>();

  const ensure = (types: TypeId[]) => {
    if (!types.includes(typeId) || types.length === 0 || types.length > 2) return null;
    const key = comboKey(types);
    const existing = groups.get(key);
    if (existing) return existing;
    const created = {
      types: key.split('-') as TypeId[],
      species: new Map<string, SpeciesRef>(),
    };
    groups.set(key, created);
    return created;
  };

  for (const entry of pokemon) {
    if (!entry.types.every(isTypeId)) continue;
    const group = ensure(entry.types as TypeId[]);
    if (group) addSpecies(group.species, entry.name);
  }

  for (const [slug, names] of Object.entries(speciesBySlug)) {
    const parts = slug.split('-');
    if (parts.length !== 2 || !parts.every(isTypeId)) continue;
    const group = ensure(parts as TypeId[]);
    if (!group) continue;
    for (const name of names) addSpecies(group.species, name);
  }

  for (const combination of popularCombinations) {
    if (!isTypeId(combination.type1) || !isTypeId(combination.type2)) continue;
    const group = ensure([combination.type1, combination.type2]);
    if (!group) continue;
    for (const name of combination.examples) addSpecies(group.species, name);
  }

  return [...groups.entries()].map(([key, group]) => {
    const [first, second] = group.types;
    const weaknesses = calculateDualTypeWeaknesses(first, second);
    const species = [...group.species.values()].sort((a, b) => a.name.localeCompare(b.name));
    return {
      key,
      types: group.types,
      label: group.types.map(displayType).join('/'),
      species,
      quadWeak: weaknesses.quadrupleWeak,
      doubleWeak: weaknesses.doubleWeak,
      indexable: group.types.length === 2 && isIndexableDualType(key),
    };
  }).filter(row => row.species.length > 0).sort((a, b) => {
    if (b.quadWeak.length !== a.quadWeak.length) return b.quadWeak.length - a.quadWeak.length;
    if (b.species.length !== a.species.length) return b.species.length - a.species.length;
    return a.label.localeCompare(b.label);
  });
}

function countersFor(typeId: TypeId, weakTo: TypeId[]): CounterRow[] {
  const perWeakness = weakTo.length >= 4 ? 2 : weakTo.length === 3 ? 3 : 4;
  const picked: CounterRow[] = [];
  const used = new Set<string>();

  for (const weakness of weakTo) {
    const candidates = pokemon.flatMap(entry => {
      if (!entry.types.every(isTypeId)) return [];
      const moves = entry.recommendedMoves.flatMap(name => {
        const moveType = MOVE_TYPES[name];
        return moveType === weakness ? [{ name, type: moveType }] : [];
      });
      const stab = entry.types.includes(weakness);
      if (moves.length === 0 && !stab) return [];
      const attack = entry.baseStats.attack;
      const special = entry.baseStats.spAtk;
      return [{
        id: entry.id,
        name: entry.name,
        href: `/pokemon/${entry.id}`,
        types: entry.types as TypeId[],
        moves,
        stabTypes: stab ? [weakness] : [],
        stat: Math.max(attack, special),
        statLabel: attack >= special ? 'Attack' as const : 'Special Attack' as const,
      }];
    }).sort((a, b) => b.moves.length - a.moves.length || b.stat - a.stat || a.name.localeCompare(b.name));

    let taken = 0;
    for (const candidate of candidates) {
      if (used.has(candidate.id)) continue;
      used.add(candidate.id);
      picked.push(candidate);
      taken += 1;
      if (taken >= perWeakness) break;
    }
  }

  return picked;
}

function exceptionsFor(typeId: TypeId, weakTo: TypeId[], typings: TypingRow[]): ExceptionRow[] {
  return TYPE_ORDER.filter(partner => partner !== typeId).flatMap(partner => {
    const changes = weakTo.flatMap(attack => {
      const total = calculateMultiplier(attack, [typeId, partner]);
      if (total === 2) return [];
      return [{
        attack,
        total,
        partnerFactor: calculateMultiplier(attack, [partner]),
      }];
    });
    if (changes.length === 0) return [];
    const slug = canonicalDualTypeSlug(comboKey([typeId, partner])) ?? comboKey([typeId, partner]);
    const examples = typings.find(row => row.key === slug)?.species.slice(0, 3) ?? [];
    return [{
      partner,
      slug,
      indexable: isIndexableDualType(slug),
      changes,
      examples,
    }];
  });
}

export function getSingleTypeGuide(typeId: TypeId): SingleTypeGuideModel {
  const typeName = displayType(typeId);
  const defensive = defenseChart[typeId];
  const offensive = offenseChart[typeId];
  const typings = typingRowsFor(typeId);
  const exceptions = exceptionsFor(typeId, defensive.weakTo, typings);

  const shortAnswer = typeId === 'ghost'
    ? GHOST_PURE_WEAKNESS_SENTENCE
    : `${typeName}-type Pokémon are weak to ${formatTypeList(defensive.weakTo)} moves, each dealing 2× damage against a pure ${typeName} defender.`;

  return {
    typeId,
    typeName,
    shortAnswer,
    weakTo: defensive.weakTo,
    resistsTo: defensive.resistsTo,
    immuneTo: defensive.immuneTo,
    superEffective: offensive.superEffective,
    notVeryEffective: offensive.notVeryEffective,
    noEffect: offensive.noEffect,
    counters: countersFor(typeId, defensive.weakTo),
    typings,
    exceptions,
    unchangedPartnerCount: 17 - exceptions.length,
  };
}

export function buildTypeFaqs(model: SingleTypeGuideModel): TypeFaq[] {
  const { typeName, typeId } = model;
  const weakList = formatTypeList(model.weakTo);
  const strongSentence = model.superEffective.length > 0
    ? `${typeName} moves are super effective (2×) against ${formatTypeList(model.superEffective)}.`
    : `${typeName} moves are not super effective against any type.`;
  const resistedSentence = model.notVeryEffective.length > 0
    ? ` They are resisted by ${formatTypeList(model.notVeryEffective)}.`
    : '';
  const immuneOffenseSentence = model.noEffect.length > 0
    ? ` They do not affect ${formatTypeList(model.noEffect)}.`
    : '';
  const resistSentence = model.resistsTo.length > 0
    ? ` A pure ${typeName} defender resists ${formatTypeList(model.resistsTo)}.`
    : ` A pure ${typeName} defender has no resistances.`;
  const immuneSentence = model.immuneTo.length > 0
    ? ` It is immune to ${formatTypeList(model.immuneTo)}.`
    : ' It has no type immunity.';

  const quadRows = model.typings.filter(row => row.quadWeak.length > 0);
  const quadExamples = quadRows.slice(0, 4).map(row => {
    const who = row.species[0]?.name ?? row.label;
    return `${who} (${row.label}) takes 4× from ${formatTypeList(row.quadWeak)}`;
  });
  const quadAnswer = quadExamples.length > 0
    ? `Pure ${typeName} never takes 4× damage, because a single type tops out at 2×. In this dataset, ${quadExamples.join('; ')}. The species table lists every 4× case we track.`
    : `No ${typeName} dual typing in this dataset takes 4× damage. A 4× weakness needs both defending types to be weak to the same attack, and pure ${typeName} stays at 2×.`;

  const removed = model.exceptions.flatMap(row =>
    row.changes.filter(change => change.total === 0 || change.total === 1).map(change => ({ row, change })),
  );
  const stacked = model.exceptions.flatMap(row =>
    row.changes.filter(change => change.total === 4).map(change => ({ row, change })),
  );
  const sample = removed.find(item => item.change.total === 0) ?? removed[0];
  let cancelAnswer: string;
  if (sample) {
    const { row, change } = sample;
    cancelAnswer = `Yes. ${typeName}/${displayType(row.partner)} takes ${formatChartMultiplier(change.total)} from ${displayType(change.attack)} because 2× × ${formatChartMultiplier(change.partnerFactor)} = ${formatChartMultiplier(change.total)}. The dual-type table lists every partner that changes a pure weakness.`;
  } else if (stacked[0]) {
    const { row, change } = stacked[0];
    cancelAnswer = `No partner reduces a pure ${typeName} weakness to 1× or 0×. Some partners stack it to 4×, including ${displayType(change.attack)} against ${typeName}/${displayType(row.partner)}.`;
  } else {
    cancelAnswer = `No. Across the other 17 types, every pure ${typeName} weakness stays 2×.`;
  }

  return [
    {
      question: `What is ${typeName} weak to?`,
      answer: `A pure ${typeName} Pokémon is weak to ${weakList} moves and takes 2× damage from each.${resistSentence}${immuneSentence} A second type can cancel, stack, or leave those results alone. The species table lists the actual weaknesses for every ${typeName} Pokémon in this dataset.`,
    },
    {
      question: `What is ${typeName} strong against?`,
      answer: `${strongSentence}${immuneOffenseSentence}${resistedSentence} Those are attacking matchups. They are not the same list as the types that hit ${typeName} super effectively.`,
    },
    {
      question: `What beats ${typeName}-type Pokémon?`,
      answer: `${weakList} moves beat a pure ${typeName} defender at 2×. ${BEATS_NOTE[typeId]} The counter table names Pokémon in this dataset that carry one of those move types or typings.`,
    },
    {
      question: `Which ${typeName} Pokémon have a 4× weakness?`,
      answer: quadAnswer,
    },
    {
      question: `Can a second type remove a ${typeName} weakness?`,
      answer: cancelAnswer,
    },
  ];
}
