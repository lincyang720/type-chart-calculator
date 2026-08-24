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
  title: 'Pokemon Weakness Chart 2026 - Complete Type Effectiveness',
  description: 'Use the complete Pokemon weakness chart for all 18 types. Find every weakness, resistance, immunity, and Gen 9 type effectiveness matchup.',
  keywords: 'pokemon type chart, type effectiveness chart, pokemon weakness chart, type matchup chart, gen 9 type chart',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Weakness Chart 2026 - Complete Type Effectiveness',
    description: 'Find every weakness, resistance, immunity, and Gen 9 type effectiveness matchup for all 18 Pokemon types.',
    url: 'https://www.typematchup.org/pokemon/type-chart',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Type Chart 2026',
    description: 'Complete type effectiveness matrix for all 18 Pokemon types.',
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
          Pokemon Weakness Chart 2026
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Complete Gen 9 type effectiveness matrix for all 18 Pokemon types. Rows show the defending type,
          columns show the attacking type. Find every weakness, resistance, and immunity or print the chart for quick reference.
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
              Rock-type moves because both Fire and Flying are weak to Rock (2× × 2× = 4×).
            </p>
          </div>
        </section>

        <section className="mb-12 print:hidden">
          <h2 className="mb-3 text-2xl font-bold">Weaknesses by Pokemon Type</h2>
          <p className="mb-6 text-gray-700">
            Use these defensive summaries when you need a faster answer than the full matrix. Each link opens a detailed guide for that type.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TYPES.map(defendingType => {
              const weakTo = ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) === 2);
              const immuneTo = ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) === 0);

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
                  {immuneTo.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Immune to:</strong> {immuneTo.map(getTypeName).join(', ')}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

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
