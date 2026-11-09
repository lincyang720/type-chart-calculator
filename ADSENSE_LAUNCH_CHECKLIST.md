# AdSense launch checklist (2026-11-09)

AdSense is reported **Ready**, and ads.txt is **Authorized**. This commit prepares ad loading but leaves advertising **OFF by default**.

## Before enabling

1. Verify the publisher ID in AdSense matches `pub-9200275562093244` and the site's `/ads.txt`.
2. Configure a **Google-certified CMP** as required for EEA, UK and Switzerland traffic in AdSense (for example, via Privacy & messaging). Review child-directed and age-related requirements separately. The site's analytics-only consent dialog **is not an advertising CMP**.
3. Review the site's `/privacy` disclosures against the actual advertising and regional settings; make sure they are accurate.
4. Configure Auto ads in AdSense, initially using a conservative ad load. Avoid overlays or ads placed next to calculator actions, navigation or misleading controls.
5. In Vercel production environment variables set both `NEXT_PUBLIC_ADSENSE_ENABLED=true` and `NEXT_PUBLIC_ADSENSE_CMP_READY=true`, then redeploy. The second flag is **only an operator acknowledgement**; it does not detect or implement CMP consent.
6. Validate the live page/network contains `adsbygoogle.js?client=ca-pub-9200275562093244`; inspect mobile display, console warnings and consent behaviour. Ad serving may not begin immediately.
7. Check `/ads.txt`, AdSense Policy center, Page RPM, Core Web Vitals and Search Console after rollout.

## Rollback

Set `NEXT_PUBLIC_ADSENSE_ENABLED=false` and redeploy. Do not delete ads.txt to pause ads.

## Scope

No changes to page routes, sitemap, metadata, canonical tags, robots rules, editorial copy or calculator interactions. No inline ad units are inserted. This PR does **not** configure a CMP in the AdSense account.
