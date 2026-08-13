import Link from 'next/link';

const tools = [
  { href: '/', title: 'Type Calculator', text: 'See every weakness, resistance, and immunity for one defending type combination.' },
  { href: '/dual-type-chart', title: 'Dual Type Chart', text: 'Explore and rank all 153 possible dual-type combinations.' },
  { href: '/type-effectiveness-calculator', title: 'Effectiveness Calculator', text: 'See the exact multiplier and how both defending types combine.' },
  { href: '/type-coverage-calculator', title: 'Coverage Calculator', text: 'Find repeated weaknesses and missing defensive answers across a team.' },
];

export default function ToolNetwork({ current }: { current: string }) {
  return (
    <section className="mt-12" aria-labelledby="related-tools">
      <h2 id="related-tools" className="text-2xl font-bold mb-5">Continue With Another Type Tool</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.filter(tool => tool.href !== current).map(tool => (
          <Link key={tool.href} href={tool.href} className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md">
            <h3 className="font-bold text-blue-800">{tool.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{tool.text}</p>
            <span className="mt-3 block text-sm font-semibold text-blue-700">Open tool →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
