import { Metadata } from 'next';
import TypeMatchupAssistant from '@/components/TypeMatchupAssistant';

export const metadata: Metadata = {
  title: 'Pokémon Type AI Assistant - Weakness and Matchup Answers',
  description: 'Ask a restricted Pokémon type assistant about weaknesses, resistances, immunities, and type effectiveness using the TypeMatchup data.',
  alternates: { canonical: '/assistant' },
};

export default function AssistantPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <TypeMatchupAssistant />
      <article className="prose mt-10 max-w-none text-gray-700">
        <h2>What this assistant can answer</h2>
        <p>Ask about a Pokémon, one type, or a dual-type combination. The assistant returns chart-based weaknesses, resistances, immunities, and super-effective targets.</p>
        <p>It uses the same data that powers the TypeMatchup calculator. Game-specific abilities, items, moves, formats, and Pokémon GO multipliers are outside this answer mode.</p>
      </article>
    </div>
  );
}
