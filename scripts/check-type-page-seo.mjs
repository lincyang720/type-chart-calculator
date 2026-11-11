// Titles and descriptions for the 18 single-type pages, plus the internal links
// those pages need from the high-CTR tools. Chart facts locked here are the
// ones the on-page notes state in prose.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];
const names = Object.fromEntries(types.map(type => [type, type[0].toUpperCase() + type.slice(1)]));
const copy = JSON.parse(readFileSync('lib/typePageCopy.json', 'utf8'));
const defense = JSON.parse(readFileSync('data/defensiveTypeChart.json', 'utf8'));
const offense = JSON.parse(readFileSync('data/typeChart.json', 'utf8'));
const pokemon = JSON.parse(readFileSync('data/pokemon.json', 'utf8')).pokemon;
const moveSource = readFileSync('lib/moveTypes.ts', 'utf8');
const moves = Object.fromEntries([...moveSource.matchAll(/'([^']+)': '([a-z]+)'/g)].map(match => [match[1], match[2]]));
assert.ok(Object.keys(moves).length > 40, 'Move type map was not parsed');

const seenTitles = new Set();
const seenDescriptions = new Set();
for (const type of types) {
  const row = copy[type];
  assert.ok(row, `Missing copy for ${type}`);
  assert.ok(row.title.startsWith(`${names[type]} Type Weakness`), `${type} title must lead with the weakness keyword`);
  assert.ok(row.title.length >= 50 && row.title.length <= 60, `${type} title is ${row.title.length} characters: ${row.title}`);
  assert.ok(row.description.length >= 140 && row.description.length <= 160, `${type} description is ${row.description.length} characters`);
  assert.doesNotMatch(row.description, /weak to/i, `${type} description gives the weakness list away`);
  assert.ok(!seenTitles.has(row.title), `Duplicate title: ${row.title}`);
  assert.ok(!seenDescriptions.has(row.description), `Duplicate description for ${type}`);
  seenTitles.add(row.title);
  seenDescriptions.add(row.description);
  assert.ok(row.intro && row.intro.length > 40, `${type} intro missing`);

  const counters = pokemon.filter(entry =>
    entry.types.includes(type) === false && (
      entry.types.some(pokemonType => defense[type].weakTo.includes(pokemonType)) ||
      entry.recommendedMoves.some(move => defense[type].weakTo.includes(moves[move]))
    ),
  );
  assert.ok(counters.length > 0, `${type} has no dataset counter`);
}

assert.deepEqual(defense.electric.weakTo, ['ground']);
assert.ok(defense.normal.immuneTo.includes('ghost'));
assert.ok(offense.fighting.noEffect.includes('ghost'));
assert.ok(offense.poison.noEffect.includes('steel'));
assert.ok(defense.flying.immuneTo.includes('ground'));
assert.ok(offense.ground.noEffect.includes('flying'));
assert.ok(offense.psychic.noEffect.includes('dark'));
assert.ok(defense.dark.immuneTo.includes('psychic'));
assert.ok(defense.steel.resistsTo.includes('fairy'));
assert.ok(!defense.steel.resistsTo.includes('electric'));
assert.ok(!offense.electric.notVeryEffective.includes('steel'));
assert.equal(defense.steel.resistsTo.length, 10);
assert.deepEqual(offense.electric.notVeryEffective, ['electric', 'grass', 'dragon']);
assert.ok(defense.fairy.immuneTo.includes('dragon'));
assert.ok(offense.dragon.noEffect.includes('fairy'));
assert.ok(offense.ghost.notVeryEffective.includes('dark'));
assert.ok(defense.ghost.weakTo.includes('dark'));
assert.equal(offense.grass.notVeryEffective.length, 7);
assert.equal(offense.bug.notVeryEffective.length, 7);
assert.deepEqual(offense.rock.superEffective, ['fire', 'ice', 'flying', 'bug']);

const mult = (attack, defend) => {
  const row = defense[defend];
  if (row.immuneTo.includes(attack)) return 0;
  if (row.weakTo.includes(attack)) return 2;
  if (row.resistsTo.includes(attack)) return 0.5;
  return 1;
};
const dual = (attack, first, second) => mult(attack, first) * mult(attack, second);
assert.equal(dual('rock', 'fire', 'flying'), 4);
assert.equal(dual('ground', 'electric', 'steel'), 4);
assert.equal(mult('electric', 'steel'), 1);
assert.equal(mult('steel', 'electric'), 0.5);
assert.equal(dual('electric', 'water', 'steel'), 2);
assert.equal(dual('electric', 'flying', 'steel'), 2);
assert.equal(dual('electric', 'steel', 'fairy'), 1);
assert.equal(dual('electric', 'electric', 'steel'), 0.5);
assert.equal(dual('electric', 'grass', 'steel'), 0.5);
assert.equal(dual('electric', 'dragon', 'steel'), 0.5);
assert.equal(dual('fighting', 'ghost', 'normal'), 0);
assert.equal(dual('dark', 'ghost', 'fairy'), 1);

const route = readFileSync('app/types/[type]/page.tsx', 'utf8');
assert.match(route, /canonical: `\/types\/\$\{typeId\}`/);
assert.match(route, /<SingleTypeGuide/);
assert.match(route, /buildTypeFaqs\(guideModel\)/);

const priorityTypes = ['ghost', 'dragon', 'poison', 'electric', 'dark', 'fairy', 'psychic', 'flying', 'ice', 'steel'];
for (const file of ['app/page.tsx', 'app/dual-type-chart/page.tsx', 'app/type-coverage-calculator/page.tsx']) {
  const source = readFileSync(file, 'utf8');
  for (const type of priorityTypes) {
    assert.ok(source.includes(`href="/types/${type}"`), `${file} does not link /types/${type}`);
  }
}

console.log('Type page SEO copy, counters, and internal links verified for 18 types.');
