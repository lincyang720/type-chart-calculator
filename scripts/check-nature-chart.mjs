import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const title = 'Pokemon Nature Chart: All 25 Natures and Stat Effects';
const description = 'Use this Pokemon nature chart to compare all 25 natures and the stats each one raises or lowers. See five neutral natures and four common attacker picks.';
const pageSource = readFileSync('app/pokemon/nature-chart/page.tsx', 'utf8');
const html = readFileSync('.next/server/app/pokemon/nature-chart.html', 'utf8');
const natures = JSON.parse(readFileSync('data/natures.json', 'utf8'));

const decodeAttribute = value => value
  .replaceAll('&quot;', '"')
  .replaceAll('&#x27;', "'")
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

const renderedTitle = decodeAttribute(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
const renderedDescription = decodeAttribute(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');

assert.equal(renderedTitle, title, 'Nature chart title differs from approved copy');
assert.ok(renderedTitle.length >= 40 && renderedTitle.length <= 60, `Nature chart title is ${renderedTitle.length} characters`);
assert.equal(renderedDescription, description, 'Nature chart description differs from approved copy');
assert.ok(renderedDescription.length >= 120 && renderedDescription.length <= 155, `Nature chart description is ${renderedDescription.length} characters`);

assert.equal(natures.length, 25, 'Nature chart must contain 25 rows');
assert.equal(new Set(natures.map(nature => nature.name)).size, 25, 'Nature names must be unique');
const neutralNames = natures.filter(nature => nature.increase === null && nature.decrease === null).map(nature => nature.name);
assert.deepEqual(neutralNames, ['Hardy', 'Docile', 'Serious', 'Bashful', 'Quirky']);
for (const nature of natures.filter(nature => nature.increase !== null || nature.decrease !== null)) {
  assert.ok(nature.increase, `${nature.name} is missing its +10% stat`);
  assert.ok(nature.decrease, `${nature.name} is missing its −10% stat`);
  assert.notEqual(nature.increase, nature.decrease, `${nature.name} must raise and lower different stats`);
}

assert.match(pageSource, /<table/);
for (const href of ['/pokemon/type-chart', '/types', '/pokemon/team-calculator', '/dual-type-chart']) {
  assert.equal(pageSource.split(`href="${href}"`).length - 1, 1, `Expected exactly one link to ${href}`);
}
assert.match(readFileSync('app/pokemon/type-chart/page.tsx', 'utf8'), /href="\/pokemon\/nature-chart"/);
assert.match(readFileSync('app/pokemon/team-calculator/page.tsx', 'utf8'), /href="\/pokemon\/nature-chart"/);
assert.match(readFileSync('app/sitemap.ts', 'utf8'), /\/pokemon\/nature-chart/);

console.log(`Nature chart verified: ${renderedTitle.length}-character title, ${renderedDescription.length}-character description, 25 rows, 5 neutral natures.`);
