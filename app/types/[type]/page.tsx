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

  for (let i = 0; i < ALL_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_TYPES.length; j++) {
      params.push({ type: `${ALL_TYPES[i]}-${ALL_TYPES[j]}` });
    }
  }

  return params;
}

// Only allow pre-generated paths, return 404 for others
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type: typeParam } = await params;

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
