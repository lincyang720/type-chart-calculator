import Link from 'next/link';
import { TypeId } from '@/lib/types';
import typeChartData from '@/data/typeChart.json';
import defensiveData from '@/data/defensiveTypeChart.json';

const TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

type Profile = { weakTo: string[]; resistsTo: string[]; immuneTo: string[] };
type Offensive = { superEffective: string[]; notVeryEffective: string[]; noEffect: string[] };
const DEFENSE = defensiveData as Record<TypeId, Profile>;
const OFFENSE = typeChartData as Record<TypeId, Offensive>;

function effectiveness(attack: TypeId, defend: TypeId): number {
  const row = DEFENSE[defend];
  if (row.immuneTo.includes(attack)) return 0;
  if (row.weakTo.includes(attack)) return 2;
  if (row.resistsTo.includes(attack)) return 0.5;
  return 1;
}

function multiplier(value: number): string {
  return value === 0.5 ? '½×' : `${value}×`;
}

function display(type: string): string {
  return type[0].toUpperCase() + type.slice(1);
}

export const GHOST_WEAKNESS_FAQS = [
  {
    question: 'What is Ghost-type Pokémon weak to?',
    answer: 'Pure Ghost Pokémon are weak to Ghost-type and Dark-type moves (2× each). A second defensive type, ability, item or battle rule can change the result.',
  },
  {
    question: 'What moves cannot hit Ghost-type Pokémon?',
    answer: 'Normal and Fighting moves deal 0× against a pure Ghost defender under standard main-series type rules; specific abilities or special mechanics can bypass type immunities.',
  },
  {
    question: 'Is Ghost super effective against Ghost?',
    answer: 'Yes. A Ghost move deals 2× against a pure Ghost defender; Ghost attacking Ghost is one of the symmetric matchups.',
  },
  {
    question: 'What does Ghost-type resist?',
    answer: 'A pure Ghost Pokémon resists Poison and Bug moves for ½× and is immune to Normal and Fighting moves for 0×.',
  },
  {
    question: 'Does a second type remove a Ghost weakness?',
    answer: 'Sometimes. Ghost/Fairy takes neutral 1× from Dark moves (2× against Ghost times ½× against Fairy). Ghost/Normal is immune to Ghost moves because Normal contributes 0×.',
  },
];

export default function GhostWeaknessGuide() {
  const ghost = DEFENSE.ghost;
  const attacking = OFFENSE.ghost;
  const offensiveNeutral = TYPES.length - attacking.superEffective.length - attacking.notVeryEffective.length - attacking.noEffect.length;
  const defensiveNeutral = TYPES.length - ghost.weakTo.length - ghost.resistsTo.length - ghost.immuneTo.length;

  // A reproducible editorial statistic over the 17 different dual types
  // containing Ghost: one count for each former 2× weakness turned 1× or 0×.
  const cancellations = TYPES.filter(type => type !== 'ghost').flatMap(secondType =>
    ghost.weakTo.map(attack => {
      const first = effectiveness(attack as TypeId, 'ghost');
      const second = effectiveness(attack as TypeId, secondType);
      return { secondType, attack, first, second, total: first * second };
    }).filter(item => item.total === 1 || item.total === 0)
  );
  const neutralized = cancellations.filter(item => item.total === 1);
  const immunized = cancellations.filter(item => item.total === 0);

  return (
    <article className="mb-6 rounded-xl bg-white p-4 text-gray-800 shadow-lg sm:p-6">
      <h2 className="mb-3 text-2xl font-bold">Ghost weakness chart: every attacking and defending type</h2>
      <p className="mb-4 leading-relaxed">
        Against a pure Ghost Pokémon, <strong>Ghost and Dark are 2× weaknesses</strong>; Poison and Bug are ½× resistances,
        while Normal and Fighting do 0×. On offense, Ghost-type moves deal 2× to Psychic and Ghost, ½× to Dark,
        and 0× to Normal. These are base main-series type matchups, before abilities, items or other battle conditions.
      </p>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200" tabIndex={0} role="region" aria-label="Full Ghost attack and defense type chart, scroll horizontally on small screens">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="px-3 py-3 text-left text-sm font-medium text-slate-700">
            Both directions for all 18 types, computed from TypeMatchup&apos;s defensive type matrix
          </caption>
          <thead className="bg-slate-100 text-left">
            <tr><th scope="col" className="px-3 py-2">Other type</th><th scope="col" className="px-3 py-2">Ghost move → target</th><th scope="col" className="px-3 py-2">Other move → Ghost</th></tr>
          </thead>
          <tbody>
            {TYPES.map(type => (
              <tr key={type} className="border-t border-slate-200">
                <th scope="row" className="px-3 py-2 text-left font-medium">{display(type)}</th>
                <td className="px-3 py-2">{multiplier(effectiveness('ghost', type))}</td>
                <td className="px-3 py-2">{multiplier(effectiveness(type, 'ghost'))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-2xl font-bold">What Ghost hits and what hits Ghost</h2>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200" tabIndex={0} role="region" aria-label="Ghost type strengths, weaknesses, resistances and immunities">
        <table className="w-full min-w-[33rem] border-collapse text-left text-sm">
          <thead className="bg-slate-100"><tr><th className="px-3 py-2">Direction</th><th className="px-3 py-2">Result</th><th className="px-3 py-2">Types</th></tr></thead>
          <tbody>
            {([
              ['Ghost on offense', '2× super effective', attacking.superEffective],
              ['Ghost on offense', '½× resisted', attacking.notVeryEffective],
              ['Ghost on offense', '0× ineffective', attacking.noEffect],
              ['Ghost on defense', '2× weak to', ghost.weakTo],
              ['Ghost on defense', '½× resists', ghost.resistsTo],
              ['Ghost on defense', '0× immune to', ghost.immuneTo],
            ] as [string, string, string[]][]).map(([direction, outcome, types]) => (
              <tr key={direction + outcome} className="border-t border-slate-200">
                <td className="px-3 py-2">{direction}</td><td className="px-3 py-2">{outcome}</td>
                <td className="px-3 py-2">{types.map(display).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-2xl font-bold">Original numbers from our type matrix</h2>
      <p className="mb-3 leading-relaxed">
        Against the 18 pure-type targets, Ghost moves are 2× against {attacking.superEffective.length} types,
        ½× against {attacking.notVeryEffective.length}, 0× against {attacking.noEffect.length},
        and neutral 1× against {offensiveNeutral}. On defense, pure Ghost has {ghost.weakTo.length} weaknesses,
        {ghost.resistsTo.length} resistances, {ghost.immuneTo.length} immunities and {defensiveNeutral} neutral interactions.
      </p>
      <p className="mb-4 leading-relaxed">
        We also tested Ghost paired with each of the other {TYPES.length - 1} types. Across its two original 2×
        weaknesses (Ghost and Dark), a second type produces <strong>{neutralized.length} neutral 1× cancellations</strong>
        and <strong>{immunized.length} complete 0× immunity</strong> among the {cancellations.length} changed
        attack–defender-pair interactions. This counts interactions, not unique Pokémon species or unique dual types.
        The underlying data is the same <code>defensiveTypeChart.json</code> used by our calculator.
      </p>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200" tabIndex={0} role="region" aria-label="Ghost dual-type weakness cancellation examples">
        <table className="w-full min-w-[33rem] border-collapse text-left text-sm">
          <thead className="bg-slate-100"><tr><th className="px-3 py-2">Ghost + second type</th><th className="px-3 py-2">Incoming move</th><th className="px-3 py-2">Calculation</th></tr></thead>
          <tbody>
            {cancellations.map(item => (
              <tr key={item.secondType + item.attack} className="border-t border-slate-200">
                <td className="px-3 py-2">Ghost/{display(item.secondType)}</td>
                <td className="px-3 py-2">{display(item.attack)}</td>
                <td className="px-3 py-2">{multiplier(item.first)} × {multiplier(item.second)} = <strong>{multiplier(item.total)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-6 text-sm text-slate-600">
        This is a type-only comparison: the actual result can change with an ability, move-specific rule, held item,
        Terastallization, or another battle condition. For example, Scrappy can permit certain Normal and Fighting
        moves to affect Ghost defenders; that exception does not change the baseline chart.
      </p>

      <h2 className="mb-3 text-2xl font-bold">Ghost weakness FAQ</h2>
      <div className="mb-6 space-y-4">
        {GHOST_WEAKNESS_FAQS.map(({ question, answer }) => (
          <section key={question} className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-1 text-lg font-semibold">{question}</h3>
            <p className="leading-relaxed">{answer}</p>
          </section>
        ))}
      </div>
      <h2 className="mb-3 text-xl font-bold">Explore related weakness charts and tools</h2>
      <nav aria-label="Related type matchups" className="grid gap-2 text-blue-700 sm:grid-cols-2">
        <Link href="/pokemon/type-chart" className="underline">Complete Pokémon type chart</Link>
        <Link href="/calculator?type1=ghost" className="underline">Weakness and resistance calculator</Link>
        <Link href="/dual-type-chart" className="underline">All dual-type combinations</Link>
        <Link href="/types/dark" className="underline">Dark-type weakness guide</Link>
        <Link href="/types/psychic" className="underline">Psychic-type weakness guide</Link>
      </nav>
    </article>
  );
}
