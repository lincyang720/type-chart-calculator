import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';
import typeChart from '@/data/typeChart.json';
import defensiveTypeChart from '@/data/defensiveTypeChart.json';
import Link from 'next/link';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export async function generateStaticParams() {
  return ALL_TYPES.map(type => ({
    type: type,
  }));
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const typeId = params.type as TypeId;
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
    description: `Complete ${type.name} type analysis: super effective against ${offensive.superEffective.slice(0, 3).join(', ')}. Weak to ${defensive.weakTo.slice(0, 3).join(', ')}. Full matchup guide and strategy tips.`,
    keywords: `${type.name} type, ${type.name} weakness, ${type.name} strength, ${type.name} matchup, ${type.name} type chart`,
    openGraph: {
      title: `${type.name} Type Chart`,
      description: `Complete ${type.name} type matchup guide`,
    },
  };
}

export default function TypePage({ params }: { params: { type: string } }) {
  const typeId = params.type as TypeId;
  const type = typesData.types.find(t => t.id === typeId);

  if (!type || !ALL_TYPES.includes(typeId)) {
    notFound();
  }

  const defensive = defensiveTypeChart[typeId];
  const offensive = typeChart[typeId];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/types" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to All Types
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <TypeBadge typeId={typeId} size="lg" />
            <h1 className="text-4xl font-bold">{type.name} Type</h1>
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
                    <TypeBadge typeId={t} clickable />
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
                    <TypeBadge typeId={t} clickable />
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
                    <TypeBadge typeId={t} clickable />
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
                    <TypeBadge typeId={t} clickable />
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
                    <TypeBadge typeId={t} clickable />
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
                    <TypeBadge typeId={t} clickable />
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
