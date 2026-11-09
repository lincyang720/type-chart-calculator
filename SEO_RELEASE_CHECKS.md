# SEO and release checks

Run `npm ci && npm run verify` before merging. GitHub Actions repeats this on pull requests and `main`.

The SEO guard checks editorial slugs, the sitemap's dual-type filtering, core canonical markers, the public sitemap directive and the AdSense seller ID. It is deliberately dependency-free.

**Known review item (2026-11-09):** 11 editorial dual-type slugs are in reverse type order relative to `canonicalDualTypeSlug`: `dragon-flying`, `dragon-ghost`, `dragon-ice`, `dragon-psychic`, `poison-fire`, `poison-fighting`, `ghost-water`, `dragon-fire`, `ghost-electric`, `ghost-fire`, `dark-rock`. They are surfaced as warnings, not auto-redirected. Inspect Search Console pages and canonical selections before consolidating; several contain editorial-specific guides.

There is no ESLint setup in this repository. The obsolete `next lint` command was removed because Next.js 16 no longer supports it. `npm run typecheck` checks types, **not** lint rules. Add ESLint plus a synchronized lockfile in a separate task if lint coverage is needed.

These checks do not measure Lighthouse/Core Web Vitals, CMP compliance, real AdSense impressions or Google indexing outcomes.
