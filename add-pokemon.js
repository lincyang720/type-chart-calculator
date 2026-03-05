const fs = require('fs');
const path = require('path');

const newPokemon = [
  {
    id: 'alakazam',
    name: 'Alakazam',
    types: ['psychic'],
    generation: 1,
    category: 'special-attacker',
    baseStats: { hp: 55, attack: 50, defense: 45, spAtk: 135, spDef: 95, speed: 120 },
    abilities: ['Synchronize', 'Inner Focus', 'Magic Guard'],
    recommendedMoves: ['Psychic', 'Focus Blast', 'Shadow Ball', 'Dazzling Gleam'],
    counters: ['Dark-types', 'Pursuit trappers', 'Priority moves'],
    strengths: 'Incredible Special Attack (135) and Speed (120). Outspeeds most threats and hits extremely hard.',
    strategy: 'Use as a revenge killer or late-game sweeper. Magic Guard prevents chip damage. Pair with screens support. Watch for Pursuit trappers like Tyranitar.'
  },
  {
    id: 'lapras',
    name: 'Lapras',
    types: ['water', 'ice'],
    generation: 1,
    category: 'special-wall',
    baseStats: { hp: 130, attack: 85, defense: 80, spAtk: 85, spDef: 95, speed: 60 },
    abilities: ['Water Absorb', 'Shell Armor', 'Hydration'],
    recommendedMoves: ['Ice Beam', 'Surf', 'Thunderbolt', 'Freeze-Dry'],
    counters: ['Fighting-types', 'Rock-types', 'Electric-types', 'Grass-types'],
    strengths: 'Massive HP (130) and good Special Defense. Freeze-Dry hits Water-types super effectively. Hydration + Rest combo in rain.',
    strategy: 'Use as a special wall or Trick Room sweeper. 4× weak to Fighting and Rock, so avoid physical attackers. Excellent in rain teams with Hydration ability.'
  },
  {
    id: 'scizor',
    name: 'Scizor',
    types: ['bug', 'steel'],
    generation: 2,
    category: 'physical-attacker',
    baseStats: { hp: 70, attack: 130, defense: 100, spAtk: 55, spDef: 80, speed: 65 },
    abilities: ['Swarm', 'Technician', 'Light Metal'],
    recommendedMoves: ['Bullet Punch', 'U-turn', 'Superpower', 'Swords Dance'],
    counters: ['Fire-types', 'Will-O-Wisp users', 'Bulky Water-types'],
    strengths: 'Technician-boosted Bullet Punch is incredibly strong priority. Only weak to Fire. Excellent defensive typing with 9 resistances.',
    strategy: 'Use Bullet Punch for priority revenge killing. U-turn for momentum. Swords Dance sweeper with proper support. 4× Fire weakness is its only major flaw.'
  }
];

// 读取现有数据
const pokemonDataPath = path.join(__dirname, 'data', 'pokemon.json');
const data = JSON.parse(fs.readFileSync(pokemonDataPath, 'utf8'));

// 添加新宝可梦
newPokemon.forEach(pokemon => {
  if (!data.pokemon.find(p => p.id === pokemon.id)) {
    data.pokemon.push(pokemon);
    console.log(`✅ Added ${pokemon.name}`);
  } else {
    console.log(`⚠️  ${pokemon.name} already exists`);
  }
});

// 保存
fs.writeFileSync(pokemonDataPath, JSON.stringify(data, null, 2));
console.log(`\n💾 Saved ${data.pokemon.length} pokemon to data/pokemon.json`);
