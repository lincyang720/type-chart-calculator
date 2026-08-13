import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { WebApplicationSchema } from '@/components/SEO/JsonLd';
import DualTypeCalculator from '@/components/DualTypeCalculator';
import { Metadata } from 'next';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from '@/lib/seo';

// Static generation for better SEO and performance

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Pokemon type matchup calculator and type effectiveness tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: '/',
  },
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function Home() {
  return (
    <>
      <WebApplicationSchema />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Tool-first Hero */}
        <section className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pokemon Type Calculator for Matchups & Weaknesses
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto px-4">
            Use this interactive type matchup tool to check weaknesses, resistances, immunities, and damage multipliers for any single or dual-type Pokemon combination.
          </p>
        </section>

        {/* Interactive Calculator — primary conversion area */}
        <section id="calculator" className="mb-12 scroll-mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
            <DualTypeCalculator />
          </div>
        </section>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.25fr_1fr]" aria-labelledby="how-calculator-works">
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 id="how-calculator-works" className="text-2xl sm:text-3xl font-bold mb-4">
              How the Pokemon Type Matchup Calculator Works
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Every damaging Pokémon move has a type, and that type is compared with the defending Pokémon&apos;s type
                before damage is resolved. A super-effective interaction normally doubles type-based damage, a resistance
                halves it, and an immunity reduces it to zero. These relationships matter when choosing an attack,
                predicting a switch, preparing for a raid, or checking whether several team members share a weakness.
              </p>
              <p>
                Select the defender&apos;s primary type and add a secondary type when needed. Results update immediately and
                group all 18 attacking types by their final multiplier. For a dual-type Pokémon, both interactions are
                multiplied: two weaknesses produce 4× effectiveness, two resistances produce ¼× effectiveness, and a
                weakness plus a resistance cancel to neutral 1× damage. Related guides beneath the result add examples,
                counterplay, and team-building context.
              </p>
              <p>
                This tool uses the modern 18-type chart from current main-series games. Earlier generations can differ
                because Fairy did not exist before Generation VI and some Steel interactions changed. Abilities, items,
                Terastallization, weather, move effects, stats, and Same-Type Attack Bonus can also change the practical
                outcome. Use the Type Effectiveness Calculator when you need to test one move and optionally include STAB.
              </p>
              <p>
                <Link href="/blog/pokemon-type-chart-2026" className="font-semibold text-blue-700 hover:underline">
                  Read the complete Pokémon type chart guide →
                </Link>
              </p>
            </div>
          </article>

          <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-7" aria-labelledby="homepage-faq">
            <h2 id="homepage-faq" className="text-2xl sm:text-3xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is a dual-type Pokémon?</h3>
                <p>A dual-type Pokémon has two defensive types at once. The game multiplies both interactions, creating 4× weaknesses, ¼× resistances, or neutralized matchups.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does STAB affect type matchups?</h3>
                <p>Same-Type Attack Bonus normally adds a 1.5× modifier when a move matches one of its user&apos;s types. STAB is separate from the defender&apos;s effectiveness multiplier.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Does this calculator work for Pokémon GO?</h3>
                <p>It identifies the underlying type relationships, but Pokémon GO uses different damage multipliers and battle systems. Use our GO-specific guides for exact event and counter advice.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I use this Pokemon type calculator?</h3>
                <p>Select a primary defending type, then add a secondary type for a dual-type Pokémon. The results update immediately and group attacks into 4× and 2× weaknesses, resistances, and immunities.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What types are immune to each other?</h3>
                <p>Examples include Normal against Ghost, Ghost against Normal and Fighting, Ground against Electric, Flying against Ground, Dark against Psychic, Fairy against Dragon, and Steel against Poison.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Does Tera type change weaknesses in Scarlet and Violet?</h3>
                <p>Yes. Terastallization replaces the Pokémon&apos;s defensive typing with its Tera type. Select that Tera type alone in the calculator to check its new defensive weaknesses and resistances.</p>
              </div>
            </div>
          </section>
        </section>

        <section className="mb-12">
          <div className="rounded-xl border border-blue-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Next step</p>
                <h2 className="text-2xl sm:text-3xl font-bold">Build From This Matchup</h2>
                <p className="text-gray-700 mt-2 max-w-3xl">
                  After checking one Pokemon&apos;s weaknesses, use these related Pokemon type calculator tools to test a
                  full team, compare the complete type chart, or jump into popular Pokemon matchup pages.
                </p>
              </div>
              <Link
                href="/pokemon/team-calculator"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                Open Team Builder →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/pokemon/team-calculator" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Pokemon Team Builder</h3>
                <p className="text-sm text-gray-600 mt-2">Check shared weaknesses and defensive gaps across six Pokemon.</p>
              </Link>
              <Link href="/pokemon/type-chart" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Complete Type Chart</h3>
                <p className="text-sm text-gray-600 mt-2">Scan every type effectiveness result in one reference table.</p>
              </Link>
              <Link href="/pokemon" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Pokemon Weakness Pages</h3>
                <p className="text-sm text-gray-600 mt-2">Open matchup guides for Charizard, Pikachu, Garchomp, and more.</p>
              </Link>
              <Link href="/pokemon/type-quiz" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Type Matchup Quiz</h3>
                <p className="text-sm text-gray-600 mt-2">Practice weaknesses and resistances after using the calculator.</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12 border-y border-red-200 bg-red-50 px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Trending</p>
              <h2 className="text-xl sm:text-2xl font-bold">Mewtwo: Pokémon GO 10th Anniversary Guide</h2>
              <p className="text-gray-700 mt-1">Timed Research is live through September 6—check the official reward details and the Psychic-type matchup.</p>
            </div>
            <Link href="/blog/mewtwo-weakness-pokemon-go-10th-anniversary-2026" className="text-blue-700 font-semibold hover:underline shrink-0">
              Read the Mewtwo guide →
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-700">
            Also timely: <Link href="/blog/nickit-weakness-pokemon-go-community-day-2026" className="font-semibold text-blue-700 hover:underline">Nickit Community Day weakness guide</Link> for August 16.
          </p>
        </section>

        {/* Quick Type Reference */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Explore Type Matchups by Type</h2>
          <p className="text-gray-600 mb-6">
            Click any type to open a focused matchup guide, or use the type matchup calculator above to compare defensive matchups faster.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {ALL_TYPES.map(typeId => (
              <Link
                key={typeId}
                href={`/types/${typeId}`}
                className="block transform hover:scale-105 transition-transform"
              >
                <TypeBadge typeId={typeId} size="lg" clickable />
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Combinations Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Popular Type Matchup Examples</h2>
          <p className="text-gray-600 mb-6">
            Explore common dual-type combinations and see how the Pokemon type matchup calculator explains their strengths and counters.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/types/fire-flying" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="fire" size="sm" />
                <TypeBadge typeId="flying" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Fire/Flying</h3>
              <p className="text-sm text-gray-600">Charizard, Moltres, Talonflame</p>
            </Link>
            <Link href="/types/water-ground" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="water" size="sm" />
                <TypeBadge typeId="ground" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Water/Ground</h3>
              <p className="text-sm text-gray-600">Swampert, Gastrodon, Quagsire</p>
            </Link>
            <Link href="/types/steel-fairy" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="steel" size="sm" />
                <TypeBadge typeId="fairy" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Steel/Fairy</h3>
              <p className="text-sm text-gray-600">Magearna, Zacian, Klefki</p>
            </Link>
            <Link href="/types/dragon-flying" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="dragon" size="sm" />
                <TypeBadge typeId="flying" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Dragon/Flying</h3>
              <p className="text-sm text-gray-600">Dragonite, Salamence, Rayquaza</p>
            </Link>
            <Link href="/types/grass-poison" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="grass" size="sm" />
                <TypeBadge typeId="poison" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Grass/Poison</h3>
              <p className="text-sm text-gray-600">Venusaur, Vileplume, Roserade</p>
            </Link>
            <Link href="/types/electric-steel" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-2">
                <TypeBadge typeId="electric" size="sm" />
                <TypeBadge typeId="steel" size="sm" />
              </div>
              <h3 className="font-semibold text-gray-800">Electric/Steel</h3>
              <p className="text-sm text-gray-600">Magnezone, Togedemaru</p>
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link href="/types" className="text-blue-600 font-semibold hover:underline">
              View All 153 Combinations →
            </Link>
          </div>
        </section>

        {/* Popular Pokemon Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Pokemon Weakness Calculator Shortcuts</h2>
          <p className="text-gray-600 mb-6">
            Check detailed type matchups for your favorite Pokemon.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/pokemon/charizard" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Charizard</p>
              <p className="text-xs text-gray-600">Fire/Flying</p>
            </Link>
            <Link href="/pokemon/pikachu" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Pikachu</p>
              <p className="text-xs text-gray-600">Electric</p>
            </Link>
            <Link href="/pokemon/mewtwo" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Mewtwo</p>
              <p className="text-xs text-gray-600">Psychic</p>
            </Link>
            <Link href="/pokemon/garchomp" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Garchomp</p>
              <p className="text-xs text-gray-600">Dragon/Ground</p>
            </Link>
            <Link href="/pokemon/lucario" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Lucario</p>
              <p className="text-xs text-gray-600">Fighting/Steel</p>
            </Link>
            <Link href="/pokemon/greninja" className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-center">
              <p className="font-semibold text-gray-800">Greninja</p>
              <p className="text-xs text-gray-600">Water/Dark</p>
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link href="/pokemon" className="text-blue-600 font-semibold hover:underline">
              View All Pokemon →
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">More Type Effectiveness Tools</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Type Effectiveness Calculator</h3>
              <p className="text-gray-600 mb-4">
                Simulate type matchups in battle with STAB calculations to plan your strategy effectively.
              </p>
              <Link href="/battle-simulator" className="text-purple-600 font-semibold hover:underline">
                Calculate Type Effectiveness →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Complete Type Chart Calculator</h3>
              <p className="text-gray-600 mb-4">
                View the full 18×18 type effectiveness matrix for comprehensive reference.
              </p>
              <Link href="/pokemon/type-chart" className="text-blue-600 font-semibold hover:underline">
                View Full Chart →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold mb-3 text-green-700">Pokemon Type Quiz</h3>
              <p className="text-gray-600 mb-4">
                Practice single-type matchups or switch to Hard mode for dual-type weakness questions.
              </p>
              <Link href="/pokemon/type-quiz" className="text-green-700 font-semibold hover:underline">
                Take the Quiz →
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold">
            <Link href="/pokemon/team-calculator" className="text-blue-700 hover:underline">
              Pokemon Team Calculator →
            </Link>
            <Link href="/pokemon/type-calculator-gen-9" className="text-blue-700 hover:underline">
              Gen 9 Type Calculator →
            </Link>
            <Link href="/pokemon/type-chart-with-abilities" className="text-blue-700 hover:underline">
              Type Chart With Abilities →
            </Link>
            <Link href="/dual-type-chart" className="text-blue-700 hover:underline">
              Interactive Dual Type Chart →
            </Link>
            <Link href="/type-coverage-calculator" className="text-blue-700 hover:underline">
              Type Coverage Calculator →
            </Link>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mb-12 prose max-w-none">
          <h2 className="text-3xl font-bold mb-6">Pokemon Type Matchup Calculator Guide</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
            <p className="mb-4">
              This Pokemon type matchup calculator helps you understand how much damage moves deal based on their
              type and the defending type or type combination. Use it as a type chart calculator for competitive battles,
              raid planning, and building balanced teams.
            </p>
            <p className="mb-4">
              The Pokemon type calculator is useful when you need a quick answer, while the full type chart calculator is
              better for scanning every matchup. Together, they make type effectiveness easier to understand without
              memorizing the entire chart.
            </p>
            <h3 className="text-xl font-semibold mb-3">Type Matchup Calculator Damage Multipliers</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Super Effective (2×):</strong> The attacking type is strong against the defending type</li>
              <li><strong>Not Very Effective (0.5×):</strong> The attacking type is weak against the defending type</li>
              <li><strong>No Effect (0×):</strong> The attacking type cannot damage the defending type at all</li>
              <li><strong>Normal (1×):</strong> Standard damage with no type advantage or disadvantage</li>
            </ul>
            <h3 className="text-xl font-semibold mb-3">Type Chart Calculator for Dual-Type Interactions</h3>
            <p className="mb-4">
              When facing dual-type opponents, multipliers stack multiplicatively. This can result in:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>4× damage:</strong> Super effective against both types (2× × 2×)</li>
              <li><strong>0.25× damage:</strong> Not very effective against both types (0.5× × 0.5×)</li>
              <li><strong>Neutralized effectiveness:</strong> Super effective against one type but not very effective against the other (2× × 0.5× = 1×)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">How to Use Matchup Results in Battle</h3>
            <p className="mb-4">
              Start by selecting the defending Pokemon&apos;s type or dual-type combination. The results group every
              attacking type by its final damage multiplier, which makes the most urgent threats easy to spot. A 4×
              weakness is usually the first matchup to plan around because even a moderately strong coverage move can
              force a switch or secure a knockout. Standard 2× weaknesses still matter, but their impact also depends
              on the attacker&apos;s stats, move power, Same-Type Attack Bonus, held items, abilities, and battle format.
            </p>
            <p className="mb-4">
              Resistances and immunities are equally useful when choosing a safe switch. A 0.5× resistance cuts type
              damage in half, while a 0.25× resistance can turn an otherwise dangerous move into an opportunity to set
              up, recover, or gain momentum. An immunity prevents damage from that attack type entirely. Remember that
              this calculator evaluates type effectiveness; it does not predict a complete damage range or account for
              every move-specific rule.
            </p>

            <h3 className="text-xl font-semibold mb-3">Defensive Matchups vs. Offensive Coverage</h3>
            <p className="mb-4">
              A defensive matchup asks which move types are effective against your selected Pokemon. Offensive coverage
              asks which opposing types your moves can hit effectively. Those are related questions, but they are not
              interchangeable. For example, a Water/Ground Pokemon has only one type weakness, yet Water and Ground moves
              do not automatically cover every opponent. When building a team, check defensive weaknesses first, then
              make sure your available attacks can pressure the types that resist your primary moves.
            </p>

            <h3 className="text-xl font-semibold mb-3">Common Type Matchup Mistakes</h3>
            <p className="mb-4">
              The most common mistake is checking only one half of a dual type. Both defending types always contribute to
              the final multiplier. Another mistake is treating a type advantage as a guaranteed win: speed, stats,
              abilities, move accuracy, and field effects can still change the outcome. Finally, do not confuse a
              Pokemon&apos;s type with the type of every move it can learn. A Pokemon can carry coverage moves that threaten
              counters that appear safe on the basic type chart.
            </p>

            <h3 className="text-xl font-semibold mb-3">Choosing a Balanced Team</h3>
            <p>
              Use the calculator on each team member and look for repeated weaknesses. If several Pokemon take super
              effective damage from the same type, add a teammate that resists or is immune to that type. Then review the
              team&apos;s offensive coverage so common defensive types cannot wall every attacker. This quick process is
              useful for story teams, raids, casual battles, Nuzlocke planning, and competitive formats, although each
              format may introduce additional mechanics that deserve a separate check.
            </p>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section className="mb-12 prose max-w-none">
          <h2 className="text-3xl font-bold mb-6">Pokemon Type Matchup Calculator FAQ</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 text-gray-700 space-y-5">
            <div>
              <h3 className="text-xl font-semibold mb-2">What is a Pokemon type matchup calculator?</h3>
              <p>
                A Pokemon type matchup calculator checks how attacking types interact with one or two defending types. It shows
                whether a matchup is super effective, resisted, immune, or neutral so you can choose better moves and
                avoid bad switch-ins.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How is a type chart calculator different from a type chart?</h3>
              <p>
                A type chart is a complete reference table for all matchups. This type chart calculator turns that chart
                into an interactive tool, so you can select a type combination and immediately see the exact weaknesses,
                resistances, immunities, and damage multipliers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Why do dual-type Pokemon have 4x weaknesses?</h3>
              <p>
                Dual-type matchups multiply both defensive results together. If an attacking type is super effective
                against both defending types, the result is 2x times 2x, or 4x damage. The same rule can also create
                quarter-damage resistances when both types resist the same attack.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">When should I use a type effectiveness calculator?</h3>
              <p>
                Use a type effectiveness calculator when building a team, preparing for raids, checking counters, or
                learning a new Pokemon&apos;s weaknesses. It is most useful before battles because it quickly reveals which
                types threaten your Pokemon and which matchups you can safely resist.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
