import type { Metadata } from 'next';
import MobileNav from '@/components/MobileNav';
import ConsentPreferences from '@/components/ConsentPreferences';
import ConsentSettingsButton from '@/components/ConsentSettingsButton';
import WebMCPBootstrap from '@/components/WebMCPBootstrap';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { siteNavItems } from '@/lib/siteNav';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: 'pokemon type chart, type calculator, weakness calculator, dual type, type matchup, battle simulator',
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Pokemon type calculator and type effectiveness calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og-image.svg'],
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
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
          process.env.NEXT_PUBLIC_ADSENSE_CMP_READY === 'true' && (
            <script
              async
              crossOrigin="anonymous"
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9200275562093244"
            />
          )}
      </head>
      <body suppressHydrationWarning>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <nav aria-label="Primary" className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <a href="/" className="shrink-0 text-xl md:text-2xl font-bold hover:opacity-90 transition-opacity">
                <span>TypeMatchup</span>
              </a>

              <div className="hidden min-w-0 flex-1 flex-col items-end gap-1 lg:flex">
                <div className="flex flex-wrap justify-end gap-x-5 gap-y-1 text-base font-semibold">
                  {siteNavItems.filter(item => item.primary).map(item => (
                    <a key={item.href} href={item.href} className="whitespace-nowrap hover:underline">
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm text-white">
                  {siteNavItems.filter(item => !item.primary).map(item => (
                    <a key={item.href} href={item.href} className="whitespace-nowrap hover:underline">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <MobileNav />
            </div>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">© 2026 TypeMatchup. All rights reserved.</p>
            <nav aria-label="Legal and contact links" className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4 text-sm">
              <a href="/blog" className="text-gray-200 hover:text-white hover:underline">Blog</a>
              <a href="/privacy" className="text-gray-200 hover:text-white hover:underline">Privacy</a>
              <a href="/about" className="text-gray-200 hover:text-white hover:underline">About</a>
              <a href="/terms" className="text-gray-200 hover:text-white hover:underline">Terms</a>
              <a href="/disclaimer" className="text-gray-200 hover:text-white hover:underline">Disclaimer</a>
              <a href="/contact" className="text-gray-200 hover:text-white hover:underline">Contact</a>
              <a href="/support" className="text-gray-200 hover:text-white hover:underline">Support</a>
              <a href="/llms.txt" className="text-gray-200 hover:text-white hover:underline">llms.txt</a>
              <ConsentSettingsButton />
            </nav>
            <p className="text-sm text-gray-400">
              Independent fan-made calculators and guides. Type matchups follow the current main-series chart (Generation VI–IX).
            </p>
            <p className="text-xs text-gray-500 mt-4">
              TypeMatchup is an unofficial, fan-made reference. Pokémon trademarks belong to their respective owners.
            </p>
          </div>
        </footer>

        <ConsentPreferences />
        <WebMCPBootstrap />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
