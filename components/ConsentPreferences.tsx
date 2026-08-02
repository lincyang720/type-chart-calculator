'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

type Consent = 'accepted' | 'rejected' | null;
const STORAGE_KEY = 'typematchup-analytics-consent';

export default function ConsentPreferences() {
  const [consent, setConsent] = useState<Consent>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Consent;
    setConsent(saved === 'accepted' || saved === 'rejected' ? saved : null);
    setShowPrompt(saved !== 'accepted' && saved !== 'rejected');
    const open = () => setShowPrompt(true);
    window.addEventListener('open-consent-preferences', open);
    return () => window.removeEventListener('open-consent-preferences', open);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setShowPrompt(false);
  };

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-Y6GJWZRG95" strategy="afterInteractive" />
          <Script id="google-analytics-consented" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Y6GJWZRG95',{anonymize_ip:true});`}
          </Script>
          <Analytics />
        </>
      )}
      {showPrompt && (
        <section className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-gray-300 bg-white p-5 shadow-2xl" aria-label="Privacy choices" role="dialog" aria-live="polite">
          <h2 className="text-lg font-bold text-gray-900">Your privacy choices</h2>
          <p className="mt-2 text-sm text-gray-700">
            We use optional analytics to understand which tools are useful. You can accept or reject analytics; the
            calculators work either way. Advertising is currently disabled. See our <a href="/privacy" className="text-blue-700 underline">Privacy Policy</a>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose('accepted')} className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800">Accept analytics</button>
            <button type="button" onClick={() => choose('rejected')} className="rounded-lg border border-gray-400 bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">Reject analytics</button>
          </div>
        </section>
      )}
    </>
  );
}
