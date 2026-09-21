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

        <h2>Dual-Type Interactions Worth Memorizing</h2>
        <p>
          Because dual-type defenders multiply, a few pairs behave in ways that surprise people. <b>Steel/Fairy</b> takes
          only ¼× from Fire, since Fire is ½× against both of its types. <b>Water/Ground</b> is 4× weak to Grass, yet it
          resists Fire, Water, and Poison and takes 0× from Electric through Ground. <b>Dark/Ghost</b> hits Psychic and
          Ghost at 2×, with only Fairy resisting the combination.
        </p>

        <h2>How the Type Chart Changed Across Generations</h2>
        <p>
          The 18-type chart is stable today, but three moments shaped it:
        </p>
        <ul>
          <li>
            <b>Generation 2</b> introduced <b>Dark</b> and <b>Steel</b>. From Generation 6 onward, Ghost and Dark moves hit
            Steel neutrally, where earlier generations had them resisted.
          </li>
          <li>
            <b>Generation 6</b> introduced <b>Fairy</b>, which is super-effective against Dragon, Dark, and Fighting while
            resisting Bug, Dark, and Fighting. This remains the last structural change to the chart.
          </li>
          <li>
            <b>Generation 1 quirks</b> were later corrected: Ghost was not effective against Psychic (now 2×), Bug was
            super-effective against Poison (now Bug resists Poison), and Ice was neutral against Fire (now ½×).
          </li>
        </ul>

        <h2>A Historical Chart, Archived From a Dead Site</h2>
        <p>
          Before Generation 4, moves were split into physical and special by the <b>type</b> of the move rather than by the
          individual move. A 2009 fan chart archived from the now-defunct site{' '}
          <a
            href="https://web.archive.org/web/2009id_/http://www.azureheights.com/compendium/typechart.htm"
            rel="nofollow"
          >
            azureheights.com
          </a>{' '}
          lists only 15 types and groups them as Special (Fire, Water, Grass, Electric, Ice, Psychic) and Physical (Normal,
          Fighting, Flying, Ground, Rock, Bug, Poison, Ghost, Dragon). That type-based split was replaced in Generation 4
          when the physical/special distinction moved to individual moves, a useful reminder that the chart itself has
          changed over time.
        </p>
        <p>
          Source: archived snapshot via the Wayback Machine, 2009-01-07. Included as historical context, not as a current
          reference.
        </p>

        <h2>Who Made This Page</h2>
        <p>
          This is a fan-made reference page, built so that one lookup does not require opening five tabs. There are no ads,
          no tracking, and no account. The effectiveness values follow the official games&apos; defined type chart, which is
          public and stable across generations, while the layout and wording here are original. If you spot a discrepancy,
          the in-game values always win.
        </p>
        <p>Not affiliated with Nintendo, Game Freak, or The Pokemon Company.</p>

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
