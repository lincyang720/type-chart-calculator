import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | TypeMatchup',
  description: 'The page you requested could not be found.',
  keywords: [],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Page Not Found | TypeMatchup',
    description: 'The page you requested could not be found.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Page Not Found | TypeMatchup',
    description: 'The page you requested could not be found.',
  },
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 text-center">
      <div className="w-full">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">404</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          The page you requested does not exist or is no longer available.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          Return to TypeMatchup
        </Link>
      </div>
    </div>
  );
}
