import { Metadata } from 'next';
import Link from 'next/link';
import TeamTypeCalculator from '@/components/TeamTypeCalculator';

export const metadata: Metadata = {
  title: 'Pokemon Team Calculator - Check Team Weaknesses',
  description:
    'Build a six-member Pokemon team and check shared type weaknesses, resistances, immunities, and defensive coverage gaps with a free team calculator.',
  keywords: [
    'pokemon team calculator',
    'pokemon team weakness calculator',
    'pokemon team type coverage',
    'pokemon team builder weakness checker',
  ],
  alternates: {
    canonical: '/pokemon/team-calculator',
  },
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Team Calculator - Check Team Weaknesses',
    description: 'Analyze shared weaknesses, resistances, immunities, and defensive gaps for a six-member Pokemon team.',
    url: 'https://www.typematchup.org/pokemon/team-calculator',
    type: 'website',
  },
};

export default function PokemonTeamCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link href="/pokemon" className="text-blue-700 font-medium hover:underline">
            ← Pokemon guides
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">Pokemon Team Calculator</h1>
          <p className="text-lg text-gray-700 max-w-4xl">
            Enter the types for up to six Pokemon to find repeated weaknesses and missing defensive answers. The report
            counts how many team members are weak, resistant, or immune to each of the 18 attack types.
          </p>
        </header>

        <TeamTypeCalculator />

        <p className="mt-6 text-center text-gray-700">
          Looking specifically for the long-form coverage workflow? Open the{' '}
          <Link href="/type-coverage-calculator" className="font-semibold text-blue-700 hover:underline">
            Pokemon Type Coverage Calculator
          </Link>.
        </p>

        <section className="prose max-w-none text-gray-700 mt-12">
          <h2>How to Check a Pokemon Team&apos;s Type Coverage</h2>
          <p>
            Add each team member&apos;s current defensive typing. Regional forms and alternate forms may have different types,
            so use the form that will actually enter battle. The calculator multiplies both defending types and then
            summarizes the result across the whole team. A Pokemon with a 2x or 4x multiplier counts as weak, while 0.5x
            and 0.25x results count as resistant.
          </p>
          <p>
            Start with the coverage gaps. If an attack type threatens several members and nobody resists or ignores it,
            the team may struggle to switch safely. Replacing one member is not always necessary: a different form,
            ability, or supporting teammate may provide the defensive answer you need.
          </p>

          <h2>Defensive Coverage Is Only One Part of Team Building</h2>
          <p>
            This team calculator evaluates incoming type matchups. It does not score offensive moves, speed control,
            hazards, recovery, status, abilities, Terastallization, or format legality. After fixing repeated defensive
            weaknesses, confirm that the team can also damage common opposing types and perform the roles required by the
            format you play.
          </p>
          <p>
            For an individual member, open the <Link href="/">type matchup calculator</Link> to inspect exact 4x and 0.25x
            interactions. You can also compare the <Link href="/pokemon/best-type-combinations">best Pokemon type
            combinations</Link> when choosing a replacement that complements the rest of the team.
          </p>
        </section>
      </div>
    </div>
  );
}
