import { Metadata } from 'next';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import { TypeId } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Best Pokemon Type Combinations for Offense and Defense',
  description:
    'Compare the best Pokemon type combinations for offense and defense, including weaknesses, resistances, immunities, examples, and team-building tips.',
  keywords: [
    'best pokemon type combinations',
    'best dual types pokemon',
    'best defensive typing pokemon',
    'best offensive type combinations',
  ],
  alternates: {
    canonical: '/pokemon/best-type-combinations',
  },
  openGraph: {
    title: 'Best Pokemon Type Combinations for Offense and Defense',
    description:
      'Compare strong dual typings, their weaknesses and resistances, and the roles they fit on a Pokemon team.',
    url: 'https://www.typematchup.org/pokemon/best-type-combinations',
    type: 'article',
  },
};

type Combination = {
  type1: TypeId;
  type2: TypeId;
  examples: string;
  role: string;
  summary: string;
};

const combinations: Combination[] = [
  {
    type1: 'steel',
    type2: 'fairy',
    examples: 'Zacian, Magearna, Klefki, Tinkaton',
    role: 'Defensive balance',
    summary:
      'Steel supplies a large resistance profile while Fairy adds a Dragon immunity. The combination has only Fire and Ground weaknesses under normal type rules.',
  },
  {
    type1: 'water',
    type2: 'ground',
    examples: 'Swampert, Gastrodon, Quagsire, Whiscash',
    role: 'Bulky pivot',
    summary:
      'Water/Ground is immune to Electric and has only one type weakness: Grass. That weakness deals 4x damage, so the combination is strongest with reliable Grass answers nearby.',
  },
  {
    type1: 'steel',
    type2: 'flying',
    examples: 'Corviknight, Skarmory, Celesteela',
    role: 'Physical defense',
    summary:
      'Flying removes Steel’s Ground weakness and Steel covers several of Flying’s vulnerabilities. Electric and Fire remain the main type-based threats.',
  },
  {
    type1: 'bug',
    type2: 'steel',
    examples: 'Scizor, Forretress, Genesect, Escavalier',
    role: 'Defensive utility',
    summary:
      'Bug/Steel compresses its defensive risk into a single Fire weakness, although that weakness is 4x. Its many resistances create useful switch-in opportunities.',
  },
  {
    type1: 'water',
    type2: 'dragon',
    examples: 'Kingdra, Palkia, Dracovish',
    role: 'Balanced offense',
    summary:
      'Water and Dragon complement each other defensively and leave Dragon and Fairy as the standard weaknesses. Their STAB moves also pressure a broad range of opponents.',
  },
  {
    type1: 'normal',
    type2: 'ghost',
    examples: 'Hisuian Zoroark',
    role: 'Immunity-based offense',
    summary:
      'Normal/Ghost is immune to Normal, Fighting, and Ghost moves under ordinary type rules. Dark is its only type weakness, making prediction especially important.',
  },
  {
    type1: 'electric',
    type2: 'flying',
    examples: 'Zapdos, Thundurus, Kilowattrel',
    role: 'Fast pivot',
    summary:
      'Flying grants a Ground immunity that removes Electric’s usual weakness. The combination remains weak to Ice and Rock and often works well in momentum-focused teams.',
  },
  {
    type1: 'fire',
    type2: 'steel',
    examples: 'Heatran',
    role: 'Offensive resistance',
    summary:
      'Fire/Steel brings an unusually broad resistance profile and strong offensive pressure. Its Ground weakness is 4x, with Fighting and Water also hitting super effectively.',
  },
];

function typeName(type: TypeId) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function BestTypeCombinationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <Link href="/pokemon" className="text-blue-700 font-medium hover:underline">
            ← Pokemon guides
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
            Best Pokemon Type Combinations
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl">
            The best Pokemon type combination depends on the job you need it to perform. Some dual types minimize
            weaknesses, some create valuable immunities, and others trade defensive safety for powerful offensive
            coverage. This guide compares eight consistently useful combinations using the standard type chart.
          </p>
        </header>

        <section className="mb-10" aria-labelledby="comparison-heading">
          <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-bold mb-3">
            Top Dual-Type Combinations Compared
          </h2>
          <p className="text-gray-700 mb-6">
            Weakness counts are a starting point, not a complete ranking. A 4x weakness can be more dangerous than two
            ordinary weaknesses, while an immunity may matter more in one battle format than another. Open any
            combination for its complete multiplier breakdown.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {combinations.map(combo => {
              const matchups = calculateDualTypeWeaknesses(combo.type1, combo.type2);
              const slug = `${combo.type1}-${combo.type2}`;
              const weaknesses = [...matchups.quadrupleWeak, ...matchups.doubleWeak];

              return (
                <article key={slug} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <TypeBadge typeId={combo.type1} size="sm" />
                    <TypeBadge typeId={combo.type2} size="sm" />
                    <span className="text-sm font-semibold text-gray-600 ml-auto">{combo.role}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {typeName(combo.type1)}/{typeName(combo.type2)}
                  </h3>
                  <p className="text-gray-700 mb-3">{combo.summary}</p>
                  <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <dt className="font-semibold text-gray-800">Weaknesses</dt>
                      <dd className="text-gray-600">
                        {weaknesses.length > 0 ? weaknesses.map(typeName).join(', ') : 'None'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-800">Immunities</dt>
                      <dd className="text-gray-600">
                        {matchups.immune.length > 0 ? matchups.immune.map(typeName).join(', ') : 'None'}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Examples:</strong> {combo.examples}
                  </p>
                  <Link href={`/types/${slug}`} className="text-blue-700 font-semibold hover:underline">
                    View complete {typeName(combo.type1)}/{typeName(combo.type2)} matchups →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="prose max-w-none text-gray-700 mb-10">
          <h2>What Makes a Type Combination Good?</h2>
          <p>
            Defensive combinations are usually judged by the number and severity of their weaknesses, the resistances
            they provide, and whether they offer immunities that help teammates switch safely. Steel appears frequently
            because it resists many attack types, but pairing Steel with another type can also introduce a dangerous 4x
            weakness. A combination with one weakness is not automatically better than one with three: the surrounding
            team, available recovery, base stats, and expected opponents all matter.
          </p>
          <p>
            Offensive typing is evaluated differently. Two STAB types are valuable when each one pressures Pokemon that
            resist the other. Move availability matters too. A theoretically excellent pairing contributes little if a
            Pokemon lacks accurate, strong attacks of both types. Coverage moves, speed, and attacking stats determine
            whether that typing can turn favorable chart matchups into actual knockouts.
          </p>

          <h2>How to Choose a Combination for Your Team</h2>
          <p>
            Begin with your team&apos;s repeated weaknesses. If several members are vulnerable to Ground, a Flying type or
            Levitate user can create a safer switch. If Dragon attacks are difficult to absorb, Fairy offers an immunity,
            while Steel provides a resistance. Next, check whether the new team member adds offensive coverage against
            the opponents your current core struggles to damage.
          </p>
          <p>
            Abilities can change these conclusions. Levitate may remove a Ground weakness, Flash Fire may turn Fire
            damage into an immunity, and abilities such as Thick Fat can reduce specific incoming types. Use the{' '}
            <Link href="/pokemon/type-chart-with-abilities">type chart with abilities</Link> when an ability is central to
            the matchup, and use the <Link href="/">type matchup calculator</Link> for quick comparisons between other
            single and dual types.
          </p>

          <h2>Are These the Objectively Best Pokemon Types?</h2>
          <p>
            No single ordering works for every generation, ruleset, or team. This list highlights combinations with clear
            type-chart advantages and recognizable strategic roles. Individual Pokemon can perform very differently even
            when they share a type combination because their stats, abilities, moves, items, and legal battle format are
            different. Treat the chart as the foundation for a team-building decision, then evaluate the full Pokemon.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Test Another Dual Type</h2>
          <p className="text-gray-700 mb-4">
            Compare any of the 153 possible two-type combinations and see every weakness, resistance, immunity, and
            neutral matchup.
          </p>
          <Link href="/" className="inline-block bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-800">
            Open the Type Matchup Calculator
          </Link>
        </section>
      </div>
    </div>
  );
}
