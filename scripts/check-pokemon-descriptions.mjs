import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const pokemon = JSON.parse(readFileSync('data/pokemon.json', 'utf8')).pokemon;
const exactDescriptions = {
  vaporeon: 'Vaporeon (Water) weakness guide. It takes 2× from Electric and Grass, so Electric- and Grass-type attackers are the safest answer.',
  jolteon: 'Jolteon (Electric) weakness guide. It takes 2× from Ground, so Ground-type attackers like Garchomp are the safest answer.',
  flareon: 'Flareon (Fire) weakness guide. It takes 2× from Water, Ground and Rock, so Water- and Ground-type attackers are the safest answer.',
  espeon: 'Espeon (Psychic) weakness guide. It takes 2× from Bug, Ghost and Dark, so Dark-type attackers like Tyranitar are the safest answer.',
  umbreon: 'Umbreon (Dark) weakness guide. It takes 2× from Fighting, Bug and Fairy, so Fairy-type attackers like Sylveon are the safest answer.',
  leafeon: 'Leafeon (Grass) weakness guide. It takes 2× from Fire, Ice, Poison, Flying and Bug, so Fire- and Ice-type attackers are the safest answer.',
  glaceon: 'Glaceon (Ice) weakness guide. It takes 2× from Fire, Fighting, Rock and Steel, so Fire- and Fighting-type attackers are the safest answer.',
  sylveon: 'Sylveon (Fairy) weakness guide. It takes 2× from Poison and Steel, so Poison- and Steel-type attackers are the safest answer.',
};

function decodeAttribute(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

const descriptions = new Map();
for (const entry of pokemon) {
  const filename = path.join('.next', 'server', 'app', 'pokemon', `${entry.id}.html`);
  const html = readFileSync(filename, 'utf8');
  const match = html.match(/<meta name="description" content="([^"]*)"/);
  assert.ok(match, `Missing metadata description for /pokemon/${entry.id}`);

  const description = decodeAttribute(match[1]);
  descriptions.set(entry.id, description);
  assert.ok(
    description.length >= 120 && description.length <= 155,
    `/pokemon/${entry.id} description is ${description.length} characters: ${description}`,
  );
}

for (const [id, expected] of Object.entries(exactDescriptions)) {
  const actual = descriptions.get(id);
  assert.equal(actual, expected, `/pokemon/${id} description differs from the required copy`);
  assert.equal(actual.length, expected.length, `/pokemon/${id} independent character counts differ`);
}

const lengths = [...descriptions.values()].map(description => description.length);
console.log(
  `Pokemon description checks passed for ${descriptions.size} pages; range ${Math.min(...lengths)}–${Math.max(...lengths)} characters.`,
);
