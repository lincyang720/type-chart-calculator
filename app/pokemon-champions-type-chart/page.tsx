import { Metadata } from 'next';
import Link from 'next/link';
import TypeChart from '@/components/TypeChart';
import JsonLd, { BreadcrumbSchema } from '@/components/SEO/JsonLd';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pokemon Champions Type Chart and Battle Guide',
  description:
    'Use the Pokemon Champions type chart for all 18 types. Check weaknesses, resistances, immunities, dual-type matchups, and team coverage.',
  keywords: [
    'pokemon champions type chart',
    'pokemon champions weakness chart',
    'pokemon champions type calculator',
    'pokemon champions battle guide',
  ],
  alternates: {
    canonical: '/pokemon-champions-type-chart',
  },
  openGraph: {
    title: 'Pokemon Champions Type Chart and Battle Guide',
    description: 'Check all 18 type matchups and prepare a balanced team for Pokemon Champions battles.',
    url: `${SITE_URL}/pokemon-champions-type-chart`,
    type: 'article',
  },
};

const faqItems = [
  {
    question: 'How do I read the Pokemon Champions type chart?',
    answer: 'Choose the attacking move type across the top and the defending Pokemon type down the side. A 2x result is super effective, 0.5x is resisted, and 0x means the defender is immune.',
  },
  {
    question: 'How do dual types work in Pokemon Champions?',
    answer: 'The standard baseline is to multiply the matchup against both defending types. Two weaknesses produce 4x damage, while a weakness and resistance cancel to normal 1x damage.',
  },
  {
    question: 'Do abilities affect the type chart?',
    answer: 'Yes. Abilities can add immunities or modify damage, so the standard type chart should be combined with the Pokemon and ability information shown in the game.',
  },
  {
    question: 'Can I analyze a complete Pokemon Champions team?',
    answer: 'Yes. TypeMatchup includes a six-slot team calculator that counts shared weaknesses, resistances, immunities, and defensive coverage gaps.',
  },
];

export default function PokemonChampionsTypeChartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Pokemon Champions Type Chart', url: `${SITE_URL}/pokemon-champions-type-chart` },
      ]} />

      <article className="max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="text-sm font-semibold text-red-700 mb-3">Trending guide | Updated July 22, 2026</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Pokemon Champions Type Chart</h1>
          <p className="text-lg text-gray-700 max-w-4xl">
            Use this complete 18-type chart as the baseline for Pokemon Champions battles. Check which attacks are super
            effective, resisted, neutral, or blocked by an immunity, then open the interactive calculators for dual-type
            opponents and complete team coverage.
          </p>
        </header>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h2 className="text-xl font-bold mb-2">Pokemon Champions Is Available Now</h2>
          <p className="text-gray-700 mb-3">
            The official Pokemon Champions site describes the game as a battle-focused title built around familiar
            mechanics including Pokemon types, abilities, and moves. It supports cross-platform battles on Nintendo
            Switch, Nintendo Switch 2, and mobile devices, with eligible partners transferable through Pokemon HOME.
          </p>
          <a
            href="https://champions.pokemon.com/en-us/"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold hover:underline"
          >
            Read the official Pokemon Champions information →
          </a>
        </section>

        <section className="mb-12" aria-labelledby="champions-chart-heading">
          <h2 id="champions-chart-heading" className="text-2xl sm:text-3xl font-bold mb-3">
            Complete Pokemon Champions Type Effectiveness Chart
          </h2>
          <p className="text-gray-700 mb-6">
            Columns show the attacking move type and rows show the defending type. On smaller screens, scroll sideways to
            view all 18 attacking types. The chart represents the standard type relationship before abilities and other
            battle-specific effects are applied.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 shadow-sm">
            <TypeChart />
          </div>
        </section>

        <section className="prose max-w-none text-gray-700 mb-10">
          <h2>How Damage Multipliers Work</h2>
          <p>
            A super-effective attack deals 2x type-based damage against a single defending type. A resisted attack deals
            0.5x, an immunity reduces the type multiplier to zero, and a neutral matchup remains at 1x. These values
            describe type effectiveness rather than a complete damage calculation. Move power, offensive and defensive
            stats, Same-Type Attack Bonus, abilities, items, and other battle mechanics still influence the final damage.
          </p>
          <p>
            Dual-type defenders combine both results. If both types are weak to the same attack, the multiplier becomes
            4x. If both resist it, the result becomes 0.25x. A 2x weakness and 0.5x resistance cancel to neutral 1x damage.
            Any type immunity reduces the standard type result to zero unless a separate game effect changes that
            interaction.
          </p>

          <h2>Building a Pokemon Champions Team by Type</h2>
          <p>
            Start by checking whether several team members share the same weakness. A repeated weakness becomes especially
            risky when no teammate resists or is immune to that attacking type. A balanced roster does not need to resist
            everything, but it should have enough safe switches and offensive pressure to avoid losing momentum whenever
            a common threat enters battle.
          </p>
          <p>
            Next, inspect offensive coverage. STAB moves are important, but coverage moves can prevent an opponent from
            walling the entire team. Type coverage should be considered alongside speed control, recovery, priority,
            status, abilities, and the legal rules for the battle mode you are playing. Use the chart for the matchup
            foundation, then confirm the exact Pokemon information inside Champions.
          </p>

          <h2>Abilities and Mega Evolution Matchups</h2>
          <p>
            Champions strategy cannot be reduced to the type chart alone. An ability may remove a weakness, add an
            immunity, or reduce specific damage. Mega Evolution can also change a Pokemon&apos;s stats, ability, or typing,
            depending on the Pokemon. Recheck the defending form after a transformation instead of relying only on its
            original type combination.
          </p>
          <p>
            TypeMatchup&apos;s <Link href="/pokemon/type-chart-with-abilities">ability-adjusted type tool</Link> covers common
            immunity and damage-modifying abilities. For any single or dual type, the{' '}
            <Link href="/">interactive matchup calculator</Link> shows every 4x weakness, resistance, and immunity without
            scanning the complete matrix.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-12">
          <Link href="/pokemon/team-calculator" className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-blue-400">
            <h2 className="text-xl font-bold mb-2">Team Calculator</h2>
            <p className="text-gray-700 mb-3">Analyze shared weaknesses and defensive gaps across six team slots.</p>
            <span className="text-blue-700 font-semibold">Check your team →</span>
          </Link>
          <Link href="/pokemon/best-type-combinations" className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-blue-400">
            <h2 className="text-xl font-bold mb-2">Best Type Combinations</h2>
            <p className="text-gray-700 mb-3">Compare useful dual typings for offense, defense, and immunities.</p>
            <span className="text-blue-700 font-semibold">Compare combinations →</span>
          </Link>
          <Link href="/pokemon/type-chart-with-abilities" className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-blue-400">
            <h2 className="text-xl font-bold mb-2">Abilities Guide</h2>
            <p className="text-gray-700 mb-3">See how common abilities modify standard type effectiveness.</p>
            <span className="text-blue-700 font-semibold">Add an ability →</span>
          </Link>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5">Pokemon Champions Type Chart FAQ</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <details key={item.question} className="bg-white border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">{item.question}</summary>
                <p className="mt-3 text-gray-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
