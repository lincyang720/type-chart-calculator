// Pokémon pages remain available as calculators/reference pages, but only
// substantial, manually reviewed guides are submitted for indexing.
export const EDITORIAL_POKEMON = new Set([
  'ferrothorn',
  'charizard',
  'garchomp',
  'dragonite',
  'corviknight',
  'heatran',
]);

export function isEditorialPokemon(slug: string): boolean {
  return EDITORIAL_POKEMON.has(slug);
}
