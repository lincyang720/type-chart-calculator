import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';
import Link from 'next/link';
import { isEditorialPokemon } from '@/lib/editorialPokemon';

type ExpandedPokemonGuide = {
  description?: string;
  strategy?: string[];
  defense?: string[];
  team?: string[];
  faq?: [string, string][];
  counters: string[];
};

const EXPANDED_POKEMON_GUIDES: Partial<Record<string, ExpandedPokemonGuide>> = {
  "greninja": {
    "description": "Greninja (Water/Dark) weakness guide. Primarina resists its main attacks, while Breloom exploits its Fighting weakness with Mach Punch.",
    "strategy": [
      "Run Protean with Heavy-Duty Boots and Hydro Pump, Dark Pulse, Ice Beam, and U-turn. Greninja forces switches with its Speed and coverage, then uses U-turn to bring in a teammate. Protean activates once per switch-in, so opening with Ice Beam costs Greninja its original Psychic immunity.",
      "Run Battle Bond with Life Orb and Hydro Pump, Dark Pulse, Ice Beam, and Water Shuriken. Water Shuriken can finish a weakened opponent and trigger a one-time boost to Attack, Special Attack, and Speed. A healthy Water-resistant wall can deny the first knockout, and switching out after activation forfeits the boosts."
    ],
    "defense": [
      "Water/Dark Greninja is immune to Psychic and Psyshock. It also resists Water, Fire, Ice, Ghost, Dark, and Steel. Look for a known Ice Beam or Shadow Ball when bringing Greninja in, since its bulk leaves little room for guessing.",
      "Greninja has five 2× weaknesses. Fighting is particularly dangerous because Breloom’s Mach Punch and Lucario’s Vacuum Wave bypass its Speed. Both can finish a chipped Greninja while it is still Water/Dark."
    ],
    "team": [
      "Dragapult naturally outspeeds unboosted Greninja and can threaten it with Draco Meteor after a free entry. Choice Scarf Meowscarada with maximum Speed can outrun even +1 Greninja and target Water/Dark with Flower Trick. Check Greninja’s current type before committing to coverage or priority.",
      "Scizor can take Grass and Fairy attacks and bring Greninja in with a slow U-turn. Great Tusk blocks Electric moves, clears hazards with Rapid Spin, and pressures Empoleon with Ground attacks. Greninja can threaten Gliscor with Ice Beam in return."
    ],
    "faq": [
      [
        "Does Protean activate again if Greninja stays in?",
        "Protean changes Greninja’s type only once per switch-in. It keeps the resulting type until it switches out or another effect changes it."
      ],
      [
        "Can Battle Bond activate twice in the same battle?",
        "Battle Bond activates once per battle. Switching out removes the boosts, and another knockout will not restore them."
      ],
      [
        "Can Water Shuriken get past Focus Sash?",
        "Yes, if the combined hits do enough damage to knock out the target. A later hit can finish the target after the Sash activates, or after an earlier hit has already taken it below full HP."
      ]
    ],
    "counters": [
      "Primarina (Water/Fairy) — Moonblast — Resists Hydro Pump, Dark Pulse, and Ice Beam.",
      "Empoleon (Water/Steel) — Grass Knot and Roost — Resists Hydro Pump and Ice Beam and can heal between switches.",
      "Tentacruel (Water/Poison) — Sludge Bomb and Rapid Spin — Resists Hydro Pump and Ice Beam and clears Spikes.",
      "Toxapex (Poison/Water) — Recover and Haze — Resists Hydro Pump and Ice Beam and can erase Battle Bond boosts.",
      "Blissey (Normal) — Seismic Toss and Soft-Boiled — Absorbs special attacks, though U-turn can bring in a physical threat.",
      "Breloom (Grass/Fighting) — Mach Punch — Can finish chipped Water/Dark Greninja after a free entry."
    ]
  },
  "gyarados": {
    "description": "Gyarados (Water/Flying) weakness guide. Rotom-Wash dodges Earthquake and exploits its 4× Electric weakness with Volt Switch.",
    "strategy": [
      "Run Intimidate with Heavy-Duty Boots and Dragon Dance, Waterfall, Earthquake, and Taunt. Intimidate creates setup turns against physical attackers, while Taunt can preempt slower Haze or recovery. Rotom-Wash resists Waterfall and avoids Earthquake, leaving Gyarados exposed to Volt Switch.",
      "Run Moxie with Lum Berry and Dragon Dance, Waterfall, Earthquake, and Ice Fang. Ice Fang hits Garchomp, and Lum Berry can cure one burn or paralysis as Gyarados looks for its first knockout. Losing Intimidate makes setup harder, while Unaware walls can ignore the Attack boosts."
    ],
    "defense": [
      "Gyarados can switch in freely on a predicted Earthquake or Headlong Rush. It also resists Water, Fire, Fighting, Bug, and Steel, with Intimidate softening physical attacks such as Close Combat. Scout for Rock coverage before switching into a Ground attacker that can choose its move.",
      "Electric damage is 4× before Terastallization. Rotom-Wash and Zapdos can exploit that weakness from outside Earthquake’s reach. Stealth Rock also cuts into the health Gyarados has available to set up when it lacks Heavy-Duty Boots."
    ],
    "team": [
      "At maximum Speed, +1 Jolly Gyarados outruns Timid Dragapult, while +1 Adamant Gyarados falls short. Choice Scarf Sandy Shocks can outrun either, and Thunderclap from Raging Bolt can hit first if Gyarados attacks. Keep an Electric answer healthy until you know whether Gyarados carries Earthquake.",
      "Great Tusk blocks Volt Switch and clears Stealth Rock with Rapid Spin. Gyarados takes Water attacks aimed at Great Tusk and can soften physical hits with Intimidate. Storm Drain Gastrodon also handles both of Rotom-Wash’s main attacks, though Trick can disrupt it."
    ],
    "faq": [
      [
        "Why run Heavy-Duty Boots if Gyarados is immune to Spikes?",
        "Flying typing avoids Spikes under normal conditions, but Stealth Rock still hits super effectively. Boots help Intimidate sets switch in repeatedly."
      ],
      [
        "Can Moxie overwhelm Unaware Dondozo?",
        "Unaware ignores Attack boosts when Dondozo takes damage. Weaken Dondozo with teammates before attempting a sweep."
      ],
      [
        "Does Thunderclap work against Dragon Dance?",
        "Thunderclap fails against Dragon Dance because it is a status move. It can move first on a later turn when Gyarados chooses to attack."
      ]
    ],
    "counters": [
      "Rotom-Wash (Electric/Water) — Volt Switch — Resists Waterfall and Ice Fang and dodges Earthquake with Levitate.",
      "Dondozo (Water) — Wave Crash and Rest — Resists Waterfall and ignores Attack boosts with Unaware.",
      "Slowbro (Water/Psychic) — Thunder Wave and Slack Off — Resists Waterfall and Ice Fang but should scout for Taunt.",
      "Zapdos (Electric/Flying) — Discharge and Roost — Switches in on Earthquake and threatens a 4× hit, but must scout Ice Fang.",
      "Raging Bolt (Electric/Dragon) — Thunderclap — Can strike before boosted Gyarados if it attacks, but should avoid Earthquake on entry.",
      "Sandy Shocks (Electric/Ground) — Thunderbolt — A fast Choice Scarf set can revenge kill even +1 Jolly Gyarados."
    ]
  },
  "mewtwo": {
    "description": "Mewtwo (Psychic) weakness guide. Ting-Lu blocks Psystrike, while Kingambit’s Sucker Punch hits Mewtwo’s Dark weakness.",
    "strategy": [
      "Run Pressure with Life Orb and Calm Mind, Psystrike, Aura Sphere, and Ice Beam. Psystrike targets Defense, while Aura Sphere covers Dark-types and Ice Beam pressures Groudon and Koraidon. Life Orb recoil and the lack of recovery leave Mewtwo vulnerable to physical priority.",
      "Run Pressure with Heavy-Duty Boots and Psystrike, Fire Blast, Ice Beam, and Recover. This set attacks immediately and uses Fire Blast to pressure Steel-types such as Necrozma-Dusk-Mane. Recover helps it make repeated entries, but without Fighting coverage, bulky Dark-types such as Ting-Lu can force it out."
    ],
    "defense": [
      "Pure Psychic Mewtwo resists Fighting and Psychic and has no natural type immunity. It can enter on a predicted Psychic or a Fighting attack from a foe locked into it. A slow pivot offers a safer route against strong neutral coverage.",
      "Dark is especially awkward because it hits Mewtwo super effectively and blocks Psystrike. Ting-Lu can take advantage of a predicted Psystrike, while Kingambit can threaten priority Sucker Punch. Aura Sphere can punish either, but gives Ghost-types such as Lunala an opening."
    ],
    "team": [
      "Maximum-Speed Koraidon and Miraidon outspeed maximum-Speed Mewtwo. Kingambit’s Sucker Punch can pick off a chipped Mewtwo when it attacks, but fails against Calm Mind or Recover. A healthy Ting-Lu can reset boosts with Whirlwind if it survives the hit first.",
      "Koraidon pressures Ting-Lu and Kingambit with Fighting attacks and can pivot with U-turn. Arceus-Dark takes Ghost attacks and threatens Lunala with Judgment. Mewtwo can return the favor by pressuring Clodsire with Psystrike."
    ],
    "faq": [
      [
        "Why does Psystrike work against specially bulky targets?",
        "Psystrike uses Mewtwo’s Special Attack against the foe’s Defense. Dark-types are immune regardless of their stats."
      ],
      [
        "Does Calm Mind help Mewtwo survive Sucker Punch?",
        "Calm Mind boosts Special Defense, and Sucker Punch is physical. Sucker Punch fails on the setup turn but can hit first when Mewtwo attacks."
      ],
      [
        "When should Mewtwo keep Aura Sphere over Fire Blast?",
        "Aura Sphere helps when Ting-Lu or Kingambit blocks Psystrike. Fire Blast is useful when Steel-types such as Necrozma-Dusk-Mane are the bigger obstacle."
      ]
    ],
    "counters": [
      "Ting-Lu (Dark/Ground) — Whirlwind and Earthquake — Blocks Psystrike and can reset Calm Mind if healthy enough to take coverage.",
      "Arceus-Dark (Dark) — Judgment and Recover — Switches into Psystrike and threatens a super-effective hit, but must respect Aura Sphere.",
      "Lunala (Psychic/Ghost) — Moongeist Beam — Resists Psystrike, blocks Aura Sphere, and can take coverage with Shadow Shield intact.",
      "Necrozma-Dusk-Mane (Psychic/Steel) — Knock Off and Morning Sun — Takes Psystrike and can remove Mewtwo’s item, but should scout Fire Blast.",
      "Giratina (Ghost/Dragon) — Shadow Ball and Roar — Blocks Aura Sphere and can force Mewtwo out, but must avoid Ice Beam.",
      "Koraidon (Fighting/Dragon) — U-turn — Can outspeed and revenge kill a chipped Mewtwo after a free entry."
    ]
  },
  "lucario": {
    "description": "Lucario (Fighting/Steel) weakness guide. Garchomp exploits its Ground weakness with Earthquake, and Skeledirge walls standard physical sets.",
    "strategy": [
      "Run Inner Focus with Life Orb and Swords Dance, Close Combat, Meteor Mash, and Extreme Speed. Inner Focus blocks Intimidate and flinching, while Extreme Speed lets Lucario finish chipped opponents that would otherwise move first. Skeledirge is immune to Close Combat and Extreme Speed and resists Meteor Mash.",
      "Run Inner Focus with Life Orb and Nasty Plot, Aura Sphere, Flash Cannon, and Dark Pulse. Dark Pulse lets the special set threaten Ghost-types, and burns do not reduce its damage. Without priority, faster Fire- and Ground-types can force Lucario out after it spends a turn setting up."
    ],
    "defense": [
      "Lucario takes quarter damage from Bug and Rock, which gives it openings against a predicted U-turn or Stone Edge. Its Steel typing blocks Poison attacks and normally prevents Toxic from poisoning it. Scout coverage before relying on those resistances to set up.",
      "Ground stands out among Lucario’s three 2× weaknesses because Earthquake is widely available. Garchomp naturally outspeeds Lucario with comparable investment, and Great Tusk threatens it with Headlong Rush. Close Combat lowers both of Lucario’s defenses and makes revenge kills easier."
    ],
    "team": [
      "Garchomp and Cinderace can outrun Lucario and threaten Earthquake or Pyro Ball. Both have to watch for Extreme Speed after taking chip damage. Dragapult is immune to that priority and can answer with Flamethrower, but should avoid switching into Dark Pulse.",
      "Gyarados is immune to Ground and resists Fire and Fighting, covering all three of Lucario’s weaknesses. Rotom-Wash avoids Earthquake with Levitate and can bring Lucario in with a slow Volt Switch. Lucario can take predicted Rock attacks aimed at Gyarados or Grass attacks aimed at Rotom-Wash."
    ],
    "faq": [
      [
        "Does Inner Focus block Intimidate on Lucario?",
        "Yes, Inner Focus prevents Intimidate’s Attack drop in Scarlet & Violet. It also prevents Lucario from flinching."
      ],
      [
        "Can Extreme Speed hit Dragapult or Skeledirge?",
        "Both are immune while they retain their Ghost typing. Special Lucario can threaten them with Dark Pulse if it gets a safe turn."
      ],
      [
        "Can Nasty Plot Lucario use Vacuum Wave?",
        "Yes, Vacuum Wave provides special Fighting-type priority against weakened targets. Replacing Dark Pulse leaves Lucario more reliant on teammates against bulky Ghost-types."
      ]
    ],
    "counters": [
      "Skeledirge (Fire/Ghost) — Torch Song and Slack Off — Blocks Close Combat and Extreme Speed and ignores boosts with Unaware, but Dark Pulse hits it super effectively.",
      "Hippowdon (Ground) — Earthquake and Slack Off — Takes physical hits when healthy, but boosted special attacks can overwhelm it.",
      "Toxapex (Poison/Water) — Haze and Recover — Resists both same-type attacks and can erase either setup boost.",
      "Landorus-Therian (Ground/Flying) — Earthquake — Resists Close Combat and threatens a super-effective hit, but Inner Focus blocks Intimidate.",
      "Dragapult (Dragon/Ghost) — Flamethrower — Outspeeds Lucario and is immune to Extreme Speed, but should enter after a knockout to avoid Dark Pulse."
    ]
  },
  "garchomp": {
    "counters": [
      "Skarmory (Steel/Flying) — Whirlwind and Roost — Blocks Earthquake, resists Dragon attacks, and can reset Swords Dance, but should scout Fire Blast.",
      "Corviknight (Flying/Steel) — Body Press and Roost — Can enter repeatedly on Earthquake and resisted Dragon moves, but must scout Fire coverage.",
      "Dondozo (Water) — Avalanche and Rest — Ignores Swords Dance with Unaware and punishes the 4× Ice weakness.",
      "Primarina (Water/Fairy) — Moonblast — Switches into predicted Dragon attacks and hits super effectively, but Earthquake hits neutrally.",
      "Mamoswine (Ice/Ground) — Ice Shard — Bypasses Speed and exploits the 4× Ice weakness against a chipped Garchomp after a free entry.",
      "Weavile (Dark/Ice) — Triple Axel — Outspeeds unboosted Garchomp at comparable investment and threatens its 4× Ice weakness, but takes Rough Skin chip."
    ]
  }
};

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const FEATURED_POKEMON_GUIDES: Record<string, { heading: string; sections: { title: string; body: string }[] }> = {
  garchomp: {
    heading: 'Garchomp Matchup and Positioning Guide',
    sections: [
      { title: 'Defensive profile and the Ice danger', body: 'Garchomp combines Dragon and Ground, granting an Electric immunity and resistances to Fire, Poison, and Rock. Ice is the emergency because it deals 4× damage; Dragon and Fairy deal 2×. Water and Grass are neutral because the two component multipliers cancel. Its 108 HP, 95 Defense, and 85 Special Defense provide useful natural bulk, but they do not make an unscouted Ice Beam or Ice Shard safe. Rough Skin can punish contact and accumulate chip, particularly beside a contact-damaging item, while the typing lets Garchomp discourage careless Electric attacks.' },
      { title: 'Attacking, setup, and utility roles', body: 'A base 130 Attack makes Earthquake a defining threat, and Dragon STAB provides broad neutral pressure. Flying types and Levitate users ignore Ground, while Fairy types are immune to Dragon, so choosing the correct move matters more than simply selecting the largest displayed power. Stone Edge or another coverage move can pressure Flying answers; a Steel or Poison option may discourage Fairy. Swords Dance can turn a forced switch into a sweep attempt, but Garchomp can also set Stealth Rock and use its bulk and Rough Skin to create progress. Pick one coherent role rather than asking a single set to set hazards, break walls, and sweep.' },
      { title: 'How to counter and support Garchomp', body: 'Preserve an Ice attacker or priority Ice Shard user, but verify whether a defensive Tera type, Focus Sash, substitute, or Yache Berry changes the expected knockout. Fairy attacks avoid the risk of Dragon immunity interactions, while faster Dragon attackers create a speed-dependent exchange. Burn, Intimidate, and physical walls can limit sets that lack the right coverage. Garchomp appreciates Steel partners that resist Ice, Dragon, and Fairy, plus teammates that pressure Flying and Levitate answers. Hazard control and speed support may matter depending on the set. Always separate the standard type calculation from abilities, items, field effects, and generation-specific rules.' },
      { title: 'Reading the set before committing a counter', body: 'Do not assume every Garchomp is the same sweeper. An early Stealth Rock often signals a utility role, but it may still carry enough Speed and Attack to punish removal. Substitute can exploit passive answers, mixed coverage can surprise a physically defensive wall, and a Choice item changes which revenge killers are safe. Look for damage rolls, item recovery, Rough Skin activation, and revealed moves before locking in the response. If Ice priority is the only emergency answer, keep it outside Earthquake range and avoid unnecessary chip. If a Fairy is the primary switch, verify that Poison or Steel coverage has not been revealed. Counterplay succeeds by denying setup turns and limiting move freedom, not merely owning one super-effective attack.' },
      { title: 'Endgame planning and speed control', body: 'Garchomp is most dangerous when its checks have been chipped into Earthquake or Dragon range. Track Flying immunities, Fairy immunities, remaining priority, and the exact Speed order before allowing a setup turn. Paralysis, Tailwind, Choice Scarf users, or naturally faster attackers can prevent a cleanup, though Scale Shot or another Speed boost may reverse the order. Conversely, a Garchomp user should weaken the opponent’s Ground immunity and Fairy before revealing the endgame plan. Rough Skin chip can place contact attackers into range for a teammate even when Garchomp faints, so trading it may be correct only after hazards or key damage have been secured. Preserve it when its Electric immunity or Rock resistance remains essential to the defensive structure.' },
    ],
  },
};

const BATCH6_TYPE_CHART_LINK_POKEMON = new Set([
  'aerodactyl',
  'gallade',
  'absol',
  'skarmory',
  'empoleon',
  'chandelure',
  'eternatus',
  'garganacl',
  'iron-valiant',
  'lugia',
  'kyogre',
  'torterra',
  'sneasler',
  'flutter-mane',
  'pelipper',
  'gholdengo',
  'amoonguss',
  'torkoal',
  'ceruledge',
  'blissey',
  'ursaluna',
  'mew',
  'alolan-ninetales',
  'urshifu',
  'whimsicott',
  'koraidon',
  'miraidon',
  'regieleki',
  'raging-bolt',
  'ditto',
  'magikarp',
]);

function getComboSlug(t1: TypeId, t2: TypeId): string {
  const i1 = ALL_TYPES.indexOf(t1);
  const i2 = ALL_TYPES.indexOf(t2);
  return i1 < i2 ? `${t1}-${t2}` : `${t2}-${t1}`;
}

function applyPokemonAbilityContext(
  pokemon: { id: string; abilities: string[] },
  weaknesses: ReturnType<typeof calculateDualTypeWeaknesses>
) {
  if (pokemon.id !== 'rotom-wash' || !pokemon.abilities.includes('Levitate')) {
    return weaknesses;
  }

  return {
    ...weaknesses,
    quadrupleWeak: weaknesses.quadrupleWeak.filter(type => type !== 'ground'),
    doubleWeak: weaknesses.doubleWeak.filter(type => type !== 'ground'),
    normal: weaknesses.normal.filter(type => type !== 'ground'),
    doubleResist: weaknesses.doubleResist.filter(type => type !== 'ground'),
    quadrupleResist: weaknesses.quadrupleResist.filter(type => type !== 'ground'),
    immune: weaknesses.immune.includes('ground') ? weaknesses.immune : [...weaknesses.immune, 'ground' as TypeId],
  };
}

// Pre-generate all pokemon pages at build time
export async function generateStaticParams() {
  return pokemonData.pokemon.map((p) => ({ name: p.id }));
}

export const dynamicParams = false;

function pokemonDescription(pokemon: typeof pokemonData.pokemon[number], typeNames: string) {
  const prefix = `${pokemon.name} (${typeNames}) weakness guide.`;
  if (pokemon.id === 'garchomp') {
    return 'Garchomp (Dragon/Ground) weakness guide. It takes 4× from Ice, so Ice Shard users like Mamoswine and Weavile are the safest answer.';
  }

  const counters = EXPANDED_POKEMON_GUIDES[pokemon.id]?.counters ?? pokemon.counters;
  if (!counters?.length) return prefix;

  const weaknesses = applyPokemonAbilityContext(pokemon, calculateDualTypeWeaknesses(
    pokemon.types[0] as TypeId, pokemon.types[1] as TypeId | undefined
  ));
  const namedCounters = counters.flatMap(counter => {
    const structured = /^(.+?) \(([^)]+)\) — /.exec(counter);
    if (structured) return [{ name: structured[1], context: structured[2] }];

    return pokemonData.pokemon.flatMap(candidate => {
      const start = counter.indexOf(candidate.name);
      if (start < 0 || !/[\s(]/.test(counter[start - 1] ?? ' ') ||
          !/[\s,)]/.test(counter[start + candidate.name.length] ?? ' ')) return [];
      return [{ name: candidate.name, context: counter, start }];
    }).sort((a, b) => a.start - b.start);
  });

  for (const [multiplier, types] of [[4, weaknesses.quadrupleWeak], [2, weaknesses.doubleWeak]] as const) {
    for (const type of types) {
      const label = typesData.types.find(entry => entry.id === type)?.name;
      if (!label) continue;
      const match = namedCounters.find(counter =>
        counter.context.split('/').includes(label) || counter.context.includes(`${label}-type`)
      );
      if (!match) continue;
      const description = `${prefix} It takes ${multiplier}× from ${label}, so ${label}-type counters like ${match.name} can exploit that weakness.`;
      if (description.length <= 155) return description;
    }
  }

  const names = [...new Set(namedCounters.map(counter => counter.name))].slice(0, 2);
  const description = `${prefix} Best counters include ${names.join(' and ')}.`;
  return names.length === 2 && description.length <= 155 ? description : prefix;
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    return { title: 'Pokemon Not Found' };
  }

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name).join('/');
  const description = pokemonDescription(pokemon, typeNames);

  if (pokemon.id === 'eevee') {
    return {
      title: 'Eevee Weakness & Eeveelution Chart - Every Eevee Evolution, Type, and Weakness',
      description,
      keywords: 'eevee weakness, eeveelution chart, eevee evolutions, eevee type, sylveon, umbreon, espeon, jolteon, vaporeon, flareon, leafeon, glaceon',
      openGraph: {
        siteName: 'TypeMatchup',
        title: 'Eevee Weakness and the Complete Eeveelution Chart',
        description: 'Eevee plus its eight evolutions compared by type, weakness, resistance, and immunity in one chart.',
        url: 'https://www.typematchup.org/pokemon/eevee',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Eevee Weakness & Eeveelution Chart',
        description: 'Eevee and all eight Eeveelutions: type, weaknesses, resistances, and immunities.',
      },
      alternates: {
        canonical: '/pokemon/eevee',
      },
      robots: { index: true, follow: true },
    };
  }

  return {
    title: `${pokemon.name} Weakness & Counters - ${typeNames} Type Guide`,
    description,
    keywords: `${pokemon.name} weakness, ${pokemon.name} counters, ${pokemon.name} best moveset, ${pokemon.name} type, ${pokemon.name} strategy`,
    openGraph: {
    siteName: 'TypeMatchup',
      title: `${pokemon.name} - Weakness, Counters & Strategy Guide`,
      description: `Complete ${pokemon.name} guide: weaknesses, best counters, recommended moveset, and competitive strategy.`,
      url: `https://www.typematchup.org/pokemon/${pokemon.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pokemon.name} Weakness & Counters`,
      description: `${pokemon.name} (${typeNames}) - weaknesses, counters, and strategy guide.`,
    },
    alternates: {
      canonical: `/pokemon/${pokemon.id}`,
    },
    robots: isEditorialPokemon(pokemon.id)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    notFound();
  }

  const type1 = pokemon.types[0] as TypeId;
  const type2 = pokemon.types.length > 1 ? pokemon.types[1] as TypeId : null;

  const weaknesses = applyPokemonAbilityContext(
    pokemon,
    calculateDualTypeWeaknesses(type1, type2 ?? undefined)
  );

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name);
  const relatedPokemon = pokemonData.pokemon
    .filter(candidate =>
      candidate.id !== pokemon.id &&
      candidate.types.some(candidateType => pokemon.types.includes(candidateType))
    )
    .slice(0, 3);

  const guide = EXPANDED_POKEMON_GUIDES[pokemon.id];
  const counterNames = guide?.faq
    ? guide.counters.map(counter => counter.split(' (')[0])
    : pokemon.counters;

  const garchompCounterAnswer = pokemon.id === 'garchomp'
    ? 'Best counters: Skarmory and Corviknight wall Earthquake and reset Swords Dance, Dondozo ignores the boost with Unaware, and Mamoswine or Weavile threaten the 4× Ice weakness with Ice Shard.'
    : undefined;

  // Build FAQ data for JSON-LD
  const faqItems = [
    {
      '@type': 'Question' as const,
      name: `What is ${pokemon.name} weak to?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: weaknesses
          ? `${pokemon.name} (${typeNames.join('/')}) is ${weaknesses.quadrupleWeak.length > 0 ? `4× weak to ${weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} and ` : ''}weak to ${weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.`
          : `${pokemon.name} is a ${typeNames[0]} type. Check the type page for detailed matchups.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `What is the best moveset for ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `The recommended moveset for ${pokemon.name} is: ${pokemon.recommendedMoves.join(', ')}.${guide?.strategy ? '' : ` ${pokemon.strategy}`}`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `How to counter ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: garchompCounterAnswer ?? `Best counters for ${pokemon.name}: ${counterNames.join(', ')}.`,
      },
    },
    ...(guide?.faq ?? []).map(([question, answer]) => ({
      '@type': 'Question' as const,
      name: question,
      acceptedAnswer: { '@type': 'Answer' as const, text: answer },
    })),
  ];

  const statTotal = pokemon.baseStats.hp + pokemon.baseStats.attack + pokemon.baseStats.defense +
    pokemon.baseStats.spAtk + pokemon.baseStats.spDef + pokemon.baseStats.speed;
  const maxStat = Math.max(pokemon.baseStats.hp, pokemon.baseStats.attack, pokemon.baseStats.defense,
    pokemon.baseStats.spAtk, pokemon.baseStats.spDef, pokemon.baseStats.speed);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems,
          }),
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/pokemon" className="hover:text-blue-600">Pokemon</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{pokemon.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {pokemon.name} Weakness &amp; Counters
            </span>
          </h1>
          <div className="flex items-center gap-3 mb-4">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`}>
                <TypeBadge typeId={t as TypeId} size="lg" clickable />
              </Link>
            ))}
            <span className="text-sm text-gray-500 ml-2">Gen {pokemon.generation} · {pokemon.category}</span>
          </div>
          {pokemon.id === 'metagross' && weaknesses && (
            <p className="mb-3 text-lg text-gray-900">
              In the main-series games from Generation VI onward, Metagross takes{' '}
              <strong>2× damage from {weaknesses.doubleWeak.map(type =>
                typesData.types.find(entry => entry.id === type)?.name ?? type
              ).join(', ')}</strong>{' '}
              under the standard Steel/Psychic type matchup.
            </p>
          )}
          <p className="text-lg text-gray-600">{pokemon.id === 'greninja'
              ? "Protean changes Greninja's type to match the move it uses, but in Gen 9 it triggers only once per switch-in, so you choose the moment. Base 122 Speed outspeeds most of the metagame. Battle Bond raises Attack, Sp. Atk and Speed once after it knocks out a target, instead of changing forme."
              : pokemon.strengths}</p>
        </div>

        {/* Type Weaknesses */}
        {weaknesses && (
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Type Weaknesses & Resistances</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-red-600 mb-3">⚠️ Weaknesses</h3>
                {weaknesses.quadrupleWeak.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-red-700 block mb-1">4× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleWeak.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-red-600 block mb-1">2× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-3">✓ Resistances</h3>
                {weaknesses.quadrupleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-700 block mb-1">¼× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-600 block mb-1">½× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.immune.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">0× Immune:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.immune.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type2 && (
              <div className="mt-4 text-center">
                <Link href={`/types/${getComboSlug(type1, type2)}`} className="text-blue-600 hover:underline text-sm">
                  View full {typeNames.join('/')} type matchup →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Base Stats */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Base Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'HP', value: pokemon.baseStats.hp, color: 'bg-green-500' },
              { label: 'Attack', value: pokemon.baseStats.attack, color: 'bg-red-500' },
              { label: 'Defense', value: pokemon.baseStats.defense, color: 'bg-orange-500' },
              { label: 'Sp. Atk', value: pokemon.baseStats.spAtk, color: 'bg-blue-500' },
              { label: 'Sp. Def', value: pokemon.baseStats.spDef, color: 'bg-purple-500' },
              { label: 'Speed', value: pokemon.baseStats.speed, color: 'bg-pink-500' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-600">{stat.label}</span>
                <span className="w-10 text-sm font-bold text-right">{stat.value}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`${stat.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(stat.value / 255) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t">
              <span className="w-16 text-sm font-bold text-gray-800">Total</span>
              <span className="w-10 text-sm font-bold text-right">{statTotal}</span>
            </div>
          </div>
        </section>

        {/* Recommended Moveset */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Moveset</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {pokemon.recommendedMoves.map(move => (
              <div key={move} className="bg-gray-50 rounded-lg p-3 text-center font-medium">
                {move}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(ability => (
                <span key={ability} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Strategy */}
        {FEATURED_POKEMON_GUIDES[pokemon.id] && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-8 prose max-w-none text-gray-700">
            <h2>{FEATURED_POKEMON_GUIDES[pokemon.id].heading}</h2>
            {FEATURED_POKEMON_GUIDES[pokemon.id].sections.map(section => (
              <section key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </section>
            ))}
          </article>
        )}

        {pokemon.id === 'eevee' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-8 prose max-w-none text-gray-700">
            <h2>Eeveelution Chart: Every Eevee Evolution, Type, and Weakness</h2>
            <p>
              Here is the quick <strong>Eeveelution chart</strong>: Eevee is Normal, and its eight evolutions cover eight
              different types. Use the weakness column when choosing a counter, and the immunity or resistance column when
              choosing a switch-in.
            </p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Pokemon</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Standard weaknesses</th>
                  <th className="py-2">Key resistance or immunity</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Eevee</td><td className="py-2 pr-4">Normal</td><td className="py-2 pr-4">Fighting</td><td className="py-2">Immune to Ghost</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Vaporeon</td><td className="py-2 pr-4">Water</td><td className="py-2 pr-4">Electric, Grass</td><td className="py-2">Resists Fire, Water, Ice, Steel</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Jolteon</td><td className="py-2 pr-4">Electric</td><td className="py-2 pr-4">Ground</td><td className="py-2">Resists Electric, Flying, Steel</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Flareon</td><td className="py-2 pr-4">Fire</td><td className="py-2 pr-4">Water, Ground, Rock</td><td className="py-2">Resists Fire, Grass, Ice, Bug, Steel, Fairy</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Espeon</td><td className="py-2 pr-4">Psychic</td><td className="py-2 pr-4">Bug, Ghost, Dark</td><td className="py-2">Resists Fighting, Psychic</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Umbreon</td><td className="py-2 pr-4">Dark</td><td className="py-2 pr-4">Fighting, Bug, Fairy</td><td className="py-2">Immune to Psychic; resists Ghost and Dark</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Leafeon</td><td className="py-2 pr-4">Grass</td><td className="py-2 pr-4">Fire, Ice, Poison, Flying, Bug</td><td className="py-2">Resists Water, Electric, Grass, Ground</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Glaceon</td><td className="py-2 pr-4">Ice</td><td className="py-2 pr-4">Fire, Fighting, Rock, Steel</td><td className="py-2">Resists Ice</td></tr>
                <tr><td className="py-2 pr-4">Sylveon</td><td className="py-2 pr-4">Fairy</td><td className="py-2 pr-4">Poison, Steel</td><td className="py-2">Immune to Dragon; resists Fighting, Bug, Dark</td></tr>
              </tbody>
            </table>
            <p>
              The table uses the standard main-series type chart. A move&apos;s actual result can change with abilities,
              held items, weather, Terastallization, or a game-specific battle rule, so verify unusual cases in the
              <Link href="/pokemon/type-chart">Pokemon type chart</Link>.
            </p>

            <h3>Eeveelutions by type</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Eeveelution</th>
                  <th className="py-2">What makes the type useful</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Normal</td><td className="py-2 pr-4">Eevee</td><td className="py-2">The baseline choice with a simple weakness and a Ghost immunity.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Water</td><td className="py-2 pr-4">Vaporeon</td><td className="py-2">A bulky Water option that handles Fire, Water, Ice, and Steel attacks well.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Electric</td><td className="py-2 pr-4">Jolteon</td><td className="py-2">The narrowest defensive weakness in the family: Ground is the matchup to cover.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Fire</td><td className="py-2 pr-4">Flareon</td><td className="py-2">Strong resistance coverage, balanced by weaknesses to Water, Ground, and Rock.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Psychic</td><td className="py-2 pr-4">Espeon</td><td className="py-2">Fast Psychic identity with useful Fighting and Psychic resistances.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Dark</td><td className="py-2 pr-4">Umbreon</td><td className="py-2">A defensive Dark profile with a Psychic immunity and a different set of answers from Espeon.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Grass</td><td className="py-2 pr-4">Leafeon</td><td className="py-2">Four helpful resistances, but several common attacking types to watch.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Ice</td><td className="py-2 pr-4">Glaceon</td><td className="py-2">A clear Ice identity that needs protection from Fire, Fighting, Rock, and Steel.</td></tr>
                <tr><td className="py-2 pr-4">Fairy</td><td className="py-2 pr-4">Sylveon</td><td className="py-2">The family member that blanks Dragon attacks and checks Fighting, Bug, and Dark pressure.</td></tr>
              </tbody>
            </table>

            <h3>How to use the chart in a matchup</h3>

            <h4>If you are picking an evolution</h4>
            <p>
              Start with the type you need, not the Pokemon name. Jolteon is the cleanest choice when the main concern is
              a Flying or Water matchup and you can protect it from Ground. Sylveon is the direct Fairy option when Dragon
              immunity matters. Umbreon is the better Dark-flavored defensive choice when you want a Psychic immunity
              rather than Espeon&apos;s Psychic damage profile.
            </p>

            <h4>If you are countering an Eeveelution</h4>
            <p>
              Read the exact row. Do not use &quot;Eevee weakness&quot; as a substitute for the evolved form&apos;s weakness.
              Fighting is super effective against Eevee, but that does not have the same meaning against Espeon, Umbreon,
              or Sylveon. The evolution&apos;s type is the first filter.
            </p>

            <h4>If the Pokemon has an extra battle mechanic</h4>
            <p>
              Use this as the type baseline, then check the exact game and format. Terastallization, abilities, and special
              forms can change what you should bring. The <Link href="/calculator">type calculator</Link> is the quickest
              way to compare one or two defending types against every attacking type.
            </p>

            <h3>Eeveelution chart FAQ</h3>
            <h4>How many Eeveelutions are there?</h4>
            <p>
              There are eight Eevee evolutions in this chart: Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon,
              Glaceon, and Sylveon. Eevee itself is included as the Normal-type starting point.
            </p>
            <h4>Which Eeveelution is Fairy type?</h4>
            <p>
              Sylveon is the Fairy-type Eeveelution. Its standard weaknesses are Poison and Steel, and Dragon-type attacks
              do not affect it.
            </p>
            <h4>Which Eeveelution has only one weakness?</h4>
            <p>
              Jolteon has one standard type weakness, Ground. Umbreon has three listed weaknesses but gains a Psychic
              immunity from its Dark typing.
            </p>

            <h3>Eeveelution chart takeaway</h3>
            <p>
              The eight evolutions are a compact tour of the type system: Water, Electric, Fire, Psychic, Dark, Grass, Ice,
              and Fairy. Pick by the matchup you need, then cover the weakness shown in the table. That keeps the chart
              useful for both collecting and team planning, without treating every Eeveelution as if it shared Eevee&apos;s
              Normal typing.
            </p>
          </article>
        )}

        {pokemon.id === 'ferrothorn' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-8 prose max-w-none text-gray-700">
            <h2>How to Use Ferrothorn: Complete Battle Guide</h2>
            <p>
              Ferrothorn is a defensive Grass/Steel Pokémon whose value comes from role compression. It can set entry
              hazards, drain opponents with Leech Seed, punish contact through Iron Barbs, and threaten meaningful damage
              without investing heavily in Speed. Its 131 base Defense and 116 Special Defense let it check attacks from
              both sides, but 74 HP means those defenses are not unlimited. Ferrothorn works best when it enters on a
              resisted move, advances the team&apos;s position, and leaves before the opponent turns its Fire weakness into
              a free knockout. It is a support Pokémon with offensive consequences, not a wall that should remain in
              against every neutral attack.
            </p>

            <h3>Understanding the Grass/Steel matchup</h3>
            <p>
              Grass/Steel gives Ferrothorn a 4× Fire weakness and a 2× Fighting weakness. Fire is the emergency: even
              modest coverage such as Flamethrower, Mystical Fire, Fire Punch, or Tera Blast can overwhelm it. Fighting
              attacks are less catastrophic but still demand a reliable switch. In exchange, Ferrothorn resists Normal,
              Water, Electric, Psychic, Rock, Dragon, Steel, and Fairy, double-resists Grass, and is immune to Poison.
              Those resistances create entries against many Water- and Electric-type attacks, but abilities and move
              effects still matter. Freeze-Dry, Knock Off, Trick, Taunt, and boosted neutral attacks can punish a switch
              even when the simple type multiplier looks favorable.
            </p>

            <h3>Moves, item choices, and ability</h3>
            <p>
              Stealth Rock or Spikes gives every forced switch lasting value. Leech Seed supplies gradual recovery and
              makes passive opponents choose between losing health and switching through hazards. Power Whip prevents
              Water- and Ground-type Pokémon from treating Ferrothorn as harmless, while Gyro Ball uses its extremely low
              Speed to pressure fast targets. Protect can scout a coverage move and collect another turn of recovery;
              Knock Off removes Boots, Leftovers, or a Choice item. Leftovers improves longevity, whereas Rocky Helmet
              stacks with Iron Barbs to punish contact. Anticipation can reveal dangerous coverage, but Iron Barbs is
              usually the defining ability because it converts physical contact into reliable chip damage.
            </p>

            <h3>Positioning and common mistakes</h3>
            <p>
              Bring Ferrothorn in through a slow pivot, after a teammate faints, or against an attack it comfortably
              resists. On the first safe turn, decide whether hazards, Leech Seed, direct damage, or an immediate switch
              creates the most progress. Automatically setting hazards is a mistake if a Fire attacker can enter for free
              and force the whole team backward. Another mistake is allowing Ferrothorn&apos;s item to be removed too early
              when it is the only long-term answer to a Water attacker. Preserve enough health for the matchup it was
              selected to handle, and remember that Leech Seed is not dependable recovery against Grass targets, Magic
              Guard users, or opponents that can repeatedly force it out.
            </p>

            <h3>Team partners and defensive cores</h3>
            <p>
              Ferrothorn needs teammates that can repeatedly absorb Fire and Fighting attacks. Bulky Water-types are
              natural Fire answers, while Ghost, Fairy, Flying, or Poison partners can help against Fighting depending on
              the format. A Fire-resistant partner that is also weak to Electric or Grass forms a productive exchange:
              Ferrothorn covers those attacks and receives Fire protection in return. Hazard removal is still valuable
              because Ferrothorn may pivot frequently and lacks instant recovery. Avoid building a core where every Fire
              answer is vulnerable to the same Ground or Rock coverage. Check all six team members in the Team Calculator
              and identify a real switch-in rather than counting only the number of resistances.
            </p>

            <h3>How to counter Ferrothorn</h3>
            <p>
              Fire coverage is the fastest answer, especially when delivered by a Pokémon that does not fear Power Whip
              or Gyro Ball. Fighting attacks also work, but contact moves may take Iron Barbs and Rocky Helmet damage.
              Taunt blocks hazards, Leech Seed, and Protect; Trick can lock Ferrothorn into one move; Knock Off removes
              its recovery or contact-punishing item. Substitute users may exploit a passive set if its attacking move
              cannot break the substitute. Pressure it with hazards and repeated forced switches when direct coverage is
              unavailable. Always verify the ruleset: Terastallization can remove the usual weaknesses, and different
              generations or competitive formats may change available moves, items, and legal teammates.
            </p>
          </article>
        )}

        <section className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Competitive Strategy</h2>
          {guide?.strategy ? (
            <div className="space-y-4">
              {guide.strategy.map(paragraph => <p key={paragraph} className="text-gray-700 leading-relaxed">{paragraph}</p>)}
            </div>
          ) : <p className="text-gray-700 leading-relaxed">{pokemon.strategy}</p>}
        </section>

        {/* Counters */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Best Counters</h2>
          <ul className="space-y-2">
            {(guide?.counters ?? pokemon.counters).map(counter => (
              <li key={counter} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-700">{counter}</span>
              </li>
            ))}
          </ul>
        </section>

        {guide?.defense && guide.team && (
          <>
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Defensive Profile</h2>
              <div className="space-y-4">
                {guide.defense.map(paragraph => <p key={paragraph} className="text-gray-700">{paragraph}</p>)}
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Counterplay and Teammates</h2>
              <div className="space-y-4">
                {guide.team.map(paragraph => <p key={paragraph} className="text-gray-700">{paragraph}</p>)}
              </div>
            </section>
          </>
        )}

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is {pokemon.name} weak to?</h3>
              <p className="text-gray-700">
                {weaknesses && weaknesses.quadrupleWeak.length > 0 && (
                  <>{pokemon.name} is 4× weak to {weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}. </>
                )}
                {weaknesses && weaknesses.doubleWeak.length > 0 && (
                  <>{pokemon.name} is 2× weak to {weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.</>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is the best moveset for {pokemon.name}?</h3>
              <p className="text-gray-700">
                The recommended moveset is: {pokemon.recommendedMoves.join(', ')}.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How to counter {pokemon.name}?</h3>
              <p className="text-gray-700">
                {garchompCounterAnswer ?? `Best counters: ${counterNames.join(', ')}.`}
              </p>
            </div>
            {guide?.faq?.map(([question, answer]) => (
              <div key={question}>
                <h3 className="font-semibold text-lg mb-2">{question}</h3>
                <p className="text-gray-700">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Explore More</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm">
                {typesData.types.find(td => td.id === t)?.name} Type Guide
              </Link>
            ))}
            {BATCH6_TYPE_CHART_LINK_POKEMON.has(pokemon.id) && (
              <Link href="/pokemon/type-chart" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
                Type Chart
              </Link>
            )}
            <Link href="/calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
              Type Calculator
            </Link>
            <Link href="/pokemon/team-calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
              Team Calculator
            </Link>
            {relatedPokemon.map(related => (
              <Link
                key={related.id}
                href={`/pokemon/${related.id}`}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm"
              >
                {related.name} Weakness Guide
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
