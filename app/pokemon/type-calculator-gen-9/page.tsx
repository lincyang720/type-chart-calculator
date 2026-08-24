import type { Metadata } from 'next';
import Link from 'next/link';
import DualTypeCalculator from '@/components/DualTypeCalculator';
import JsonLd, { BreadcrumbSchema } from '@/components/SEO/JsonLd';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pokemon Type Calculator Gen 9 - Scarlet and Violet Matchups',
  description: 'Use the Gen 9 Pokemon type calculator for Scarlet and Violet. Check single and dual-type weaknesses, resistances, immunities, and 4x matchups.',
  keywords: 'pokemon type calculator gen 9, scarlet violet type calculator, gen 9 type chart, pokemon weakness calculator',
  alternates: { canonical: '/pokemon/type-calculator-gen-9' },
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Type Calculator Gen 9',
    description: 'Calculate Scarlet and Violet type weaknesses, resistances, immunities, and dual-type matchups.',
    url: `${SITE_URL}/pokemon/type-calculator-gen-9`,
    type: 'website',
  },
};

const faqItems = [
  { question: 'Is this calculator updated for Pokemon Scarlet and Violet?', answer: 'Yes. It uses the current 18-type effectiveness system used in Generation 9 games.' },
  { question: 'Does Terastallization change the calculation?', answer: 'After Terastallization, use the Pokemon current defensive Tera type for standard defensive matchups. Offensive Tera and STAB rules are separate from this weakness calculator.' },
  { question: 'Does this include abilities?', answer: 'This calculator shows standard type effectiveness. Use the linked abilities calculator for defensive abilities such as Levitate, Flash Fire, and Thick Fat.' },
];

export default function Gen9TypeCalculatorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Gen 9 Type Calculator', url: `${SITE_URL}/pokemon/type-calculator-gen-9` },
      ]} />
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl">Pokemon Type Calculator Gen 9</h1>
        <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-gray-600">
          Calculate weaknesses, resistances, immunities, and 4x damage for Scarlet and Violet single or dual-type Pokemon.
        </p>
        <DualTypeCalculator />

        <section className="mt-12 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-2xl font-bold">Generation 9 Type Effectiveness</h2>
          <div className="space-y-4 text-gray-700">
            <p>Generation 9 keeps the same 18-type matchup system introduced after Fairy type was added. Standard weaknesses and resistances therefore match the modern chart used by Pokemon Scarlet and Violet.</p>
            <p>Dual-type multipliers stack. Two weaknesses create 4x damage, two resistances create 0.25x damage, and an immunity reduces type damage to zero.</p>
            <p>Terastallization can replace a Pokemon&apos;s defensive typing with its Tera type. Select that current defensive type here when checking incoming damage after Terastallization.</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Related Gen 9 Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/pokemon/type-chart" className="rounded-lg border border-gray-200 bg-white p-4 font-semibold text-blue-700 shadow-sm hover:bg-blue-50">Complete Gen 9 weakness chart</Link>
            <Link href="/pokemon/type-chart-with-abilities" className="rounded-lg border border-gray-200 bg-white p-4 font-semibold text-blue-700 shadow-sm hover:bg-blue-50">Type chart with abilities</Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Gen 9 Type Calculator FAQ</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <details key={item.question} className="rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 text-gray-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
