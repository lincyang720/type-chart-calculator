'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';

type Consent = 'accepted' | 'rejected' | null;
const STORAGE_KEY = 'typematchup-analytics-consent';
const GA4_MEASUREMENT_ID = 'G-37RP6M77TC';

// The Google CMP (Privacy & messaging) is the source of truth whenever ads
// are enabled. The site's old analytics prompt must never grant consent for it.
const ADSENSE_ACTIVE =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
  process.env.NEXT_PUBLIC_ADSENSE_CMP_READY === 'true';

type ConsentModeValues = { analyticsStoragePurposeConsentStatus: number };
type GoogleFc = {
  callbackQueue?: { push: (callback: Record<string, () => void>) => number };
  getGoogleConsentModeValues?: () => ConsentModeValues;
};

function GoogleAnalyticsLoader({ includeVercel }: { includeVercel: boolean }) {
  useEffect(() => {
    const analyticsWindow = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    // A previous local rejection may have set this flag before CMP was enabled.
    delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`];

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag = analyticsWindow.gtag || function gtag() {
      analyticsWindow.dataLayer?.push(arguments);
    };
    // Do not send consent updates here. Google CMP owns those signals.
    analyticsWindow.gtag('js', new Date());
    analyticsWindow.gtag('config', GA4_MEASUREMENT_ID);

    if (!document.getElementById('google-analytics-script')) {
      const script = document.createElement('script');
      script.id = 'google-analytics-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }
  }, []);

  // Vercel Analytics has its own tracking mechanism, not covered by Google's
  // consent mode. Keep it off when relying on the Google CMP to prevent
  // inadvertent collection after a CMP rejection or revocation.
  return includeVercel ? (
    <Analytics
      beforeSend={(event) => (
        window.localStorage.getItem(STORAGE_KEY) === 'accepted' ? event : null
      )}
    />
  ) : null;
}

function CmpControlledAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const win = window as typeof window & { googlefc?: GoogleFc };
    const fc: GoogleFc = win.googlefc ?? { callbackQueue: [] as Record<string, () => void>[] };
    win.googlefc = fc;

    // Google's documented basic-consent-mode integration. Status GRANTED=1;
    // DENIED/UNKNOWN/NOT_APPLICABLE/NOT_CONFIGURED all fail closed.
    const queue = fc.callbackQueue ?? ([] as Record<string, () => void>[]);
    fc.callbackQueue = queue;
    queue.push({
      CONSENT_MODE_DATA_READY: () => {
        const status = fc.getGoogleConsentModeValues?.().analyticsStoragePurposeConsentStatus;
        setAllowed(status === 1);
      },
    });
  }, []);

  return allowed ? <GoogleAnalyticsLoader includeVercel={false} /> : null;
}

function StandaloneAnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setConsent(saved === 'accepted' || saved === 'rejected' ? saved : null);
    setShowPrompt(saved !== 'accepted' && saved !== 'rejected');

    const open = () => setShowPrompt(true);
    window.addEventListener('open-consent-preferences', open);
    return () => window.removeEventListener('open-consent-preferences', open);
  }, []);

  useEffect(() => {
    if (consent === 'rejected') {
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = true;
      // When the standalone choice is rejected, disable GA4 collection.
      // Do not update Google Consent Mode; the independent CMP owns it.
    } else if (consent === 'accepted') {
      delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`];
    }
  }, [consent]);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setShowPrompt(false);
  };

  return (
    <>
      {consent === 'accepted' && <GoogleAnalyticsLoader includeVercel />}
      {showPrompt && (
        <section
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-gray-300 bg-white p-5 shadow-2xl"
          aria-label="Privacy choices"
          role="dialog"
          aria-live="polite"
        >
          <h2 className="text-lg font-bold text-gray-900">Your privacy choices</h2>
          <p className="mt-2 text-sm text-gray-700">
            We use optional analytics to understand which tools are useful. You can accept or reject
            analytics; the calculators work either way. Advertising is disabled on this deployment.
            See our <a href="/privacy" className="text-blue-700 underline">Privacy Policy</a>.
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

export default function ConsentPreferences() {
  return ADSENSE_ACTIVE ? <CmpControlledAnalytics /> : <StandaloneAnalyticsConsent />;
}
