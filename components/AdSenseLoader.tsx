'use client';

import Script from 'next/script';

/**
 * Site approval and ads.txt alone do not display ads.
 * Only enable after configuring an appropriate Google-certified consent
 * management platform and verifying the site's privacy settings.
 */
export default function AdSenseLoader() {
  return (
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9200275562093244"
    />
  );
}
