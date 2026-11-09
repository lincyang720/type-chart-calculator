# Google CMP / Analytics integration validation

## Behavior

- **Both AdSense flags false (production today):** the existing optional analytics prompt remains in place. Visitors can accept or reject GA4 and Vercel Analytics.
- **Both flags true (future rollout):** Google Privacy & messaging CMP becomes the sole source of consent signals. The custom analytics prompt is **not shown**.
- Under CMP control, GA4 is loaded **only when** Google `googlefc` reports `analyticsStoragePurposeConsentStatus === GRANTED` (Google's documented numeric value `1`). All other states fail closed.
- Vercel Analytics is disabled in CMP mode, because Google's Consent Mode does not automatically govern Vercel's independent analytics SDK. A separate policy-aware integration is required before restoring it.
- The footer Privacy choices button uses Google's revocation-message API when available; otherwise opens the site's privacy page. US state-specific controls are rendered separately by Google when applicable.
- No code ever translates the standalone `typematchup-analytics-consent` localStorage choice into Google's CMP consent. This prevents the old opt-in from overriding a later CMP rejection.

## Automated verification

Run `npm ci && npm run verify`. GitHub Actions builds the project on PRs and main.

The assertions in `scripts/check-consent.mjs` verify that CMP mode does not render the custom prompt, checks the approved state, and does not load Vercel Analytics.

## What still requires an actual browser and appropriate test location

1. In AdSense, confirm the EU and US messages remain published for **typematchup.org** and both Google consent-mode purposes are enabled.
2. After configuring **both** Vercel production flags and redeploying, visit:
   - EU/GDPR debug: `https://www.typematchup.org/?fc=alwaysshow&fctype=gdpr`
   - US states debug: `https://www.typematchup.org/?fc=alwaysshow&fctype=ccpa`
   These parameters are documented by Google and allow previewing the published messages; use an incognito browser if consent was previously saved. Debug display does **not** prove real geolocation rules.
3. In developer tools, confirm `adsbygoogle.js?client=ca-pub-9200275562093244` loaded without an ad blocker. Use Google Tag Assistant to inspect consent mode signals.
4. Test reject and accept: no GA4 script before analytics consent; after analytics consent, GA4 may load; when rejected, no analytics cookies should be created by this integration. Check the actual request timeline, not only the on-screen banner.
5. Test mobile, an actual EEA/UK/Swiss connection, and an applicable US state session. Check the Google CMP's published state and regional coverage.
6. Check AdSense Policy center, messages report, and ad serving after rollout. Message counts can lag.

**Do not set the AdSense flags to true based on code/build checks alone.** Live CMP display cannot be verified while the ad script is disabled, because Google's AdSense tag deploys the messages. This change does not modify Vercel variables or turn on ads.

Docs:
- https://developers.google.com/funding-choices/fc-api-docs
- https://developers.google.com/tag-platform/security/guides/consent-debugging
