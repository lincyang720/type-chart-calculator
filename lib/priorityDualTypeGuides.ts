// Hand-written guides for the 12 dual-type pages that stay in the AdSense review.
// DualTypeContent renders these in place of the generated combination template.
// Slugs match /types/[type] and lib/editorialCombinations.ts.

export type GuideLink = { href: string; label: string };

export type GuideCallout = {
  label: string;
  detail: string;
  href: string;
  linkLabel: string;
};

export type GuideSpecies = {
  name: string;
  href?: string;
  role: string;
};

export type GuidePlay = {
  title: string;
  body: string;
};

export type CombinationGuide = {
  heading: string;
  opening: string;
  offense: string;
  counterplay: string;
  teamBuilding: string;
  extraLinks?: GuideLink[];
  faqs: { question: string; answer: string }[];
  species?: GuideSpecies[];
  callouts?: GuideCallout[];
  plays?: GuidePlay[];
  formatNote?: string;
};

const howToRead: GuideLink = {
  href: '/blog/how-to-read-dual-type-chart',
  label: 'How to read a dual-type chart',
};

const everyFourX: GuideLink = {
  href: '/blog/every-4x-weakness-gen-9',
  label: 'Every 4× weakness in Gen 9',
};

const coreChoice: GuideLink = {
  href: '/blog/water-ground-vs-steel-fairy-vs-dragon-ground',
  label: 'Water/Ground vs Steel/Fairy vs Dragon/Ground',
};

function calculatorLink(type1: string, type2: string, label: string): GuideLink {
  return { href: `/calculator?type1=${type1}&type2=${type2}`, label };
}

export const PRIORITY_DUAL_TYPE_GUIDES: Record<string, CombinationGuide> = {
  'steel-fairy': {
    heading: 'Steel/Fairy in practice: Tinkaton, then the Fire and Ground turns',
    opening:
      'Steel/Fairy is the defensive pair with two ordinary 2× weaknesses and two immunities. Fire is 2× into Steel and 1× into Fairy. Ground is the same product. Poison is 0× because Steel is immune, and Dragon is 0× because Fairy is immune. Bug is 0.25×. Fighting cancels: 2× into Steel and 0.5× into Fairy, so Close Combat is 1×. In Generation 9 the Pokémon you actually send is Tinkaton. Magearna is the special attacker from earlier generations, and Crowned Zacian is the restricted physical attacker.',
    species: [
      {
        name: 'Tinkaton',
        href: '/pokemon/tinkaton',
        role: 'The Paldea Steel/Fairy. Gigaton Hammer, Play Rough, Knock Off, and Stealth Rock. Mold Breaker ignores abilities such as Levitate. It does not remove a Flying type’s immunity to Ground.',
      },
      {
        name: 'Zacian',
        href: '/pokemon/zacian',
        role: 'Crowned Zacian is Fairy/Steel in restricted formats. Behemoth Blade and Play Rough, with Intrepid Sword raising Attack on entry. Fire and Ground are still 2×.',
      },
      {
        name: 'Magearna',
        href: '/pokemon/magearna',
        role: 'The special Steel/Fairy from earlier generations: Fleur Cannon and Flash Cannon. Soul-Heart rewards KOs. The chart is the same one Tinkaton uses.',
      },
    ],
    callouts: [
      {
        label: 'No 4× weakness',
        detail: 'Fire and Ground are the only super-effective types, and each is 2×. A Fire move is not 4× into this pair. Fairy does not add a second Fire weakness.',
        href: '/calculator?type1=steel&type2=fairy',
        linkLabel: 'Open Steel/Fairy in the Dual Type Calculator',
      },
      {
        label: 'Immune to Poison and Dragon',
        detail: 'Poison is 0× through Steel. Dragon is 0× through Fairy. Draco Meteor and Sludge Bomb are both blank clicks into Tinkaton.',
        href: '/blog/water-ground-vs-steel-fairy-vs-dragon-ground',
        linkLabel: 'Compare Steel/Fairy with Water/Ground and Dragon/Ground',
      },
    ],
    offense:
      'Play Rough is 2× into Dragapult (Dragon/Ghost) and 4× into Roaring Moon (Dark/Dragon). It is 1× into Kingambit, because Dark is weak to Fairy and Steel resists Fairy. Gigaton Hammer and Flash Cannon are 0.25× into Heatran: Fire resists both Steel and Fairy, and Steel resists both as well. Heatran is the switch that makes both STABs bounce. The follow-up is a Ground partner, not a second Steel or Fairy click. Gigaton Hammer also cannot be selected on the next turn, so Tinkaton’s breaking move is a one-turn window.',
    plays: [
      {
        title: 'Switch into Draco Meteor, leave on Headlong Rush',
        body: 'Tinkaton takes Dragapult’s Draco Meteor at 0× and can Knock Off the item or set Stealth Rock. Great Tusk’s Headlong Rush is Ground, so it is 2×. That is the turn to go to Corviknight, which takes Ground at 0×, or to a Water resist that actually wants the Tusk.',
      },
      {
        title: 'Heatran blanks both STABs',
        body: 'Flash Cannon and Play Rough are each 0.25× into Heatran. Clicking them is how Heatran gets a free Magma Storm, and Magma Storm is 2× back. Switch to Garchomp. Earthquake is 4× into Fire/Steel. Stealth Rock still chips Heatran on the way in, and that chip is only one eighth: Fire is weak to Rock and Steel resists Rock, so Rock is 1×. The knockout is the Ground move.',
      },
    ],
    counterplay:
      'Fire and Ground are the chart answers, and they are 2× rather than a one-shot 4×, so bulk and recovery can live through one hit. Great Tusk, Excadrill, and Heatran are the Pokémon that make the weakness real. Knock Off removes Leftovers or an Air Balloon before the second Ground move. An Air Balloon postpones Earthquake once. A Flying Tera Type removes the Ground weakness and gives up the Steel/Fairy resistances that made the switch worth it. Bug is a poor attack into this pair at 0.25×.',
    formatNote:
      'Singles builds Tinkaton as the hazard and Knock Off slot beside a Ground immunity. Restricted VGC builds Crowned Zacian as the attacker, and the same Fire and Ground moves are still 2× when two opponents can click them on the same turn. The typing does not change. The number of Pokémon that can aim a Ground move at it does.',
    teamBuilding:
      'Put a Ground immunity next to Tinkaton before you add a sweeper. Corviknight takes Earthquake at 0× and takes the Grass moves that scare Swampert. Swampert takes Fire at 0.5× and Electric at 0×, which are the attacks aimed at Corviknight, and it takes Ground from Tusk at 1×. Garchomp is the partner that actually threatens Heatran after Tinkaton’s STABs do 0.25×. Check the six in the team calculator so the team does not quietly become three Pokémon that all take Headlong Rush at 2×.',
    extraLinks: [
      calculatorLink('steel', 'fairy', 'Steel/Fairy calculator preset'),
      howToRead,
      coreChoice,
      { href: '/types/water-ground', label: 'Water/Ground guide' },
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Steel/Fairy weak to?',
        answer: 'Fire and Ground, each at 2×. There is no 4× weakness. Fighting and Steel both cancel to 1×.',
      },
      {
        question: 'What is Steel/Fairy immune to?',
        answer: 'Poison, through Steel, and Dragon, through Fairy. Bug is 0.25×.',
      },
      {
        question: 'Which Generation 9 Pokémon is Steel/Fairy?',
        answer: 'Tinkaton. Crowned Zacian is Steel/Fairy in restricted formats, and Magearna shares the chart when the format allows it.',
      },
    ],
  },
  'water-ground': {
    heading: 'Water/Ground in practice: one weakness, and it is 4× Grass',
    opening:
      'Water/Ground has a single super-effective type. Grass is 2× into Water and 2× into Ground, so the product is 4×. Electric is 0× because Ground is immune, which is why the pair looks safe on a weakness count. Fire, Poison, Rock, and Steel are 0.5×. Water and Ice each cancel to 1×: Water is 0.5× into Water and 2× into Ground, and Ice is 0.5× into Water and 2× into Ground. Swampert, Gastrodon, and Quagsire share that chart. Freeze-Dry is an Ice move that treats Water as weak to Ice, so it is also 4× into this pair.',
    species: [
      {
        name: 'Swampert',
        href: '/pokemon/swampert',
        role: 'The bulky singles shape: Stealth Rock, Earthquake, Waterfall, Ice Punch. Rock chip on the way in is one sixteenth, because Rock is 0.5×.',
      },
      {
        name: 'Gastrodon',
        role: 'The doubles shape. Storm Drain pulls a single-target Water move onto Gastrodon, boosts Special Attack, and still leaves Grass at 4×. Earth Power and Ice Beam are the usual attacks.',
      },
      {
        name: 'Quagsire',
        role: 'Unaware ignores the opponent’s stat boosts and does not change the type line. Water Absorb makes Water 0×. Grass is still 4× on either ability.',
      },
    ],
    callouts: [
      {
        label: '4× Grass',
        detail: 'Grass is the only super-effective type. Rillaboom’s Grassy Glide is that product at priority, and both of Water/Ground’s STABs are 0.5× into Rillaboom. Freeze-Dry is the same 4×.',
        href: '/calculator?type1=water&type2=ground',
        linkLabel: 'Open Water/Ground in the Dual Type Calculator',
      },
      {
        label: 'Immune to Electric',
        detail: 'Volt Switch, Thunderbolt, and Discharge do 0×. The immunity is why this pair switches into Electric attackers. It does not reduce Grass.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'See Grass on the Gen 9 4× list',
      },
    ],
    offense:
      'Waterfall is 2× into Great Tusk, Excadrill, and Heatran. Earthquake is 4× into Heatran, 2× into Gholdengo and Kingambit, 1× into Ferrothorn, and 0× into Corviknight and Pelipper. Ice Punch is the coverage that threatens Grass switch-ins, and it does not outrun Grassy Glide. A Water/Ground that only clicks its STABs gives Rillaboom, Amoonguss, and Ferrothorn comfortable turns: Ferrothorn takes Waterfall at 0.5× and Earthquake at 1×, then clicks Grass back at 4×.',
    plays: [
      {
        title: 'Take the Volt Switch, then leave before Grassy Glide',
        body: 'Swampert switches into Rotom-Wash’s Volt Switch at 0× and can set Stealth Rock. The Rock chip on Swampert itself is one sixteenth. If Rillaboom is the next Pokémon, Grassy Glide is 4× and priority, and Waterfall and Earthquake are both 0.5× into it. Go to Corviknight or Scizor. Grass is 0.25× into both.',
      },
      {
        title: 'Storm Drain only redirects Water',
        body: 'In doubles, Gastrodon sits next to a Pokémon that wants to click Surf. Storm Drain pulls that Surf onto Gastrodon for 0× and a Special Attack boost. Amoonguss can still target Gastrodon with a Grass move on the same turn. The redirect does not give you a Grass immunity, and Ice Beam is how Gastrodon threatens Amoonguss before that click.',
      },
    ],
    counterplay:
      'Lead with Grass and keep a second Grass move on the team, because one Rillaboom can be pivoted around. Energy Ball, Leaf Storm, and Giga Drain all use the 4× line. Electric attacks are a blank click unless the Water/Ground Pokémon has switched out. Strong neutral special attacks matter once Grass is gone: the typing has no second weakness to fall back on. Quagsire’s Unaware ignores a Swords Dance and still takes Grass at 4×.',
    formatNote:
      'Singles uses Swampert or Quagsire as the Electric immunity that also sets hazards or ignores boosts. VGC uses Gastrodon because Storm Drain changes which slot a Water move hits. The 4× Grass line is the same in both games. Doubles makes it sharper, because the Grass attacker can target Gastrodon while a partner hits the Pokémon you wanted to switch to.',
    teamBuilding:
      'Name the Grass answer before you lock Water/Ground as the first core. Corviknight and Scizor take Grass at 0.25× and give the Electric and Fire attacks back to Swampert. A team with only one of those answers folds the first time Grassy Glide comes out after that Pokémon faints. The core comparison with Steel/Fairy and Dragon/Ground is the page for choosing which hole you would rather have.',
    extraLinks: [
      calculatorLink('water', 'ground', 'Water/Ground calculator preset'),
      howToRead,
      everyFourX,
      coreChoice,
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/types/bug-steel', label: 'Bug/Steel guide' },
      { href: '/pokemon/swampert', label: 'Swampert' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Water/Ground 4× weak to?',
        answer: 'Grass. It is the only super-effective type. Freeze-Dry is also 4× because it treats Water as weak to Ice.',
      },
      {
        question: 'Is Water/Ground immune to Electric?',
        answer: 'Yes. Ground makes Electric 0×, including Volt Switch. Water alone would be weak to Electric.',
      },
      {
        question: 'Why do Swampert, Gastrodon, and Quagsire play differently?',
        answer: 'They share the chart. Swampert is the singles hazard setter, Gastrodon redirects Water in doubles, and Quagsire’s Unaware ignores boosts. Grass is 4× for all three.',
      },
    ],
  },
  'ground-dragon': {
    heading: 'Ground/Dragon in practice: Garchomp’s Earthquake, then the Ice Shard',
    opening:
      'Garchomp is the Ground/Dragon you build. Ice is 2× into Ground and 2× into Dragon, so Ice Beam, Ice Shard, and Ice Spinner are 4×. Electric is 0×. Fire, Poison, and Rock are 0.5×. Dragon and Fairy are 2×. Water and Grass cancel to 1×, which is why a weakness count that stops at “weak to Ice” misses the two 2× lines and overstates Water and Grass. Flygon shares the typing and is a different Speed and move set. Stealth Rock removes one sixteenth on entry, because Rock is 0.5×.',
    species: [
      {
        name: 'Garchomp',
        href: '/pokemon/garchomp',
        role: 'Rough Skin, Earthquake, Dragon Claw or Outrage, Swords Dance, and Stealth Rock. Fire Blast is the coverage click into Flying/Steel. Generation 9 still uses this set.',
      },
      {
        name: 'Flygon',
        role: 'The other fully evolved Ground/Dragon. Electric is 0× because of the Ground type. Levitate is Flygon’s ability, a separate Ground immunity, and Ice is still 4×.',
      },
    ],
    callouts: [
      {
        label: '4× Ice',
        detail: 'Ice Shard, Ice Beam, and Ice Spinner are 4×. Weavile’s Ice Shard is that product at priority. Freeze-Dry is Ice as well, so it is 4× here even before its Water effect matters.',
        href: '/calculator?type1=ground&type2=dragon',
        linkLabel: 'Open Ground/Dragon in the Dual Type Calculator',
      },
      {
        label: 'Immune to Electric',
        detail: 'Thunderbolt and Volt Switch do 0×. Fairy is still 2×, and Dragon moves do 0× into Fairy. The Electric immunity does not answer Flutter Mane.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Ice on the Gen 9 4× list',
      },
    ],
    offense:
      'Earthquake is the reason to start with this core when the wall is Heatran, Gholdengo, or Kingambit. It is 4× into Heatran, 2× into Gholdengo and Kingambit, and 0× into Corviknight, Skarmory, and Pelipper. Dragon Claw is 2× into other Dragons and 0× into Flutter Mane and Tinkaton. Into Corviknight, Fire Blast is 2× and Stone Edge is 1×, because Rock is 2× into Flying and 0.5× into Steel. Outrage into a Fairy switch locks Garchomp into a move that then does 0×.',
    plays: [
      {
        title: 'Earthquake the Steel, Fire Blast the bird',
        body: 'Garchomp clicks Earthquake into Heatran for 4×, or into Kingambit and Gholdengo for 2×. Corviknight takes that Earthquake at 0×. The next click is Fire Blast, which is 2× into Flying/Steel. Staying on Earthquake, or clicking Dragon Claw at 0.5× into Steel, is how Corviknight Defogs for free.',
      },
      {
        title: 'Ice Shard ends the Swords Dance',
        body: 'Weavile’s Ice Shard is 4× and priority. A Swords Dance in front of Weavile is the turn Garchomp faints. Flutter Mane is the other switch: Moonblast is 2×, Outrage is 0×, and Extreme Speed is not Garchomp’s move. Earthquake is 1× into Ghost/Fairy. Tinkaton takes the Moonblast at 0.5× and is immune to a Dragon move if Garchomp has already locked itself.',
      },
    ],
    counterplay:
      'Keep an Ice move that you do not have to reveal on turn one, and keep a Fairy that can take a Ground hit. Ice Shard does not care that Garchomp outspeeds Weavile. A Focus Sash or a Yache Berry changes the first Ice hit and does not change the multiplier. Flying and Levitate still blank Earthquake, so a team whose only answer is Corviknight still needs the Fire or Rock coverage scouted.',
    formatNote:
      'Singles Garchomp is the Stealth Rock or Swords Dance attacker, and the Ice Shard from Weavile is the emergency. In doubles, Earthquake hits both opponents and also your ally unless that ally is Flying, Levitate, or otherwise immune. The 4× Ice line is the same. The spread move is the part that changes the team you put next to it.',
    teamBuilding:
      'Name an Ice resist before you call Garchomp the first core. Tinkaton takes Ice at 0.5×. Corviknight takes Ice at 1×, because Flying is weak to Ice and Steel resists it. Tinkaton also takes Fairy attacks aimed at Garchomp at 0.5× and is immune to Dragon. Water/Ground is the wrong partner if Grass is already the more common attack in the room: Swampert’s Grass hole is 4×, and it does not resist the Ice move aimed at Garchomp. The core guide compares that choice directly.',
    extraLinks: [
      calculatorLink('ground', 'dragon', 'Ground/Dragon calculator preset'),
      howToRead,
      everyFourX,
      coreChoice,
      { href: '/types/steel-fairy', label: 'Steel/Fairy guide' },
      { href: '/types/dragon-flying', label: 'Dragon/Flying guide' },
      { href: '/pokemon/garchomp', label: 'Garchomp' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Ground/Dragon 4× weak to?',
        answer: 'Ice. Dragon and Fairy are 2×. Water and Grass cancel to 1×. Electric is 0×.',
      },
      {
        question: 'Does Earthquake hit every Steel wall?',
        answer: 'It is 4× into Heatran and 2× into Gholdengo and Kingambit. It is 0× into Corviknight and Skarmory.',
      },
      {
        question: 'Why is Garchomp the Ground/Dragon in Generation 9?',
        answer: 'Garchomp is the one with the stats, Rough Skin, and the Stealth Rock or Swords Dance sets. Flygon shares the multipliers and not the role.',
      },
    ],
  },
  'fire-flying': {
    heading: 'Fire/Flying in practice: Charizard, Boots, and a 50% Rock entry',
    opening:
      'Charizard, Talonflame, and Moltres share Fire/Flying. Rock is 2× into Fire and 2× into Flying, so Stone Edge is 4× and Stealth Rock removes half of maximum HP on entry. Water and Electric are 2×. Ground is 0×. Grass and Bug are 0.25×. Fire, Fighting, Steel, and Fairy are 0.5×. Heavy-Duty Boots are part of the typing in singles, because the Ground immunity is only free if the entry did not already cost half the health bar.',
    species: [
      {
        name: 'Charizard',
        href: '/pokemon/charizard',
        role: 'The Generation 9 special attacker. Flamethrower or Fire Blast, Hurricane or Air Slash, Roost, and Focus Blast. Solar Power needs sun. Blaze does not. Boots are the item unless a remover is guaranteed.',
      },
      {
        name: 'Talonflame',
        role: 'Gale Wings gives Flying moves priority only at full HP. Stealth Rock’s 50% means Gale Wings is gone after one entry unless Boots are on.',
      },
      {
        name: 'Moltres',
        role: 'The bulky special Fire/Flying. The same Rock 4× and the same Ground immunity. Roost and a status move are the usual way it uses the bulk Charizard does not have.',
      },
    ],
    callouts: [
      {
        label: '4× Rock',
        detail: 'Rock is the only 4× weakness. Stealth Rock removes 50% on entry. Knock Off on the Boots, or a blocked Defog, is how that 50% happens more than once.',
        href: '/calculator?type1=fire&type2=flying',
        linkLabel: 'Open Fire/Flying in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground',
        detail: 'Earthquake and Headlong Rush do 0×. Water and Electric are still 2×. The Ground switch is the entry you want, and it still pays the Rock tax without Boots.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Rock on the Gen 9 4× list',
      },
    ],
    offense:
      'Flamethrower is 4× into Scizor and Ferrothorn, and it is 2× into Corviknight. Hurricane is 2× into Fighting types such as Great Tusk and 0.5× into Rock. Both STABs are 0.5× into Tyranitar. Focus Blast is 4× into Tyranitar because Fighting is 2× into Rock and 2× into Dark. Solar Beam in sun hits Water and Ground answers, and it does nothing about the Rock weakness. A set that tries to run all of those coverage moves is not a set.',
    plays: [
      {
        title: 'Boots, then the Headlong Rush switch',
        body: 'Charizard with Heavy-Duty Boots switches into Great Tusk’s Headlong Rush at 0× and clicks Flamethrower or Hurricane. Without Boots, Stealth Rock has already removed half of Charizard before that Ground immunity matters. Tyranitar’s Stone Edge is 4×, so Charizard does not stay in to find out. Focus Blast is the coverage that is 4× back into Rock/Dark.',
      },
      {
        title: 'Talonflame only has Gale Wings at full HP',
        body: 'Talonflame’s priority Brave Bird needs full health. One Rock entry takes 50% and turns Gale Wings off. Boots keep the priority. A team that puts Talonflame in without Boots or a remover is spending the priority on the first switch.',
      },
    ],
    counterplay:
      'Stealth Rock is the answer you set and then protect. Stone Edge and Rock Slide are the attack you click when Charizard is already in. Water and Electric are the 2× clicks when Rock accuracy is the problem: Swampert’s Waterfall and Raging Bolt’s Thunderclap both qualify. Sun boosts Fire and weakens Water. Rain does the opposite. Neither weather changes Rock. Knock Off on Boots, then a second entry, is the sequence.',
    formatNote:
      'Singles is a hazard format, so the 4× Rock weakness is a 50% entry tax and Boots are the item. VGC rarely stacks Stealth Rock, so the same weakness shows up as Rock Slide from the partner’s slot while Charizard is attacking into sun with Torkoal. The multiplier is 4× in both. The way you pay it is different.',
    teamBuilding:
      'Charizard needs a remover and a Pokémon that takes Rock, Water, and Electric more than once. Great Tusk sets rocks against the opponent and also threatens Charizard, so it is a partner and a problem. A Ground immunity on the opposing team is what Charizard switches into. A Ground teammate of your own takes the Electric moves aimed at Charizard. Run the six through the team calculator with Stealth Rock assumed on, and count Charizard’s health after one entry before you give it a setup move.',
    extraLinks: [
      calculatorLink('fire', 'flying', 'Fire/Flying calculator preset'),
      howToRead,
      everyFourX,
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/types/bug-steel', label: 'Bug/Steel guide' },
      { href: '/pokemon/charizard', label: 'Charizard' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Fire/Flying 4× weak to?',
        answer: 'Rock. Stealth Rock removes 50% on entry. Water and Electric are 2×. Ground is 0×.',
      },
      {
        question: 'Why do Charizard and Talonflame run Heavy-Duty Boots?',
        answer: 'Boots block the 50% Rock entry. Talonflame also needs full HP for Gale Wings, which the Rock chip removes.',
      },
      {
        question: 'What does sun change for Fire/Flying?',
        answer: 'Sun boosts Fire and weakens Water. Rock stays 4×, and Electric stays 2×.',
      },
    ],
  },
  'flying-steel': {
    heading: 'Flying/Steel in practice: Corviknight’s Defog turn',
    opening:
      'Corviknight and Skarmory are the Flying/Steel pair in current play. There is no 4× weakness. Fire is 2×, and Electric is 2×. Ground is 0× through Flying. Poison is 0× through Steel. Grass and Bug are 0.25×. Stealth Rock is neutral into this pair: Rock is 2× into Flying and 0.5× into Steel, so the entry chip is the ordinary one eighth. That is why Corviknight can Defog repeatedly. Celesteela shares the chart and is not a Generation 9 Pokémon.',
    species: [
      {
        name: 'Corviknight',
        href: '/pokemon/corviknight',
        role: 'Pressure, Defog, Brave Bird, Roost, U-turn, and Body Press. The singles pivot that switches into Ground and Poison, removes hazards, and leaves.',
      },
      {
        name: 'Skarmory',
        href: '/pokemon/skarmory',
        role: 'The same chart with Spikes instead of Corviknight’s bulkier pivot sets. Defog and Brave Bird are still there. Fire and Electric are still 2×.',
      },
    ],
    callouts: [
      {
        label: 'No 4× weakness',
        detail: 'Fire and Electric are 2×. Nothing on the chart reaches 4×. A strong neutral special hit still matters if Roost has been denied.',
        href: '/calculator?type1=flying&type2=steel',
        linkLabel: 'Open Flying/Steel in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground and Poison',
        detail: 'Earthquake and Headlong Rush are 0×. Sludge Bomb is 0×. The pivot comes in on those moves and should leave when the Fire or Electric attacker is the one staying in.',
        href: '/blog/how-to-read-dual-type-chart',
        linkLabel: 'How the two factors multiply',
      },
    ],
    offense:
      'Brave Bird is 2× into Fighting, Grass, and Bug targets that do not also resist Flying. It is 0.5× into Steel. Body Press uses Corviknight’s Defense and is Fighting, so it is 1× into Tinkaton (Fighting cancels on Steel/Fairy) and 4× into Kingambit. Iron Head is 2× into Fairy types that are not also Steel, and 1× into Tinkaton. U-turn is the progress move when the Fire attacker switches in: Bug is 0.25× into a lot of what you wanted to hit, and the point of U-turn is the switch, not the damage.',
    plays: [
      {
        title: 'Defog the Ground switch, U-turn the Fire switch',
        body: 'Corviknight takes Great Tusk’s Headlong Rush at 0×, Defogs, and Roosts. Heatran’s Magma Storm and Charizard’s Flamethrower are 2×, and Raging Bolt’s Thunderclap is 2×. Those are U-turn turns. Staying in to Defog again in front of Magma Storm is how the pivot faints with the hazards still up.',
      },
      {
        title: 'The Water/Ground loop',
        body: 'Swampert takes Electric at 0× and Fire at 0.5×, and it invites Rillaboom. Corviknight takes that Grass move at 0.25× and invites the Electric move back onto Swampert. The loop works when both Pokémon are alive. After one of them faints, the remaining one is standing on the attack the pair was built to hand off.',
      },
    ],
    counterplay:
      'Fire is the cleaner 2× attack when your own team resists it. Electric is the cleaner one when the opponent’s partner is not a Ground type waiting for the Volt Switch. Ground is 0× unless the Flying type has been grounded. Magma Storm and a burn stop Roost from keeping pace. Knock Off removes Leftovers before the second pivot.',
    formatNote:
      'Singles is where this typing is a core. Corviknight’s Defog and Skarmory’s Spikes need hazards to matter. VGC rarely builds the game around entry hazards, and Intimidate already does the physical-pivot job, so Flying/Steel shows up less often. Fire and Electric are still 2× when it does.',
    teamBuilding:
      'Pair Corviknight with a Pokémon that takes Fire and Electric. Swampert is the direct one: Electric is 0× and Fire is 0.5× into Water/Ground, and the Grass move aimed at Swampert is 0.25× into Corviknight. Tinkaton takes neither Electric nor Fire well (Electric is 1×, Fire is 2×), so it is a Dragon answer beside Corviknight and not a replacement for the Fire switch. Put the six into the team calculator and click the Fire and Electric columns before you add a second Steel.',
    extraLinks: [
      calculatorLink('flying', 'steel', 'Flying/Steel calculator preset'),
      howToRead,
      coreChoice,
      { href: '/types/water-ground', label: 'Water/Ground guide' },
      { href: '/types/steel-fairy', label: 'Steel/Fairy guide' },
      { href: '/pokemon/corviknight', label: 'Corviknight' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Flying/Steel weak to?',
        answer: 'Fire and Electric, each at 2×. There is no 4× weakness.',
      },
      {
        question: 'What is Flying/Steel immune to?',
        answer: 'Ground, through Flying, and Poison, through Steel. Grass and Bug are 0.25×.',
      },
      {
        question: 'Why does Corviknight Defog so often?',
        answer: 'It switches into Earthquake at 0×, and Stealth Rock is only one eighth because Rock cancels to 1×. The Defog turn ends when the Fire or Electric attacker stays in.',
      },
    ],
  },
  'bug-steel': {
    heading: 'Bug/Steel in practice: Scizor’s Bullet Punch and a 4× Fire',
    opening:
      'Scizor is the Bug/Steel you build. Forretress is the hazard setter on the same chart. Fire is 2× into Bug and 2× into Steel, so Flamethrower, Magma Storm, and Flare Blitz are 4×. Poison is 0×. Grass is 0.25×. There is no second 4× weakness, and Ground is not one of the weaknesses: Bug resists Ground, so Ground cancels to 1×. That surprise is why people click Earthquake and get a neutral hit. Rain halves Fire damage and still leaves a Fire move super effective.',
    species: [
      {
        name: 'Scizor',
        href: '/pokemon/scizor',
        role: 'Technician Bullet Punch, U-turn, Knock Off, Swords Dance, and Roost. Bullet Punch is the Steel priority. U-turn is how it leaves when the Fire switch is obvious.',
      },
      {
        name: 'Forretress',
        role: 'Spikes and Rapid Spin on the same 4× Fire chart. It cannot spin in front of Heatran or Charizard. The resistances are what let it set hazards against everything else.',
      },
    ],
    callouts: [
      {
        label: '4× Fire',
        detail: 'Fire is the only super-effective type, and it is 4×. Heatran, Charizard, and Incineroar’s Flare Blitz all use it. Rain cuts that damage in half and the hit is still super effective.',
        href: '/calculator?type1=bug&type2=steel',
        linkLabel: 'Open Bug/Steel in the Dual Type Calculator',
      },
      {
        label: 'Immune to Poison',
        detail: 'Sludge Bomb is 0×. Grass is 0.25×, which is why Scizor is a switch-in for the Grass move aimed at Swampert. Ground is 1×, not a weakness.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Fire on the Gen 9 4× list',
      },
    ],
    offense:
      'Bullet Punch is Steel priority into Fairy, Ice, and Rock. It is 2× into Flutter Mane and Clefable, and 1× into Tinkaton. U-turn is Bug, which is 0.25× into Gholdengo and a poor damage click into Kingambit (Dark is weak to Bug and Steel resists Bug, so the product is 1×). The Bug STAB is for Psychic and Dark targets that do not also resist Bug. Gardevoir is Psychic/Fairy, so Bug cancels to 1×. The move Scizor actually spams is Bullet Punch, and the move that keeps it alive is U-turn into the Fire switch.',
    plays: [
      {
        title: 'Take the Moonblast, Punch, then U-turn',
        body: 'Clefable’s Moonblast is 0.25× into Bug/Steel. Scizor comes in, Swords Dance or Bullet Punch, and threatens Flutter Mane at 2× with that same Steel move. Heatran and Charizard take Bullet Punch at 0.25× or 0.5× and reply with 4× Fire. U-turn on the turn they switch in. Staying for a second Punch is the KO.',
      },
      {
        title: 'Forretress spins against Grass, not against Fire',
        body: 'Forretress takes the Grass move aimed at Swampert at 0.25×, sets Spikes, and can Rapid Spin. Charizard’s Flamethrower is 4×, so the spin turn is forfeit if Charizard is the Pokémon in. The hazard setter and the Fire answer have to be different slots.',
      },
    ],
    counterplay:
      'Keep a Fire move and a way to punish the U-turn. If Scizor always leaves as Heatran comes in, the Fire attacker needs a slow pivot or a partner already aimed at the switch-in. Knock Off removes the item before a Swords Dance set gets a second Roost. Earthquake is only 1×. Players who treat Ground as the Bug/Steel answer are clicking the neutral move and giving Scizor a setup turn.',
    formatNote:
      'Singles can play around one Fire attacker by U-turning to a resist. Doubles often has the Fire move and a second attack on the same turn, so the pivot lands and still gets hit. Scizor is a singles Pokémon for that reason. Incineroar’s Flare Blitz is 4× in VGC on the turns Scizor does show up.',
    teamBuilding:
      'Give Scizor a Fire resist that enjoys the turns Scizor creates. Swampert takes Fire at 0.5× and hands Grass back to Scizor at 0.25×. A Dragon that resists Fire can take Flamethrower, and it still needs an answer when the Fire move is aimed at Scizor and the Dragon is not in. Do not put Charizard and Scizor on the same six and call the Fire weakness covered. The team calculator’s Fire column should show one Pokémon that can switch in more than once.',
    extraLinks: [
      calculatorLink('bug', 'steel', 'Bug/Steel calculator preset'),
      howToRead,
      everyFourX,
      coreChoice,
      { href: '/types/water-ground', label: 'Water/Ground guide' },
      { href: '/types/fire-flying', label: 'Fire/Flying guide' },
      { href: '/pokemon/scizor', label: 'Scizor' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Bug/Steel 4× weak to?',
        answer: 'Fire. It is the only super-effective type. Ground cancels to 1× because Bug resists it.',
      },
      {
        question: 'Is Bug/Steel immune to Poison?',
        answer: 'Yes. Steel makes Poison 0×. Grass is 0.25×.',
      },
      {
        question: 'Why does Scizor U-turn out of Heatran?',
        answer: 'Heatran’s Fire move is 4×, and Bullet Punch is resisted. U-turn is the turn Scizor uses to leave before the Fire attack lands.',
      },
    ],
  },
  'fighting-steel': {
    heading: 'Fighting/Steel in practice: Lucario into Kingambit, then the Ghost',
    opening:
      'Lucario is the Fighting/Steel in ordinary play. Cobalion shares the chart. Crowned Zamazenta is the restricted version. There is no 4× weakness. Fire, Fighting, and Ground are each 2×. Poison is 0×. Bug and Rock are 0.25×, so Stealth Rock removes one thirty-second of Lucario’s HP. The offensive chart is the part people miss: Close Combat is 4× into Kingambit and 0× into Gholdengo, because Ghost is immune to Fighting.',
    species: [
      {
        name: 'Lucario',
        href: '/pokemon/lucario',
        role: 'Swords Dance, Close Combat, Meteor Mash, and Extreme Speed. The Generation 9 sweeper on this typing. Extreme Speed is Normal, so Ghosts are immune to it.',
      },
      {
        name: 'Cobalion',
        role: 'The bulkier Fighting/Steel. The same three 2× weaknesses and the same Poison immunity. It is a defender and a Sacred Sword user, not a second Lucario.',
      },
      {
        name: 'Zamazenta',
        role: 'Crowned Zamazenta is Fighting/Steel in restricted formats. Body Press and Behemoth Bash use the same defensive chart. Fire, Fighting, and Ground stay 2×.',
      },
    ],
    callouts: [
      {
        label: 'No 4× weakness',
        detail: 'Fire, Fighting, and Ground are 2×. A team that prepared a 4× answer for this pair prepared for a different Steel type. The hit is still super effective.',
        href: '/calculator?type1=fighting&type2=steel',
        linkLabel: 'Open Fighting/Steel in the Dual Type Calculator',
      },
      {
        label: 'Immune to Poison',
        detail: 'Poison is 0×. Bug and Rock are 0.25×. Lucario can set up on a Poison move. It cannot set up on Earthquake, Flamethrower, or Close Combat.',
        href: '/blog/how-to-read-dual-type-chart',
        linkLabel: 'How a 2× and a 0.5× cancel',
      },
    ],
    offense:
      'Close Combat is 4× into Kingambit (Dark/Steel) and 2× into Ting-Lu (Dark/Ground). It is 1× into Tinkaton, because Fairy resists Fighting and Steel is weak to it. It is 0× into Gholdengo. Meteor Mash is 2× into Clefable and Flutter Mane, 1× into Tinkaton, and 0.5× into Gholdengo. Extreme Speed is 0× into every Ghost, including Gholdengo and Flutter Mane. The set breaks Kingambit and then needs a partner for the Ghost that switches in.',
    plays: [
      {
        title: 'Swords Dance on the Poison move, Close Combat Kingambit',
        body: 'Lucario takes a Sludge Bomb at 0×, uses Swords Dance, and Close Combats Kingambit for 4×. Tinkaton is the Steel/Fairy switch that does not care: Close Combat and Meteor Mash are both 1× into it, and Play Rough back is 1× before the Defense drop from Close Combat. The partner that threatens Tinkaton has to be ready. Lucario’s own STABs are not that partner.',
      },
      {
        title: 'Gholdengo blanks both the priority and the Fighting move',
        body: 'Extreme Speed is 0× into Gholdengo. Close Combat is 0×. Meteor Mash is 0.5×. Make It Rain back is 2×. The turn Gholdengo comes in is a switch to Garchomp, whose Earthquake is 2× into Ghost/Steel, or to a Fire attacker. Clicking the third Steel move is how Lucario loses the KO it just set up.',
      },
    ],
    counterplay:
      'Ground, Fire, and a Ghost that can take one Meteor Mash are the three answers, and you want two of them because Lucario is faster than a lot of the walls. Great Tusk’s Headlong Rush is 2×. Heatran’s Magma Storm is 2×. Gholdengo is the switch that makes the Fighting STAB and the Normal priority disappear. A Fighting move of your own is also 2×, which matters when the Lucario player expected their Steel type to resist Close Combat. It does not.',
    formatNote:
      'Singles Lucario is a setup sweeper with Extreme Speed, and the game is about whether Gholdengo or a Ground type is still alive after Kingambit drops. Restricted VGC uses Crowned Zamazenta as a bulkier Fighting/Steel that clicks Body Press, and the opponents can aim Fire and Ground at it in the same turn. The chart is identical. The speed-sweeper plan is the singles one.',
    teamBuilding:
      'Lucario wants a Ghost answer and a Ground resist more than it wants another Steel. Garchomp takes the Electric immunity role and hits Gholdengo with Earthquake. Corviknight takes Ground moves aimed at Lucario at 0× and does not enjoy the Fire move that also hits Lucario. Keep the Fire and Ground columns short on the team calculator. A second Fighting/Steel does not cover Lucario’s weaknesses.',
    extraLinks: [
      calculatorLink('fighting', 'steel', 'Fighting/Steel calculator preset'),
      howToRead,
      { href: '/types/steel-fairy', label: 'Steel/Fairy guide' },
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/pokemon/lucario', label: 'Lucario' },
      { href: '/pokemon/gholdengo', label: 'Gholdengo' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Fighting/Steel weak to?',
        answer: 'Fire, Fighting, and Ground, each at 2×. There is no 4× weakness. Poison is 0×.',
      },
      {
        question: 'Does Close Combat beat every Steel type?',
        answer: 'It is 4× into Kingambit and 0× into Gholdengo. Into Tinkaton it cancels to 1×.',
      },
      {
        question: 'Why does Extreme Speed fail into Gholdengo?',
        answer: 'Extreme Speed is Normal, and Ghost is immune to Normal. Close Combat is also 0× into Ghost. Meteor Mash is the STAB that connects, at 0.5×.',
      },
    ],
  },
  'electric-flying': {
    heading: 'Electric/Flying in practice: Kilowattrel’s Volt Switch and a 25% Rock entry',
    opening:
      'Kilowattrel is the Generation 9 Electric/Flying. Zapdos is the bulky one with Roost. There is no 4× weakness. Ice and Rock are 2×, so Stealth Rock removes one quarter on entry. Ground is 0×. Grass, Fighting, Flying, Bug, and Steel are 0.5×. Flying STAB is 0.5× into Steel. Electric is neutral into Steel, and it is 2× into Corviknight because the Flying half is weak to Electric and Steel does not cancel that weakness.',
    species: [
      {
        name: 'Kilowattrel',
        role: 'The Paldea Electric/Flying. Volt Switch, Thunderbolt, Hurricane, and Discharge. Wind Power charges Electric moves after it is hit by wind. It is frail, so the quarter from Stealth Rock is a large part of its health.',
      },
      {
        name: 'Zapdos',
        role: 'Thunderbolt, Hurricane, Heat Wave, Roost, and Volt Switch. Boots keep the 25% Rock entry off. Roost is what lets it switch into Earthquake more than once.',
      },
      {
        name: 'Thundurus',
        role: 'The older special attacker on this chart. Prankster support sets and the offensive sets share Ice and Rock at 2× and Ground at 0×.',
      },
    ],
    callouts: [
      {
        label: 'No 4× weakness',
        detail: 'Ice and Rock are the only super-effective types, each at 2×. Stealth Rock is one quarter because Rock is 2× into Flying and 1× into Electric.',
        href: '/calculator?type1=electric&type2=flying',
        linkLabel: 'Open Electric/Flying in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground',
        detail: 'Earthquake and Headlong Rush are 0×. That is the switch-in. Ice Shard and Stone Edge are the reasons it does not stay.',
        href: '/blog/how-to-read-dual-type-chart',
        linkLabel: 'Read the Ground immunity on a dual-type chart',
      },
    ],
    offense:
      'Thunderbolt is 4× into Pelipper and Gyarados, 2× into Corviknight, 1× into Heatran, and 0× into Ground. Hurricane is 2× into Great Tusk, because Flying is 2× into Fighting, and 1× into Garchomp. It is not a universal Ground punish. Heat Wave is 4× into Scizor and Ferrothorn, and 1× into Heatran. The Electric move is for the Water/Flying and the Flying/Steel. The Flying move is for the Fighting type that thinks it can take Volt Switch.',
    plays: [
      {
        title: 'Earthquake in, Hurricane only if it is Great Tusk',
        body: 'Kilowattrel switches into Earthquake at 0×. If a Water type stays, Volt Switch is 2× and keeps the momentum. If the switch is Great Tusk, Hurricane is 2× into Ground/Fighting. If the switch is Garchomp, Hurricane is 1× and Garchomp’s Stone Edge or Fire Blast is waiting. Kilowattrel leaves. The Ground immunity got you in. It does not mean every Ground Pokémon is your target.',
      },
      {
        title: 'Zapdos, Boots, and the Rock quarter',
        body: 'Zapdos with Heavy-Duty Boots switches into Headlong Rush, Roosts, and Thunderbolts the Water type that comes back. Without Boots, Stealth Rock takes one quarter each entry, and Roost is spent recovering the hazard instead of the attack. Weavile’s Ice Shard is 2× and priority. Zapdos does not Roost in front of it.',
      },
    ],
    counterplay:
      'Rock and Ice are the attacks. Stealth Rock makes the frail ones, Kilowattrel especially, switch in already hurt. A Ground switch blanks the Electric move and invites Hurricane only if that Ground type is also weak to Flying. Special bulk lives through one Thunderbolt. It does not live through a Volt Switch into a second special attacker. Knock Off on Boots brings the Rock quarter back.',
    formatNote:
      'Singles Kilowattrel and Zapdos are Volt Switch pivots, and the Rock entry is the tax. In doubles, Discharge is the spread Electric move, and a Ground partner takes it at 0× while both opponents take the hit. That partner is the reason to click Discharge. Without the immune ally, Discharge hits your own slot too.',
    teamBuilding:
      'Put a Rock and Ice answer next to Zapdos, and put a Ground type next to it if you want the Discharge turn in doubles. Swampert takes Electric attacks aimed at your Water types and is not needed to take Electric aimed at Zapdos. Tinkaton takes the Ice attacks at 0.5×. Corviknight takes Ice and Rock at 1×, and Thunderbolt from Zapdos is 2× into Corviknight, so it is the target rather than the switch. The team calculator should show someone who switches into Stone Edge more than once.',
    extraLinks: [
      calculatorLink('electric', 'flying', 'Electric/Flying calculator preset'),
      howToRead,
      { href: '/types/water-flying', label: 'Water/Flying guide' },
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/pokemon/pelipper', label: 'Pelipper, the 4× Electric target' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Electric/Flying weak to?',
        answer: 'Ice and Rock, each at 2×. There is no 4× weakness. Stealth Rock removes one quarter.',
      },
      {
        question: 'Is Electric/Flying immune to Ground?',
        answer: 'Yes. Flying makes Ground 0×. Ice and Rock are the attacks that still hit super effectively.',
      },
      {
        question: 'Which Generation 9 Pokémon is Electric/Flying?',
        answer: 'Kilowattrel. Zapdos is the bulky Roost version of the same chart.',
      },
    ],
  },
  'water-flying': {
    heading: 'Water/Flying in practice: Gyarados in singles, Pelipper in the rain',
    opening:
      'Electric is 2× into Water and 2× into Flying, so Thunderbolt, Thunderclap, and Discharge are 4×. Rock is 2×, and Stealth Rock removes one quarter. Ground is 0×. Fire, Water, Fighting, Bug, and Steel are 0.5×. Gyarados is the Dragon Dance sweeper. Pelipper is the Drizzle setter. Cramorant shares the chart and a different job. The 4× Electric line is why both of them are built next to a Ground type.',
    species: [
      {
        name: 'Gyarados',
        href: '/pokemon/gyarados',
        role: 'Intimidate, Dragon Dance, Waterfall, and a coverage move. Earthquake from Gyarados still misses Flying targets. Boots, or a remover, keep the Rock quarter off the setup.',
      },
      {
        name: 'Pelipper',
        href: '/pokemon/pelipper',
        role: 'Drizzle, Hurricane, Weather Ball, U-turn, and Roost. The rain setter in singles and in VGC. Electric is 4× whether or not rain is up. Rain does not weaken Electric.',
      },
      {
        name: 'Cramorant',
        role: 'Gulp Missile punishes the contact move after Surf. The defensive chart is still 4× Electric and 2× Rock. It is a disruption Pokémon, not a second Gyarados.',
      },
    ],
    callouts: [
      {
        label: '4× Electric',
        detail: 'Electric is the only 4× weakness. Raging Bolt’s Thunderclap and Zapdos’s Thunderbolt are that product. A Ground partner takes the same move at 0×.',
        href: '/calculator?type1=water&type2=flying',
        linkLabel: 'Open Water/Flying in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground',
        detail: 'Earthquake is 0×. That is Gyarados’s setup entry. Rock is still 2×, so Stealth Rock takes one quarter of that entry.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Electric on the Gen 9 4× list',
      },
    ],
    offense:
      'Waterfall is 2× into Great Tusk, Excadrill, and Heatran, and 0.5× into other Water types. Hurricane is 2× into Fighting and Grass targets. An Electric attacker that outspeeds threatens the 4× back, so Hurricane is the click when that attacker is not the one staying in. Pelipper’s Weather Ball in rain is Water and is boosted by the weather. It is still resisted by Water and by Dragon. Gyarados’s Earthquake coverage is 0× into Corviknight, which is the physical wall that Intimidate did not remove. Ice Fang is the coverage that hits Grass and Dragon answers Waterfall does not.',
    plays: [
      {
        title: 'Intimidate, Dragon Dance, then leave to the Ground type',
        body: 'Gyarados switches into a physical attacker, Intimidate drops Attack, and it can Dragon Dance on a Ground move because Earthquake is 0×. Waterfall then hits Great Tusk at 2×. Raging Bolt’s Thunderclap is 4×. The turn that Pokémon comes in, Gyarados goes to Swampert, which takes Electric at 0×. Stealth Rock has already taken one quarter if Boots are missing, so the Dance is happening from 75%.',
      },
      {
        title: 'Pelipper sets rain and U-turns into the Electric answer',
        body: 'Pelipper’s Drizzle starts rain for a Swift Swim teammate, then U-turn. Zapdos and Raging Bolt still do 4× with Electric moves. Rain does not change that. The U-turn target is Swampert or Gastrodon. Clicking Hurricane to “trade” with the Electric attacker is a trade Pelipper loses on the multiplier.',
      },
    ],
    counterplay:
      'Electric first, Rock second. A Ground type on the Water/Flying team will take the Electric move, so the Electric attacker wants Volt Switch or a partner that hits the Ground switch. Stealth Rock is one quarter and adds up on Gyarados because Dragon Dance sets want to come in more than once. Grass is 1× into this pair. It is not the Water/Ground 4×, and it is not a substitute for Thunderbolt.',
    formatNote:
      'Singles Gyarados is a setup sweeper that fears the Rock quarter and the 4× Electric. VGC Pelipper is a rain setter whose partner is often the Water or Swift Swim attacker, and Gastrodon is the slot that catches Thunderbolt and also redirects allied Water moves. The chart line players prepare is Electric in both formats. The Pokémon holding the typing is different.',
    teamBuilding:
      'Name the Electric immunity before the rain sweeper. Swampert and Gastrodon take Thunderbolt at 0× and take Rock moves better than Gyarados does. They bring a 4× Grass weakness, so Corviknight or Scizor still belongs on the six if Rillaboom is in the format. Pelipper plus Gyarados on the same team stacks the 4× Electric and the Rock quarter. One of them needs the Ground partner more than they need each other.',
    extraLinks: [
      calculatorLink('water', 'flying', 'Water/Flying calculator preset'),
      howToRead,
      everyFourX,
      { href: '/types/electric-flying', label: 'Electric/Flying guide' },
      { href: '/types/water-ground', label: 'Water/Ground guide' },
      { href: '/pokemon/gyarados', label: 'Gyarados' },
      { href: '/pokemon/pelipper', label: 'Pelipper' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Water/Flying 4× weak to?',
        answer: 'Electric. Rock is 2×, so Stealth Rock removes one quarter. Ground is 0×.',
      },
      {
        question: 'Does rain help Pelipper survive Electric attacks?',
        answer: 'No. Rain boosts Water moves and weakens Fire. Electric stays 4×.',
      },
      {
        question: 'Why are Gyarados and Pelipper different roles?',
        answer: 'Gyarados uses Intimidate and Dragon Dance. Pelipper uses Drizzle and U-turn. Both are Water/Flying, so both take Thunderbolt at 4×.',
      },
    ],
  },
  'dragon-flying': {
    heading: 'Dragon/Flying in practice: Dragonite, Multiscale, and a 4× Ice',
    opening:
      'Dragonite is the Generation 9 Dragon/Flying. Salamence is the Intimidate one. Rayquaza is the restricted one. Ice is 2× into Dragon and 2× into Flying, so Ice Beam and Ice Shard are 4×. Rock, Dragon, and Fairy are 2×. Ground is 0×. Grass is 0.25×. Fire, Water, Fighting, and Bug are 0.5×. Stealth Rock removes one quarter, because Rock is 2×. Multiscale halves the first hit only while Dragonite is at full HP, and the Rock quarter breaks that condition before the Ice move lands.',
    species: [
      {
        name: 'Dragonite',
        href: '/pokemon/dragonite',
        role: 'Multiscale, Dragon Dance, Extreme Speed, Earthquake, and a Dragon move. Boots keep the Rock quarter off so the first Ice hit is still halved. Extreme Speed is 0× into Ghosts.',
      },
      {
        name: 'Salamence',
        href: '/pokemon/salamence',
        role: 'Intimidate and a Dragon Dance or special set. No Multiscale. The Ice move is the full 4× on the first hit. Hurricane and Dragon Claw are the usual attacks.',
      },
      {
        name: 'Rayquaza',
        href: '/pokemon/rayquaza',
        role: 'The restricted Dragon/Flying. Air Lock suppresses weather. Ice is still 4× and Ground is still 0×. The stats do not change the chart.',
      },
    ],
    callouts: [
      {
        label: '4× Ice',
        detail: 'Ice Shard, Ice Beam, and Ice Spinner are 4×. Multiscale makes the first of those 2× only while Dragonite is at full HP. Stealth Rock’s one-quarter entry breaks Multiscale.',
        href: '/calculator?type1=dragon&type2=flying',
        linkLabel: 'Open Dragon/Flying in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground',
        detail: 'Earthquake is 0×. That is the Dragon Dance entry. Fairy is still 2×, and Dragon moves are 0× into Fairy. Rock is 2× on top of the Ice weakness.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Dragonite on the Gen 9 4× list',
      },
    ],
    offense:
      'Dragon Claw is 2× into other Dragons and 0× into Tinkaton, Clefable, and Flutter Mane. Extreme Speed hits Clefable, because Normal is 1× into pure Fairy, and it misses Flutter Mane, because Flutter Mane is Ghost/Fairy and Ghost is immune to Normal. Earthquake is 1× into Flutter Mane and 0× into Corviknight. The Dragon Dance win is Extreme Speed into targets that are not Ghosts, plus a switch when the Fairy that came in is Flutter Mane. Outrage locks Dragonite into the move the Fairy immunity blanks.',
    plays: [
      {
        title: 'Boots keep Multiscale for the first Ice Beam',
        body: 'Dragonite with Heavy-Duty Boots switches into Earthquake at 0× and Dragon Dances. An Ice Beam on full HP is halved by Multiscale, so the chart’s 4× plays as 2× for that one hit. Stealth Rock without Boots takes one quarter first. Multiscale is already gone, and the Ice Beam is the full 4×. Weavile’s Ice Shard is priority on top of that 4×. Dragonite does not Dance in front of Weavile.',
      },
      {
        title: 'Extreme Speed hits Clefable and misses Flutter Mane',
        body: 'Clefable takes Dragon moves at 0× and Extreme Speed at 1×, so Extreme Speed is the click. Flutter Mane takes Dragon moves at 0× and Extreme Speed at 0× as well. Earthquake is 1× into Ghost/Fairy. Moonblast back is 2×. Tinkaton takes that Moonblast at 0.5× and is immune to the Dragon move if Dragonite is locked. The switch is Tinkaton, not a second Extreme Speed.',
      },
    ],
    counterplay:
      'Ice is the chart answer. Ice Shard does it at priority, which matters after a Dragon Dance. Fairy is the 2× answer that also blanks Dragon STAB. Keep one of each, because Dragonite’s Extreme Speed KOs the frail Ice attacker that is not holding a Sash, and it does not KO the Fairy that is a Ghost. Rock coverage and Stealth Rock break Multiscale for the Ice move that comes second. Ground attacks do nothing.',
    formatNote:
      'Singles Dragonite is Boots plus Multiscale plus Dragon Dance, and Stealth Rock is the usual way Multiscale comes off. VGC uses hazards rarely, so Multiscale lasts until the first attack, and Ice coverage from the partner’s slot is the 4× you actually click. Salamence in doubles is more often the Intimidate support than the Dance sweeper. The Ice multiplier does not change with the format.',
    teamBuilding:
      'Dragonite wants a Fairy resist and an Ice resist. Tinkaton does both: Moonblast is 0.5×, Ice is 0.5×, and Dragon moves are 0×. Corviknight takes Ice and Rock at 1× and shares the Ground immunity, so it does not give Dragonite a new switch into Earthquake and it is not the Ice Shard answer. A team of Dragonite and Garchomp stacks 4× Ice. Pick one Dragon if the room is full of Ice Shard, or give the second slot to the Steel that takes the Shard.',
    extraLinks: [
      calculatorLink('dragon', 'flying', 'Dragon/Flying calculator preset'),
      howToRead,
      everyFourX,
      { href: '/types/ground-dragon', label: 'Ground/Dragon guide' },
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/types/steel-fairy', label: 'Steel/Fairy guide' },
      { href: '/pokemon/dragonite', label: 'Dragonite' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Dragon/Flying 4× weak to?',
        answer: 'Ice. Rock, Dragon, and Fairy are 2×. Ground is 0×. Grass is 0.25×.',
      },
      {
        question: 'How does Multiscale change the Ice weakness?',
        answer: 'At full HP, Multiscale halves the first hit, so a 4× Ice move plays as 2× once. Stealth Rock removes one quarter and breaks Multiscale. The next Ice move is the full 4×.',
      },
      {
        question: 'Does Extreme Speed hit Flutter Mane?',
        answer: 'No. Extreme Speed is Normal, and Flutter Mane’s Ghost type is immune to Normal. Dragon moves are 0× into its Fairy type. Earthquake is 1×.',
      },
    ],
  },
  'psychic-fairy': {
    heading: 'Psychic/Fairy in practice: Gardevoir’s Moonblast and Hatterene’s Trick Room',
    opening:
      'Gardevoir is the special attacker. Hatterene is the Trick Room setter in doubles. There is no 4× weakness. Poison, Ghost, and Steel are 2×. Dragon is 0×. Fighting is 0.25×, which is the Close Combat switch. Psychic is 0.5×. The offensive trap is Dark: Psychic moves do 0× into Kingambit, Ting-Lu, and Roaring Moon. Moonblast is the click that still hits Dark, and into Roaring Moon it is 4× because Dark and Dragon are both weak to Fairy.',
    species: [
      {
        name: 'Gardevoir',
        href: '/pokemon/gardevoir',
        role: 'Moonblast, Psychic, and a coverage move or Healing Wish. Trace copies the ability across from the target. The singles special attacker on this chart.',
      },
      {
        name: 'Hatterene',
        role: 'Magic Bounce and Trick Room. The doubles setter. Steel, Ghost, and Poison are still 2×, so Gholdengo and Amoonguss are the Pokémon it cannot sit in front of.',
      },
      {
        name: 'Galarian Rapidash',
        role: 'The faster physical Psychic/Fairy. Pastel Veil blocks poisoning the ally in doubles. Psycho Cut and Play Rough use the same weaknesses: Poison, Ghost, and Steel at 2×.',
      },
    ],
    callouts: [
      {
        label: 'No 4× weakness',
        detail: 'Poison, Ghost, and Steel are 2×. Fighting is 0.25×. A Close Combat aimed at this pair is a setup turn, not a knockout, unless the attacker is already boosted past the resist.',
        href: '/calculator?type1=psychic&type2=fairy',
        linkLabel: 'Open Psychic/Fairy in the Dual Type Calculator',
      },
      {
        label: 'Immune to Dragon',
        detail: 'Draco Meteor and Dragon Claw are 0×. Fairy is the type that does it. The immunity does not stop Shadow Ball, Make It Rain, or Sludge Bomb.',
        href: '/blog/how-to-read-dual-type-chart',
        linkLabel: 'How Fairy’s Dragon immunity multiplies',
      },
    ],
    offense:
      'Moonblast is 4× into Roaring Moon, 2× into Dragapult, 1× into Kingambit, and 0.5× into Gholdengo and Heatran. Psychic is 2× into Fighting and Poison targets that are not also Dark, and 0× into every Dark type. Clicking Psychic when Kingambit is the obvious switch gives Kingambit a free turn and a 1× Moonblast at best if you correct next turn. Gholdengo takes Psychic at 0.5× and Moonblast at 0.5×, then hits back with Shadow Ball or Make It Rain at 2×. The coverage move, or the partner, has to be the Gholdengo plan. The STABs are not.',
    plays: [
      {
        title: 'Take the Dragon move, Moonblast the Dark/Dragon',
        body: 'Gardevoir switches into Dragapult’s Draco Meteor at 0×, or into a Close Combat at 0.25×. Moonblast into Roaring Moon is 4×. The same Moonblast into Kingambit is 1×, and a Psychic click into that switch is 0×. If the Dark type on the team is Kingambit rather than Roaring Moon, Gardevoir should be attacking the Pokémon that is already in, not fishing for the Fairy super-effective hit.',
      },
      {
        title: 'Gholdengo blanks Psychic and resists Fairy',
        body: 'Hatterene or Gardevoir stays in on a resisted Fighting move and then sees Gholdengo. Psychic is 0.5×, because Ghost is neutral to Psychic and Steel resists it. Moonblast is 0.5×. Shadow Ball and Make It Rain are 2× back. The turn is a switch to a Ground or Fire attacker: Garchomp’s Earthquake is 2× into Ghost/Steel, and a Fire move is 2× into the Steel half. Trick Room does not turn those 0.5× STABs into the KO.',
      },
    ],
    counterplay:
      'Steel, Ghost, and Poison are the three 2× attacks, and Dark is the switch that blanks Psychic even when you lack those. Gholdengo is both a Steel and a Ghost. Amoonguss is the Poison that also threatens a lot of the partners Gardevoir likes. Knock Off and status matter because this pair has no 4× to force a KO through special bulk. Magic Bounce on Hatterene sends Stealth Rock and Taunt back. It does not bounce a Steel move.',
    formatNote:
      'Singles Gardevoir has to win the special-attacker trade and respect the Dark and Steel switches with no terrain help. VGC Hatterene sets Trick Room, often beside Indeedee. Psychic Terrain blocks priority moves into Hatterene, which is a doubles tool the singles Gardevoir set does not get. The 2× Steel, Ghost, and Poison lines are the same in both games.',
    teamBuilding:
      'Gardevoir and Hatterene need a Pokémon that hits Gholdengo and lives a Steel move. Garchomp’s Earthquake is 2× into Gholdengo and Garchomp takes Psychic attacks aimed at the team at 1× while being immune to nothing Gardevoir is weak to except by switching into the Dragon move Gardevoir already blanks. A Steel partner resists the Fairy mirror and shares the Ground and Fire problems. Check the team calculator for a Ghost and Steel column that is not only the Psychic/Fairy slot.',
    extraLinks: [
      calculatorLink('psychic', 'fairy', 'Psychic/Fairy calculator preset'),
      howToRead,
      { href: '/types/steel-fairy', label: 'Steel/Fairy guide' },
      { href: '/pokemon/gardevoir', label: 'Gardevoir' },
      { href: '/pokemon/gholdengo', label: 'Gholdengo' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Psychic/Fairy weak to?',
        answer: 'Poison, Ghost, and Steel, each at 2×. There is no 4× weakness. Fighting is 0.25×.',
      },
      {
        question: 'What is Psychic/Fairy immune to?',
        answer: 'Dragon. Fairy supplies the immunity. Psychic moves are still 0× into Dark types, which is an offensive blank rather than a defensive one.',
      },
      {
        question: 'Why do Gardevoir and Hatterene get different plans?',
        answer: 'Gardevoir is the singles special attacker. Hatterene sets Trick Room in doubles, often next to Psychic Terrain. Both take Make It Rain and Shadow Ball at 2×.',
      },
    ],
  },
  'grass-flying': {
    heading: 'Grass/Flying in practice: a rare chart with a 4× Ice and a free Earthquake',
    opening:
      'Jumpluff and Tropius are the fully evolved Grass/Flying Pokémon. Shaymin-Sky shares the typing as a mythical form. None of the three is a Generation 9 staple, and the chart still decides the game when one shows up. Ice is 2× into Grass and 2× into Flying, so Ice Beam and Ice Shard are 4×. Fire, Poison, Flying, and Rock are 2×. Ground is 0×. Grass is 0.25×. Water and Fighting are 0.5×. Stealth Rock removes one quarter. Electric cancels to 1×: Grass resists it and Flying is weak to it.',
    species: [
      {
        name: 'Jumpluff',
        role: 'Chlorophyll, Sleep Powder, Leech Seed, U-turn, Acrobatics, and Strength Sap. The one that actually uses the Ground immunity to come in, spread sleep, and leave. Sun makes it fast and also boosts the Fire moves that hit it at 2×.',
      },
      {
        name: 'Tropius',
        role: 'Harvest, Leech Seed, and Air Slash. Much slower. The same 4× Ice and the same one-quarter Rock entry. It is a niche support Pokémon on this chart, not a second sweeper.',
      },
      {
        name: 'Shaymin-Sky',
        role: 'The mythical Grass/Flying. Seed Flare and Air Slash. Legal formats are rare. Ice is still 4× on the turns it is allowed.',
      },
    ],
    callouts: [
      {
        label: '4× Ice',
        detail: 'Ice Shard and Ice Beam are 4×. Weavile and Baxcalibur are the priority versions. There is no Multiscale on Jumpluff or Tropius to halve the first one.',
        href: '/calculator?type1=grass&type2=flying',
        linkLabel: 'Open Grass/Flying in the Dual Type Calculator',
      },
      {
        label: 'Immune to Ground',
        detail: 'Earthquake is 0×. That is the entry. Fire, Poison, Flying, and Rock are still 2×, and the Rock entry is one quarter from Stealth Rock.',
        href: '/blog/every-4x-weakness-gen-9',
        linkLabel: 'Ice on the Gen 9 4× list',
      },
    ],
    offense:
      'Grass STAB is 2× into Water, Ground, and Rock targets that do not resist Grass. Swampert takes it at 4×, which is the one matchup this typing wins cleanly. Flying STAB is 2× into Fighting and into other Grass types, and 0.5× into Steel. Acrobatics is stronger without a held item, which is the opposite of Boots. A Jumpluff that wants the Rock quarter gone is holding Boots and clicking a weaker Acrobatics. A Jumpluff that wants the Acrobatics damage is paying one quarter every time it switches into hazards. Sleep Powder is often the move that matters more than either STAB.',
    plays: [
      {
        title: 'Earthquake in, Sleep Powder, U-turn before the Ice',
        body: 'Jumpluff switches into Great Tusk’s Headlong Rush at 0× and clicks Sleep Powder. If it stays, Ice Shard from Weavile is 4× and priority, and Tusk’s Ice Spinner is 4× as well once Tusk wakes or if the sleep missed. U-turn on the turn the Ice attacker is the obvious switch. The Ground immunity is one entry. It is not a reason to take an Ice move.',
      },
      {
        title: 'Boots or Acrobatics, not both at full strength',
        body: 'Stealth Rock takes one quarter of Jumpluff each entry. Boots remove that tax and turn off the Acrobatics boost, because Acrobatics wants an empty item slot. A sun team that uses Chlorophyll for Speed is also boosting Charizard’s Flamethrower, and that Flamethrower is 2× into Grass/Flying. The item choice is the hazard plan. The sun is a Speed plan that makes the Fire answer stronger.',
      },
    ],
    counterplay:
      'Ice is the knockout. Fire, Flying, Poison, and Rock all do 2× if the Ice move is missing. Stealth Rock does a quarter of the work before any of those clicks. Sleep Powder is the reason to switch a Grass resist in carefully: the sleep lands on the Pokémon you sent, and Jumpluff then U-turns to something that hits the sleeper’s team. A Ground attack does not touch this pair. Electric is only 1×, so Thunderbolt is not the answer the way it is into Water/Flying.',
    formatNote:
      'This typing is a singles niche, usually a sun lead or a lower-tier sleep spreader. It is not a VGC core. Doubles would put the 4× Ice and the 2× Fire on the board from two slots at once, and Jumpluff does not have the bulk to be the Pokémon that is taking either. The chart is the same. The format that actually fields it is singles.',
    teamBuilding:
      'If Jumpluff is on the sheet, it is there to sleep a Ground or Water type and leave. The Ice answer has to be a different slot. Tinkaton takes Ice at 0.5×. Corviknight takes Ice at 1× and shares the Ground immunity, so it does not need Jumpluff’s entry and it is not the Ice Shard switch. A Water/Ground teammate is the Pokémon Jumpluff’s Grass STAB replaces, not the Pokémon it stands next to: you do not need two answers to Electric that both fold to Ice or Grass. Check the team calculator’s Ice and Fire columns before the Chlorophyll set is the one you keep.',
    extraLinks: [
      calculatorLink('grass', 'flying', 'Grass/Flying calculator preset'),
      howToRead,
      everyFourX,
      { href: '/types/water-ground', label: 'Water/Ground guide' },
      { href: '/types/fire-flying', label: 'Fire/Flying guide' },
      { href: '/types/flying-steel', label: 'Flying/Steel guide' },
      { href: '/pokemon/team-calculator', label: 'Team Calculator' },
    ],
    faqs: [
      {
        question: 'What is Grass/Flying 4× weak to?',
        answer: 'Ice. Fire, Poison, Flying, and Rock are 2×. Ground is 0×. Electric cancels to 1×.',
      },
      {
        question: 'Which Pokémon are Grass/Flying?',
        answer: 'Jumpluff and Tropius are the fully evolved ones. Shaymin-Sky is the mythical form. The typing is uncommon in Generation 9, and the multipliers still apply when one is on the field.',
      },
      {
        question: 'How much does Stealth Rock do to Grass/Flying?',
        answer: 'One quarter of maximum HP. Rock is 2× into Flying and 1× into Grass.',
      },
    ],
  },
};

export function isPriorityDualTypeGuide(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(PRIORITY_DUAL_TYPE_GUIDES, slug);
}
