# Weekly Google Search Console → GitHub report

This workflow uses Google's **read-only Search Analytics API**, not the Search Console "request indexing" API. It appends only finalized, measurable GSC data to \`operations/weekly-reviews.md\`. It never modifies SEO pages, sitemaps, metadata, or analytics configuration.

## One-time permission setup (site owner action)

The existing ChatGPT-connected Search Console connector **cannot automatically authenticate a GitHub Actions runner**. A one-time Google-to-GitHub credential is required:

1. In Google Cloud Console, enable **Google Search Console API** for a Cloud project (no new paid analytics service is required). Create a dedicated service account and JSON key for this read-only workflow. Restrict and rotate the key according to your security policy.
2. In [Search Console → Settings → Users and permissions](https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fwww.typematchup.org%2F), add that service-account \`client_email\` to the exact URL-prefix property \`https://www.typematchup.org/\` with **Restricted** read access when permitted. Confirm it can read search performance data. If Google requires elevated role due to inherited ownership, review with the site owner before granting anything.
3. In the [GitHub repository Actions secrets](https://github.com/lincyang720/type-chart-calculator/settings/secrets/actions), create an **Actions repository secret** named \`GSC_SERVICE_ACCOUNT_JSON\`. Paste the entire JSON there **only**, never into code, PR comments, chat, or a committed file.
4. In [GitHub Actions](https://github.com/lincyang720/type-chart-calculator/actions/workflows/gsc-weekly.yml), manually select **Run workflow** once after setup, then inspect the output. No report is written if credentials or finalized data are missing.

The GitHub workflow token is limited to \`contents: write\` so it can commit the single review file. Google authorization scope is \`https://www.googleapis.com/auth/webmasters.readonly\`.

## Schedule and data method

- The workflow runs Thursdays at **09:17 Asia/Taipei** (01:17 UTC) rather than Mondays: GSC official data can lag by days. A check on Monday might not have finalized Sunday data.
- Each run compares **two completed Monday–Sunday calendar weeks** and requests \`dataState=final\`, \`type=web\`.
- A site-wide unfiltered daily query must contain each of the **14 expected dates**, or the script aborts before any write (including genuinely no-traffic days that the API omits). This is deliberate fail-closed behavior.
- Then four exact page URLs are queried, each over both 7-day periods. Nine exact page+query combinations are queried over both periods.
- A missing exact row is labeled **未返回**, never silently treated as zero. CTR is computed from that row's original clicks and impressions; GSC position is copied as reported. Page-level and query+page metrics are not mixed.
- A unique hidden date marker prevents duplicate weekly blocks. Existing content is preserved byte-for-byte except trailing blank-line normalization. Concurrent weekly workflow runs are serialized.
- GitHub only commits \`operations/weekly-reviews.md\`. The existing \`validate.yml\` CI continues unchanged.
- A cron run can be delayed by GitHub Actions; the intended week is calculated from the actual date of execution. If a week is missed entirely, it needs a later manual replay or explicit backfill rather than invented entries.

## Validation and troubleshooting

- Local tests: \`python -m unittest discover -s tests -p 'test_gsc_weekly.py' -v\`.
- Auth/client: \`python -m pip install "google-auth>=2.30,<3" "requests>=2.31,<3"\`.
- Optional read-only preview: \`python scripts/gsc_weekly.py --dry-run\` with \`GSC_SERVICE_ACCOUNT_JSON\` set in the runner environment.
- \`Missing GSC_SERVICE_ACCOUNT_JSON\`: the GitHub repository secret is not configured.
- 401 / 403: check Search Console API enablement, Google service-account key, and the exact property access.
- Missing finalized GSC date rows: the workflow fails without writing. Retry later.
- 403 on \`git push\`: check repository Actions workflow permissions or branch protection rules; do not bypass review controls.

**Security:** The service-account key grants API access; store it only in the GitHub Actions secret. If it is accidentally disclosed, revoke it in Google Cloud immediately.
