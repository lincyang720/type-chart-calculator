import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { BreadcrumbSchema } from '@/components/SEO/JsonLd';
import naturesData from '@/data/natures.json';
import { SITE_URL } from '@/lib/seo';

const TITLE = 'Pokemon Nature Chart: All 25 Natures and Stat Effects';
const DESCRIPTION = 'Use this Pokemon nature chart to compare all 25 natures and the stats each one raises or lowers. See five neutral natures and four common attacker picks.';
const H1 = 'Use This Pokemon Nature Chart to Choose the Right Stat Boost';
const PAGE_URL = `${SITE_URL}/pokemon/nature-chart`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/pokemon/nature-chart' },
  openGraph: {
    siteName: 'TypeMatchup',
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const faqItems = [
  {
    question: 'Can you change a Pokemon’s nature?',
    answer: 'You can change the stat effects with a Mint in modern games. The Nature shown on the Pokemon’s summary does not change, but its raised and lowered stats follow the Mint you used.',
  },
  {
    question: 'Which Pokemon nature is the best?',
    answer: 'There is no single best nature. The right choice boosts the stat a Pokemon uses most while lowering a stat its moveset or role can afford to ignore.',
  },
  {
    question: 'Does nature affect whether a Pokemon is shiny?',
    answer: 'No. Nature does not change shiny odds, and a shiny Pokemon receives the same nature effects as any other Pokemon.',
  },
  {
    question: 'Do Pokemon natures affect HP?',
    answer: 'No. Natures can modify Attack, Defense, Special Attack, Special Defense, or Speed, but they never raise or lower HP.',
  },
  {
    question: 'Do neutral natures change any stats?',
    answer: 'No. Hardy, Docile, Serious, Bashful, and Quirky apply a 1.0 multiplier to every stat, so their final numbers are unchanged by nature.',
  },
  {
    question: 'Can a Pokemon pass its nature through breeding?',
    answer: 'In modern main-series games, a parent holding an Everstone can pass its Nature to an Egg. Mint effects change stat growth only and are not inherited as a new Nature.',
  },
];

export default function PokemonNatureChartPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Pokemon', url: `${SITE_URL}/pokemon` },
        { name: 'Pokemon Nature Chart', url: PAGE_URL },
      ]} />

      <article className="max-w-5xl mx-auto text-gray-700">
        <header className="mb-10">
          <Link href="/pokemon" className="text-blue-700 font-medium hover:underline">
            Pokemon guides
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {H1}
          </h1>
          <p className="mt-5 text-lg leading-8">
            A nature fine-tunes a Pokemon for a particular job. The chart below shows every standard nature, the stat it
            raises, the stat it lowers, and the kind of battle role that usually benefits from that trade. Nature does
            not change typing, moves, Ability, IVs, or EVs; it changes the final value of selected non-HP stats.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Quick answer: what a Pokemon nature changes</h2>
          <p className="leading-7">
            A stat-changing nature raises one non-HP stat by 10% and lowers another non-HP stat by 10%. The other stats
            use a neutral 1.0 multiplier. That makes nature a focused adjustment rather than a new base-stat spread. A
            Jolly Pokemon, for example, receives a 1.1 Speed multiplier and a 0.9 Special Attack multiplier, while its
            Attack, Defense, and Special Defense stay at 1.0. The five neutral natures apply 1.0 everywhere.
          </p>
          <p className="leading-7 mt-4">
            Nature works independently from type effectiveness. Use the <Link className="text-blue-700 underline" href="/pokemon/type-chart">Pokemon type chart</Link> when
            deciding which move hits a defender, then use this page when deciding how that Pokemon should distribute its
            offensive, defensive, or Speed potential.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete Pokemon nature chart</h2>
          <p className="leading-7 mb-5">
            Read the plus and minus columns together. Every non-neutral row has exactly one boosted stat and one reduced
            stat. “Best for” describes a common use, not a rule: a moveset, format, Speed benchmark, or Trick Room plan can
            justify a different choice. Special Attack and Special Defense are abbreviated as Sp. Atk and Sp. Def.
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm" role="region" aria-label="All 25 Pokemon natures and their stat effects" tabIndex={0}>
            <table className="min-w-full text-left bg-white">
              <thead className="bg-blue-50 text-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3">Nature</th>
                  <th scope="col" className="px-4 py-3">+10% Stat</th>
                  <th scope="col" className="px-4 py-3">−10% Stat</th>
                  <th scope="col" className="px-4 py-3">Best for</th>
                </tr>
              </thead>
              <tbody>
                {naturesData.map(nature => (
                  <tr key={nature.name} className="border-t border-gray-200 align-top">
                    <th scope="row" className="px-4 py-3 font-semibold text-gray-900">{nature.name}</th>
                    <td className="px-4 py-3 text-green-700 font-medium">{nature.increase ?? 'None'}</td>
                    <td className="px-4 py-3 text-red-700 font-medium">{nature.decrease ?? 'None'}</td>
                    <td className="px-4 py-3">{nature.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-7 mt-5">
            The table describes stat growth only. A nature never adds a resistance or weakness, so check unusual defensive
            combinations with the <Link className="text-blue-700 underline" href="/dual-type-chart">dual-type chart</Link> instead of treating a defensive nature as type protection.
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The five neutral natures have no stat effect</h2>
          <p className="leading-7">
            Hardy, Docile, Serious, Bashful, and Quirky have no effect on final stats. Internally, each corresponds to the
            same stat being marked as both raised and lowered, so the effects cancel and every multiplier remains 1.0.
            These natures are usable during a story playthrough, but a competitive build normally gains more from a nature
            that supports its intended role. A neutral nature does not provide hidden balance, extra HP, or broader move
            coverage. It simply leaves the calculated stats unchanged.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Best natures for physical and special attackers</h2>
          <p className="leading-7">
            Physical attackers usually compare Adamant with Jolly. Adamant raises Attack and lowers Special Attack, making
            it the direct damage choice for a Pokemon that uses only physical moves. Kingambit is a practical Adamant
            example because stronger physical attacks matter more than unused Special Attack. Jolly raises Speed and lowers
            Special Attack. Meowscarada commonly values Jolly when moving before another fast threat is more important than
            the extra damage Adamant would provide.
          </p>
          <p className="leading-7 mt-4">
            Special attackers make the parallel choice between Modest and Timid. Modest raises Special Attack and lowers
            Attack, so Gholdengo can use it when its team already supplies enough Speed control. Timid raises Speed and
            lowers Attack, helping Flutter Mane reach more targets before they move. Neither pair has a universal winner.
            Compare the Speed tier, expected damage rolls, item, ability, and support available to the set.
          </p>
          <p className="leading-7 mt-4">
            Defensive Pokemon use the same principle. Bold or Impish improves Defense, while Calm or Careful improves
            Special Defense. Choose the version that lowers an offensive stat the moveset does not use. After selecting a
            nature, check the full six-member result with the <Link className="text-blue-700 underline" href="/pokemon/team-calculator">Pokemon team calculator</Link>; a faster attacker still needs teammates that can switch into the attacks it cannot take.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How to calculate a final stat with nature</h2>
          <p className="leading-7">
            A useful planning form is <code className="rounded bg-gray-100 px-1 py-0.5">(base value + IV + EV/4) × level coefficient × nature multiplier</code>.
            In the main-series formula for a non-HP stat, the base value begins with twice the species base stat, EV/4 is
            rounded down, the level step is applied, and 5 is added before the nature multiplier. The exact calculation is
            <code className="ml-1 rounded bg-gray-100 px-1 py-0.5">floor((floor(((2 × Base + IV + floor(EV / 4)) × Level) / 100) + 5) × Nature)</code>.
            Use 1.1 for the raised stat, 0.9 for the lowered stat, and 1.0 for an unaffected stat. HP uses a different
            formula and never receives a nature multiplier.
          </p>
          <p className="leading-7 mt-4">
            Consider a level 50 Garchomp with base 102 Speed, a 31 Speed IV, 252 Speed EVs, and a Jolly nature. First,
            floor(252 / 4) gives 63. The pre-nature calculation is floor(((2 × 102 + 31 + 63) × 50) / 100) + 5, which is
            154. Jolly boosts Speed, so floor(154 × 1.1) produces a final Speed stat of 169. With a neutral multiplier,
            the same Garchomp would have 154 Speed. A Speed-lowering nature would use 0.9 and produce 138 after rounding.
            This is why a 10% nature can decide whether two otherwise similar Pokemon move first.
          </p>
          <p className="leading-7 mt-4">
            IVs, EVs, level, and nature answer different training questions. The <Link className="text-blue-700 underline" href="/types">Pokemon types guide</Link> explains matchup identities; the calculation here explains the numerical stat shown on the summary screen. Keep the two decisions separate when planning a build.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pokemon nature FAQ</h2>
          <div className="space-y-6">
            {faqItems.map(item => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                <p className="mt-1 leading-7">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
