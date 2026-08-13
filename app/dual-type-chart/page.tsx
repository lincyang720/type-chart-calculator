import type { Metadata } from 'next';
import DualTypeExplorer from '@/components/DualTypeExplorer';
import ToolNetwork from '@/components/ToolNetwork';
import JsonLd from '@/components/SEO/JsonLd';

const faqs = [
  ['What is a rare dual type in Pokémon?', 'Normal/Ghost and Ice/Fairy have historically appeared on relatively few evolutionary lines. Availability changes whenever new Pokémon, forms, or games are released.'],
  ['What dual types have the most weaknesses?', 'Grass/Ice has seven attacking-type weaknesses under the modern chart. Several other combinations have six. Use the “Most weaknesses” sorting option above to compare all 153 combinations.'],
  ['How does a 4× weakness work?', 'If both defending types are weak to the same attacking type, the two 2× multipliers combine: 2 × 2 = 4× type effectiveness.'],
  ['What is a strong defensive dual type?', 'Steel/Fairy has only Fire and Ground weaknesses plus two immunities. Water/Ground has one weakness, Grass, but that weakness deals 4× damage. Stats, abilities, recovery, and format still matter.'],
];

const title = 'Pokémon Dual Type Chart — All 153 Combinations';
const description = 'Interactive Pokémon dual type chart for all 153 combinations. Sort by weakness count and inspect 4× weaknesses, resistances, immunities, and example Pokémon.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/dual-type-chart' },
  openGraph: { title, description, url: 'https://www.typematchup.org/dual-type-chart', type: 'website' },
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
            name: 'Pokémon Dual Type Chart',
            url: 'https://www.typematchup.org/dual-type-chart',
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
        <h1 className="text-3xl font-bold sm:text-5xl">Pokémon Dual Type Chart</h1>
        <p className="mt-4 text-lg text-gray-700">
          Every dual-type combination&apos;s weaknesses, resistances, and immunities—sorted and explorable.
        </p>
      </header>

      <DualTypeExplorer />

      <article className="prose mx-auto mt-12 max-w-4xl">
        <h2>What Is a Dual Type in Pokémon?</h2>
        <p>
          A dual-type Pokémon uses two types for its defensive matchups. The pair can add weaknesses and resistances,
          cancel one type&apos;s weakness with the other type&apos;s resistance, or gain an immunity that overrides the second
          interaction. The chart above calculates all 153 unique pairs from the modern 18-type system and lets you compare
          them using the same rules.
        </p>

        <h2>How Dual Type Weaknesses Stack</h2>
        <p>
          Damage multipliers against the two defending types are multiplied together. Water/Ground hit by Electric takes
          2×0=0× damage because Ground&apos;s immunity overrides Water&apos;s weakness. Grass/Ice hit by Fire takes 2×2=4×
          damage because both types are weak to Fire. Two resistances combine into 0.25× damage, while a weakness and a
          resistance cancel to the usual 1× multiplier.
        </p>

        <h2>Which Dual Types Have the Most Weaknesses?</h2>
        <p>
          Grass/Ice has seven weaknesses under the modern type chart: Fire, Fighting, Poison, Flying, Bug, Rock, and Steel.
          Its Fire weakness is 4×, while the other six deal 2× type effectiveness. Rock/Ice is also fragile but has six
          weaknesses, including 4× weaknesses to Fighting and Steel. Select “Most weaknesses” above to rank every pairing
          from the number of attacking types that hit it super effectively.
        </p>

        <h2>Strong Defensive Dual Types</h2>
        <p>
          Steel/Fairy has only Fire and Ground weaknesses, two immunities, and a broad set of resistances. Water/Ground has
          just one weakness, although Grass deals 4× damage. A low weakness count does not guarantee the best Pokémon: base
          stats, recovery, abilities, movepool, and the rules of the battle format determine whether a typing can consistently
          switch into attacks.
        </p>

        <h2>Rare Dual Type Combinations</h2>
        <p>
          Some pairings have appeared on very few Pokémon or evolutionary lines. Normal/Ghost and Ice/Fairy are recognizable
          examples, but “rare” changes as new species and regional forms are released. Use the example links in the selected
          combination panel to inspect Pokémon present in this site&apos;s dataset, and treat rarity as generation-specific rather
          than a permanent competitive advantage.
        </p>

        <h2>Dual Type Chart FAQ</h2>
        {faqs.map(([question, answer]) => (
          <section key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}
      </article>

      <ToolNetwork current="/dual-type-chart" />
    </main>
  );
}
