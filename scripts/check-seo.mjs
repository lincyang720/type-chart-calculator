// Dependency-free guardrails for site URLs and AdSense configuration.
// This does not replace an SEO crawl or Search Console.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (filename) => readFileSync(path.join(root, filename), 'utf8');
const typeOrder = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const editorialSource = read('lib/editorialCombinations.ts');
const slugs = [...editorialSource.matchAll(/^  '([a-z]+-[a-z]+)',?$/gm)].map(match => match[1]);
assert.equal(new Set(slugs).size, slugs.length, 'Duplicate editorial dual-type slug');
assert.ok(slugs.length > 0, 'Expected editorial combinations to be present');

const canonical = (slug) => {
  const parts = slug.split('-');
  assert.equal(parts.length, 2, `Invalid dual-type slug: ${slug}`);
  assert.ok(parts.every(type => typeOrder.includes(type)), `Unknown type in ${slug}`);
  assert.notEqual(parts[0], parts[1], `Same type repeated: ${slug}`);
  return parts.sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)).join('-');
};

const noncanonical = slugs.filter(slug => canonical(slug) !== slug);
const duplicatesByPair = new Map();
for (const slug of slugs) {
  const key = canonical(slug);
  duplicatesByPair.set(key, [...(duplicatesByPair.get(key) || []), slug]);
}
const accidentalAliases = [...duplicatesByPair.values()].filter(aliases => aliases.length > 1);
assert.equal(accidentalAliases.length, 0, 'Two editorial URLs use the same defensive type pairing');

const sitemap = read('app/sitemap.ts');
assert.ok(sitemap.includes('isIndexableDualType(slug)'), 'Sitemap must filter thin dual-type pages');
const typePage = read('app/types/[type]/page.tsx');
assert.ok(typePage.includes('dualTypeRobots(typeParam)'), 'Dual-type metadata must respect noindex');
assert.ok(typePage.includes('canonical: `/types/${typeId}`'), 'Single-type canonical missing');
const robots = read('public/robots.txt');
assert.ok(robots.includes('Sitemap: https://www.typematchup.org/sitemap.xml'));
const ads = read('public/ads.txt');
const loader = read('components/AdSenseLoader.tsx');
const match = ads.match(/^google\.com, pub-(\d+), DIRECT, f08c47fec0942fa0/m);
assert.ok(match, 'Expected authorized Google seller in ads.txt');
assert.ok(loader.includes(`ca-pub-${match[1]}`), 'AdSense client differs from ads.txt');

console.log(`SEO guardrails passed: ${slugs.length} editorial combinations, publisher ID consistent.`);
if (noncanonical.length) {
  console.warn(`Review ${noncanonical.length} reverse-order editorial URLs before changing canonical/redirects:`);
  for (const slug of noncanonical) console.warn(`  /types/${slug} -> possible canonical /types/${canonical(slug)}`);
}
