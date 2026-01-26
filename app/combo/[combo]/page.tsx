import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import popularCombinations from '@/data/popularCombinations.json';
import Link from 'next/link';

export async function generateStaticParams() {
  return popularCombinations.combinations.map(combo => ({
    combo: `${combo.type1}-${combo.type2}`,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ combo: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const [type1, type2] = resolvedParams.combo.split('-') as [TypeId, TypeId];

  const type1Data = typesData.types.find(t => t.id === type1);
  const type2Data = typesData.types.find(t => t.id === type2);
  const combo = popularCombinations.combinations.find(c => c.type1 === type1 && c.type2 === type2);

  if (!type1Data || !type2Data) {
    return { title: 'Type Combination Not Found' };
  }

  const weaknesses = calculateDualTypeWeaknesses(type1, type2);
  const weakList = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak].slice(0, 3).join(', ');
  const resistList = [...weaknesses.quadrupleResist, ...weaknesses.doubleResist].slice(0, 3).join(', ');

  return {
    title: `${type1Data.name}/${type2Data.name} Type Weakness Calculator - Strengths & Counters`,
    description: `Complete ${type1Data.name}/${type2Data.name} type analysis. Weak to: ${weakList}. Resists: ${resistList}. ${combo?.examples ? `Pokemon: ${combo.examples.slice(0, 2).join(', ')}.` : ''} Full matchup guide.`,
    keywords: `${type1} ${type2} weakness, ${type1} ${type2} type, ${type1Data.name} ${type2Data.name} weakness, ${type1} ${type2} resistances, ${type1} ${type2} counters, dual type calculator`,
    openGraph: {
      title: `${type1Data.name}/${type2Data.name} Type - Weaknesses & Resistances`,
      description: `Weak to: ${weakList}. Resists: ${resistList}.`,
      url: `https://www.typematchup.org/combo/${type1}-${type2}`,
      type: 'website',
    },
    alternates: {
      canonical: `/combo/${type1}-${type2}`,
    },
  };
}

export default async function DualTypePage({ params }: { params: Promise<{ combo: string }> }) {
  const resolvedParams = await params;
  const [type1, type2] = resolvedParams.combo.split('-') as [TypeId, TypeId];

  const type1Data = typesData.types.find(t => t.id === type1);
  const type2Data = typesData.types.find(t => t.id === type2);
  const combo = popularCombinations.combinations.find(c => c.type1 === type1 && c.type2 === type2);

  if (!type1Data || !type2Data) {
    notFound();
  }

  const weaknesses = calculateDualTypeWeaknesses(type1, type2);

  const renderTypeList = (types: TypeId[], label: string, multiplier: string, bgColor: string) => {
    if (types.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-3 ${bgColor} text-white px-4 py-2 rounded-lg`}>
          {label} ({multiplier})
        </h3>
        <div className="flex flex-wrap gap-2">
          {types.map(typeId => (
            <Link key={typeId} href={`/types/${typeId}`}>
              <TypeBadge typeId={typeId} size="lg" clickable />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {type1Data.name}/{type2Data.name} Type
          </span>
        </h1>
        <div className="flex justify-center gap-3 mb-4">
          <TypeBadge typeId={type1} size="lg" />
          <TypeBadge typeId={type2} size="lg" />
        </div>

        {combo && combo.examples && (
          <p className="text-lg text-gray-600">
            <strong>Popular Pokemon:</strong> {combo.examples.join(', ')}
          </p>
        )}
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold mb-4">Quick Summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-red-600 mb-2">⚠️ Main Weaknesses:</h3>
            <p className="text-gray-700">
              {weaknesses.quadrupleWeak.length > 0 && (
                <span className="font-bold text-red-700">
                  4× weak to {weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
              {weaknesses.quadrupleWeak.length > 0 && weaknesses.doubleWeak.length > 0 && <br />}
              {weaknesses.doubleWeak.length > 0 && (
                <span>
                  2× weak to {weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-green-600 mb-2">✓ Main Resistances:</h3>
            <p className="text-gray-700">
              {weaknesses.quadrupleResist.length > 0 && (
                <span className="font-bold text-green-700">
                  ¼× resists {weaknesses.quadrupleResist.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
              {weaknesses.quadrupleResist.length > 0 && weaknesses.doubleResist.length > 0 && <br />}
              {weaknesses.doubleResist.length > 0 && (
                <span>
                  ½× resists {weaknesses.doubleResist.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Matchups */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6">Defensive Type Matchups</h2>

        {renderTypeList(weaknesses.quadrupleWeak, 'Quadruple Weak', '4×', 'bg-red-700')}
        {renderTypeList(weaknesses.doubleWeak, 'Weak', '2×', 'bg-red-500')}
        {renderTypeList(weaknesses.doubleResist, 'Resistant', '½×', 'bg-green-500')}
        {renderTypeList(weaknesses.quadrupleResist, 'Double Resistant', '¼×', 'bg-green-700')}
        {renderTypeList(weaknesses.immune, 'Immune', '0×', 'bg-gray-600')}

        {weaknesses.normal.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 bg-gray-100 rounded">
              Show Normal Effectiveness Types ({weaknesses.normal.length})
            </summary>
            <div className="mt-3 flex flex-wrap gap-2 px-4">
              {weaknesses.normal.map(typeId => (
                <Link key={typeId} href={`/types/${typeId}`}>
                  <TypeBadge typeId={typeId} size="sm" clickable />
                </Link>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Strategy Tips */}
      {combo && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">Strategy Tips</h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Why This Combination?</h3>
            <p className="text-gray-700 mb-4">{combo.reason}</p>

            <h3 className="text-xl font-semibold mb-2">Best Counters</h3>
            <p className="text-gray-700">
              To counter {type1Data.name}/{type2Data.name} types, use Pokemon with{' '}
              {weaknesses.quadrupleWeak.length > 0 ? (
                <strong>{weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(' or ')} moves for 4× damage</strong>
              ) : weaknesses.doubleWeak.length > 0 ? (
                <strong>{weaknesses.doubleWeak.slice(0, 2).map(t => typesData.types.find(td => td.id === t)?.name).join(' or ')} moves for 2× damage</strong>
              ) : (
                'neutral coverage moves'
              )}.
            </p>
          </div>
        </div>
      )}

      {/* Tools */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Try Our Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/calculator" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
            Dual Type Calculator
          </Link>
          <Link href="/battle-simulator" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center">
            Battle Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
