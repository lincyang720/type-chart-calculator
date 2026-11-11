import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('data/defensiveTypeChart.json', 'utf8'));
const types = Object.keys(data);
const multiplier = (attacker, defender) => {
  const row = data[defender];
  return row.immuneTo.includes(attacker) ? 0 :
    row.weakTo.includes(attacker) ? 2 :
    row.resistsTo.includes(attacker) ? 0.5 : 1;
};
let pairs = 0;
let asymmetric = 0;
for (let i = 0; i < types.length; i++) {
  for (let k = i + 1; k < types.length; k++) {
    pairs++;
    if (multiplier(types[i], types[k]) !== multiplier(types[k], types[i])) asymmetric++;
  }
}
assert.equal(types.length, 18);
assert.equal(pairs, 153);
assert.equal(asymmetric, 75);
assert.equal(multiplier('ground', 'electric'), 2);
assert.equal(multiplier('electric', 'ground'), 0);
assert.equal(multiplier('electric', 'steel'), 1);
assert.equal(multiplier('steel', 'electric'), 0.5);
assert.equal(multiplier('ghost', 'normal'), 0);
assert.equal(multiplier('normal', 'ghost'), 0);
const article = readFileSync('content/blog/pokemon-type-chart-attack-vs-defense-direction.md', 'utf8');
assert.match(article, /75 of the 153/);
assert.match(article, /\*\*No—you cannot read/);
assert.match(article, /date: "2026-11-09"/);
console.log('Directional type-chart 75/153 figures and source article verified.');
