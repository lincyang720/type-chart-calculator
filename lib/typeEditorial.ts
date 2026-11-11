import { TypeId } from './types';

export type TypeEditorialProfile = {
  role: string;
  judgment: string;
  partners: string;
  scenario: string;
  exception: string;
};

export const TYPE_EDITORIAL_PROFILES: Record<TypeId, TypeEditorialProfile> = {
  normal: {
    role: 'Normal is a low-risk neutral slot rather than a pressure type. Its value comes from broad move pools, one clean Fighting weakness, and the ability to avoid stacking obvious defensive liabilities.',
    judgment: 'Use Normal when the Pokémon brings stats, utility, setup, recovery, or coverage that the typing does not need to carry by itself. Do not draft it expecting super-effective STAB pressure; Normal wins by consistency, not by matchup spikes.',
    partners: 'Ghost-resistant or Ghost-immune teammates are useful because Normal attacks cannot hit Ghost, while Flying, Poison, Psychic, Bug, or Fairy partners can reduce the pressure from Fighting attackers.',
    scenario: 'Normal is strongest on story teams, balance teams, and utility roles where a predictable defensive profile matters more than hitting many types super effectively.',
    exception: 'If the format is full of Steel, Rock, or Ghost switch-ins, a Normal attacker needs coverage or support; otherwise it becomes easy to wall despite looking safe on paper.',
  },
  fire: {
    role: 'Fire is an anti-Steel and anti-Grass pressure type with unusually useful resistances into Ice, Bug, Steel, Fire, Grass, and Fairy.',
    judgment: 'Fire should usually be treated as a momentum type: it threatens common defensive materials, but its Water, Ground, and Rock weaknesses make careless switching expensive.',
    partners: 'Grass and Water teammates help absorb Water and Ground pressure, while Flying or Levitate users can protect Fire from Ground moves. Hazard removal matters for Fire Pokémon that also carry Flying, Bug, or Ice weaknesses.',
    scenario: 'Fire performs best when it can enter after a resisted hit, force a Steel or Grass target out, and either attack immediately or pivot into the opponent’s Fire answer.',
    exception: 'Rain, bulky Water cores, and Rock-heavy teams can make Fire feel weaker than the chart suggests, so confirm weather, hazards, and secondary typing before committing.',
  },
  water: {
    role: 'Water is one of the most stable defensive types because it has only Electric and Grass weaknesses while resisting Fire, Water, Ice, and Steel.',
    judgment: 'Use Water as a glue type when a team needs fewer emergency weaknesses. Its offensive coverage against Fire, Ground, and Rock also punishes many Pokémon that try to pressure Steel or Fire partners.',
    partners: 'Ground partners block Electric attacks, Grass-resistant partners cover Grass pressure, and Steel or Fire teammates can absorb the Ice and Fairy attacks often aimed elsewhere.',
    scenario: 'Water is especially valuable on balanced teams, raid planning, and bulky pivots where repeated neutral or resisted entries matter more than a single knockout.',
    exception: 'Do not assume every Water Pokémon is defensively safe; secondary typings can add 4× Grass or Electric weaknesses, and freeze-dry-style effects can change expected answers in specific games.',
  },
  electric: {
    role: 'Electric has one of the cleanest defensive profiles in the chart: a single Ground weakness and useful pressure into Water and Flying.',
    judgment: 'Electric is best when the team can deliberately manage Ground. If Ground is covered, Electric becomes a strong tempo type because it threatens common pivots and often forces predictable switches.',
    partners: 'Flying, Grass, and Water teammates help handle Ground matchups in different ways. Ice or Grass coverage can punish Ground switch-ins if the attacker has the move slot.',
    scenario: 'Electric works well as speed control, pivot pressure, and anti-Water insurance, especially when Volt Switch-style play is available in the format.',
    exception: 'Ground immunity completely blanks Electric attacks in the standard chart, so never rely on Electric STAB alone unless you already know the opponent lacks a Ground answer.',
  },
  grass: {
    role: 'Grass is a specialist type: excellent into Water, Ground, and Rock, but exposed to Fire, Ice, Poison, Flying, and Bug.',
    judgment: 'Use Grass for targeted answers, not blanket safety. It is valuable when your team needs to punish Water/Ground cores, resist Electric and Ground, or check bulky Water Pokémon.',
    partners: 'Fire, Steel, and Poison teammates can cover several Grass weaknesses, while Water partners help against Fire and Ice depending on the matchup.',
    scenario: 'Grass shines in formats where Water and Ground are common enough that resisting them creates repeated switch-in value.',
    exception: 'Grass attackers are resisted by seven types, so they need secondary STAB, status, recovery, or utility to avoid becoming passive after the first obvious matchup.',
  },
  ice: {
    role: 'Ice is an offensive coverage type first and a defensive type second. It threatens Grass, Ground, Flying, and Dragon but resists only Ice.',
    judgment: 'Treat Ice as a weapon, not a wall. It is often better as coverage on another type than as the team’s main defensive backbone.',
    partners: 'Water, Steel, Fire, and Fighting partners can reduce the pressure from Fire, Rock, Steel, and Fighting attacks. Hazard control is important for Ice Pokémon that need multiple entries.',
    scenario: 'Ice is strongest when the opponent relies on Dragon/Flying, Ground/Flying, or Grass/Ground targets that fold to super-effective coverage.',
    exception: 'If an Ice Pokémon lacks speed, priority, bulk, or safe entry support, its excellent coverage may never matter because the defensive profile gives opponents many ways to force it out.',
  },
  fighting: {
    role: 'Fighting is a high-value breaker type with super-effective coverage into Normal, Ice, Rock, Dark, and Steel.',
    judgment: 'Use Fighting when the team needs to crack bulky Steel, Rock, or Dark structures. It is less reliable as a blind attack because Flying, Psychic, Bug, Poison, and Fairy can all resist it, while Ghost is immune.',
    partners: 'Steel partners help against Fairy and Flying, Dark partners pressure Psychic and Ghost, and Poison or Fire coverage can discourage Fairy switch-ins.',
    scenario: 'Fighting is excellent on wallbreakers, revenge killers, and coverage moves that stop Normal or Steel targets from sitting on the field.',
    exception: 'Ghost immunity is the big trap. In formats with common Ghost pivots, Fighting pressure needs Knock Off, Dark coverage, prediction, or a partner that punishes the Ghost entry.',
  },
  poison: {
    role: 'Poison is not just a Fairy counter; it is a defensive utility type that resists Fighting, Poison, Bug, Grass, and Fairy while carrying only Ground and Psychic weaknesses.',
    judgment: 'The best use of Poison is selective role compression. It can answer Fairy pressure, absorb Grass/Fighting contact patterns, and support teams with status or pivoting, but it rarely wins by raw offensive coverage alone.',
    partners: 'Dark teammates cover Psychic, Flying or Levitate partners cover Ground, and Water or Grass partners can punish Ground attackers that try to force Poison out.',
    scenario: 'Poison is strongest when your team is weak to Fairy or Fighting but cannot afford another Steel type. It gives a softer, more flexible defensive answer with different matchup incentives.',
    exception: 'Steel is immune to Poison attacks, and Poison is resisted by Poison, Ground, Rock, and Ghost. A Poison attacker without Ground, Fire, Dark, or utility support can become too easy to park against.',
  },
  ground: {
    role: 'Ground is one of the best offensive types because it hits Fire, Electric, Poison, Rock, and Steel while also blocking Electric defensively.',
    judgment: 'Use Ground to punish teams that lean on Steel or Electric safety. Its defensive value is real, but Water, Grass, and Ice weaknesses mean it needs careful partner support.',
    partners: 'Water and Grass teammates can absorb Water or Ground-adjacent pressure, while Fire and Steel partners help cover Ice and Grass depending on secondary typing.',
    scenario: 'Ground excels as an Electric stop, Steel breaker, and coverage move on teams that need reliable progress against defensive cores.',
    exception: 'Flying immunity can waste Ground attacks entirely. In Flying-heavy or Levitate-heavy formats, Ground needs Rock, Ice, Electric, or status support to keep opponents honest.',
  },
  flying: {
    role: 'Flying creates value through Ground immunity, Fighting resistance, and pressure into Grass, Fighting, and Bug.',
    judgment: 'Use Flying as a positioning type. It can steal turns from Ground attacks, but Electric, Ice, and Rock weaknesses mean repeated entry requires hazard and item planning.',
    partners: 'Ground partners handle Electric, Steel partners resist Ice and Rock, and Water or Fighting coverage helps against Rock targets.',
    scenario: 'Flying is ideal for pivots, sweepers, and defensive glue that need to punish Fighting or Ground-heavy structures.',
    exception: 'Stealth Rock and Rock coverage can flip good chart matchups into bad practical trades, especially for Fire/Flying, Bug/Flying, Ice/Flying, or Dragon/Flying Pokémon.',
  },
  psychic: {
    role: 'Psychic pressures Fighting and Poison while resisting those same two attack types defensively.',
    judgment: 'Use Psychic when Fighting control matters or when a special attacker needs a clean way to punish Poison. It needs protection from Bug, Ghost, and Dark pressure.',
    partners: 'Fairy and Fighting partners pressure Dark, Normal or Dark partners can manage Ghost, and Steel partners absorb Bug and many neutral hits.',
    scenario: 'Psychic is useful on offensive teams that want to punish Fighting cores and on balance teams that need a Poison answer without relying on Ground.',
    exception: 'Dark immunity blocks Psychic attacks completely, so Psychic attackers need coverage, prediction, or a teammate ready to punish the obvious Dark switch.',
  },
  bug: {
    role: 'Bug targets Grass, Psychic, and Dark, but it is resisted by seven types and often needs a secondary role to justify the slot.',
    judgment: 'Use Bug when the Pokémon brings momentum, setup, priority, hazards, or a strong secondary typing. Bug STAB alone is usually not enough to carry an offensive plan.',
    partners: 'Water, Rock, and Ground teammates can pressure Fire, Flying, and Steel answers, while Steel partners cover many of Bug’s defensive weaknesses.',
    scenario: 'Bug works best when it punishes Psychic or Dark targets while also providing utility such as pivoting, trapping pressure, or defensive resistances.',
    exception: 'If the opposing team has Fire, Flying, Ghost, Steel, Poison, Fighting, and Fairy answers, Bug attacks can disappear quickly; avoid drafting Bug without a secondary plan.',
  },
  rock: {
    role: 'Rock is a strong anti-Flying and anti-Fire type with super-effective hits into Fire, Ice, Flying, and Bug.',
    judgment: 'Use Rock to punish airborne and Fire-heavy teams, but respect its defensive burden: Water, Grass, Fighting, Ground, and Steel all hit it super effectively.',
    partners: 'Grass and Water partners handle Water/Ground pressure, Flying or Psychic partners help against Fighting, and Steel teammates can share hazard pressure carefully.',
    scenario: 'Rock is excellent as coverage, hazard chip, and revenge pressure against Flying or Fire threats that otherwise switch too freely.',
    exception: 'Rock Pokémon often need speed control or bulk support because missing a key Rock attack or entering into the wrong coverage move can cost the whole exchange.',
  },
  ghost: {
    role: 'Ghost combines rare immunities to Normal and Fighting with offensive pressure into Psychic and Ghost.',
    judgment: 'Use Ghost when denying Normal/Fighting attacks creates free turns or when the team needs spinblocking-style and Psychic-punishing utility. Its mirror weakness means speed and matchup control matter.',
    partners: 'Dark-resistant partners such as Fighting, Fairy, or some Steel combinations help absorb Dark pressure, while Normal teammates can switch into opposing Ghost attacks under standard rules.',
    scenario: 'Ghost is valuable on offensive pivots, utility disruptors, and teams that want safe entries against Fighting-locked attacks.',
    exception: 'Dark is the main practical obstacle: it resists Ghost and hits Ghost super effectively, so Ghost attackers need Fairy, Fighting, Bug, or strong neutral backup.',
  },
  dragon: {
    role: 'Dragon is a stat-and-resistance type: it resists Fire, Water, Electric, and Grass, but offensively hits only Dragon super effectively.',
    judgment: 'Use Dragon for flexible neutral pressure and defensive entry into elemental attacks. It needs Fairy planning because Fairy is immune to Dragon attacks and hits Dragon super effectively.',
    partners: 'Steel partners are natural Fairy and Ice buffers, Fire partners pressure Steel and Ice, and Poison coverage can punish Fairy switch-ins.',
    scenario: 'Dragon is strongest on bulky attackers and sweepers that use excellent stats, setup, or coverage to turn neutral matchups into progress.',
    exception: 'A Dragon attacker without Fairy answers can be forced out repeatedly. In Fairy-heavy formats, Dragon STAB should be treated as one tool, not the entire plan.',
  },
  dark: {
    role: 'Dark is the direct answer to Psychic and Ghost pressure, with a Psychic immunity and super-effective hits into both Psychic and Ghost.',
    judgment: 'Use Dark when the team needs to stop Psychic moves, pressure Ghosts, or punish utility Pokémon. It must account for Fighting, Bug, and Fairy weaknesses.',
    partners: 'Poison and Steel partners handle Fairy, Flying or Psychic partners help against Fighting, and Fire or Rock coverage can discourage Bug answers.',
    scenario: 'Dark fits revenge killers, pivots, trappers, and bulky utility roles that need to deny Psychic or Ghost progress.',
    exception: 'Fairy is the cleanest punishment route into Dark. If your Dark slot cannot threaten Fairy on the switch, pair it with a teammate that makes Fairy entry costly.',
  },
  steel: {
    role: 'Steel is the premier defensive compression type, resisting ten attack types and ignoring Poison damage through immunity.',
    judgment: 'Use Steel when a team needs a durable answer to Dragon, Fairy, Ice, Rock, Psychic, and repeated neutral pressure. Its Fire, Fighting, and Ground weaknesses must be actively covered.',
    partners: 'Flying or Levitate users cover Ground, Water partners cover Fire, and Fairy or Psychic partners can help reduce Fighting pressure depending on the format.',
    scenario: 'Steel is strongest as a defensive anchor, hazard setter, pivot, or Fairy check that gives frailer teammates room to operate.',
    exception: 'Do not stack Steel blindly. Many teams already prepare Fire, Fighting, and Ground coverage; a second Steel can make those coverage moves too efficient unless the pair covers each other.',
  },
  fairy: {
    role: 'Fairy is a premium anti-Dragon and anti-Dark type with a Dragon immunity and only Poison and Steel weaknesses.',
    judgment: 'Use Fairy when the team needs a safe Dragon stop or a way to punish Fighting and Dark pressure. It is reliable defensively but not invincible into Steel-heavy structures.',
    partners: 'Fire and Ground partners pressure Steel, Psychic or Ground partners pressure Poison, and Steel/Fairy cores can create strong mutual defensive coverage.',
    scenario: 'Fairy performs best on balance and offense that need one slot to check Dragon threats while still threatening Dark and Fighting targets.',
    exception: 'Poison and Steel are predictable answers, so Fairy attackers should carry coverage, status, setup, or partners that convert those switch-ins into progress.',
  },
};

export function getTypeEditorialProfile(typeId: TypeId): TypeEditorialProfile {
  return TYPE_EDITORIAL_PROFILES[typeId];
}
