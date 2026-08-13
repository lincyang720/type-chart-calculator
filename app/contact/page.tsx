import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact TypeMatchup',
  description: 'Contact TypeMatchup to report a calculation issue, suggest a feature, ask a privacy question, or discuss the website.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact TypeMatchup</h1>
        <p className="text-lg text-gray-700 mb-8">
          Send questions, correction requests, bug reports, feature ideas, privacy requests, or partnership inquiries by
          email. Please include the page URL and enough detail to reproduce an issue when reporting a calculation problem.
        </p>

        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-3">Email</h2>
          <a href="mailto:lincyang85@gmail.com" className="text-blue-700 text-lg font-semibold hover:underline">
            lincyang85@gmail.com
          </a>
          <p className="text-gray-600 mt-3">
            We aim to respond within five business days. Complex data corrections or technical issues may take longer to
            investigate.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Before You Write</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>For type calculations, include both defending types and the attacking type.</li>
            <li>For a Pokemon guide correction, include the Pokemon or form name.</li>
            <li>Do not send passwords, payment card details, or other sensitive information.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Information about data handling is available in our <Link href="/privacy" className="text-blue-700 font-semibold hover:underline">Privacy Policy</Link>.
          </p>
        </section>

        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">For Gaming Sites and Guide Authors</h2>
          <p className="text-gray-700">
            You can add our lightweight type matchup widget to a guide or fan resource at no cost. It does not display
            ads or load TypeMatchup analytics inside the embedded frame. See the{' '}
            <Link href="/embed" className="font-semibold text-blue-700 hover:underline">embed instructions and live preview</Link>,
            or email us about an editorial collaboration, correction, or custom integration.
          </p>
        </section>
      </div>
    </div>
  );
}
