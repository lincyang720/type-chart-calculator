import type { Metadata } from 'next';
import Link from 'next/link';
import pokemonData from '@/data/pokemon.json';
import PokemonTeamBuilder, { type TeamBuilderPokemon } from '@/components/PokemonTeamBuilder';
import type { TypeId } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Pokemon Team Builder',
  description: 'Build a six-Pokémon team with a searchable roster and instantly check the 18-type weakness matrix, resistances, immunities, and missing defensive coverage.',
  alternates: { canonical: '/team-builder' },
  openGraph: {
    title: 'Pokemon Team Builder',
    description: 'Choose six Pokémon and see your team’s weaknesses, resistances, and coverage gaps in a live 18-type matrix.',
    url: 'https://www.typematchup.org/team-builder',
    type: 'website',
  },
};

const TYPE_IDS = new Set<string>([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]);

// Whitelist data from the existing repo; exclude unrecognized/incomplete types rather than inventing them.
const pokemon: TeamBuilderPokemon[] = pokemonData.pokemon
  .filter(entry => entry.id && entry.name && entry.types.length >= 1 && entry.types.length <= 2 && entry.types.every(type => TYPE_IDS.has(type)))
  .map(entry => ({ id: entry.id, name: entry.name, types: entry.types as TypeId[] }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function TeamBuilderPage() {
  return (
    <main className="container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Pokemon Team Builder</h1>
      <PokemonTeamBuilder pokemon={pokemon} />
      <section className="mt-10 max-w-4xl space-y-3 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">How the team matrix works</h2>
        <p>Pick up to six Pokémon. For each incoming attack type, the tool multiplies the selected Pokémon’s defensive types using the site’s existing type chart. The matrix shows each member’s damage multiplier and totals how many members take 2× or 4× damage, resist, or are immune.</p>
        <p>Coverage gaps highlight attack types where at least one Pokémon is weak and no teammate has a resistance or immunity. This is a typing overview, not a full battle prediction. Abilities, held items, moves and competitive legality are not assessed.</p>
        <p>Need manual type combinations? Visit the <Link href="/pokemon/team-calculator" className="font-semibold text-blue-700 underline">Pokemon Team Calculator</Link>, or use the <Link href="/pokemon/type-chart" className="font-semibold text-blue-700 underline">Pokemon Type Chart</Link> for every type matchup.</p>
      </section>
    </main>
  );
}
