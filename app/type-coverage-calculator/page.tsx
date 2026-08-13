import type { Metadata } from 'next';
import Link from 'next/link';
import TeamTypeCalculator from '@/components/TeamTypeCalculator';
import ToolNetwork from '@/components/ToolNetwork';
import JsonLd from '@/components/SEO/JsonLd';

const faqs = [
  ['What does this Pokémon type coverage calculator check?', 'It counts how many team members are weak, resistant, or immune to each attacking type and highlights weaknesses without a defensive answer.'],
  ['Can I enter six Pokémon?', 'Yes. Enter the current defensive typing for up to six team members. Use the exact regional or alternate form that will enter battle.'],
  ['Does this calculate offensive move coverage?', 'This version focuses on defensive team coverage: safe switches, shared weaknesses, resistances, and immunities. Move coverage, stats, abilities, and format legality require separate checks.'],
  ['Do abilities and Tera types change the result?', 'Yes. Enter a transformed defensive type when planning a Tera state, and review ability-specific immunities separately because this chart uses standard type relationships.'],
];

const title = 'Pokemon Type Coverage Calculator — Team Weakness Checker';
const description = 'Free Pokemon type coverage calculator for up to six team members. Find shared weaknesses, resistances, immunities, and defensive coverage gaps.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/type-coverage-calculator' },
  openGraph: { title, description, url: 'https://www.typematchup.org/type-coverage-calculator', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: 'Pokemon Type Coverage Calculator',
            url: 'https://www.typematchup.org/type-coverage-calculator',
            applicationCategory: 'GameApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          },
        ],
      }} />

      <header className="mx-auto mb-8 max-w-4xl text-center">
        <h1 className="text-3xl font-bold sm:text-5xl">Pokemon Type Coverage Calculator</h1>
        <p className="mt-4 text-lg text-gray-700">
          Build a six-member defensive type profile and find repeated weaknesses, safe switches, and uncovered threats.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        <TeamTypeCalculator />
      </div>

      <article className="prose mx-auto mt-12 max-w-4xl">
        <h2>What Is Pokemon Type Coverage?</h2>
        <p>
          Pokemon type coverage describes how well a team handles the 18 attacking types. Defensive coverage asks which
          attacks threaten several members and whether another teammate resists or ignores those attacks. Offensive
          coverage asks which opponents your moves can hit super effectively. This calculator focuses on the defensive
          side: it reveals repeated weaknesses, available resistances, immunities, and threats for which the team has no
          type-based safe switch.
        </p>

        <h2>How to Use This Type Coverage Calculator</h2>
        <ol>
          <li>Add up to six team members by selecting each member&apos;s current defensive type or dual typing.</li>
          <li>Review the table to see how many members are weak, resistant, or immune to every attacking type.</li>
          <li>Start with coverage gaps, especially attacks that threaten two or more members without a resistance or immunity.</li>
          <li>Replace a team member, change a planned Tera type, or add a partner that can switch into the biggest threat.</li>
          <li>Run the analysis again and confirm that your key weaknesses now have a realistic defensive answer.</li>
        </ol>

        <h2>Shared Weaknesses and Coverage Gaps</h2>
        <p>
          A shared weakness is not automatically fatal. The important question is whether the rest of the team can absorb
          that attack and respond. Three Pokémon weak to Ground can still be manageable when a healthy Flying type or
          Levitate user is available; the same weakness becomes dangerous when every member takes neutral or super-effective
          damage. Treat the highlighted gaps as priorities, then consider each teammate&apos;s bulk, speed, recovery, and role.
        </p>

        <h2>Offensive vs Defensive Coverage</h2>
        <p>
          Offensive coverage asks “what can I hit?” and depends on the moves your team actually carries. Defensive coverage
          asks “what hits my team?” and begins with its typing. A team can have broad attacking options and still lose to one
          repeated 4× weakness. After fixing the defensive gaps above, use the{' '}
          <Link href="/type-effectiveness-calculator">type effectiveness calculator</Link> to check important attacking
          interactions and individual multipliers.
        </p>

        <h2>Abilities, Items, and Terastallization</h2>
        <p>
          Levitate, absorption abilities, resistance berries, Air Balloon, weather, and Terastallization can change a real
          battle. The report intentionally starts with the standard type chart so every count remains transparent. Enter the
          transformed defensive type when planning a Tera state, and then apply ability-, item-, and format-specific rules to
          the result.
        </p>

        <h2>Coverage Calculator FAQ</h2>
        {faqs.map(([question, answer]) => (
          <section key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}
      </article>

      <ToolNetwork current="/type-coverage-calculator" />
    </main>
  );
}
