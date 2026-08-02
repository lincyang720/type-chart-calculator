'use client';

export default function ConsentSettingsButton() {
  return <button type="button" className="text-gray-200 hover:text-white hover:underline" onClick={() => window.dispatchEvent(new Event('open-consent-preferences'))}>Privacy choices</button>;
}
