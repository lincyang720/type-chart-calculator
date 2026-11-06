import type { Metadata } from 'next';
import pokemonData from '@/data/pokemon.json';
import popularCombinations from '@/data/popularCombinations.json';
import dualTypeSpecies from '@/data/dualTypeSpecies.json';

const TYPE_ORDER = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

type PokemonTypeId = (typeof TYPE_ORDER)[number];

// These URLs stay indexable even if a later roster edit misses their species.
// The species check already covers them; this set is a guard for the pages
// AdSense review should keep.
const PRIORITY_INDEXABLE_SLUGS = [
  'steel-fairy',
  'water-ground',
  'ground-dragon',
  'fire-flying',
  'flying-steel',
  'bug-steel',
  'fighting-steel',
  'electric-flying',
  'water-flying',
  'dragon-flying',
  'psychic-fairy',
  'grass-flying',
] as const;

const speciesBySlug = dualTypeSpecies as Record<string, string[]>;

function isTypeId(value: string): value is PokemonTypeId {
  return (TYPE_ORDER as readonly string[]).includes(value);
}

/** ALL_TYPES order, matching generateStaticParams for /types/[type]. */
export function canonicalDualTypeSlug(slug: string): string | null {
  const parts = slug.split('-');
  if (parts.length !== 2) return null;
  const [first, second] = parts;
  if (!isTypeId(first) || !isTypeId(second) || first === second) return null;
  const firstIndex = TYPE_ORDER.indexOf(first);
  const secondIndex = TYPE_ORDER.indexOf(second);
  return firstIndex < secondIndex ? `${first}-${second}` : `${second}-${first}`;
}

function addSpecies(counts: Map<string, number>, rawSlug: string, names: readonly string[]) {
  const slug = canonicalDualTypeSlug(rawSlug);
  if (!slug) return;
  const realNames = names.map(name => name.trim()).filter(name => name.length > 0);
  if (realNames.length === 0) return;
  counts.set(slug, (counts.get(slug) ?? 0) + realNames.length);
}

function buildSpeciesCounts(): Map<string, number> {
  const counts = new Map<string, number>();

  for (const [slug, names] of Object.entries(speciesBySlug)) {
    if (!Array.isArray(names)) continue;
    addSpecies(counts, slug, names);
  }

  for (const pokemon of pokemonData.pokemon) {
    if (pokemon.types.length !== 2) continue;
    addSpecies(counts, `${pokemon.types[0]}-${pokemon.types[1]}`, [pokemon.name]);
  }

  for (const combination of popularCombinations.combinations) {
    addSpecies(counts, `${combination.type1}-${combination.type2}`, combination.examples);
  }

  return counts;
}

const SPECIES_COUNTS = buildSpeciesCounts();

const PRIORITY_PAIRS = new Set(
  PRIORITY_INDEXABLE_SLUGS
    .map(slug => canonicalDualTypeSlug(slug))
    .filter((slug): slug is string => slug !== null),
);

export function representativeSpeciesCount(slug: string): number {
  const canonical = canonicalDualTypeSlug(slug);
  if (!canonical) return 0;
  return SPECIES_COUNTS.get(canonical) ?? 0;
}

/**
 * A dual-type page is thin when every roster source lists zero Pokémon:
 * guide species in data/dualTypeSpecies.json, data/pokemon.json, and
 * data/popularCombinations.json. Either type order is the same pairing.
 */
export function isThinTheoreticalCombination(slug: string): boolean {
  const canonical = canonicalDualTypeSlug(slug);
  if (!canonical) return false;
  if (PRIORITY_PAIRS.has(canonical)) return false;
  return representativeSpeciesCount(slug) === 0;
}

export function isIndexableDualType(slug: string): boolean {
  return canonicalDualTypeSlug(slug) !== null && !isThinTheoreticalCombination(slug);
}

export function listThinTheoreticalCombinations(slugs: Iterable<string>): string[] {
  return [...slugs].filter(slug => isThinTheoreticalCombination(slug)).sort((a, b) => a.localeCompare(b));
}

export function dualTypeRobots(slug: string): Metadata['robots'] {
  const index = isIndexableDualType(slug);
  return {
    index,
    follow: true,
    googleBot: index
      ? {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      : {
          index: false,
          follow: true,
        },
  };
}
