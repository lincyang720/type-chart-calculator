import type { Metadata } from 'next';
import Link from 'next/link';
import AbilityTypeCalculator from '@/components/AbilityTypeCalculator';
import { BreadcrumbSchema } from '@/components/SEO/JsonLd';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pokemon Type Chart With Abilities - Weakness Calculator',
  description: 'Calculate Pokemon type matchups with defensive abilities such as Levitate, Flash Fire, Water Absorb, Thick Fat, Filter, and Wonder Guard.',
  keywords: 'pokemon type chart with abilities, pokemon ability weakness calculator, levitate type chart, pokemon immunity calculator',
  alternates: { canonical: '/pokemon/type-chart-with-abilities' },
  openGraph: {
    title: 'Pokemon Type Chart With Abilities',
    description: 'See how defensive abilities change Pokemon weaknesses, resistances, and immunities.',
    url: `${SITE_URL}/pokemon/type-chart-with-abilities`,
    type: 'website',
  },
};

export default function TypeChartWithAbilitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Type Chart With Abilities', url: `${SITE_URL}/pokemon/type-chart-with-abilities` },
      ]} />
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl">Pokemon Type Chart With Abilities</h1>
        <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-gray-600">
          Add a defensive ability to a single or dual type and compare the adjusted matchup with its normal type multiplier.
        </p>
        <AbilityTypeCalculator />

        <section className="mt-12 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-2xl font-bold">How Abilities Change Type Matchups</h2>
          <div className="space-y-4 text-gray-700">
            <p>Type effectiveness is calculated first, then the selected ability is applied. Immunity abilities reduce the matching attack to 0x, while damage-reduction abilities modify the normal type multiplier.</p>
            <p>The base value remains visible whenever an ability changes the result, making it easier to distinguish natural typing from the ability&apos;s effect.</p>
            <p>This tool covers effects that can be calculated reliably from move type alone. Effects that depend on contact, move flags, weather, terrain, Mold Breaker-style interactions, held items, or battle state are outside this chart.</p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/pokemon/type-chart" className="font-semibold text-blue-700 hover:underline">Standard weakness chart</Link>
          <Link href="/pokemon/type-calculator-gen-9" className="font-semibold text-blue-700 hover:underline">Gen 9 type calculator</Link>
        </div>
      </div>
    </div>
  );
}
