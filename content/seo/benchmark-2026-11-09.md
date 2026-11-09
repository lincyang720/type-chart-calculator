# 28-day keyword benchmark and editorial inventory

Cycle started: **2026-11-09** (Asia/Taipei); first recurring publication attempt **2026-11-10**.
Fixed keyword: **pokemon type chart**.
Fixed comparison domains: **pokemondb.net**, **sg.portal-pokemon.com**, **dittobase.com**.
Do not rotate these within this cycle.

## Evidence and scope

The user requested 10 relevant pages from **each** comparison domain. As of the initial pass, we have verified the following relevant URLs only; **this is NOT a completed 30-page audit**. We will not fill missing rows with invented URLs or infer Google's ranking positions from domain names. Search-result appearances here do not establish that these domains are actually the top three Google results for the user's target locale.

| Actual relevant page (checked) | What it covers | Not developed on this page, or additional angle we can offer | Original evidence to create |
| --- | --- | --- | --- |
| https://pokemondb.net/type | 18-type effectiveness matrix, STAB, historical chart changes, downloads | A measurable reverse-direction mistake rate is not established on this one page | Reproduce a 153-pair reversal audit from site source data |
| https://pokemondb.net/type/dual/ | Comprehensive dual-type matchups and rarity | Explain which attacking types' reversals are asymmetric without relying on a huge grid | Computed case studies and task-first mini-tables |
| https://pokemondb.net/type/old | Gen 1 and Gen 2–5 chart differences | Worked modern-vs-old *decision* scenarios by defender | Compare two locally labeled matrices and note version |
| https://pokemondb.net/go/type | GO-specific type effectiveness multipliers | A mistake-proof comparison of GO / main-series for the same defender | Calculate both chart values with version explicitly selected |
| https://pokemondb.net/tools/type-coverage | Offensive move type coverage tool | Cases where defensive type reversal causes wrong coverage predictions | Reproducible type-coverage tests |
| https://sg.portal-pokemon.com/game/type-chart/ | Official 18-type matrix and summary | Individual learner-oriented directional examples aren't on the chart itself | Short original attack→defender scenarios |
| https://www.dittobase.com/scarlet-violet/guides/pokemon-type-effectiveness-guide | Dual-type math, STAB, Tera Types, Stellar Tera | Reversal audit and reproducible asymmetric counts are not presented in this guide | Verified 74/153 audit and two-way case-table |
| https://www.dittobase.com/scarlet-violet/compare | Type effectiveness table and compare tool | A focused reverse-direction reading tutorial is not established on this page | Distinguish move attacker vs defending types; test 10 pairs |

**Remaining work:** find, load and qualify up to 10 genuine on-topic pages per domain, recording absent/nonexistent pages as such. In particular, the official Singapore site may not have 10 distinct type-chart editorial pages; do not substitute unrelated corporate pages. Claims about what every competitor page lacks must wait until all eligible pages have been actually read. No copying competitors' text.

## Prioritized editorial queue (verify again against live site and article inventory every day)

| Priority | Unique intent/gap | Original contribution that can be audited | Status |
| --- | --- | --- | --- |
| 1 | Attack-vs-defense chart direction | Enumerate all 153 different type pairs and 74 reversals; 10 asymmetric examples | Drafted/publishing 2026-11-09 |
| 2 | When does a type weakness cancel to neutral? | Count cancellation patterns over all unique defending dual-type pairs, include exceptions | Planned; ensure distinct from existing /blog/how-to-read-dual-type-chart |
| 3 | Which Pokémon type pairs have no immunity? | Programmatic all-pairs distribution with exact method and filters | Planned |
| 4 | Electric type chart decision-tree: Ground immunities vs Flying/Water | Fully trace 10 named matchup paths from locally verified typing data | Planned |
| 5 | Offensive type-coverage set cover for 18 pure defenders | Reproducible simple greedy algorithm, caveat versus whole Pokédex | Planned; distinguish from existing type-coverage calculator |
| 6 | Dual-type chart: matching 4× weak attackers to defender combinations | Calculate exact pair-count, full table or download; tie to existing chart | Planned; avoid duplicating /blog/every-4x-weakness-gen-9 |
| 7 | Why a 0× immunity outweighs a 2× weakness | Verified all-pair worked cases; defensive axis first | Planned |
| 8 | Old type chart vs current direction-confusion traps | Exact Gen 1/Gen 2–5 differences with date/version | Planned |
| 9 | Pokémon GO vs main-series: same attackers, different multipliers | Parallel calculations and valid event caveats | Planned; avoid duplicate GO guide |
| 10 | A printable chart reading checklist for players on mobile | Short first-screen decisions, high-contrast own diagram, accessibility | Planned; avoid duplicate chart page |

## Publishing gate

1. Check site `content/blog` for slug and topic duplicates.
2. Use exact current chart code for all type claims; show method for novel numbers.
3. Answer a user question in the first screen. At least ~30% of the article should be original calculations, verified examples, screenshots of first-party tools, or unique editorial synthesis—not competitor paraphrase.
4. Confirm no false claims about Pokémon generations, rules, type lists or account traffic. Cite competitors only for reading convention; don't copy text.
5. Use `content/blog/<slug>.md` frontmatter; `lib/blog.ts` auto-discovers files and `app/sitemap.ts` auto-includes published posts in sitemap.
6. Run typecheck, SEO and build; merge after checks; then verify **production URL and sitemap URL** before logging as published.
7. Record a dated publishing ledger with real URL, CI and deployment result; failed attempts stay failed.

## Five parallel workstreams

- **T1 UI:** Review mobile chart table width, first-screen typography, tap sizes and spacing; log before/after evidence and roll back unsuccessful changes.
- **T2 Comparison:** Read the locked three domains with URLs/date; learn structure, not sentences.
- **T3 Idea bank:** Add gaps from owned math, official GSC queries *only when read*, and human questions *only with sourced links*. No invented “Google keyword data.”
- **T4 FAQ:** Provide precise first-sentence answers plus an example and scope caveat.
- **T5 Visual/video:** Draft original visualization concepts (e.g., arrow-labeled attacking-vs-defending diagram) and short English voiceover scripts. Images and YouTube publication require actual original files/connected channel and verification; don't claim uploaded when not.

## Baseline reporting

2026-11-09 known official GSC figure from prior authenticated session: **165 indexed pages**, report last updated **2026-10-22**, property `https://www.typematchup.org/`. This is **not** a complete previous 28-day snapshot. GA4 daily data should be re-read from the official source for each cycle. Never manufacture missing 28-day snapshots or daily mean from seven-day unique active users.
