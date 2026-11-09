'use client';

const ADSENSE_ACTIVE =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
  process.env.NEXT_PUBLIC_ADSENSE_CMP_READY === 'true';

type GoogleFc = {
  callbackQueue?: { push: (callback: Record<string, () => void>) => number };
  showRevocationMessage?: () => void;
};

export default function ConsentSettingsButton() {
  const open = () => {
    if (!ADSENSE_ACTIVE) {
      window.dispatchEvent(new Event('open-consent-preferences'));
      return;
    }

    // The Google CMP owns consent in ad-enabled deployments. Use its supported
    // revocation entrypoint, not the site's standalone analytics prompt.
    const fc = (window as typeof window & { googlefc?: GoogleFc }).googlefc;
    if (fc?.callbackQueue && fc.showRevocationMessage) {
      fc.callbackQueue.push({ CONSENT_DATA_READY: () => fc.showRevocationMessage?.() });
    } else {
      window.location.assign('/privacy');
    }
  };

  return (
    <button type="button" className="text-gray-200 hover:text-white hover:underline" onClick={open}>
      Privacy choices
    </button>
  );
}
