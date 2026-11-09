import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('data/defensiveTypeChart.json','utf8'));
const offense = JSON.parse(readFileSync('data/typeChart.json','utf8'));
const types = Object.keys(data);
const m = (a,b) => data[b].immuneTo.includes(a) ? 0 : data[b].weakTo.includes(a) ? 2 : data[b].resistsTo.includes(a) ? .5 : 1;
const ghost = data.ghost;
assert.deepEqual(ghost.weakTo, ['ghost','dark']);
assert.deepEqual(ghost.resistsTo, ['poison','bug']);
assert.deepEqual(ghost.immuneTo, ['normal','fighting']);
assert.deepEqual(offense.ghost.superEffective, ['psychic','ghost']);
assert.deepEqual(offense.ghost.notVeryEffective, ['dark']);
assert.deepEqual(offense.ghost.noEffect, ['normal']);
assert.equal(types.length,18);
assert.equal(types.filter(t=>m('ghost',t)===1).length,14);
assert.equal(types.filter(t=>m(t,'ghost')===1).length,12);
const neutralized=[],immune=[];
for(const second of types.filter(t=>t!=='ghost')) {
 for(const atk of ghost.weakTo) {
   const a=m(atk,'ghost'), b=m(atk,second);
   if(a*b===1) neutralized.push(second+':'+atk);
   if(a*b===0) immune.push(second+':'+atk);
 }
}
assert.deepEqual(neutralized.sort(), ['dark:dark','dark:ghost','fairy:dark','fighting:dark'].sort());
assert.deepEqual(immune,['normal:ghost']);
const route=readFileSync('app/types/[type]/page.tsx','utf8');
const guide=readFileSync('components/GhostWeaknessGuide.tsx','utf8');
assert.match(route,/Pokemon Ghost Weakness: What Beats Ghost Types\?/);
assert.match(route,/Ghost-type Pokémon are weak to Ghost and Dark moves, each dealing 2×/);
assert.match(route,/typeId === 'ghost' && <GhostWeaknessGuide/);
assert.match(guide,/GHOST_WEAKNESS_FAQS/);
assert.match(guide,/full.*18|all 18|all 18 types|Both directions for all 18/i);
assert.match(guide,/Ghost weakness FAQ/);
assert.match(guide,/\/pokemon\/type-chart/);
assert.match(guide,/\/calculator\?type1=ghost/);
assert.match(guide,/\/dual-type-chart/);
assert.match(guide,/\/types\/dark/);
console.log('Ghost weakness page: data, FAQ and links verified. Offense neutral 14, defense neutral 12, four 2×→1× and one 2×→0× interaction.');
