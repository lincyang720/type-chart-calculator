// Minimal, standalone CMP diagnostic: this route does not render app/layout.tsx.
// It is disabled by default, and a separate server-only secret is required.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const publisherId = 'ca-pub-9200275562093244';

export function GET(request: Request) {
  const key = process.env.CMP_DIAGNOSTIC_TOKEN;
  const enabled = process.env.CMP_DIAGNOSTIC_ENABLED === 'true';
  const supplied = new URL(request.url).searchParams.get('key');

  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // Avoid exposing the diagnostic ad tag on an unprotected or default setup.
  if (!enabled || !key || key.length < 24 || supplied !== key) {
    return new Response('Not found', {
      status: 404,
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // No React, Next Script, GA4, Vercel Analytics, site consent popup, or
  // publisher-created googlefc namespace. Only the official AdSense tag.
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TypeMatchup CMP isolated diagnostic</title>
  <script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}"></script>
</head>
<body>
  <h1>Google Privacy &amp; messaging diagnostics</h1>
  <p>This isolated page loads only the official AdSense publisher script. It is not a public website feature.</p>
  <p>Check the browser's Network panel for Funding Choices requests and use Google's testing query parameters.</p>
</body>
</html>`;

  return new Response(html, { status: 200, headers });
}
