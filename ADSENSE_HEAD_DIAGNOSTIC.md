# Native AdSense head tag test

Observed in a browser on 2026-11-09: AdSense script HTTP 200, no GDPR test banner, `__tcfapi` undefined, and a `data-nscript` warning. The Google diagnostic identifier `adsense_fc_has_namespace_but_no_iframes` does not by itself establish a root cause.

This experiment switches from Next.js Script (afterInteractive) to the standard native asynchronous script in the top-level head. The publisher ID and dual environment gates are unchanged.

Production must remain disabled until the real Google CMP message, accept/reject, Consent Mode, and analytics behavior are tested. A successful build, script HTTP 200, or no warning does not prove privacy compliance.

After approval for a controlled production test, set both flags true and redeploy, test `?fc=alwaysshow&fctype=gdpr` in a clean browser, check the network and TCF API, and restore both flags false if the message fails. A Vercel preview with an unmatched domain cannot conclusively test the message.
