import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';
import typeChart from '@/data/typeChart.json';
import defensiveTypeChart from '@/data/defensiveTypeChart.json';
import Link from 'next/link';
import {
  DualTypeContent,
  generateMetadata as generateDualTypeMetadata,
} from '@/app/combo/[combo]/page';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

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
