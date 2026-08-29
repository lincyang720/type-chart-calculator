import Link from 'next/link';

import JsonLd from '@/components/SEO/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import SupportContributionClient from './SupportContributionClient';

const supportUrl = `${SITE_URL}/support`;
const githubUrl = 'https://github.com/lincyang720/type-chart-calculator';
const pokemonPokedexUrl = 'https://www.pokemon.com/us/pokedex';
const publishedDate = '2026-08-29';
const modifiedDate = '2026-08-29';

const supportFaqItems = [
  {
    question: 'What does supporting TypeMatchup fund?',
    answer:
      'Contributions help cover hosting, maintenance, data review, accessibility work, privacy tooling, and new Pokemon type matchup features.',
  },
  {
    question: 'Is TypeMatchup free to use?',
    answer:
      'Yes. The calculators, type chart, Pokemon pages, blog guides, and embeddable widget are free to use. Contributions are optional.',
  },
  {
    question: 'Is TypeMatchup an official Pokemon website?',
    answer:
      'No. TypeMatchup is an independent fan-made reference and is not affiliated with, endorsed by, sponsored by, or approved by Nintendo, Game Freak, Creatures Inc., or The Pokemon Company.',
  },
];

const supportPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: [githubUrl],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'support',
        email: 'lincyang85@gmail.com',
        url: `${SITE_URL}/contact`,
      },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/about#editor`,
      name: 'TypeMatchup Editorial Team',
      url: `${SITE_URL}/about`,
      sameAs: [githubUrl],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage',
      '@id': `${supportUrl}#webpage`,
      url: supportUrl,
      name: `Support ${SITE_NAME}`,
      description:
        'Support TypeMatchup and learn how contributions fund the free Pokemon type matchup calculator, data reviews, hosting, accessibility, privacy, and editorial maintenance.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      author: { '@id': `${SITE_URL}/about#editor` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      datePublished: publishedDate,
      dateModified: modifiedDate,
      inLanguage: 'en',
      primaryImageOfPage: `${SITE_URL}/og-image.svg`,
      citation: [pokemonPokedexUrl, githubUrl],
    },
    {
      '@type': 'Article',
      '@id': `${supportUrl}#article`,
      headline: 'Support TypeMatchup',
      description:
        'How optional contributions help keep TypeMatchup free, accurate, accessible, and independently maintained.',
      author: { '@id': `${SITE_URL}/about#editor` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      mainEntityOfPage: { '@id': `${supportUrl}#webpage` },
      datePublished: publishedDate,
      dateModified: modifiedDate,
      citation: [pokemonPokedexUrl, githubUrl],
    },
    {
      '@type': 'FAQPage',
      '@id': `${supportUrl}#faq`,
      mainEntity: supportFaqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd data={supportPageSchema} />
      <article className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 mb-3">
            Independent Pokemon type tools
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Support TypeMatchup</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Help keep TypeMatchup free, fast, and useful for players, guide writers, students, and creators.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            By TypeMatchup Editorial Team · Published August 29, 2026 · Last reviewed August 29, 2026
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-8" aria-labelledby="contribution-heading">
          <div className="mb-6">
            <h2 id="contribution-heading" className="text-xl sm:text-2xl font-semibold mb-4">
              Make an Optional Contribution
            </h2>
            <p className="text-gray-600 mb-4">
              TypeMatchup is built as a free reference for Pokemon type matchups, defensive weaknesses, resistances,
              immunities, dual-type combinations, and team-planning checks. If the site saved you time while building a
              team, writing a guide, preparing for a raid, or double-checking a matchup, a small contribution helps keep
              the project maintained.
            </p>
            <p className="text-gray-600">
              Donations are optional and do not unlock hidden features. They simply support the ongoing work behind the
              public calculators, editorial guides, embed widget, data reviews, privacy controls, and infrastructure that
              keep the site available to everyone.
            </p>
          </div>

          <SupportContributionClient />
        </section>

        <section className="bg-blue-50 rounded-lg p-6 mb-8" aria-labelledby="why-support-heading">
          <h2 id="why-support-heading" className="text-lg sm:text-xl font-semibold mb-4">
            Why Support Us?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckIcon />
              <span>Keep the core Pokemon type chart, matchup calculator, team calculator, and battle tools free for everyone.</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>Cover hosting, monitoring, maintenance, analytics consent tooling, and accessibility improvements.</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>Fund new features such as better Pokemon pages, clearer dual-type explanations, and guide-writer resources.</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>Support open-source development and transparent correction workflows for the underlying type data.</span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-8" aria-labelledby="data-trust-heading">
          <h2 id="data-trust-heading" className="text-lg sm:text-xl font-semibold mb-4">
            How We Keep the Data Trustworthy
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              TypeMatchup starts from the modern 18-type Pokemon matchup chart and stores the effectiveness rules as
              structured data before turning them into calculators, guides, and pages. The site treats each result as an
              explainable multiplier: 2× means weak, ½× means resisted, 0× means immune, and dual-type matchups multiply
              the two defending type interactions.
            </p>
            <p>
              We cross-check public-facing terminology with the official Pokemon Pokédex, which lets visitors “explore
              Pokémon by type, weakness, Ability, and more.” We also keep the calculation code and data reviewable in the
              public GitHub repository so corrections can be traced instead of hidden in a black box.
            </p>
            <blockquote cite={pokemonPokedexUrl} className="border-l-4 border-blue-300 pl-4 italic text-gray-600">
              “Explore Pokémon by type, weakness, Ability, and more.”
            </blockquote>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Source reference:{' '}
                <a className="text-blue-700 hover:underline" href={pokemonPokedexUrl}>
                  Official Pokemon Pokédex type and weakness filters
                </a>
              </li>
              <li>
                Project reference:{' '}
                <a className="text-blue-700 hover:underline" href={githubUrl}>
                  TypeMatchup source repository
                </a>
              </li>
              <li>
                Correction path:{' '}
                <Link className="text-blue-700 hover:underline" href="/contact">
                  contact TypeMatchup with the page URL and matchup details
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg sm:text-xl font-semibold mb-4">
            Support TypeMatchup FAQ
          </h2>
          <div className="space-y-5 text-gray-700">
            {supportFaqItems.map(item => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6" aria-labelledby="other-support-heading">
          <h2 id="other-support-heading" className="text-lg sm:text-xl font-semibold mb-4">
            Other Ways to Support
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Share:</strong> Send TypeMatchup to a friend, Discord group, class, or guide-writing team that
              needs a fast type matchup reference.
            </p>
            <p>
              <strong>Feedback:</strong> Report bugs, unclear explanations, or outdated matchup details through the{' '}
              <Link href="/contact" className="text-blue-700 hover:underline">
                contact page
              </Link>.
            </p>
            <p>
              <strong>Embed:</strong> Add the{' '}
              <Link href="/embed" className="text-blue-700 hover:underline">
                free type calculator widget
              </Link>{' '}
              to a guide, classroom page, or fan project.
            </p>
            <p>
              <strong>Contact:</strong>{' '}
              <a href="mailto:lincyang85@gmail.com" className="text-blue-700 hover:underline">
                lincyang85@gmail.com
              </a>
            </p>
            <p>
              <strong>Contribute:</strong> Review the{' '}
              <a href={githubUrl} className="text-blue-700 hover:underline">
                open-source codebase
              </a>{' '}
              and suggest improvements when you spot a clearer way to explain a matchup.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
