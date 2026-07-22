import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import MobileNav from '@/components/MobileNav';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from '@/lib/seo';
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9200275562093244"
          crossOrigin="anonymous"
        ></script>
        {/* Google Analytics - Lazy load for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y6GJWZRG95"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y6GJWZRG95');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <a href="/" className="text-xl md:text-2xl font-bold hover:opacity-90 transition-opacity">
                <span className="hidden sm:inline">Type Chart Calculator</span>
                <span className="sm:hidden">Type Chart</span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex gap-6 text-base">
                <a href="/" className="hover:underline">Home</a>
                <a href="/calculator" className="hover:underline">Calculator</a>
                <a href="/battle-simulator" className="hover:underline">Battle Simulator</a>
                <a href="/types" className="hover:underline">All Types</a>
                <a href="/pokemon" className="hover:underline">Pokemon</a>
                <a href="/blog" className="hover:underline">Blog</a>
                <a href="/support" className="hover:underline">Support</a>
              </div>

              {/* Mobile Navigation */}
              <MobileNav />
            </div>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">© 2026 Type Chart Calculator. All rights reserved.</p>
            <nav aria-label="Legal and contact links" className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4 text-sm">
              <a href="/privacy" className="text-gray-200 hover:text-white hover:underline">Privacy</a>
              <a href="/terms" className="text-gray-200 hover:text-white hover:underline">Terms</a>
              <a href="/contact" className="text-gray-200 hover:text-white hover:underline">Contact</a>
              <a href="/support" className="text-gray-200 hover:text-white hover:underline">Support</a>
            </nav>
            <p className="text-sm text-gray-400">
              Educational tool for understanding type effectiveness and matchups.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Disclaimer: This is an unofficial fan-made tool. All type mechanics and data are based on game mechanics.
            </p>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
