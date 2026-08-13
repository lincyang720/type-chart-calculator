import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About TypeMatchup',
  description: 'Learn why TypeMatchup exists, how its type calculations are produced, and how to report a data issue.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <article className="max-w-3xl mx-auto prose prose-gray">
        <h1>About TypeMatchup</h1>
        <p>
          TypeMatchup is an independent, fan-made reference site for players who want to understand Pokémon type
          effectiveness without repeatedly working through the chart by hand. Its calculators combine the two defending
          types selected by a visitor and show the resulting weaknesses, resistances, and immunities.
        </p>
        <h2>What we publish</h2>
        <p>
          The site includes interactive calculators, a complete type chart, team-planning tools, Pokémon matchup pages,
          and editorial strategy guides. A multiplier is a starting point rather than a prediction of a battle result:
          abilities, moves, stats, items, weather, format rules, and Terastallization can all change the practical answer.
          Our longer guides add that context and explain how a matchup can affect switching, coverage, and team building.
        </p>
        <h2>How calculations are checked</h2>
        <p>
          Results are generated from a structured effectiveness chart for the modern main-series games. We test combined
          multipliers and review reports when game rules or page content change. The site is not affiliated with,
          endorsed by, or sponsored by Nintendo, Game Freak, or The Pokémon Company.
        </p>
        <h2>Corrections and contact</h2>
        <p>
          Accuracy matters. If a result looks wrong, send the page URL, attacking type, defending type or types, and any
          relevant ability or format detail through the <Link href="/contact">Contact page</Link>. You can also read how
          analytics and advertising services are handled in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <h2>Use the calculator in your own guide</h2>
        <p>
          Gaming writers, community resources, and educators can use our <Link href="/embed">free embeddable type
          calculator</Link>. The lightweight widget shows no ads and does not load TypeMatchup analytics inside the frame.
        </p>
      </article>
    </div>
  );
}
