import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const route = readFileSync('app/consent-diagnostic/route.ts', 'utf8');
const sitemap = readFileSync('app/sitemap.ts', 'utf8');

assert.match(route, /export const dynamic = 'force-dynamic'/);
assert.match(route, /CMP_DIAGNOSTIC_ENABLED === 'true'/);
assert.match(route, /CMP_DIAGNOSTIC_TOKEN/);
assert.match(route, /key\.length < 24/);
assert.match(route, /supplied !== key/);
assert.match(route, /return new Response\('Not found'/);
assert.match(route, /'X-Robots-Tag': 'noindex, nofollow, noarchive'/);
assert.match(route, /'Cache-Control': 'private, no-store, max-age=0'/);
assert.match(route, /<script async crossorigin="anonymous" src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/);
assert.ok(!route.includes('<AdSenseLoader'));
assert.ok(!route.includes('gtag('));
assert.ok(!route.includes('window.googlefc'));
assert.ok(!sitemap.includes('/consent-diagnostic'));
console.log('CMP isolated diagnostic guardrails passed.');
