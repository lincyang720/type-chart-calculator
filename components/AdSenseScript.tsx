'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { isEditorialCombination } from '@/lib/editorialCombinations';

export default function AdSenseScript() {
  const pathname = usePathname();
  const match = pathname.match(/^\/types\/([^/]+)$/);

  // Never request ads on thin calculator-only combination pages. An editor
  // must explicitly promote a page after adding a substantial original guide.
  if (match?.[1].includes('-') && !isEditorialCombination(match[1])) {
    return null;
  }

  return (
    <Script
      async
      id="adsense-script"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9200275562093244"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
