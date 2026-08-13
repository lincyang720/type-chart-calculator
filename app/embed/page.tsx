import type { Metadata } from 'next';
import EmbedCode from '@/components/EmbedCode';

export const metadata: Metadata = {
  title: 'Embed the Free Pokemon Type Calculator',
  description: 'Add a free, lightweight Pokemon type matchup calculator to a guide, fan site, or gaming resource.',
  alternates: { canonical: '/embed' },
  openGraph: { title: 'Embed the Free Pokemon Type Calculator', description: 'A lightweight, free Pokemon type matchup widget for gaming guides and fan sites.', url: 'https://www.typematchup.org/embed', type: 'website' },
};

export default function EmbedPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8"><h1 className="text-3xl sm:text-5xl font-bold">Embed the Pokemon Type Calculator</h1><p className="mt-4 text-lg text-gray-700">Give readers an immediate matchup answer inside your guide, fan site, classroom resource, or community page.</p></header>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-bold mb-3">Live preview</h2><iframe src="/embed/type-calculator" title="Pokemon Type Matchup Calculator preview" width="100%" height="680" loading="lazy" className="rounded-xl border-0" /></section>
        <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-7"><h2 className="text-2xl font-bold mb-3">Copy the embed code</h2><p className="mb-4 text-gray-700">Paste this snippet into an HTML block. The widget is responsive, requires no account, displays no ads, and does not load TypeMatchup analytics inside the iframe.</p><EmbedCode /></section>
        <article className="prose mt-10 max-w-none"><h2>What publishers may customize</h2><p>You may change the iframe width, height, border, and surrounding text to fit your layout. Please do not modify the calculator result, hide its source link, imply an official affiliation, or use it on pages that distribute ROMs, cheats, harmful downloads, or other unlawful material.</p><h2>Data and maintenance</h2><p>The widget uses the same modern type chart data as TypeMatchup. Updates happen at the iframe URL, so sites using the standard snippet do not need to reinstall it. The widget does not create user accounts or receive the host page URL.</p><h2>Partnerships and corrections</h2><p>Gaming writers and tool authors may contact us for a custom size, editorial collaboration, calculation correction, or a suggested integration. Embedding is free and does not require a paid link placement.</p></article>
      </div>
    </main>
  );
}
