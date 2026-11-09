// Source-level regression check; live Google CMP needs browser/geographic validation.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const consent = readFileSync('components/ConsentPreferences.tsx', 'utf8');
const footer = readFileSync('components/ConsentSettingsButton.tsx', 'utf8');
assert.match(consent, /ADSENSE_ACTIVE \? <CmpControlledAnalytics \/> : <StandaloneAnalyticsConsent \/>/);
assert.match(consent, /CONSENT_MODE_DATA_READY/);
assert.match(consent, /analyticsStoragePurposeConsentStatus/);
assert.match(consent, /setAllowed\(status === 1\)/);
assert.match(consent, /<GoogleAnalyticsLoader includeVercel=\{false\} \/>/);
assert.doesNotMatch(consent, /gtag\('consent', 'update', \{ analytics_storage: 'granted' \}\)/);
assert.match(footer, /showRevocationMessage/);
console.log('CMP consent integration source checks passed.');
