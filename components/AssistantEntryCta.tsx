'use client';

import Link from 'next/link';

export default function AssistantEntryCta({ compact = false }: { compact?: boolean }) {
  const trackEntry = () => {
    const analyticsWindow = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    analyticsWindow.gtag?.('event', 'assistant_entry_click', {
      entry_location: window.location.pathname,
    });
  };

  return (
    <section className={`rounded-xl border border-purple-200 bg-purple-50 ${compact ? 'p-4' : 'p-5 sm:p-6'}`} aria-labelledby="assistant-entry-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-700">Need a quick answer?</p>
          <h2 id="assistant-entry-title" className="mt-1 text-xl font-bold text-gray-900">Ask the Pokémon Type Assistant</h2>
          <p className="mt-1 text-gray-700">Ask about a Pokémon&apos;s weakness or what beats a single or dual type.</p>
        </div>
        <Link href="/assistant" onClick={trackEntry} className="inline-flex shrink-0 items-center justify-center rounded-lg bg-purple-700 px-4 py-2.5 font-semibold text-white hover:bg-purple-800">
          Ask the assistant →
        </Link>
      </div>
    </section>
  );
}
