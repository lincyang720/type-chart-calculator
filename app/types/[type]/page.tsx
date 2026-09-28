import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { DefensiveTypeChart, TypeChart, TypeId } from '@/lib/types';
import typesData from '@/data/types.json';
import typeChartData from '@/data/typeChart.json';
import defensiveTypeChartData from '@/data/defensiveTypeChart.json';
import Link from 'next/link';
import { getTypeEditorialProfile } from '@/lib/typeEditorial';
import {
  DualTypeContent,
  generateMetadata as generateDualTypeMetadata,
} from '@/app/combo/[combo]/page';
import { EDITORIAL_COMBINATIONS } from '@/lib/editorialCombinations';
import { COMBO_WORDING } from '@/lib/comboWording';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeChart = typeChartData as TypeChart;
const defensiveTypeChart = defensiveTypeChartData as DefensiveTypeChart;

function getTypeName(typeId: string) {
  return typesData.types.find(typeItem => typeItem.id === typeId)?.name ?? typeId;
}

function formatTypeNames(typeIds: string[]) {
  if (typeIds.length === 0) return 'none';
  return typeIds.map(getTypeName).join(', ');
}

function scoreTypeRisk(typeId: TypeId) {
  const defensiveProfile = defensiveTypeChart[typeId];
  return defensiveProfile.weakTo.length * 2
    + defensiveProfile.immuneTo.length * -2
    + defensiveProfile.resistsTo.length * -1;
}

function describeRiskBand(score: number) {
  if (score <= -3) return 'low defensive burden';
  if (score <= 1) return 'balanced defensive burden';
  if (score <= 4) return 'noticeable defensive burden';
  return 'high defensive burden';
}

// Pre-generate all 18 single-type pages and 153 dual-type pages at build time.
export async function generateStaticParams() {
  const params: { type: string }[] = ALL_TYPES.map((type) => ({ type }));
  const generated = new Set(params.map(param => param.type));

  for (let i = 0; i < ALL_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_TYPES.length; j++) {
      const combo = `${ALL_TYPES[i]}-${ALL_TYPES[j]}`;
      params.push({ type: combo });
      generated.add(combo);
    }
  }

  for (const combo of EDITORIAL_COMBINATIONS) {
    if (!generated.has(combo)) {
      params.push({ type: combo });
    }
  }

  return params;
}

// Only allow pre-generated paths, return 404 for others
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type: typeParam } = await params;

  const comboWording = COMBO_WORDING[typeParam];
  if (comboWording) {
    return {
      title: comboWording.title,
      description: comboWording.description,
      openGraph: {
        siteName: 'TypeMatchup',
        title: comboWording.title,
        description: comboWording.description,
        url: `https://www.typematchup.org/types/${typeParam}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: comboWording.title,
        description: comboWording.description,
      },
      alternates: {
        canonical: `/types/${typeParam}`,
      },
    };
  }

  if (typeParam.includes('-')) {
    return generateDualTypeMetadata({
      params: Promise.resolve({ combo: typeParam }),
    });
  }

  const typeId = typeParam as TypeId;
  const type = typesData.types.find(t => t.id === typeId);

  if (!type) {
    return {
      title: 'Type Not Found',
    };
  }

  const defensive = defensiveTypeChart[typeId];
  const offensive = typeChart[typeId];

  if (typeId === 'dragon') {
    return {
      title: 'Dragon Types Chart and Dragon Type Weakness - How to Beat Dragon Pokemon (2026)',
      description: 'Dragon types chart and Dragon type weakness on one page: Dragon is weak to Ice, Dragon, and Fairy, resists Fire, Water, Electric, and Grass, and cannot hit Fairy. Featured Dragon Pokemon by dual typing, the 4x Ice weakness club, Fairy and Ice counters, anti-Dragon team cores, and Pokemon GO raid counters.',
      keywords: 'dragon types chart, dragon type weakness, dragon pokemon, dragon type matchups, how to beat dragon pokemon, dragon weakness 2026, dragon type chart',
      openGraph: {
        siteName: 'TypeMatchup',
        title: 'Dragon Types Chart and Dragon Type Weakness (2026)',
        description: 'Dragon is weak to Ice, Dragon, and Fairy, resists Fire, Water, Electric, and Grass, and cannot hit Fairy. Grouped Dragon Pokemon by dual typing plus counters and team cores.',
        url: 'https://www.typematchup.org/types/dragon',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Dragon Types Chart and Dragon Type Weakness',
        description: 'Dragon weaknesses, resistances, featured Dragon Pokemon by typing, and the counters that beat them.',
      },
      alternates: {
        canonical: '/types/dragon',
      },
    };
  }

  return {
    title: `${type.name} Type Chart - Strengths, Weaknesses & Matchups`,
    description: `${type.name} type guide: super effective vs ${offensive.superEffective.slice(0, 3).join(', ')}. Weak to ${defensive.weakTo.slice(0, 3).join(', ')}. Full matchup analysis.`,
    keywords: `${type.name} type, ${type.name} weakness, ${type.name} strength, ${type.name} matchup, ${type.name} type chart`,
    openGraph: {
    siteName: 'TypeMatchup',
      title: `${type.name} Type Chart - Strengths, Weaknesses & Matchups`,
      description: `${type.name} type guide: super effective vs ${offensive.superEffective.slice(0, 3).join(', ')}. Weak to ${defensive.weakTo.slice(0, 3).join(', ')}.`,
      url: `https://www.typematchup.org/types/${typeId}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${type.name} Type Chart`,
      description: `${type.name} type guide: super effective vs ${offensive.superEffective.slice(0, 3).join(', ')}. Weak to ${defensive.weakTo.slice(0, 3).join(', ')}.`,
    },
    alternates: {
      canonical: `/types/${typeId}`,
    },
  };
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type: typeParam } = await params;

  if (typeParam.includes('-')) {
    return DualTypeContent({
      params: Promise.resolve({ combo: typeParam }),
    });
  }

  const typeId = typeParam as TypeId;
  const type = typesData.types.find(t => t.id === typeId);

  if (!type || !ALL_TYPES.includes(typeId)) {
    notFound();
  }

  const defensive = defensiveTypeChart[typeId];
  const offensive = typeChart[typeId];
  const editorialProfile = getTypeEditorialProfile(typeId);
  const offensiveCoverageScore = offensive.superEffective.length - offensive.notVeryEffective.length - offensive.noEffect.length * 2;
  const defensiveBurdenScore = scoreTypeRisk(typeId);
  const saferSwitchTypes = ALL_TYPES.filter(candidateTypeId =>
    defensiveTypeChart[candidateTypeId].resistsTo.some(resistedType => defensive.weakTo.includes(resistedType as TypeId)) ||
    defensiveTypeChart[candidateTypeId].immuneTo.some(immuneType => defensive.weakTo.includes(immuneType as TypeId))
  ).slice(0, 6);
  const coveragePartners = ALL_TYPES.filter(candidateTypeId => {
    const candidateOffense = typeChart[candidateTypeId];
    return offensive.notVeryEffective.some(resistedByType =>
      candidateOffense.superEffective.includes(resistedByType as TypeId)
    ) || offensive.noEffect.some(immuneDefenderType =>
      candidateOffense.superEffective.includes(immuneDefenderType as TypeId)
    );
  }).slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What is ${type.name} type strong against?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: offensive.superEffective.length > 0
                    ? `${type.name} type moves are super effective (2× damage) against ${offensive.superEffective.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} types.`
                    : `${type.name} type has no super effective matchups.`,
                },
              },
              {
                '@type': 'Question',
                name: `What is ${type.name} type weak against?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: defensive.weakTo.length > 0
                    ? `${type.name} type is weak to (takes 2× damage from) ${defensive.weakTo.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} type moves.`
                    : `${type.name} type has no weaknesses!`,
                },
              },
              {
                '@type': 'Question',
                name: `What types resist ${type.name}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: offensive.notVeryEffective.length > 0
                    ? `${offensive.notVeryEffective.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} types resist ${type.name} type moves (take 0.5× damage).`
                    : `No types resist ${type.name} type moves.`,
                },
              },
            ],
          }),
        }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/types" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to All Types
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <TypeBadge typeId={typeId} size="lg" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{type.name} Type</h1>
          </div>
          <p className="text-lg text-gray-600">{type.description}</p>
        </div>

        {typeId === 'fire' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Fire type at a glance</h2>
            <p>
              <strong>Direct answer:</strong> Fire-type moves are super effective (2×) against Grass, Ice, Bug, and Steel.
              A Fire Pokémon is weak (2×) to Water, Ground, and Rock, resists six types (Fire, Grass, Ice, Bug, Steel, and Fairy),
              and has no immunities.
            </p>

            <h3>What Fire hits (offensive matchups)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Result</th>
                  <th className="py-2">Types Fire is…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 text-green-700 font-semibold">Super effective (2×)</td><td className="py-2">Grass, Ice, Bug, Steel</td></tr>
                <tr className="border-b"><td className="py-2 text-red-700 font-semibold">Not very effective (0.5×)</td><td className="py-2">Fire, Water, Rock, Dragon</td></tr>
                <tr><td className="py-2 text-gray-700 font-semibold">No effect (0×)</td><td className="py-2">none</td></tr>
              </tbody>
            </table>

            <h3>What hits Fire (defensive matchups)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Result</th>
                  <th className="py-2">Types that are…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 text-red-700 font-semibold">Super effective vs Fire (2×)</td><td className="py-2">Water, Ground, Rock</td></tr>
                <tr className="border-b"><td className="py-2 text-green-700 font-semibold">Resist Fire (0.5×)</td><td className="py-2">Fire, Grass, Ice, Bug, Steel, Fairy</td></tr>
                <tr><td className="py-2 text-gray-700 font-semibold">Immune to Fire (0×)</td><td className="py-2">none</td></tr>
              </tbody>
            </table>

            <h3>What Fire players most often get wrong</h3>
            <ul>
              <li><strong>Fire resists Steel and Fairy.</strong> Because Fire resists so few things offensively, people forget it actually shrugs off Steel and Fairy moves (both 0.5×). Fire is one of only three types (with Poison and Steel) that resists Fairy on defense.</li>
              <li><strong>Fire is weak to Rock.</strong> Rock is an uncommon attacking type, so it surprises people that a Rock Slide or Stone Edge dents Fire for 2× — the same Rock weakness Fire shares with Flying, Bug, and Ice.</li>
              <li><strong>Ground is strong against Rock, not the reverse.</strong> A player who has been gaming since Red and Blue admitted the odd matchups still trip him up: "ground is strong against rock." It is a good reminder that Rock-type moves do nothing special to Ground, while Ground tears through Rock.</li>
            </ul>
          </article>
        )}

        {typeId === 'ghost' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Ghost type in battle</h2>
            <p>
              <strong>Direct answer:</strong> Ghost-type moves are super effective (2×) against Psychic and Ghost, and do nothing (0×) to Normal.
              A Ghost Pokémon is weak (2×) to Ghost and Dark, and is immune (0×) to both Normal and Fighting.
            </p>

            <h3>Scenario 1 — switching into a Normal or Fighting move</h3>
            <p>
              You bring in Gengar as the opponent clicks Fake Out, Rapid Spin, or Close Combat. None of those connect: Ghost is immune to both Normal and Fighting.
              That free turn is why Ghost is such a good defensive pivot — but only against those two categories, not against everything.
            </p>

            <h3>Scenario 2 — Ghost versus Ghost</h3>
            <p>
              Your Ghost faces a Ghost (think Gengar into Dragapult). Ghost is weak to Ghost, and Ghost moves are super effective against Ghost —
              so it cuts both ways at 2×. Players often assume "same type = neutral" and lose a Pokémon they thought was safe.
            </p>

            <h3>Scenario 3 — a Dark attacker shows up</h3>
            <p>
              Dark moves hit Ghost for 2×. If you cannot switch to something that blanks Dark (a Fighting-immune or Dark-resistant partner),
              the Ghost gets worn down fast. Terastallizing to a type that drops the Dark weakness is the common fix.
            </p>

            <h3>What Ghost players most often get wrong</h3>
            <ul>
              <li><strong>Ghost is immune to BOTH Normal and Fighting.</strong> Most people remember one and forget the other. Both Normal and Fighting moves do 0× to every Ghost Pokémon, and Ghost moves in turn do 0× to Normal.</li>
              <li><strong>Ghost is weak to Ghost.</strong> The "same type feels neutral" trap again — Ghost takes 2× from Ghost moves, exactly like it does from Dark.</li>
              <li><strong>Poison is not immune to Ghost or Rock — it is only half effective.</strong> A veteran admitted he mixes this up: "poison 对 rock 和对 ghost 都无效" (he remembers Poison as useless into both). In the actual chart, Poison is not very effective (0.5×) against Rock and Ghost, not 0×. It is a frequent mix-up worth catching before you plan a Poison switch.</li>
            </ul>
            <h3>Three real dual-type checks</h3>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Pokémon and target move</th><th className="py-2">Calculation</th><th className="py-2">Final result</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Gengar (Ghost/Poison) vs Ground</td><td className="py-2">1× × 2×</td><td className="py-2">2×</td></tr>
                <tr className="border-b"><td className="py-2">Gengar (Ghost/Poison) vs Psychic</td><td className="py-2">1× × 2×</td><td className="py-2">2×</td></tr>
                <tr><td className="py-2">Aegislash (Ghost/Steel) vs Fighting</td><td className="py-2">0× × 2×</td><td className="py-2">0×</td></tr>
              </tbody>
            </table>
            <p>These examples show why the Ghost row alone is not enough: the second type can turn a neutral matchup into a weakness or preserve an immunity when the other type is weak.</p>
          </article>
        )}

        {typeId === 'poison' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Poison dual-type multiplication</h2>
            <p>Poison is weak to Ground and Psychic, resists Fighting, Poison, Bug, Grass, and Fairy, and its attacks are super effective against Grass and Fairy.</p>
            <dl>
              <div className="border-b py-3"><dt className="font-semibold">Venusaur (Grass/Poison) vs Ground</dt><dd>0.5× × 2× = 1×</dd></div>
              <div className="border-b py-3"><dt className="font-semibold">Toxapex (Poison/Water) vs Ground</dt><dd>2× × 1× = 2×</dd></div>
              <div className="border-b py-3"><dt className="font-semibold">Gengar (Ghost/Poison) vs Fighting</dt><dd>0× × 0.5× = 0×</dd></div>
              <div className="py-3"><dt className="font-semibold">Venusaur (Grass/Poison) vs Psychic</dt><dd>1× × 2× = 2×</dd></div>
            </dl>
            <p>The first type gives only one factor. Check both defending types before calling a Poison matchup neutral, resisted, or immune.</p>
          </article>
        )}

        {typeId === 'steel' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Steel type across the generations</h2>
            <p>
              <strong>Direct answer:</strong> Steel-type moves are super effective (2×) against Ice, Rock, and Fairy.
              A Steel Pokémon is weak (2×) to Fire, Fighting, and Ground, resists ten types, and is immune only to Poison.
            </p>

            <h3>Gen 2–5 (1999–2013): the original Steel</h3>
            <p>
              Steel was added in Generation 2 and arrived as the ultimate wall. It resisted eleven types — including Dark and Ghost —
              and was immune to Poison, with only Fire, Fighting, and Ground as weaknesses. For a decade, "switch to Steel" meant "shrug off almost anything."
            </p>

            <h3>Gen 6 (2013): the Fairy rebalance</h3>
            <p>
              Fairy was introduced and the chart was trimmed. Steel lost its resistances to <strong>Dark</strong> and <strong>Ghost</strong> (those became neutral 1×),
              and gained a new weakness to <strong>Fairy</strong>. Steel still resists ten types and is immune to Poison, but it no longer neutralizes Dark or Ghost attackers.
            </p>

            <h3>Gen 9 (2022+): Terastal</h3>
            <p>
              The type chart itself did not change, but Terastallization lets a Steel Pokémon change its type mid-battle, trading its resistances for a different defensive profile on demand.
            </p>

            <h3>What Steel players most often get wrong</h3>
            <ul>
              <li><strong>"Steel resists Dark and Ghost."</strong> Not since 2013. This is the single most common stale memory: a player who has been competing since Red and Blue told us the tricky ones are "matchups that have changed — mainly steel no longer resisting dark or ghost, or anything related to fairy." Since Gen 6 those two matchups are neutral, not resisted.</li>
              <li><strong>"Steel isn't weak to Fairy."</strong> Wrong since Gen 6. Fairy was added that generation specifically and hits Steel for 2×, so Sylveon, Tinkaton, and other Fairy attackers are real answers to Steel.</li>
              <li><strong>"Steel shrugs off Ground."</strong> It never did. Ground has been super effective against Steel since Steel existed (Gen 2). Steel's bulk comes from its many resistances, not from avoiding Ground.</li>
            </ul>
          </article>
        )}

        {typeId === 'fairy' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Fairy type across the generations</h2>
            <p>
              <strong>Direct answer:</strong> Fairy-type moves are super effective (2×) against Fighting, Dragon, and Dark.
              A Fairy Pokémon is weak (2×) to Poison and Steel, resists Fighting, Bug, and Dark, and is immune to Dragon.
            </p>

            <h3>Gen 6 (2013): the type that was added to stop Dragon</h3>
            <p>
              Fairy did not exist before Generation 6. It was introduced specifically to rein in Dragon-types, which had dominated competitive play.
              The chart gave Fairy two jobs: be super effective against Dragon, and be the only type immune to Dragon. Both are still true today.
            </p>

            <h3>What Fairy actually does now</h3>
            <p>
              Offensively Fairy hits Fighting, Dragon, and Dark for 2×, is weak (0.5×) against Fire, Poison, and Steel, and has no 0× targets of its own.
              Defensively it is the Dragon-immune type, resists Fighting, Bug, and Dark, and is weak only to Poison and Steel.
            </p>

            <h3>What Fairy players most often get wrong</h3>
            <ul>
              <li><strong>"Fairy is immune to Dragon — and it is the only type that is."</strong> This was a Gen 6 addition built to check Dragon dominance. Players who learned the chart before 2013 never had a Dragon-immune type, so it still slips their mind.</li>
              <li><strong>"Fairy is weak to Poison and Steel."</strong> Both are deliberate Fairy answers — a Fairy Pokémon takes 2× from Poison moves like Poison Jab and from Steel moves. Easy to forget because Fairy otherwise feels like a premium offensive type.</li>
              <li><strong>"Fairy only resists three types."</strong> Aside from the Dragon immunity, Fairy resists just Fighting, Bug, and Dark and is neutral to almost everything else. People over-rate its bulk.</li>
            </ul>
          </article>
        )}

        {typeId === 'dragon' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Dragon type in battle</h2>
            <p>
              <strong>Direct answer:</strong> Dragon-type moves are super effective (2×) only against Dragon, not very effective (0.5×) against Steel,
              and do nothing (0×) to Fairy. A Dragon Pokémon is weak (2×) to Ice, Dragon, and Fairy, and resists Fire, Water, Electric, and Grass.
            </p>

            <h3>Scenario 1 — Dragon versus Dragon</h3>
            <p>
              Your Dragon faces a Dragon (think Garchomp into Dragapult). Dragon is weak to Dragon, and Dragon moves are super effective against Dragon —
              so it cuts both ways at 2×. The "same type feels neutral" trap again: neither side is safe.
            </p>

            <h3>Scenario 2 — an Ice move appears</h3>
            <p>
              Ice hits Dragon for 2×, and on a Dragon/Flying Pokémon that becomes a 4× weakness. Switch to a partner that resists Ice — Dragon itself resists Fire, Water, Electric, and Grass, so a bulky Fire or Water teammate often soaks the hit.
            </p>

            <h3>Scenario 3 — a Fairy switches in</h3>
            <p>
              Your Dragon moves do 0× to Fairy, and Fairy hits your Dragon for 2×. Dragon has no neutral or better option into Fairy — this is the Gen 6 Fairy check on Dragon. Keep a coverage move (Steel or Fairy-resistant partner) ready.
            </p>

            <h3>Scenario 4 — Dragon STAB only pressures Dragons</h3>
            <p>
              A Dragon attack is super effective only against other Dragons; against everything else it is neutral or worse (0.5× vs Steel). A Dragon Pokémon almost always needs a second attack type to actually threaten the team.
            </p>

            <h3>What Dragon players most often get wrong</h3>
            <ul>
              <li><strong>"Dragon is only super effective against Dragon."</strong> It is the most offensively narrow type — exactly one target. People assume Dragon hits wide because it is "strong."</li>
              <li><strong>"Dragon has a Fairy weakness."</strong> Added in Gen 6. Before that Dragon was weak only to Ice and Dragon and resisted four types; the Fairy addition gave it a third weakness. Veterans pre-2013 forget Fairy exists in the matchup.</li>
              <li><strong>"Dragon resists four types but the Ice weakness is the one to fear."</strong> Dragon resists Fire, Water, Electric, and Grass, yet a single Ice move (or Ice + Flying for 4×) is the classic knockout. Easy to remember Ice, forget the Fairy third wheel.</li>
            </ul>

            <h3>Dragon type matchup at a glance</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Question</th>
                  <th className="py-2">Answer for a pure Dragon defender or attacker</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Dragon&apos;s weaknesses</td><td className="py-2">Ice, Dragon, Fairy</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon&apos;s resistances</td><td className="py-2">Fire, Water, Electric, Grass</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon&apos;s immunities</td><td className="py-2">None from the Dragon type alone</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon attacks are strong against</td><td className="py-2">Dragon</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon attacks are resisted by</td><td className="py-2">Steel</td></tr>
                <tr><td className="py-2 pr-4">Dragon attacks do not affect</td><td className="py-2">Fairy</td></tr>
              </tbody>
            </table>
            <p>
              These are the standard main-series type interactions. A second type can add, remove, or multiply the result,
              so the grouped list below matters more than the single word &quot;Dragon.&quot;
            </p>

            <h3>Featured Dragon Pokemon by typing</h3>
            <p>
              Dragon Pokemon are not all weak to the same moves. The second type is the part that makes each Dragon
              matchup different, so read the row before you pick a counter.
            </p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Typing</th>
                  <th className="py-2 pr-4">Featured Pokemon</th>
                  <th className="py-2">What the second type changes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Flying</td><td className="py-2 pr-4">Dragonite, Salamence, Rayquaza</td><td className="py-2">Adds Flying&apos;s matchup rules, including a strong concern about Ice attacks.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Ground</td><td className="py-2 pr-4">Garchomp</td><td className="py-2">Adds Ground&apos;s Electric immunity while keeping the Dragon identity.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Ghost</td><td className="py-2 pr-4">Dragapult, Giratina</td><td className="py-2">Adds Ghost interactions and gives the pair a different defensive profile.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Dark</td><td className="py-2 pr-4">Hydreigon</td><td className="py-2">Adds Dark&apos;s Psychic immunity and changes how the pair handles several attacks.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Water</td><td className="py-2 pr-4">Dracovish, Palkia</td><td className="py-2">Adds Water&apos;s resistance profile and makes the combination less like a pure Dragon.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Steel</td><td className="py-2 pr-4">Dialga</td><td className="py-2">Steel changes the defensive profile substantially and resists Dragon attacks.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Poison</td><td className="py-2 pr-4">Eternatus</td><td className="py-2">Poison adds its own matchup rules and a different set of resistances.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dragon / Fighting</td><td className="py-2 pr-4">Koraidon</td><td className="py-2">Fighting adds offensive pressure against Normal, Ice, Rock, Dark, and Steel targets.</td></tr>
                <tr><td className="py-2 pr-4">Dragon / Electric</td><td className="py-2 pr-4">Miraidon, Raging Bolt</td><td className="py-2">Electric gives the pair an Electric identity and a useful Flying matchup.</td></tr>
              </tbody>
            </table>

            <h3>Why Fairy is the best Dragon counter</h3>
            <p>
              Fairy is <strong>immune</strong> to Dragon moves. A Garchomp locked into Outrage does literally 0 damage to
              any Fairy type, and Fairy hits back for 2×. The most common Fairy answers to Dragon are:
            </p>
            <ul>
              <li><strong>Sylveon</strong> — Pixilate Hyper Voice destroys Dragons, and 130 base SpDef tanks Dragon Pulse.</li>
              <li><strong>Clefable</strong> — Magic Guard plus Unaware ignores Dragon Dance boosts, and Moonblast OHKOs most Dragons.</li>
              <li><strong>Gardevoir</strong> — Fairy/Psychic with Moonblast and Psychic coverage.</li>
              <li><strong>Togekiss</strong> — Air Slash flinch plus Dazzling Gleam, with Serene Grace making it annoying.</li>
              <li><strong>Magearna</strong> — Steel/Fairy resists Dragon <em>and</em> is immune to it, while Fleur Cannon hits hard.</li>
            </ul>

            <h3>Why Ice moves are essential</h3>
            <p>
              You do not need an Ice-type Pokemon — you just need Ice-type moves. Many Water types learn Ice Beam, which
              makes them excellent Dragon checks:
            </p>
            <ul>
              <li><strong>Ice Beam on Blastoise or Swampert</strong> — surprise KO on Garchomp and Dragonite.</li>
              <li><strong>Ice Shard on Mamoswine</strong> — priority that picks off weakened Dragons.</li>
              <li><strong>Freeze-Dry on Lapras</strong> — hits Water/Dragon types such as Palkia and Kingdra super effectively.</li>
              <li><strong>Ice Punch on Weavile</strong> — one of the fastest Ice attackers, revenge killing most Dragons.</li>
            </ul>
            <h4>The 4× Ice weakness club</h4>
            <p>Some Dragon Pokemon take <strong>4× damage</strong> from Ice:</p>
            <ul>
              <li><strong>Garchomp</strong> (Dragon/Ground) — Ice Beam is an instant KO.</li>
              <li><strong>Dragonite</strong> (Dragon/Flying) — Ice Shard can OHKO.</li>
              <li><strong>Rayquaza</strong> (Dragon/Flying) — the most extreme case.</li>
              <li><strong>Salamence</strong> (Dragon/Flying) — same as Dragonite.</li>
              <li><strong>Landorus</strong> (Ground/Flying) — not a Dragon, but the same 4× Ice weakness.</li>
            </ul>
            <p>If you see any of these on the opponent&apos;s team, bring Ice coverage.</p>

            <h3>Dragon versus Dragon</h3>
            <p>
              Using Dragon moves against Dragons works, but you also take super effective damage back. The Dragon
              Pokemon most often used to beat other Dragons are <strong>Dragapult</strong> (Dragon/Ghost, 142 base Speed
              with Dragon Darts and Shadow Ball), <strong>Garchomp</strong> (Outrage hits hard, but getting locked in is
              dangerous against a Fairy switch), and <strong>Kyurem-Black</strong> (170 base Attack with Fusion Bolt and
              Dragon Claw covering almost everything).
            </p>

            <h3>Countering specific Dragons</h3>
            <ul>
              <li><strong>Garchomp</strong> — any Fairy type is immune to Outrage and Dragon Claw, and Ice Beam from any Water type OHKOs the 4× weakness. Watch out for Swords Dance plus Scale Shot and Stone Edge for Ice types. <Link href="/pokemon/garchomp">Full Garchomp guide</Link></li>
              <li><strong>Dragonite</strong> — Ice Shard from Mamoswine or Weavile hits the 4× weakness and bypasses Multiscale once there is prior damage, and Stealth Rock strips Multiscale on switch-in. Fairy types wall it completely. Watch out for Dragon Dance plus Extreme Speed priority. <Link href="/pokemon/dragonite">Full Dragonite guide</Link></li>
              <li><strong>Dragapult</strong> — Dark types such as Tyranitar and Greninja resist the Ghost STAB, and Fairy types are immune to Dragon. Watch out for 142 base Speed, mixed attacking stats, and U-turn pivoting. <Link href="/pokemon/dragapult">Full Dragapult guide</Link></li>
              <li><strong>Salamence</strong> — Ice moves hit the 4× weakness and Fairy types wall it, while Stealth Rock chips 25% on every switch. Watch out for Dragon Dance plus Moxie snowballing and Mega Salamence&apos;s Aerilate. <Link href="/pokemon/salamence">Full Salamence guide</Link></li>
            </ul>

            <h3>Best anti-Dragon team core</h3>
            <p>Build with at least two of these three pieces to handle Dragon Pokemon:</p>
            <ol>
              <li><strong>Fairy type</strong> (Sylveon, Clefable, or Magearna) — the primary Dragon check.</li>
              <li><strong>Ice coverage</strong> (Ice Beam on a Water type) — the backup for 4× weak Dragons.</li>
              <li><strong>Steel type</strong> (Ferrothorn, Corviknight) — resists Dragon and provides hazards.</li>
            </ol>
            <p>
              A practical core is <strong>Clefable</strong> (Unaware walls Dragon Dance sweepers), <strong>Swampert</strong>
              (Ice Beam for Garchomp, resists Rock), and <strong>Ferrothorn</strong> (Stealth Rock plus Leech Seed, resists Dragon).
            </p>

            <h3>Dragon type in Pokemon GO</h3>
            <p>In Pokemon GO raids, Dragon types are best countered by:</p>
            <ol>
              <li><strong>Mega Gardevoir</strong> — Charm plus Dazzling Gleam (Fairy).</li>
              <li><strong>Shadow Mamoswine</strong> — Powder Snow plus Avalanche (Ice).</li>
              <li><strong>Mega Rayquaza</strong> — Dragon Tail plus Outrage (Dragon versus Dragon).</li>
              <li><strong>Shadow Dragonite</strong> — Dragon Tail plus Outrage.</li>
              <li><strong>Galarian Darmanitan</strong> — Ice Fang plus Avalanche.</li>
            </ol>
            <p>
              For GO Battle League PvP: <strong>Togekiss</strong> dominates Dragon types in Master League,
              <strong>Azumarill</strong> (Water/Fairy) walls Dragons in Great League, and <strong>Alolan Ninetales</strong>
              (Ice/Fairy) double-counters Dragons.
            </p>

            <h3>Key takeaways for 2026</h3>
            <ol>
              <li><strong>Always carry Ice coverage</strong> — Ice Beam on a Water type costs nothing and handles most Dragons.</li>
              <li><strong>Fairy types are mandatory</strong> — at least one Fairy on every competitive team.</li>
              <li><strong>Stealth Rock matters</strong> — 25% chip on Dragonite, Salamence, and Charizard on every switch.</li>
              <li><strong>Do not rely on Dragon versus Dragon</strong> — it is a coin flip, and Fairy is safer.</li>
              <li><strong>Scout for coverage moves</strong> — good Dragon players carry Poison Jab or Iron Head for Fairies.</li>
            </ol>

            <h3>The three checks before using a Dragon counter</h3>
            <ol>
              <li><strong>Check the second type.</strong> Start with the row in the table, not the word &quot;Dragon.&quot; Dragon/Flying, Dragon/Ground, and Dragon/Steel do not share a defensive profile — the second type can create an immunity or add a new weakness.</li>
              <li><strong>Check whether the move is really Ice, Dragon, or Fairy.</strong> The displayed type of the move matters more than the species name; if it is not one of those three, check the full chart instead of assuming super-effective damage.</li>
              <li><strong>Check the exact combination in the calculator.</strong> Open the <Link href="/calculator">type calculator</Link>, select the defending Pokemon&apos;s two types, then compare the attacking type. This catches cases where two multipliers combine into something different from the pure Dragon row.</li>
            </ol>

            <h3>Dragon type chart takeaway</h3>
            <p>
              Dragon is strong against Dragon but cannot hit Fairy at all, while pure Dragon defenders are weak to Ice,
              Dragon, and Fairy. The second type is the part that makes each Dragon matchup different. Use the grouped
              list above to identify the pairing, then verify the exact multiplier before building a team or choosing a counter.
            </p>
          </article>
        )}

        {typeId === 'ice' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>The Ice-type question players keep asking</h2>
            <p>A recurring player question is why Ice feels excellent on offense but fragile on defense.</p>
            <h3>Why an Ice move is often better than an Ice Pokémon</h3>
            <p>Ice moves are super effective against Flying, Ground, Grass, and Dragon. A non-Ice Pokémon can carry that coverage while avoiding the pure Ice defender&apos;s weaknesses to Fire, Fighting, Rock, and Steel.</p>
            <h3>Where the chart surprises players</h3>
            <ul>
              <li>Dragon/Flying takes 2× × 2× = 4× from Ice.</li>
              <li>Ground/Flying takes 2× × 2× = 4× from Ice.</li>
              <li>Grass/Flying takes 2× × 2× = 4× from Ice.</li>
              <li>Pure Ice resists only Ice, so an Ice label does not make a safe defensive switch.</li>
            </ul>
          </article>
        )}

        {typeId === 'bug' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Bug matchups, one generation at a time</h2>
            <p>Reading an older Bug chart without its generation label can produce a wrong answer because some rows belong to types that did not exist yet.</p>
            <ol>
              <li><strong>Generation I:</strong> Bug is super effective against Grass and Psychic; Dark, Steel, and Fairy are not rows in this generation&apos;s chart.</li>
              <li><strong>Generation II:</strong> Dark and Steel arrive. Bug gains Dark as an offensive target, while Steel resists Bug.</li>
              <li><strong>Generation VI:</strong> Fairy arrives and resists Bug, adding a modern defensive answer that older charts cannot show.</li>
              <li><strong>Generations VII–IX:</strong> The 18-type baseline remains, while battle mechanics such as regional forms and Terastallization can change the practical matchup without changing the base Bug row.</li>
            </ol>
            <p>Use the generation label first, then read the Bug multiplier; the same move can be evaluated against a different type roster in an older game.</p>
          </article>
        )}

        {typeId === 'electric' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Electric matchups across chart revisions</h2>
            <p>The chart has changed around Electric without changing its central Ground interaction.</p>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Era</th><th className="py-2">Electric-specific reading</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Generation I</td><td className="py-2">Electric is super effective against Water and Flying, resisted by Electric and Grass, and blocked by Ground; Steel and Fairy do not exist yet.</td></tr>
                <tr className="border-b"><td className="py-2">Generations II–V</td><td className="py-2">Steel is present as a neutral Electric target, while Ground remains the immunity.</td></tr>
                <tr className="border-b"><td className="py-2">Generations VI–IX</td><td className="py-2">Fairy is present, but Electric remains neutral into it; Ground remains the defensive answer.</td></tr>
              </tbody>
            </table>
            <p>The stable answer is not “Electric is always safe”: Ground remains an immunity to Electric attacks, while abilities such as Levitate can change a Pokémon&apos;s practical result without changing the base type table.</p>
          </article>
        )}

        {typeId === 'normal' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Normal dual-type checks</h2>
            <p>Normal is often the neutral half of a dual typing, so the second type decides whether a move stays neutral or becomes a weakness.</p>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Defender</th><th className="py-2">Attacking type</th><th className="py-2">Factor one</th><th className="py-2">Factor two</th><th className="py-2">Result</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Staraptor (Normal/Flying)</td><td className="py-2">Electric</td><td className="py-2">1×</td><td className="py-2">2×</td><td className="py-2">2×</td></tr>
                <tr className="border-b"><td className="py-2">Bibarel (Normal/Water)</td><td className="py-2">Grass</td><td className="py-2">1×</td><td className="py-2">2×</td><td className="py-2">2×</td></tr>
                <tr><td className="py-2">Heliolisk (Electric/Normal)</td><td className="py-2">Ground</td><td className="py-2">2×</td><td className="py-2">1×</td><td className="py-2">2×</td></tr>
              </tbody>
            </table>
            <p>The Normal factor is neutral in all three examples; the partner type supplies the weakness.</p>
          </article>
        )}

        {typeId === 'fire' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Questions players ask when a Fire switch goes wrong</h2>
            <p>Players often ask why a Fire Pokémon that resists one move still feels unsafe on the next turn.</p>
            <ul>
              <li>Why does a Fire switch into Grass not guarantee safety? The opponent may carry Ground or Rock coverage, so the resisted move is only one part of the turn.</li>
              <li>Why does Fire struggle with entry hazards? Rock pressure punishes repeated switching before the type chart is even used for the next attack.</li>
              <li>Why does a Fire attacker need a second move type? Water, Rock, Dragon, and Fire all resist Fire attacks in the standard chart.</li>
            </ul>
            <p>These questions separate a one-turn resistance from a complete defensive plan.</p>
          </article>
        )}

        {typeId === 'water' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Water type changes, generation by generation</h2>
            <p>Water has kept its familiar chart role, but the generation around that role changed what a Water move or Water Pokémon meant.</p>
            <ol>
              <li><strong>Generation I:</strong> Water attacks were part of the original chart, and Water had no ability-based exceptions.</li>
              <li><strong>Generation II:</strong> Dark and Steel entered the chart, while the special category still controlled Water attacks such as Surf and Hydro Pump.</li>
              <li><strong>Generation III:</strong> Abilities introduced matchup exceptions such as Water Absorb, so a Water immunity could belong to an ability rather than a type.</li>
              <li><strong>Generation IV:</strong> The physical/special split made moves such as Waterfall physical while Surf remained special, without changing Water&apos;s type effectiveness row.</li>
              <li><strong>Generation VI onward:</strong> Fairy joined the chart as a neutral Water target, while abilities and regional forms continued to change practical answers.</li>
            </ol>
            <p>Reading a Water matchup therefore requires both the generation and the move category, not only the Water label.</p>
          </article>
        )}

        {typeId === 'grass' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Grass dual-type checks</h2>
            <p>Grass is a useful second type to inspect because a partner can amplify a weakness or leave the attack neutral.</p>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Defender</th><th className="py-2">Attacking type</th><th className="py-2">Factor one</th><th className="py-2">Factor two</th><th className="py-2">Result</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Ferrothorn (Grass/Steel)</td><td className="py-2">Fire</td><td className="py-2">2×</td><td className="py-2">2×</td><td className="py-2">4×</td></tr>
                <tr className="border-b"><td className="py-2">Cradily (Grass/Rock)</td><td className="py-2">Ice</td><td className="py-2">2×</td><td className="py-2">1×</td><td className="py-2">2×</td></tr>
                <tr><td className="py-2">Ludicolo (Grass/Water)</td><td className="py-2">Bug</td><td className="py-2">2×</td><td className="py-2">1×</td><td className="py-2">2×</td></tr>
              </tbody>
            </table>
            <p>Ferrothorn is the only 4× example here because both Grass and Steel are weak to Fire in the site chart.</p>
          </article>
        )}

        {typeId === 'fighting' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Questions players ask about Fighting coverage</h2>
            <p>A recurring player question is why a Fighting move that threatens five types can still miss the target that matters.</p>
            <ul>
              <li>Why does Fighting fail against Ghost? Ghost is a complete immunity, so more Fighting power does not change the result.</li>
              <li>Why do Fighting attackers fear Fairy and Flying switch-ins? Both types resist Fighting, and neither is merely a small damage reduction in a practical team turn.</li>
              <li>Why is Fighting coverage still valuable? It pressures Normal, Ice, Rock, Dark, and Steel, so one move can target several common defensive structures.</li>
            </ul>
            <p>The useful question is not only what Fighting hits for 2×; it is which immunity or resistance the opponent can bring next.</p>
          </article>
        )}

        {typeId === 'ground' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Ground matchup changes across generations</h2>
            <p>Ground&apos;s type-row answers stayed recognizable while later generations added ways to bypass or restore its immunity.</p>
            <ol>
              <li><strong>Generation I:</strong> Ground attacks were blocked by Flying and were super effective against Fire, Electric, Poison, Rock, and the original chart&apos;s other listed targets.</li>
              <li><strong>Generation II:</strong> Steel was added as a type that Ground attacks hit super effectively, giving Ground a new high-value target.</li>
              <li><strong>Generation III:</strong> Levitate introduced an ability-based Ground immunity that is separate from the Flying type.</li>
              <li><strong>Generation IV:</strong> Magnet Rise allowed a non-Flying Pokémon to become immune to Ground temporarily, while the physical/special split changed how Ground moves were assigned.</li>
              <li><strong>Generation V onward:</strong> items, moves, and abilities continued to create grounded and ungrounded states without changing the base Ground row.</li>
            </ol>
            <p>That history explains why a Ground calculation needs the type chart plus the active ability, item, or field state.</p>
          </article>
        )}

        {typeId === 'flying' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Flying dual-type checks</h2>
            <p>Flying often turns a second weakness into a 4× result, but a partner can also cancel part of the Electric or Rock pressure.</p>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Defender</th><th className="py-2">Attacking type</th><th className="py-2">Factor one</th><th className="py-2">Factor two</th><th className="py-2">Result</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Charizard (Fire/Flying)</td><td className="py-2">Rock</td><td className="py-2">2×</td><td className="py-2">2×</td><td className="py-2">4×</td></tr>
                <tr className="border-b"><td className="py-2">Gliscor (Ground/Flying)</td><td className="py-2">Ice</td><td className="py-2">2×</td><td className="py-2">2×</td><td className="py-2">4×</td></tr>
                <tr><td className="py-2">Skarmory (Steel/Flying)</td><td className="py-2">Electric</td><td className="py-2">1×</td><td className="py-2">2×</td><td className="py-2">2×</td></tr>
              </tbody>
            </table>
            <p>Skarmory shows why the two factors must be multiplied: Electric is neutral against Steel, while Flying is weak to Electric, so the combined result is 2×.</p>
          </article>
        )}

        {typeId === 'psychic' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Questions players ask about Psychic matchups</h2>
            <p>Players often ask why Psychic feels powerful into Poison and Fighting but suddenly stops working against one switch.</p>
            <ul>
              <li>Why does Dark blank Psychic completely? Dark is an immunity in the base chart, not a resistance that stronger Psychic moves can overcome.</li>
              <li>Why do Bug and Ghost moves matter so much against Psychic teams? Psychic defenders are weak to Bug, Ghost, and Dark, so those attack categories pressure the same role from different directions.</li>
              <li>Why can Steel stay in on Psychic attacks? Steel resists Psychic, which turns a clean offensive answer into a prediction problem.</li>
            </ul>
            <p>The player-facing answer is to identify the opponent&apos;s immunity first, then identify the coverage move that punishes that switch.</p>
          </article>
        )}

        {typeId === 'rock' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Rock type changes, generation by generation</h2>
            <p>Rock has kept its familiar offensive targets, while later generations changed its defensive context and move categories.</p>
            <ol>
              <li><strong>Generation I:</strong> Rock attacks were super effective against Fire, Ice, Flying, and Bug, while the chart had no Dark, Steel, or Fairy row.</li>
              <li><strong>Generation II:</strong> Steel and Dark entered the chart, and Sandstorm introduced a weather interaction that Rock Pokémon ignore.</li>
              <li><strong>Generation IV:</strong> The physical/special split made Rock moves such as Stone Edge physical while type effectiveness stayed separate from move category.</li>
              <li><strong>Generation VI:</strong> Fairy joined the chart, adding a new neutral target for Rock while reshaping several surrounding matchup decisions.</li>
              <li><strong>Generation IX:</strong> Terastallization can replace the active defensive type, so a Rock calculation may describe the base form rather than the battle state.</li>
            </ol>
            <p>Rock&apos;s chart answer and Rock&apos;s practical battle answer are not always the same generation-specific question.</p>
          </article>
        )}

        {typeId === 'dark' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Dark dual-type checks</h2>
            <p>Dark pairings are especially sensitive to Fighting, Bug, and Fairy because the partner type can stack the same weakness.</p>
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b"><th className="py-2">Defender</th><th className="py-2">Attacking type</th><th className="py-2">Factor one</th><th className="py-2">Factor two</th><th className="py-2">Result</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Tyranitar (Rock/Dark)</td><td className="py-2">Fighting</td><td className="py-2">2×</td><td className="py-2">2×</td><td className="py-2">4×</td></tr>
                <tr className="border-b"><td className="py-2">Hydreigon (Dark/Dragon)</td><td className="py-2">Fairy</td><td className="py-2">2×</td><td className="py-2">2×</td><td className="py-2">4×</td></tr>
                <tr><td className="py-2">Mandibuzz (Dark/Flying)</td><td className="py-2">Bug</td><td className="py-2">2×</td><td className="py-2">0.5×</td><td className="py-2">1×</td></tr>
              </tbody>
            </table>
            <p>Each 4× result comes from two separate 2× entries in the site chart; neither factor is inferred from the species name.</p>
          </article>
        )}

        {typeId === 'steel' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Questions players ask about Steel&apos;s resistances</h2>
            <p>A recurring player question is whether Steel&apos;s many resistances make every Steel switch automatically safe.</p>
            <ul>
              <li>Why does Steel still lose to Fire, Fighting, and Ground? The resistance count does not remove those three weaknesses from the base chart.</li>
              <li>Why do older players remember Steel resisting Dark and Ghost? Those matchups changed when the modern chart was revised in Generation VI.</li>
              <li>Why can a Steel Pokémon still be pressured by a neutral attack? A resistance is only one chart factor; power, coverage, hazards, and recovery decide the actual turn.</li>
            </ul>
            <p>The discussion is about the tradeoff between Steel&apos;s broad resistance profile and its concentrated weaknesses, not about counting resistances alone.</p>
          </article>
        )}

        {typeId === 'fairy' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Fairy type changes, generation by generation</h2>
            <p>Fairy is the clearest example of a modern type changing how older matchups must be read.</p>
            <ol>
              <li><strong>Generations I–V:</strong> Fairy did not exist, so Dragon had no Fairy immunity to account for.</li>
              <li><strong>Generation VI:</strong> Fairy was introduced as a new type; it became super effective against Dragon, Dark, and Fighting and immune to Dragon.</li>
              <li><strong>Generation VI revisions:</strong> Several existing Pokémon gained Fairy as a secondary or replacement type, so historical species comparisons need the generation label.</li>
              <li><strong>Generation IX:</strong> Terastallization allows a Pokémon to become Fairy temporarily, separating the base species typing from the active battle typing.</li>
            </ol>
            <p>A pre-Generation VI chart cannot answer a Fairy matchup because the defending type did not exist in that chart.</p>
          </article>
        )}

        {typeId === 'normal' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Normal type at a glance</h2>
            <p>
              <strong>Direct answer:</strong> Normal-type moves are super effective against nothing, not very effective (0.5×) against Rock and Steel,
              and do nothing (0×) to Ghost. A Normal Pokémon is weak (2×) only to Fighting, resists nothing, and is immune to Ghost.
            </p>

            <h3>What Normal hits (offensive matchups)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Result</th>
                  <th className="py-2">Types Normal is…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 text-green-700 font-semibold">Super effective (2×)</td><td className="py-2">none</td></tr>
                <tr className="border-b"><td className="py-2 text-red-700 font-semibold">Not very effective (0.5×)</td><td className="py-2">Rock, Steel</td></tr>
                <tr><td className="py-2 text-gray-700 font-semibold">No effect (0×)</td><td className="py-2">Ghost</td></tr>
              </tbody>
            </table>

            <h3>What hits Normal (defensive matchups)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Result</th>
                  <th className="py-2">Types that are…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 text-red-700 font-semibold">Super effective vs Normal (2×)</td><td className="py-2">Fighting</td></tr>
                <tr className="border-b"><td className="py-2 text-green-700 font-semibold">Resist Normal (0.5×)</td><td className="py-2">none</td></tr>
                <tr><td className="py-2 text-gray-700 font-semibold">Immune to Normal (0×)</td><td className="py-2">Ghost</td></tr>
              </tbody>
            </table>

            <h3>What Normal players most often get wrong</h3>
            <ul>
              <li><strong>"Normal has zero super-effective matchups."</strong> Normal hits nothing for 2× — it is the only type with no offensive 2× targets. People expect a "basic" type to at least hit something hard.</li>
              <li><strong>"Normal and Ghost are mutually immune."</strong> Normal moves do 0× to Ghost, and Ghost moves do 0× to Normal — both directions. A veteran who has been playing since Red and Blue admitted there are "still some moments I forget match ups." People remember one direction, forget the other.</li>
              <li><strong>"Normal is weak only to Fighting and resists nothing."</strong> Exactly one weakness (Fighting) and zero resistances — unique among types. People over-estimate how "safe" or "broad" Normal is.</li>
            </ul>
          </article>
        )}

        {/* Offensive Matchups */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Offensive Matchups</h2>
          <p className="text-gray-600 mb-4">
            When using {type.name}-type moves:
          </p>

          {offensive.superEffective.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 mb-2">Super Effective Against (2×):</h3>
              <div className="flex flex-wrap gap-2">
                {offensive.superEffective.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {offensive.notVeryEffective.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-700 mb-2">Not Very Effective Against (0.5×):</h3>
              <div className="flex flex-wrap gap-2">
                {offensive.notVeryEffective.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {offensive.noEffect.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">No Effect Against (0×):</h3>
              <div className="flex flex-wrap gap-2">
                {offensive.noEffect.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Defensive Matchups */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Defensive Matchups</h2>
          <p className="text-gray-600 mb-4">
            When defending as a {type.name}-type:
          </p>

          {defensive.weakTo.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-700 mb-2">Weak To (2× damage):</h3>
              <div className="flex flex-wrap gap-2">
                {defensive.weakTo.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {defensive.resistsTo.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 mb-2">Resists (0.5× damage):</h3>
              <div className="flex flex-wrap gap-2">
                {defensive.resistsTo.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {defensive.immuneTo.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Immune To (0× damage):</h3>
              <div className="flex flex-wrap gap-2">
                {defensive.immuneTo.map(t => (
                  <Link key={t} href={`/types/${t}`}>
                    <TypeBadge typeId={t as TypeId} clickable />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Strategy Tips */}
        <section className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Strategy Tips</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <h3 className="font-semibold mb-1">Offensive Strategy</h3>
              <p className="text-sm">
                Use {type.name}-type moves against {offensive.superEffective.slice(0, 3).map(t =>
                  typesData.types.find(type => type.id === t)?.name
                ).join(', ')} types for maximum damage.
                {offensive.noEffect.length > 0 && ` Avoid using against ${offensive.noEffect.map(t =>
                  typesData.types.find(type => type.id === t)?.name
                ).join(', ')} types as they are immune.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Defensive Strategy</h3>
              <p className="text-sm">
                {defensive.weakTo.length > 0 ? (
                  <>Be cautious of {defensive.weakTo.slice(0, 3).map(t =>
                    typesData.types.find(type => type.id === t)?.name
                  ).join(', ')} type moves. </>
                ) : (
                  <>This type has no weaknesses! </>
                )}
                {defensive.resistsTo.length > 0 && (
                  <>Switch in against {defensive.resistsTo.slice(0, 3).map(t =>
                    typesData.types.find(type => type.id === t)?.name
                  ).join(', ')} type moves to take reduced damage.</>
                )}
              </p>
            </div>
          </div>
        </section>

        <article className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{type.name} Type Editorial Analysis</h2>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Coverage Score</h3>
              <p className="text-2xl font-bold text-blue-700">{offensiveCoverageScore}</p>
              <p className="text-sm text-gray-600">
                TypeMatchup score: super-effective targets minus resisted and immune targets.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Defensive Burden</h3>
              <p className="text-2xl font-bold text-purple-700">{defensiveBurdenScore}</p>
              <p className="text-sm text-gray-600">
                {describeRiskBand(defensiveBurdenScore)} based on weaknesses, resistances, and immunities.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Role Fit</h3>
              <p className="text-sm text-gray-700">{editorialProfile.role}</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Original TypeMatchup judgment</h3>
              <p>{editorialProfile.judgment}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team partners and coverage</h3>
              <p>{editorialProfile.partners}</p>
              <p className="mt-2">
                Data check: {type.name} attacks are resisted or blocked by {formatTypeNames([...offensive.notVeryEffective, ...offensive.noEffect])}.
                Candidate partner attack types that pressure at least one of those answers include {formatTypeNames(coveragePartners)}.
              </p>
            </section>
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best use case</h3>
              <p>{editorialProfile.scenario}</p>
              <p className="mt-2">
                On defense, {type.name} is threatened by {formatTypeNames(defensive.weakTo)}. Teammate types that can
                resist or blank at least one of those threats include {formatTypeNames(saferSwitchTypes)}.
              </p>
            </section>
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Important exception</h3>
              <p>{editorialProfile.exception}</p>
            </section>
          </div>
        </article>

        {typeId === 'flying' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-6 prose max-w-none text-gray-700">
            <h2>Flying-Type Strategy and Matchup Guide</h2>
            <p>
              Flying is defined as much by its Ground immunity as by its attacking coverage. A Flying Pokémon can stop a
              Choice-locked Earthquake, protect an Electric-weak teammate from Ground pressure, or enter while Spikes are
              on the field. It is weak to Electric, Ice, and Rock, and it resists Grass, Fighting, and Bug. Those facts
              create useful turns, but a type label does not guarantee durability: frail attackers and bulky pivots use
              the same chart very differently. Abilities, secondary typing, held items, recovery, and the battle format
              determine whether a predicted switch is actually safe.
            </p>
            <h3>Using Flying attacks</h3>
            <p>
              Flying moves are super effective against Grass, Fighting, and Bug. They are resisted by Electric, Rock, and
              Steel, so a Flying attacker should identify which of those answers is likely to enter. Ground or Fighting
              coverage can pressure some Rock and Steel targets, while a pivoting move may be better than guessing. Move
              quality also matters: Brave Bird offers power with recoil, Hurricane trades accuracy for strength and may
              interact with rain, and Air Slash provides a more controlled special option. Select the move for the role
              and expected battle length rather than assuming every Flying Pokémon wants the strongest STAB attack.
            </p>
            <h3>Defensive positioning and hazards</h3>
            <p>
              The Ground immunity is excellent for creating momentum, but Stealth Rock punishes many Flying switches.
              Pure Flying takes 2× effectiveness from Rock, so Stealth Rock removes a quarter of maximum health under
              standard rules; a secondary type can raise or lower that amount. Heavy-Duty Boots prevents hazard damage,
              while reliable removal preserves other item choices. Scout for Stone Edge, Ice coverage, Knock Off, and
              Electric pivoting moves before repeatedly entering on Ground. Roost may change type interactions for the
              turn in some generations, which can alter a predicted Electric, Ice, Rock, or Ground exchange.
            </p>
            <h3>Building around Flying Pokémon</h3>
            <p>
              Ground teammates are natural Electric answers and can pressure Rock or Steel, but they may share an Ice
              weakness with some Flying partners. Steel types resist Ice and Rock; Water or Fighting coverage can help
              remove Rock targets. In return, Flying supplies a Ground immunity and Fighting resistance that many Steel
              teammates appreciate. Check the whole defensive core rather than counting one-for-one resistances. A team
              needs an actual switch-in with enough health and recovery, hazard control when repeated pivots are planned,
              and Speed control if its Flying slot is slow.
            </p>
            <h3>How to counter Flying types</h3>
            <p>
              Electric, Ice, and Rock are the direct super-effective options, but secondary typing can cancel or amplify
              each one. Stealth Rock and item removal often create more reliable long-term progress than revealing a
              coverage move immediately. Preserve an accurate revenge-killing option for fast sweepers and deny free
              turns to defensive Defog or setup users with Taunt, status, or strong neutral pressure. Never send Ground
              attacks into a standard Flying target unless Gravity, Smack Down, an ability, Terastallization, or another
              explicit effect has removed the immunity. Confirm the current game’s rules before relying on an interaction.
            </p>
          </article>
        )}

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is {type.name} type strong against?</h3>
              <p className="text-gray-700">
                {type.name} type moves are super effective (2× damage) against {offensive.superEffective.map(t =>
                  typesData.types.find(type => type.id === t)?.name
                ).join(', ')} types.
                {offensive.superEffective.length === 0 && `${type.name} type has no super effective matchups.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is {type.name} type weak against?</h3>
              <p className="text-gray-700">
                {defensive.weakTo.length > 0 ? (
                  `${type.name} type is weak to (takes 2× damage from) ${defensive.weakTo.map(t =>
                    typesData.types.find(type => type.id === t)?.name
                  ).join(', ')} type moves.`
                ) : (
                  `${type.name} type has no weaknesses!`
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What types resist {type.name}?</h3>
              <p className="text-gray-700">
                {offensive.notVeryEffective.length > 0 ? (
                  `${offensive.notVeryEffective.map(t =>
                    typesData.types.find(type => type.id === t)?.name
                  ).join(', ')} types resist ${type.name} type moves (take 0.5× damage).`
                ) : (
                  `No types resist ${type.name} type moves.`
                )}
              </p>
            </div>
            {defensive.resistsTo.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">What does {type.name} type resist?</h3>
                <p className="text-gray-700">
                  {type.name} type resists (takes 0.5× damage from) {defensive.resistsTo.map(t =>
                    typesData.types.find(type => type.id === t)?.name
                  ).join(', ')} type moves.
                </p>
              </div>
            )}
            {(defensive.immuneTo.length > 0 || offensive.noEffect.length > 0) && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Immunities</h3>
                <p className="text-gray-700">
                  {defensive.immuneTo.length > 0 && (
                    <>{type.name} type is immune to {defensive.immuneTo.map(t =>
                      typesData.types.find(type => type.id === t)?.name
                    ).join(', ')} type moves. </>
                  )}
                  {offensive.noEffect.length > 0 && (
                    <>{type.name} type moves have no effect on {offensive.noEffect.map(t =>
                      typesData.types.find(type => type.id === t)?.name
                    ).join(', ')} types.</>
                  )}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Tools */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Explore More</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`/calculator?type1=${typeId}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Dual Type Calculator</h3>
              <p className="text-sm text-gray-600">
                See how {type.name} combines with other types
              </p>
            </Link>
            <Link
              href={`/battle-simulator?defending=${typeId}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-purple-600 mb-2">Battle Simulator</h3>
              <p className="text-sm text-gray-600">
                Test {type.name} in battle scenarios
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
