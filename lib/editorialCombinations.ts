// Dual-type pages in this list have a human-written strategy guide and are
// eligible for indexing and advertising. Calculator-only combinations remain
// accessible to users, but are deliberately kept out of search and ad inventory.
export const EDITORIAL_COMBINATIONS = new Set([
  'steel-fairy',
  'water-ground',
  'ground-dragon',
  'flying-steel',
  'bug-steel',
  'poison-ghost',
  'water-psychic',
  'poison-dragon',
]);

export function isEditorialCombination(slug: string): boolean {
  return EDITORIAL_COMBINATIONS.has(slug);
}
