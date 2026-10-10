import { Metadata } from 'next';
import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { formatMultiplier, calculateMultiplier } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import JsonLd, { BreadcrumbSchema } from '@/components/SEO/JsonLd';
import { SITE_URL } from '@/lib/seo';
import PrintChartButton from './PrintChartButton';

export const metadata: Metadata = {
  title: 'Pokemon Type Chart 2026 - Complete Printable Gen 9 Guide',
  description: 'Complete and printable Pokemon type chart for Gen 9 Scarlet & Violet. Check all 18 types, weaknesses, resistances, immunities, Tera Type, Tera Blast, and dual-type matchups.',
  keywords: 'pokemon type chart, type effectiveness chart, pokemon weakness chart, type matchup chart, gen 9 type chart, scarlet and violet type chart, tera type chart, 2026 type chart, stellar tera, tera blast',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Type Chart 2026 - Complete Printable Gen 9 Guide',
    description: 'Find every weakness, resistance, immunity, and Gen 9 type effectiveness matchup for all 18 Pokemon types, with a print-friendly chart and Tera Type notes.',
    url: 'https://www.typematchup.org/pokemon/type-chart',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Type Chart 2026 - Gen 9 Scarlet & Violet',
    description: 'Complete type effectiveness matrix for all 18 Pokemon types, with Tera Type and Gen 9 mechanics.',
  },
  alternates: {
    canonical: '/pokemon/type-chart',
  },
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getCellClass(multiplier: number): string {
  if (multiplier === 0) return 'bg-gray-400 text-white font-bold';
  if (multiplier === 0.25) return 'bg-green-700 text-white font-bold';
  if (multiplier === 0.5) return 'bg-green-500 text-white font-bold';
  if (multiplier === 1) return 'bg-gray-100 text-gray-800';
  if (multiplier === 2) return 'bg-red-500 text-white font-bold';
  if (multiplier === 4) return 'bg-red-700 text-white font-bold';
  return 'bg-gray-100 text-gray-800';
}

function getTypeName(typeId: TypeId): string {
  return typesData.types.find(type => type.id === typeId)?.name ?? typeId;
}

// Per-type quick reference: signature Pokemon plus the one-line practical note.
const TYPE_QUICK_NOTES: Record<TypeId, { keyPokemon: string; note: string }> = {
  normal: {
    keyPokemon: 'Snorlax, Blissey, Porygon-Z',
    note: 'Normal is the simplest type — only one weakness (Fighting) and one immunity (Ghost). Snorlax with Thick Fat is a premier special wall.',
  },
  fire: {
    keyPokemon: 'Charizard, Blaziken, Cinderace, Heatran',
    note: 'Fire resists 6 types — tied for the most resistances. Heatran\'s Fire/Steel typing gives it an incredible 9 resistances plus a Poison immunity.',
  },
  water: {
    keyPokemon: 'Blastoise, Swampert, Greninja, Toxapex',
    note: 'Water is the best defensive type in the game. Only two weaknesses, and Water/Ground (Swampert) eliminates the Electric weakness entirely.',
  },
  electric: {
    keyPokemon: 'Pikachu, Rotom-Wash, Jolteon',
    note: 'Only one weakness makes Electric great defensively. Rotom-Wash (Electric/Water) is a competitive staple — Levitate removes the Ground weakness.',
  },
  grass: {
    keyPokemon: 'Venusaur, Ferrothorn, Rillaboom',
    note: 'Five weaknesses make Grass tricky, but Ferrothorn\'s Grass/Steel typing patches most of them and is one of the best defensive Pokemon in the game.',
  },
  ice: {
    keyPokemon: 'Glaceon, Weavile, Kyurem',
    note: 'Ice is the worst defensive type — four weaknesses and only one resistance. But offensively it is elite, hitting Dragon, Flying, Ground, and Grass for super effective damage.',
  },
  fighting: {
    keyPokemon: 'Lucario, Blaziken, Urshifu',
    note: 'Fighting hits 5 types super effectively (Normal, Ice, Rock, Dark, Steel) — the most of any type. Lucario\'s Fighting/Steel gives it 8 resistances.',
  },
  poison: {
    keyPokemon: 'Venusaur, Toxapex, Gengar',
    note: 'Poison became much more valuable in Gen 6 when Fairy type was introduced. It is one of only two types super effective against Fairy.',
  },
  ground: {
    keyPokemon: 'Garchomp, Swampert, Landorus, Excadrill',
    note: 'Ground is arguably the best offensive type. Earthquake is one of the most spammed moves in competitive. Electric immunity is huge.',
  },
  flying: {
    keyPokemon: 'Dragonite, Corviknight, Landorus, Rayquaza',
    note: 'Ground immunity is Flying\'s biggest asset. Corviknight\'s Flying/Steel typing makes it one of the best physical walls in the game.',
  },
  psychic: {
    keyPokemon: 'Mewtwo, Gardevoir, Metagross',
    note: 'Once the most dominant type in Gen 1 (no real counters), Psychic has been balanced by Dark (immune) and strong Bug/Ghost moves.',
  },
  bug: {
    keyPokemon: 'Scizor, Volcarona, Genesect',
    note: 'Bug is weak offensively (resisted by 7 types) but Scizor\'s Bug/Steel with Technician-boosted Bullet Punch is a competitive legend.',
  },
  rock: {
    keyPokemon: 'Tyranitar, Excadrill (partner)',
    note: 'Five weaknesses make Rock rough defensively, but Tyranitar\'s Sand Stream boosts its SpDef by 50%, making it deceptively bulky.',
  },
  ghost: {
    keyPokemon: 'Gengar, Dragapult, Mimikyu',
    note: 'Two immunities make Ghost excellent defensively. Mimikyu\'s Disguise ability gives it a free turn of setup — one of the best sweepers in the game.',
  },
  dragon: {
    keyPokemon: 'Garchomp, Dragonite, Rayquaza, Dragapult',
    note: 'Dragon resists all four "starter" types. Before Fairy was introduced in Gen 6, Dragon was the most overpowered type in the game.',
  },
  dark: {
    keyPokemon: 'Tyranitar, Greninja, Umbreon',
    note: 'Dark\'s Psychic immunity and Ghost resistance make it great for trapping with Pursuit. Greninja\'s Protean lets it become any type on the fly.',
  },
  steel: {
    keyPokemon: 'Lucario, Metagross, Ferrothorn, Corviknight, Scizor, Heatran, Magearna',
    note: 'Steel is the best defensive type — 10 resistances plus Poison immunity. Every competitive team needs a Steel type.',
  },
  fairy: {
    keyPokemon: 'Sylveon, Togekiss, Clefable, Magearna, Gardevoir, Mimikyu',
    note: 'Fairy was introduced in Gen 6 specifically to nerf Dragon. Dragon immunity + only two weaknesses makes it the second-best defensive type after Steel.',
  },
};

const faqItems = [
  {
    question: 'How do I use the Pokemon weakness chart?',
    answer: 'Choose the defending type from the rows, then find the attacking move type in the columns. A 2x result is a weakness, 0.5x is a resistance, and 0x is an immunity.',
  },
  {
    question: 'How do dual-type weaknesses work?',
    answer: 'Multiply the effectiveness of the attack against both defending types. Two weaknesses create 4x damage, while a weakness and a resistance cancel to 1x damage.',
  },
  {
    question: 'Is this chart correct for Pokemon Scarlet and Violet?',
    answer: 'Yes. The chart uses the current 18-type system used in Generation 9, including Fairy type and the modern Steel-type resistances.',
  },
  {
    question: 'Do abilities change Pokemon weaknesses?',
    answer: 'Some abilities can add immunities or modify damage, but this chart shows the standard type matchup before abilities, held items, weather, or special move effects are applied.',
  },
  {
    question: 'Is this type chart updated for 2026 and Generation 9?',
    answer: 'Yes. The chart uses the current 18-type system from Generation 9, and this page covers Pokemon Scarlet & Violet including The Teal Mask and The Indigo Disk DLC: Tera Type, Stellar Tera, Tera Blast, and Paradox Pokemon.',
  },
  {
    question: 'Does a Tera Type change the type chart?',
    answer: 'The base chart does not change, but Terastallization replaces a Pokemon\'s defensive type for the rest of the battle, so the row you read before Terastallizing may not be the row that applies afterwards. Check the Tera Type, not only the original type.',
  },
  {
    question: 'What does Tera Blast do?',
    answer: 'Tera Blast is a Generation 9 move with 80 Base Power that becomes the user\'s Tera Type and uses its higher offensive stat. It lets a Pokemon attack with a type it does not naturally have.',
  },
];

export default function TypeChartPage() {
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
    <div className="container mx-auto px-4 py-8 print:px-0 print:py-0">
      <JsonLd data={faqSchema} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Pokemon Type Chart', url: `${SITE_URL}/pokemon/type-chart` },
      ]} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pokemon Type Chart 2026 — Gen 9 Scarlet &amp; Violet
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Complete Pokemon type chart for 2026: the Gen 9 type effectiveness matrix for all 18 types in Pokemon Scarlet
          &amp; Violet, including The Indigo Disk DLC. Rows show the defending type, columns show the attacking type. Find every
          weakness, resistance, and immunity, plus Tera Type, Tera Blast, and Stellar Tera — or print the chart for quick reference.
        </p>

        <div className="mb-6 flex justify-center">
          <PrintChartButton />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
          <span className="px-3 py-1 bg-red-700 text-white rounded font-semibold">4× Super Effective</span>
          <span className="px-3 py-1 bg-red-500 text-white rounded font-semibold">2× Super Effective</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded border">1× Normal</span>
          <span className="px-3 py-1 bg-green-500 text-white rounded font-semibold">½× Resisted</span>
          <span className="px-3 py-1 bg-green-700 text-white rounded font-semibold">¼× Resisted</span>
          <span className="px-3 py-1 bg-gray-400 text-white rounded font-semibold">0× Immune</span>
        </div>

        {/* Type Chart Matrix */}
        <div className="overflow-x-auto mb-12 border rounded-lg shadow">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 p-2 border min-w-[80px]">Defending ↓ / Attacking →</th>
                {ALL_TYPES.map(attackingType => {
                  return (
                    <th key={attackingType} className="p-2 border min-w-[48px] text-center bg-gray-50">
                      <TypeBadge typeId={attackingType} size="sm" />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ALL_TYPES.map(defendingType => {
                return (
                  <tr key={defendingType}>
                    <th className="sticky left-0 z-10 bg-gray-50 p-2 border text-left">
                      <TypeBadge typeId={defendingType} size="sm" />
                    </th>
                    {ALL_TYPES.map(attackingType => {
                      const multiplier = calculateMultiplier(attackingType, [defendingType]);
                      return (
                        <td key={`${defendingType}-${attackingType}`} className={`p-2 border text-center ${getCellClass(multiplier)}`}>
                          {formatMultiplier(multiplier)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="mb-12 rounded-lg border border-blue-200 bg-blue-50 p-6 print:hidden" aria-labelledby="printable-type-chart">
          <h2 id="printable-type-chart" className="text-2xl font-bold mb-3">Printable Pokemon Type Chart Quick Reference</h2>
          <p className="text-gray-700 mb-4">
            Use the chart above as a quick reference during team building or a battle. The print button creates a cleaner
            version of the 18×18 matrix: read a defending type down the left side, find the attacking type across the top,
            and use the multiplier in the intersecting cell.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Red cells show a weakness, green cells show resistance, and gray cells show immunity.</li>
            <li>For a dual-type defender, multiply the two cells instead of choosing only one type.</li>
            <li>This quick reference uses the standard main-series chart; it does not replace game-specific ability, item, or move rules.</li>
          </ul>
        </section>

        {/* Explanation */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Read the Pokemon Type Chart</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The table above is read from the perspective of the <strong>defending type</strong> (rows) against the
              <strong> attacking type</strong> (columns). For example, find Water in the left column and Electric in the
              top row — the cell shows <strong>2×</strong>, meaning Electric-type moves are super effective against Water-type Pokemon.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>2× (red):</strong> The defending type is weak to the attacking type.</li>
              <li><strong>½× (green):</strong> The defending type resists the attacking type.</li>
              <li><strong>0× (gray):</strong> The defending type is immune to the attacking type.</li>
              <li><strong>1× (white):</strong> Normal damage with no type advantage.</li>
            </ul>
            <p>
              For dual-type Pokemon, multiply the values from both types. A Fire/Flying Pokemon takes 4× damage from
              Rock-type moves because both Fire and Flying are weak to Rock (2× × 2× = 4×). The same rule produces the
              other two stack results: two resistances give ¼× damage (0.5× × 0.5×), and a weakness plus a resistance
              cancel out to neutral 1× damage (2× × 0.5×). Ice against Dragon/Flying Rayquaza is the classic 4× example.
            </p>
          </div>
        </section>

        {/* Tera Type: Gen 9 */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4">Tera Type: The Gen 9 Game Changer</h2>
          <p className="text-gray-700 mb-4">
            Pokemon Scarlet &amp; Violet introduced <strong>Terastallization</strong>, which changes a Pokemon&apos;s type to its
            Tera Type during battle. The 18×18 matrix above still describes the base game, but the row you read before
            Terastallizing is not always the row that applies afterwards.
          </p>

          <h3 className="text-xl font-semibold mb-2">How Tera Types affect matchups</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Offensive Tera:</strong> a Water-type Pokemon with Tera Electric can use Electric moves with STAB to surprise Ground-type counters.</li>
            <li><strong>Defensive Tera:</strong> Terastallizing to a type that resists your weaknesses — for example Garchomp going Tera Steel to dodge Fairy and Ice.</li>
            <li><strong>STAB stacking:</strong> if your Tera Type matches one of your original types, that type&apos;s moves get an extra boost.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Best Tera Types for competitive play</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Tera Steel</strong> — 10 resistances, removes many common weaknesses.</li>
            <li><strong>Tera Water</strong> — only 2 weaknesses, great with Rain teams.</li>
            <li><strong>Tera Fairy</strong> — Dragon immunity plus strong offensive coverage.</li>
            <li><strong>Tera Ground</strong> — Electric immunity, and Earthquake becomes even stronger.</li>
            <li><strong>Tera Ghost</strong> — Normal and Fighting immunity, great for setup sweepers.</li>
          </ol>

          <h3 className="text-xl font-semibold mb-2">Tera Raid strategy</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Always bring Pokemon with moves super effective against the raid boss&apos;s <strong>Tera Type</strong>, not its original type.</li>
            <li>For 7-star raids, coordinate type coverage with your teammates before the timer matters.</li>
            <li>Use the <Link href="/calculator" className="text-blue-700 hover:underline">Type Calculator</Link> to check the exact matchup before you commit a slot.</li>
          </ul>
        </section>

        {/* Generation context */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4">How the Type Chart Changed Across Generations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Gen 1:</strong> the chart had 15 types; Dark, Steel, and Fairy did not exist.</li>
            <li><strong>Gen 2–5:</strong> Dark and Steel were added, and the older matchup rules applied.</li>
            <li><strong>Gen 6 onward:</strong> Fairy was added, and the modern Steel, Dark, Ghost, and Fairy interactions began.</li>
            <li><strong>Gen 9 (Scarlet &amp; Violet):</strong> Terastallization and Tera Type were added. Stellar Tera is a temporary battle mechanic rather than a normal type row in this chart.</li>
          </ul>
          <p className="mt-4 text-gray-700">
            Tera Raid decisions use the raid Pokemon&apos;s displayed Tera Type as the immediate defensive target. Paradox
            Pokemon can also pair unusual type combinations with their abilities, so the standard matrix above remains the
            baseline rather than the complete battle calculation.
          </p>
        </section>

        {/* Gen 9 exclusive mechanics */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4">Gen 9 Exclusive Mechanics</h2>

          <h3 className="text-xl font-semibold mb-2">Stellar Tera Type (DLC)</h3>
          <p className="text-gray-700 mb-6">
            Introduced in <em>The Teal Mask</em> DLC, <strong>Stellar Tera</strong> boosts all of a Pokemon&apos;s moves once
            (2× STAB) the first time it Terastallizes. After that first use it returns to the normal 1.5× STAB, so it is
            best used on mixed attackers that benefit from a one-time burst.
          </p>

          <h3 className="text-xl font-semibold mb-2">Paradox Pokemon</h3>
          <p className="text-gray-700 mb-6">
            Scarlet and Violet introduced Paradox Pokemon — Ancient forms in Scarlet and Future forms in Violet — which
            often sport unique type combinations and synergize with the Booster Energy ability when Terastallized.
          </p>

          <h3 className="text-xl font-semibold mb-2">New Gen 9 type combinations</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Grass/Fire</strong> — Scovillain, the first ever Grass/Fire Pokemon.</li>
            <li><strong>Normal/Poison</strong> — Grafaiai.</li>
            <li><strong>Poison/Normal</strong> — the Maushold line.</li>
            <li><strong>Electric/Fighting</strong> — Pawmot.</li>
          </ul>
        </section>

        {/* Tera Blast and advanced Tera strategy */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4">Tera Blast and Advanced Tera Strategy</h2>

          <h3 className="text-xl font-semibold mb-2">Tera Blast (Gen 9 move)</h3>
          <p className="text-gray-700 mb-3">
            <strong>Tera Blast</strong> is a Gen 9 move with 80 Base Power that changes to match your Tera Type and uses
            your higher offensive stat:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Espathra (Psychic) with Fairy Tera — Tera Blast becomes Fairy.</li>
            <li>Dragonite (Dragon/Flying) with Ground Tera — Tera Blast becomes Ground and hits Electric-types.</li>
            <li>Gholdengo (Steel/Ghost) with Fighting Tera — Tera Blast becomes Fighting and hits Dark-types.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Best Tera Types by Pokemon</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Pokemon</th>
                  <th className="py-2 pr-4">Best Tera Type</th>
                  <th className="py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Dragonite</td><td className="py-2 pr-4">Normal</td><td className="py-2">2× STAB Extreme Speed (priority nuke)</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Kingambit</td><td className="py-2 pr-4">Fairy / Dark</td><td className="py-2">Removes Fighting weakness / boosts Sucker Punch</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Gholdengo</td><td className="py-2 pr-4">Steel / Fighting</td><td className="py-2">Boosts Steel STAB / hits Dark-types</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Great Tusk</td><td className="py-2 pr-4">Ground / Fighting</td><td className="py-2">Boosts STAB / removes weaknesses</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Roaring Moon</td><td className="py-2 pr-4">Flying / Dragon</td><td className="py-2">Boosts STAB / removes Ice weakness</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Garchomp</td><td className="py-2 pr-4">Fire / Steel</td><td className="py-2">Removes the 4× Ice weakness</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Corviknight</td><td className="py-2 pr-4">Steel / Water</td><td className="py-2">Removes the Electric weakness</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Toxapex</td><td className="py-2 pr-4">Poison / Water</td><td className="py-2">Boosts defensive STAB</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Clodsire</td><td className="py-2 pr-4">Poison / Ground</td><td className="py-2">Boosts defensive STAB</td></tr>
                <tr><td className="py-2 pr-4">Skeledirge</td><td className="py-2 pr-4">Fire / Ghost</td><td className="py-2">Boosts STAB, removes weaknesses</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mb-2">Competitive Tera Type tier list</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>S-Tier:</strong> Fairy (removes Dragon/Dark/Fighting weaknesses, Dragon immunity), Steel (best defensive typing), Water (solid defense, boosts Water STAB), Ghost (immune to Normal/Fighting, great coverage).</li>
            <li><strong>A-Tier:</strong> Ground (Electric immunity, hits Steel/Electric/Fire), Flying (Ground immunity), Fire (removes Ice weakness), Grass (removes Water/Ground weaknesses situationally).</li>
            <li><strong>B-Tier:</strong> Electric, Dark, Dragon, Fighting.</li>
            <li><strong>C-Tier (niche):</strong> Ice, Poison, Bug, Rock, Psychic, Normal — mostly for specific STAB boosts.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Tera Type prediction and counterplay</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Predict:</strong> check common sets, watch for a defensive Tera when an opponent stays in on a bad matchup, bait an early Tera, or scout with Protect.</li>
            <li><strong>Counter:</strong> force an early Tera with a super-effective move, then switch to a counter for the new type; or save your own Tera to react. Run multi-type coverage such as Earthquake + Ice Beam + Thunderbolt to blunt defensive Teras.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">VGC vs Singles</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>VGC (Doubles):</strong> offensive Teras dominate for quick KOs; defensive Teras are reserved for support Pokemon such as Amoonguss and Torkoal; Tera timing can swing the whole game.</li>
            <li><strong>OU Singles:</strong> defensive Teras are more common because they remove key weaknesses; Tera Blast sees use on special attackers; Tera prediction and timing are win conditions saved for late game.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Common Tera mistakes</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li>Tera-ing too early — save it for critical moments.</li>
            <li>Predictable Tera Types — mix it up to surprise opponents.</li>
            <li>Ignoring the opponent&apos;s Tera — always play around the fact that they can Tera.</li>
            <li>Bad Tera choices — match the Tera Type to the Pokemon&apos;s role, offensive or defensive.</li>
          </ol>

          <h3 className="text-xl font-semibold mb-2">Scarlet &amp; Violet meta: top threats by type</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Dragon:</strong> Garchomp, Dragapult, Baxcalibur — still powerful; Tera often removes the Ice or Fairy weakness.</li>
            <li><strong>Fairy:</strong> Flutter Mane, Iron Valiant, Clefable — dominate OU and check Dragon and Dark.</li>
            <li><strong>Steel:</strong> Kingambit, Gholdengo, Corviknight — excellent defensive typing.</li>
            <li><strong>Ghost:</strong> Gholdengo, Dragapult, Flutter Mane — immune to Normal and Fighting.</li>
          </ul>
        </section>

        <section className="mb-12 print:hidden">
          <h2 className="mb-3 text-2xl font-bold">All 18 Types at a Glance</h2>
          <p className="mb-6 text-gray-700">
            Use these per-type summaries when you need a faster answer than the full matrix: weaknesses, immunities,
            resistances, signature Pokemon, and the one thing that decides how the type plays. Each link opens a detailed guide for that type.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TYPES.map(defendingType => {
              const weakTo = ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) === 2);
              const immuneTo = ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) === 0);
              const resistsTo = ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) === 0.5);
              const quickNote = TYPE_QUICK_NOTES[defendingType];

              return (
                <article key={defendingType} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <TypeBadge typeId={defendingType} />
                    <Link href={`/types/${defendingType}`} className="text-sm font-semibold text-blue-700 hover:underline">
                      Full guide
                    </Link>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>{getTypeName(defendingType)} weaknesses:</strong>{' '}
                    {weakTo.map(getTypeName).join(', ')}
                  </p>
                  {resistsTo.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Resists:</strong> {resistsTo.map(getTypeName).join(', ')}
                    </p>
                  )}
                  {immuneTo.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Immune to:</strong> {immuneTo.map(getTypeName).join(', ')}
                    </p>
                  )}
                  {quickNote && (
                    <>
                      <p className="mt-2 text-sm text-gray-700">
                        <strong>Key Pokemon:</strong> {quickNote.keyPokemon}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{quickNote.note}</p>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick reference tips */}
        <section className="mb-12 bg-gray-50 rounded-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4">Quick Reference Tips</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Always have a <strong>Steel type</strong> on your team — it checks Dragon, Fairy, Ice, and more.</li>
            <li><strong>Ground + Flying</strong> coverage hits every type for at least neutral damage.</li>
            <li><strong>Water/Ground</strong> (Swampert) has only one weakness — Grass, at 4×.</li>
            <li><strong>Ice is the best offensive type</strong> against the metagame — it hits Dragon, Flying, Ground, and Grass.</li>
            <li><strong>Never ignore Stealth Rock</strong> — it punishes Fire, Ice, Flying, and Bug types on every switch.</li>
          </ol>
        </section>

        <p className="mb-12 text-sm text-gray-500 print:hidden">
          Last updated for the 2026 season. Type chart data is accurate for Pokemon Scarlet &amp; Violet (Gen 9),
          including The Indigo Disk DLC.
        </p>

        <section className="mb-12 print:hidden">
          <h2 className="mb-6 text-2xl font-bold">Pokemon Weakness Chart FAQ</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <details key={item.question} className="rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">{item.question}</summary>
                <p className="mt-3 text-gray-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center print:hidden">
          <h2 className="text-2xl font-bold mb-3">Try the Interactive Type Matchup Calculator</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Skip the manual lookup. Select any single or dual-type combination and instantly see weaknesses, resistances, and immunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Open Type Calculator
            </Link>
            <Link href="/battle-simulator" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Battle Simulator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
