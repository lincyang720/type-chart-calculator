import type { Metadata } from 'next';
import Link from 'next/link';
import EffectivenessExplorer from '@/components/EffectivenessExplorer';
import ToolNetwork from '@/components/ToolNetwork';
import JsonLd from '@/components/SEO/JsonLd';

const faqs = [
  ['How does Pokémon type effectiveness work?', 'Each attacking type has a 2×, 1×, 0.5×, or 0× relationship with each defending type. For a dual-type defender, multiply both relationships together.'],
  ['Which Pokémon have famous 4× weaknesses?', 'Examples include Rhyperior against Water and Grass, Gyarados against Electric, Charizard against Rock, Scizor against Fire, and Garchomp against Ice.'],
  ['What is the difference between 0.25× and 0.5× damage?', 'A 0.5× result means one defending type resists the attack. A 0.25× result means both defending types resist it, so 0.5 × 0.5 = 0.25×.'],
  ['What types are immune to what?', 'Key immunities include Normal to Ghost, Ghost to Normal and Fighting, Ground to Electric, Flying to Ground, Dark to Psychic, Fairy to Dragon, and Steel to Poison.'],
];

const title = 'Pokemon Type Effectiveness Calculator — Exact Multipliers';
const description = 'Pokemon type effectiveness calculator showing exact 4×, 2×, 1×, 0.5×, 0.25×, and 0× multipliers plus the complete calculation and 18×18 matrix.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/type-effectiveness-calculator' },
  openGraph: { siteName: 'TypeMatchup', title, description, url: 'https://www.typematchup.org/type-effectiveness-calculator', type: 'website' },
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
            name: 'Pokemon Type Effectiveness Calculator',
            url: 'https://www.typematchup.org/type-effectiveness-calculator',
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
        <h1 className="text-3xl font-bold sm:text-5xl">Pokemon Type Effectiveness Calculator</h1>
        <p className="mt-4 text-lg text-gray-700">
          See exactly how damage multipliers combine—4×, 2×, 1×, 0.5×, 0.25×, or immune.
        </p>
      </header>

      <EffectivenessExplorer />
      <div className="mx-auto mt-6 max-w-4xl text-center">
        <Link href="/#calculator" className="font-semibold text-blue-700 hover:underline">
          Use the Type Calculator to see every matchup category →
        </Link>
      </div>

      <article className="prose mx-auto mt-12 max-w-4xl">
        <h2>How Pokemon Type Effectiveness Works</h2>
        <p>
          Each attacking type has a multiplier against each defending type: 2× for super effective, 1× for normal damage,
          0.5× for not very effective, or 0× when the defender is immune. For a dual-type defender, multiply the two values.
          An Ice attack against Grass/Flying is 2×2=4×, while an Electric attack against Water/Ground is 2×0=0×. The
          calculator shows both parts of the equation so you can see exactly why the final result occurs.
        </p>

        <h2>How to Use the 18×18 Type Effectiveness Matrix</h2>
        <p>
          Matrix rows are attacking move types and columns are single defending types. Choose any cell to load that matchup
          into the calculator, then add an optional second defending type to test a dual-type target. The matrix covers the
          base type chart; STAB, abilities, weather, items, critical hits, and other battle modifiers apply after the displayed
          type multiplier.
        </p>

        <h2>The 4× Weakness Explained</h2>
        <p>
          A 4× weakness happens when both of a Pokémon&apos;s types are weak to the same attacking type. Familiar examples include
          Rhyperior against Water or Grass, Gyarados against Electric, Charizard against Rock, Scizor against Fire, and
          Garchomp against Ice. These matchups can decide a turn immediately, but abilities, items, Terastallization, and a
          game&apos;s damage rules may still alter the practical outcome.
        </p>

        <h2>Types That Are Immune to What?</h2>
        <p>
          Seven defending-type immunities are especially useful to memorize: Normal is immune to Ghost; Ghost is immune to
          Normal and Fighting; Ground is immune to Electric; Flying is immune to Ground; Dark is immune to Psychic; Fairy is
          immune to Dragon; and Steel is immune to Poison. Because any 0× factor makes a dual-type calculation equal zero, an
          immunity can completely override the second type&apos;s weakness.
        </p>

        <h2>How to Memorize Type Effectiveness</h2>
        <p>
          Learn the immunities first, then group intuitive relationships such as Water beating Fire, Ground, and Rock or Fire
          beating Grass, Ice, Bug, and Steel. Use the matrix for exceptions and reinforce them with the site&apos;s type quiz instead
          of trying to memorize all 324 single-type cells at once.
        </p>

        <h2>Type Effectiveness FAQ</h2>
        {faqs.map(([question, answer]) => (
          <section key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}
      </article>

      <ToolNetwork current="/type-effectiveness-calculator" />
    </main>
  );
}
