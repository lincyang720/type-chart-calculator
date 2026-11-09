# Isolated Google CMP test page

## Why

On 2026-11-09, Google's GDPR test message would not display on the normal site even after using a native AdSense head tag. The AdSense script returned HTTP 200 and a diagnostic request showed `adsense_fc_has_namespace_but_no_iframes`, but neither `__tcfapi` nor the consent mode getter was available in the tested browser. The published message belongs to typematchup.org.

This page separates **site JavaScript interference** from **Google message delivery / account / domain** problems. No workaround is assumed to solve the issue before a real test.

## Safety: default 404, no normal site ads

A standalone Next.js Route Handler at `/consent-diagnostic` returns raw HTML **without the site React layout, Analytics, Vercel Analytics, or googlefc callbackQueue**. The only external script is the official Google AdSense `<script async>` in `<head>`.

The route requires two server-side variables in the same Vercel Production deployment:

- `CMP_DIAGNOSTIC_ENABLED=true`
- `CMP_DIAGNOSTIC_TOKEN=<a unique secret of at least 24 characters>`

If either is missing, the endpoint returns HTTP 404 with `noindex` and `no-store`. Leave `NEXT_PUBLIC_ADSENSE_ENABLED=false` and `NEXT_PUBLIC_ADSENSE_CMP_READY=false` throughout the experiment. **Do not place the diagnostic token in the GitHub repository, NEXT_PUBLIC_ variables, or chat.** This is access control for a temporary diagnostic endpoint, not a guaranteed protection from every form of credential leakage; inspect browser sharing/recordings.

After changing the Vercel variables, perform a fresh Production deployment. Use a fresh guest browser and enter the URL locally:

```
https://www.typematchup.org/consent-diagnostic?key=<your secret>&fc=alwaysshow&fctype=gdpr
```

You may use `fctype=ccpa` for a separate US-state diagnostic. Observe the presence of Google message iframe, `window.__tcfapi`, scripts/network requests, and any Console error. Do not add extra code or change publisher ID on the test page.

**After the brief test**, set `CMP_DIAGNOSTIC_ENABLED=false` and redeploy. Delete the diagnostic environment secret when no longer needed.

## How to interpret the experiment

- **Minimal route shows GDPR but homepage does not:** investigate global JS conflicts, `googlefc` interactions, Script and analytics sequencing. Avoid claiming a specific cause until isolated.
- **Minimal route does not show GDPR either:** check message page exclusions, domain matching, account status, AdSense tag load and request restrictions; use collected evidence to follow up with Google. This is suggestive, not conclusive proof of a Google outage.
- **404 on diagnostic route:** expected while disabled, secret missing, token under 24 characters or wrong token.
- **AdSense script HTTP 200:** confirms tag fetch only; not proof of GDPR message or TCF consent.
- **Green CI:** checks source, types, SEO and build; it cannot verify Google's live CMP behavior.

Reference: https://support.google.com/adsense/answer/10924669?hl=en
