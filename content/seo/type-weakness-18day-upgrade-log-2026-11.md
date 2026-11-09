# TypeMatchup one-type-page-per-day weakness upgrade — 2026-11-09 to 2026-11-26

**Source for volumes:** numbers supplied by site owner as Google US monthly searches on 2026-11-09; neither independently estimated nor verified in GSC. Fix target `pokemon <type> weakness`, one canonical `/types/<type>` page per day; this plan supersedes the usual article-creation cadence for the period.

## Daily schedule and completion log

| Date (Asia/Taipei) | Order | URL | Primary phrase | Owner-supplied monthly search | Status / evidence |
|---|---:|---|---|---:|---|
| 2026-11-09 | 1 | [`/types/ghost`](https://www.typematchup.org/types/ghost) | `pokemon ghost weakness` | 1.5万 | **DONE — only Ghost page changed**: PR [#21](https://github.com/lincyang720/type-chart-calculator/pull/21), production commit `49e431d9b52fd7b175189c92b010f2eb7da993f0`, Vercel production Ready. Browser shows correct title, first answer, 18-row matrix, five main FAQs, five internal links; sitemap contains URL. Browser visually loaded; exact HTTP response code was not separately captured by API. |
| 2026-11-10 | 2 | [`/types/psychic`](https://www.typematchup.org/types/psychic) | `pokemon psychic weakness` | 1.2万 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-11 | 3 | [`/types/steel`](https://www.typematchup.org/types/steel) | `pokemon steel weakness` | 9900 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-12 | 4 | [`/types/fairy`](https://www.typematchup.org/types/fairy) | `pokemon fairy weakness` | 9900 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-13 | 5 | [`/types/poison`](https://www.typematchup.org/types/poison) | `pokemon poison weakness` | 9900 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-14 | 6 | [`/types/ice`](https://www.typematchup.org/types/ice) | `pokemon ice weakness` | 8100 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-15 | 7 | [`/types/electric`](https://www.typematchup.org/types/electric) | `pokemon electric weakness` | 8100 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-16 | 8 | [`/types/rock`](https://www.typematchup.org/types/rock) | `pokemon rock weakness` | 6600 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-17 | 9 | [`/types/dark`](https://www.typematchup.org/types/dark) | `pokemon dark weakness` | 6600 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-18 | 10 | [`/types/water`](https://www.typematchup.org/types/water) | `pokemon water weakness` | 5400 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-19 | 11 | [`/types/ground`](https://www.typematchup.org/types/ground) | `pokemon ground weakness` | 5400 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-20 | 12 | [`/types/grass`](https://www.typematchup.org/types/grass) | `pokemon grass weakness` | 4400 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-21 | 13 | [`/types/bug`](https://www.typematchup.org/types/bug) | `pokemon bug weakness` | 4400 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-22 | 14 | [`/types/normal`](https://www.typematchup.org/types/normal) | `pokemon normal weakness` | 4400 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-23 | 15 | [`/types/flying`](https://www.typematchup.org/types/flying) | `pokemon flying weakness` | 3600 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-24 | 16 | [`/types/fighting`](https://www.typematchup.org/types/fighting) | `pokemon fighting weakness` | 2900 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-25 | 17 | [`/types/fire`](https://www.typematchup.org/types/fire) | `pokemon fire weakness` | 720 | Not started — scheduled only; verify live and record outcome before marking done. |
| 2026-11-26 | 18 | [`/types/dragon`](https://www.typematchup.org/types/dragon) | `pokemon dragon weakness` | 390 | Not started — scheduled only; verify live and record outcome before marking done. |

## Ghost page change (2026-11-09)

- **Metadata and H1**: `Pokemon Ghost Weakness: What Beats Ghost Types?`; one keyword family, existing canonical retained.
- **First visible paragraph**: `Ghost-type Pokémon are weak to Ghost and Dark moves, each dealing 2× damage against a pure Ghost defender.`
- **Coverage**: full 18-row attack/defense direction chart and six-item grouped offense/defense outcomes; dynamic data from `data/defensiveTypeChart.json` and `data/typeChart.json`.
- **Reproducible data**: Ghost attacks are neutral against 14 pure types and pure Ghost defends neutrally against 12. Across 17 distinct Ghost/other dual types, the original 2× Ghost/Dark weaknesses yield 4 attack–defender interactions reduced to 1× and 1 reduced to 0× (these are interactions, not species). Tested in `scripts/check-ghost-weakness.mjs` and CI.
- **Five original FAQs** visibly present plus JSON-LD. **Five internal links** to complete chart, calculator, dual chart, Dark and Psychic weakness guides.
- **Not changed:** other 17 type pages, their metadata, their editorial sections, ads.txt, AdSense/CMP configurations or environment variables.

## Verification and future publication rules

- Only edit one specific `/types/<type>` on each calendar day, following the order. A change in shared code must be strictly conditional on that type; no other type-page changes.
- For each day record actual date, title, first-sentence answer, data source, CI, Vercel Production status, page content and sitemap, and any explicit HTTP status if captured (never infer 200 just from visual rendering).
- Provide the exact monthly search figure supplied by owner and no estimates. A successful existing-page update is not a new URL, new article or newly indexed page.
- Keep mechanics exceptions as small supporting paragraphs; no zero-volume mechanism headline, no extra type page the same day.
- After 2026-11-26 stop this type-specific sequence; 28-day performance report remains independent.
