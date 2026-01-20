import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Type Chart Calculator - Complete Type Effectiveness Guide',
  description: 'Interactive type matchup chart and calculator. Find weaknesses, resistances, and super effective moves for all 18 types. Perfect for competitive battles and team building.',
  keywords: 'type chart, type effectiveness, weakness calculator, type matchup, battle simulator, dual type calculator',
  authors: [{ name: 'Type Chart Calculator' }],
  openGraph: {
    title: 'Type Chart Calculator - Complete Type Effectiveness Guide',
    description: 'Interactive type matchup chart and calculator for all 18 types',
    url: 'https://typematchup.org',
    siteName: 'Type Chart Calculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Type Chart Calculator',
    description: 'Interactive type matchup chart and calculator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
                Type Chart Calculator
              </a>
              <div className="flex gap-6">
                <a href="/" className="hover:underline">Home</a>
                <a href="/calculator" className="hover:underline">Calculator</a>
                <a href="/battle-simulator" className="hover:underline">Battle Simulator</a>
                <a href="/types" className="hover:underline">All Types</a>
              </div>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <Analytics />

        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">© 2026 Type Chart Calculator. All rights reserved.</p>
            <p className="text-sm text-gray-400">
              Educational tool for understanding type effectiveness and matchups.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Disclaimer: This is an unofficial fan-made tool. All type mechanics and data are based on game mechanics.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
