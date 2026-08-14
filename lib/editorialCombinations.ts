// Dual-type pages in this list have a human-written strategy guide and are
// eligible for indexing. Calculator-only combinations remain accessible to
// users, but are deliberately kept out of search. Advertising is disabled sitewide
// during the content-quality review.
export const EDITORIAL_COMBINATIONS = new Set([
  'fire-flying',
  'steel-fairy',
  'water-ground',
  'ground-dragon',
  'flying-steel',
  'bug-steel',
  'poison-ghost',
  'water-psychic',
  'poison-dragon',
  'water-flying',
  'grass-poison',
  'dragon-flying',
]);

export function isEditorialCombination(slug: string): boolean {
  return EDITORIAL_COMBINATIONS.has(slug);
}
