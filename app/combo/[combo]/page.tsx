import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import popularCombinations from '@/data/popularCombinations.json';
import pokemonData from '@/data/pokemon.json';
import Link from 'next/link';
import { isEditorialCombination } from '@/lib/editorialCombinations';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

type CombinationGuide = {
  heading: string;
  opening: string;
  offense: string;
  counterplay: string;
  teamBuilding: string;
  faqs: { question: string; answer: string }[];
};

// These are editorial expansions for combinations with sustained search interest.
// Keys use the canonical order from ALL_TYPES, which is also used for /types URLs.
const COMBINATION_GUIDES: Record<string, CombinationGuide> = {
  'fire-flying': {
    heading: 'Fire/Flying strategy: explosive pressure with a Rock emergency',
    opening: 'Fire/Flying is an aggressive pairing best known through Charizard, Moltres, and Talonflame. It is immune to Ground, double-resists Grass and Bug, and resists Fire, Fighting, Steel, and Fairy, so it can find real entry points despite looking fragile. The defining liability is Rock: both types are weak to it, producing a 4× weakness. Water and Electric deal 2× damage. That makes Stealth Rock especially important because a grounded Fire/Flying Pokémon can lose half its maximum health on entry under standard hazard rules. Heavy-Duty Boots, reliable hazard removal, or unusually careful positioning is therefore part of the matchup rather than an optional convenience.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel, while Flying STAB pressures Grass, Fighting, and Bug. Together they hit many defensive utility Pokémon and can force switches, but Rock resists both attacks and Water also resists Fire. Electric does not resist Flying, yet many Electric Pokémon can threaten an immediate knockout in return. Solar Beam, Focus Blast, Ground coverage, or a strong neutral move may address a specific answer, although no single set should try to cover everything. Charizard often attacks specially, Talonflame can use Speed and priority-oriented tools, and Moltres may combine offense with recovery or status. The user should choose moves for the Pokémon and format, not copy one generic Fire/Flying set.',
    counterplay: 'Rock attacks are the direct answer, but preserving Stealth Rock can be even more valuable than revealing Stone Edge immediately. Force repeated entries, remove Heavy-Duty Boots with Knock Off, and deny Defog or Rapid Spin to make the 4× weakness matter throughout the battle. Water and Electric attacks provide safer 2× pressure when inaccurate Rock moves are undesirable. Before committing, scout for sun, a resistance Berry, Roost, defensive Terastallization, or coverage that punishes the expected counter. Roost can temporarily change Flying-related interactions in some generations, while abilities such as Flame Body may punish contact. Strong priority and Speed control also help against offensive variants that cannot take neutral hits.',
    teamBuilding: 'Fire/Flying needs hazard control and dependable Rock, Water, and Electric answers. Ground Pokémon can block Electric attacks and pressure Rock targets; Grass partners can help into Water; Steel or Fighting coverage can discourage Rock. Do not select partners only by type label—make sure at least one can repeatedly switch into the relevant attacker. Fire/Flying repays that support by absorbing Ground attacks and heavily resisting Grass and Bug, often protecting bulky Water- or Ground-based teammates. Use the Team Calculator to inspect the complete core, then account separately for Stealth Rock, item removal, weather, recovery, and the legal rules of the chosen format. Plan the hazard sequence before battle: if removal is blocked or Heavy-Duty Boots is lost, preserve the Fire/Flying slot until it can claim value immediately rather than spending half its health on a speculative pivot. Sun can amplify Fire pressure and reduce Water damage, but it does not solve Rock or Electric. Rain reverses that balance and may turn an otherwise manageable Water attack into a knockout. A slow pivot can create safer entries, whereas repeated double switches magnify hazard damage. Finally, separate defensive typing from role: Talonflame, Moltres, and Charizard share multipliers but have different Speed, bulk, recovery, abilities, and preferred teammates.',
    faqs: [
      { question: 'What is Fire/Flying 4× weak to?', answer: 'Rock attacks deal 4× damage because both Fire and Flying are weak to Rock.' },
      { question: 'What else is Fire/Flying weak to?', answer: 'Water and Electric normally deal 2× damage. Ground has no effect because Flying grants an immunity.' },
      { question: 'Why are Heavy-Duty Boots common?', answer: 'They prevent entry-hazard damage, including the severe Stealth Rock damage caused by the 4× Rock weakness.' },
    ],
  },
  'steel-fairy': {
    heading: 'Steel/Fairy strategy: elite defense, limited safe answers',
    opening: 'Steel/Fairy is prized because it turns many common attacks into low-risk switch-ins. It has no 4× weakness, takes no damage from Dragon and Poison, and only fears Fire and Ground at 2×. That defensive profile creates chances to set a boost, use utility, or simply force a pivot. It does not make every Steel/Fairy Pokémon a wall, though: stats, recovery, ability, held item, and format still decide whether it can repeatedly absorb hits.',
    offense: 'The two STAB types also ask useful questions of an opposing team. Steel pressures Fairy, Ice, and Rock targets, while Fairy checks Dragon, Dark, and Fighting targets. Magearna commonly converts that coverage into special pressure or momentum; Zacian uses it to threaten fast physical damage in restricted formats. Do not assume the type pair alone supplies perfect coverage—bulky Fire- or Water-based answers can still need a separate move, a pivot, or hazards to wear down.',
    counterplay: 'When facing Steel/Fairy, identify whether its Ground weakness can actually be exploited before committing to Earthquake or Earth Power. Air Balloon, a Flying Tera Type, a switch, or a partner with Ground immunity can change the exchange. Fire attacks are often the cleaner immediate pressure, but rain, resist berries, and special bulk may blunt them. Strong neutral attacks, Knock Off, status, and denying recovery are often better long-game plans than repeatedly attacking into its resistances.',
    teamBuilding: 'Pair Steel/Fairy with a dependable Fire and Ground answer rather than stacking more Pokémon that share those weaknesses. Bulky Water-types, Levitate users, and Flying-types can cover those lanes, while the Steel/Fairy slot repays them by checking Dragons and many special attackers. Use the Team Calculator to make sure the six-Pokémon roster does not quietly become Ground-weak. For a broader comparison, see the best type combinations guide before choosing a role for this typing. Decide which job the Steel/Fairy slot performs before selecting partners. A fast attacker needs safe entry and help wearing down bulky Fire or Water answers; a slower utility Pokémon needs recovery support and a plan for repeated Ground pressure. Hazards and Knock Off can turn apparent checks into temporary answers, while opposing hazards may limit how often the core pivots. Track abilities and items explicitly: Air Balloon can postpone Ground pressure, weather can change Fire damage, and an ability may add an immunity or alter contact. In restricted formats, powerful individual stats can matter more than the defensive chart, so compare actual damage and Speed rather than assuming the celebrated typing wins automatically.',
    faqs: [
      { question: 'What is Steel/Fairy weak to?', answer: 'Under the standard chart it is weak only to Fire and Ground, both for 2× damage; it has no 4× weakness.' },
      { question: 'What is Steel/Fairy immune to?', answer: 'It is immune to Dragon through Fairy and to Poison through Steel.' },
    ],
  },
  'water-ground': {
    heading: 'Water/Ground strategy: one flaw, but it is a major one',
    opening: 'Water/Ground looks almost perfect on a defensive summary: Electric does nothing, Fire and Steel are resisted, and Grass is the only attacking type that is super effective. The catch is severity. Grass lands for 4× damage, so a coverage move such as Energy Ball, Giga Drain, Leaf Storm, or even a surprise Tera Blast can end a promising switch-in. Treat the typing as an invitation to control the matchup, not a license to ignore its one answer.',
    offense: 'Water and Ground STAB give this pair practical pressure against Fire-, Rock-, Steel-, and Electric-based targets. Swampert illustrates the role well: it can provide bulk, Stealth Rock, and strong physical attacks without surrendering momentum to Electric-types. Ground attacks must still respect Flying and Levitate immunities, while Water attacks can be absorbed by common Water-type defenders. A coverage move, a double switch, or hazard chip is usually what turns favorable type coverage into a real breakthrough.',
    counterplay: 'The direct answer is Grass, but good Water/Ground players plan for it. They may pivot immediately, carry Ice coverage, use a teammate to punish Grass-types, or rely on a Tera Type that changes the defensive calculation. If Grass is unavailable, use strong neutral special attacks and exploit limited recovery or Speed instead of feeding an Electric move into an immunity. Opponents should also account for item and ability; immunity to Electric says nothing about a specific Pokémon’s ability to take repeated Grass hits.',
    teamBuilding: 'A Water/Ground slot wants partners that reliably deter Grass attacks. Steel, Fire, Flying, Bug, Poison, and Dragon Pokémon can help depending on the format and movesets; a Grass-resistant pivot that invites Electric attacks creates a particularly clean loop. Conversely, avoid giving the team only one Grass answer. Test the full spread in the Team Calculator, then compare this high-reward defensive profile with other top combinations in the best combinations guide.',
    faqs: [
      { question: 'What is Water/Ground 4× weak to?', answer: 'Grass is its only weakness and deals 4× damage under normal type rules.' },
      { question: 'Is Water/Ground immune to Electric?', answer: 'Yes. Ground grants a complete Electric immunity, even though Water by itself is weak to Electric.' },
    ],
  },
  'ground-dragon': {
    heading: 'Ground/Dragon strategy: punishing coverage with an Ice emergency',
    opening: 'Ground/Dragon is an attacking typing built around forcing uncomfortable answers. It is immune to Electric, resists Fire, Poison, and Rock, and has STAB attacks that threaten a broad range of targets. Water and Grass are neutral after the two types offset each other. The entire profile is balanced by a very clear danger: Ice hits for 4× damage. Any game plan with this combination must account for Ice Beam, Ice Spinner, Ice Shard, Freeze-Dry, and hidden coverage before it tries to sweep.',
    offense: 'Earthquake and Dragon attacks give Ground/Dragon Pokémon excellent neutral reach, and Garchomp is the classic example of how that pressure can create setup turns. Ground STAB punishes Steel, Fire, Poison, Rock, and Electric types, while Dragon STAB keeps many Water-, Grass-, and Dragon-type switch-ins honest. Neither move is consequence-free: Flying-types and Levitate ignore Ground, and Fairy-types stop Dragon attacks cold. Rock, Steel, Fire, or Poison coverage and smart pivoting often matter more than simply clicking the strongest STAB move.',
    counterplay: 'Against Ground/Dragon, preserve an Ice option and do not reveal it too early if the opponent can remove it. Priority Ice Shard is especially valuable against faster offensive variants, but it must still clear any Focus Sash, substitute, defensive Tera Type, or bulky spread. Fairy attacks also threaten the typing at 2× and can punish an Outrage lock. If direct Ice coverage is unavailable, pressure it with faster threats, status, and chip so it cannot repeatedly exploit its useful resistances.',
    teamBuilding: 'This typing pairs naturally with teammates that absorb Ice and Fairy pressure—Steel-types are the most direct answer, while Fire- and Water-types can help versus Ice attacks depending on the matchup. It also appreciates support against opposing Flying-types and Levitate users that evade Ground STAB. Use the calculator to check coverage after adding moves and teammates; the best combinations guide is a useful comparison when deciding whether a 4× Ice weakness fits the roster.',
    faqs: [
      { question: 'What is Ground/Dragon 4× weak to?', answer: 'Ice is the only 4× weakness because both Ground and Dragon are weak to it.' },
      { question: 'What is Ground/Dragon immune to?', answer: 'It is immune to Electric attacks through its Ground typing.' },
    ],
  },
  'flying-steel': {
    heading: 'Flying/Steel strategy: pivot freely, but respect Electric and Fire',
    opening: 'Flying/Steel is one of the safest defensive shells for a pivot. It is immune to Ground and Poison, double-resists Grass and Bug, and shrugs off many common chip moves. Those traits explain why Corviknight can repeatedly enter on physical utility attacks, remove hazards, or bring a teammate in safely. The typing is not invincible: Fire and Electric attacks both deal 2× damage, and a neutral special hit can still overwhelm a Pokémon whose bulk, recovery, or item has been worn down.',
    offense: 'Steel STAB punishes Fairy, Ice, and Rock targets, while Flying STAB threatens Grass, Bug, and Fighting Pokémon. That pairing is especially useful for a slow pivot because it can pressure the switch without committing to a fragile sweeper plan. Still, a Steel attack is resisted by Fire, Water, Steel, and Electric, and Flying attacks are checked by Rock, Steel, and Electric. U-turn, coverage, and hazard damage often do more to create progress than trying to force every matchup with STAB alone.',
    counterplay: 'Bring Fire or Electric pressure, but first check whether the target can pivot, recover, or change its defensive typing. A strong Fire move usually creates the clearest immediate threat; Electric coverage can be safer when Fire is resisted by the rest of the team. Ground moves should not be the primary answer unless Gravity, Smack Down, or a similar effect has removed the Flying immunity. Status and repeated entry hazards also matter because this type combination is often chosen to switch frequently.',
    teamBuilding: 'Use Flying/Steel beside a reliable Fire and Electric answer, ideally one that appreciates a Ground immunity in return. Water/Ground is a particularly tidy defensive partner on paper: it resists Fire, ignores Electric, and invites Grass attacks that Flying/Steel handles well. Avoid treating that pairing as automatic; make sure the rest of the roster can answer strong Water and Ice coverage. Check the complete spread in the Team Calculator before committing to a six-Pokémon core, then compare its tradeoffs in the best combinations guide.',
    faqs: [
      { question: 'What is Flying/Steel weak to?', answer: 'Flying/Steel is weak to Fire and Electric, each for 2× damage. It has no 4× weakness.' },
      { question: 'What is Flying/Steel immune to?', answer: 'It is immune to Ground through Flying and to Poison through Steel.' },
    ],
  },
  'bug-steel': {
    heading: 'Bug/Steel strategy: exceptional resistances, one 4× Fire alarm',
    opening: 'Bug/Steel compresses a remarkable number of defensive jobs into one slot. It is immune to Poison, double-resists Grass, and resists a long list of other attacking types, letting it find turns against many passive or resisted attacks. The price is absolute: Fire is a 4× weakness. A seemingly harmless Fire coverage move can remove a Bug/Steel Pokémon before its resistances matter, so its user must track opposing sets, weather, and whether a Fire switch-in is waiting.',
    offense: 'The STAB pairing is more useful than its reputation suggests. Bug attacks threaten Psychic, Dark, and Grass targets, while Steel attacks answer Fairy, Ice, and Rock Pokémon; Scizor can turn that into priority pressure with Bullet Punch. Neither side solves every defensive answer. Fire- and Water-type Pokémon can take Steel comfortably, and Flying-, Fighting-, Poison-, and Steel-based targets may make Bug attacks unattractive. Use a pivot, coverage move, or hazard chip to punish the obvious Fire-type response instead of handing it a free entrance.',
    counterplay: 'Fire is the first answer, but it should be used with care around a predicted switch, rain, a resistance Berry, or a defensive Terastallization. If direct Fire coverage is absent, exploit the combination\'s modest Speed, limit its setup turns, and use neutral special attacks before it can convert resistances into momentum. Knock Off can be valuable against item-reliant variants, while entry hazards reduce the number of safe pivots. Do not mistake its many resistances for immunity: the type chart still leaves several avenues for neutral damage.',
    teamBuilding: 'A Bug/Steel slot needs a dedicated Fire plan rather than a vague collection of neutral checks. Bulky Water-types, Dragons that resist Fire, and Flash Fire teammates can all cover the obvious weakness, depending on the format. In return, Bug/Steel can absorb Grass pressure for Water/Ground partners and switch into Fairy, Ice, or Psychic attacks for more fragile teammates. Use the Team Calculator to catch shared Fire weakness before finalizing the roster, and compare this specialized defensive profile with the best combinations guide.',
    faqs: [
      { question: 'What is Bug/Steel 4× weak to?', answer: 'Fire deals 4× damage because both Bug and Steel are weak to it.' },
      { question: 'Is Bug/Steel immune to Poison?', answer: 'Yes. Steel grants Bug/Steel a complete Poison immunity.' },
    ],
  },
  'poison-ghost': {
    heading: 'Poison/Ghost strategy: disruptive coverage with four clear answers',
    opening: 'Poison/Ghost is built for disruption rather than effortless switching. It is immune to Normal and Fighting, double-resists Poison and Bug, and resists Grass and Fairy, giving it clean entries against several common support attacks. Gengar shows the attacking side of the typing: it can threaten fast special damage while making Normal- and Fighting-type moves unusable. Its value depends on the actual Pokémon, though—many users cannot afford to absorb repeated neutral hits, and the four weaknesses are all relevant coverage types.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Ghost STAB targets Psychic and opposing Ghost Pokémon. Together they make it difficult for a team to rely on one passive Fairy or Psychic answer, especially when status and hazards are in play. Normal-types stop Ghost moves entirely, but Poison attacks can still damage them; Dark-types resist Ghost but do not resist Poison. Steel-types deserve special attention because they ignore Poison attacks, so a Ground-, Fire-, Fighting-, or other coverage option may be needed to prevent them from absorbing momentum.',
    counterplay: 'Ground, Psychic, Ghost, and Dark attacks all hit Poison/Ghost for 2× damage. The best choice depends on the moveset: a Ground move can be blocked by Levitate, while a Psychic attack may be unsafe against a Dark-type partner. Ghost and Dark coverage can also punish an attempted switch, but be mindful of bulky special walls and defensive Terastallization. If super-effective coverage is unavailable, force it to take hazards and chip; this typing offers useful immunities, not unlimited durability.',
    teamBuilding: 'Pair Poison/Ghost with teammates that deter Ground, Psychic, Ghost, and Dark attacks instead of assuming its immunities solve every defensive problem. Dark-types can block Psychic moves, Normal-types blank Ghost attacks, and a Flying or Levitate partner can keep Ground pressure from becoming automatic. Poison/Ghost returns the favor by checking Fighting and Fairy attacks and by spreading status or forcing switches. Test the complete core in the Team Calculator, then use the best combinations guide to decide whether its offensive utility fits the team\'s defensive needs.',
    faqs: [
      { question: 'What is Poison/Ghost weak to?', answer: 'Poison/Ghost is weak to Ground, Psychic, Ghost, and Dark attacks, all for 2× damage. It has no 4× weakness.' },
      { question: 'What is Poison/Ghost immune to?', answer: 'It is immune to Normal and Fighting attacks through its Ghost typing.' },
    ],
  },
  'water-psychic': {
    heading: 'Water/Psychic strategy: flexible offense with important defensive caveats',
    opening: 'Water/Psychic combines two useful attacking types without erasing the weaknesses of either one. The pairing resists Fire, Water, Ice, Fighting, Psychic, and Steel, which can create sensible entry points against common attacks. It is weak to Electric, Grass, Bug, Ghost, and Dark. None of those weaknesses is 4×, but all five appear often as STAB or coverage, so a Water/Psychic Pokémon should not be treated as a universal special wall. Slowbro, Slowking, and Starmie also demonstrate why the name of the typing never tells the whole story: one may function as a slow regenerative pivot, another as a specially bulky support piece, and another as a fast attacker or utility option. Check the Pokémon’s ability, stats, recovery, and item before using this chart as a switching instruction.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Psychic STAB pressures Fighting and Poison Pokémon. The combination is particularly good at making a Fire- or Fighting-based opponent think twice about staying in. It is not complete neutral coverage, however. Water, Grass, and Dragon targets resist Water; Steel and Psychic targets resist Psychic; Dark is completely immune to Psychic. A Dark-type switch can therefore steal momentum if the attacker commits to Psychic too freely. Ice Beam is a common complement because it pressures Grass and Dragon answers, while coverage such as Thunderbolt can punish opposing Water-types. Those examples explain a decision, not a mandatory moveset: a defensive Slowbro may value recovery, status, or a pivoting move more than a third attack. Choose coverage according to the team’s actual gaps rather than trying to hit every type on one set.',
    counterplay: 'To counter Water/Psychic, start by identifying its role. Electric and Grass attacks are direct answers, but both can be anticipated and handed to a Ground-type or Grass-resistant partner. Ghost and Dark moves are often harder for the typing itself to absorb, although a Normal or Fairy teammate can change that exchange. Bug also deals 2× damage, but many Bug moves are weaker or easier to resist than the other choices. Against Slowbro or Slowking, preventing recovery and denying repeated Regenerator pivots may matter more than one super-effective hit; Knock Off, status, hazards, and sustained pressure can limit their safe entries. Against Starmie, Speed control and priority may be more reliable because a slower counter can be struck by coverage first. Always scout for an ability or held item before assuming the visible multiplier guarantees a knockout.',
    teamBuilding: 'A Water/Psychic slot appreciates teammates that answer Electric, Grass, Ghost, Dark, and Bug pressure without all sharing a second weakness. Ground-types provide an Electric immunity, while Steel or Fairy partners can help into several Dark- and Bug-based attacks. A Grass-resistant pivot is important because Grass threatens the Water side and may also recover health with Giga Drain. In return, Water/Psychic can switch into Fire, Ice, Fighting, Psychic, and Steel attacks for those partners. Build around the Pokémon’s role: a slow bulky pivot wants hazard control and partners that exploit the switches it creates, while a fast attacker wants wallbreaking support and a plan for Dark- and Water-type answers. Use the Team Calculator to check the entire six-member weakness spread; covering five weaknesses on paper is not enough if four teammates all invite the same Electric attacker.',
    faqs: [
      { question: 'What is Water/Psychic weak to?', answer: 'It is weak to Electric, Grass, Bug, Ghost, and Dark attacks. Each normally deals 2× damage, and the typing has no inherent 4× weakness.' },
      { question: 'What does Water/Psychic resist?', answer: 'It resists Fire, Water, Ice, Fighting, Psychic, and Steel attacks under the standard modern type chart.' },
      { question: 'Which Pokémon use Water/Psychic?', answer: 'Well-known examples include Slowbro, Slowking, Starmie, and some regional or alternate forms. Their different stats and abilities give them very different battle roles.' },
    ],
  },
  'poison-dragon': {
    heading: 'Poison/Dragon strategy: strong neutral pressure without a simple defensive identity',
    opening: 'Poison/Dragon is a rare pairing whose value comes from how its two halves cover one another. Poison removes Dragon’s Fairy weakness by resisting Fairy, so Fairy attacks become neutral rather than super effective. Dragon, meanwhile, resists Fire, Water, Electric, and Grass, while Poison adds resistances to Fighting, Poison, Bug, Grass, and Fairy. Grass is resisted twice and deals only ¼ damage. The resulting weaknesses are Ground, Psychic, Ice, and Dragon, all at 2×. That profile gives the typing several useful entry points but no immunity, so it still takes chip damage and strong neutral hits. Eternatus, Dragalge, and Naganadel illustrate very different uses of the same pair; their stats, abilities, legal formats, and moves are more decisive than the shared chart alone.',
    offense: 'Dragon STAB is resisted by Steel and stopped entirely by Fairy, while Poison STAB hits Fairy super effectively and also pressures Grass. This makes Poison a natural partner for Dragon offense: a Fairy cannot assume that switching into a Dragon move makes the whole attacker harmless. Steel remains the most important structural answer because it resists Dragon and is immune to Poison. A Poison/Dragon attacker therefore often needs Ground, Fire, Fighting, or another coverage option—or a teammate that can exploit Steel-types. Dragon attacks otherwise offer broad neutral reach, and Poison can spread status or threaten chip even when immediate damage is not the plan. Before selecting both STAB moves, consider the role: a bulky utility set may gain more from recovery, hazards, phazing, or status, while a fast sweeper needs enough coverage to stop Steel from ending its progress.',
    counterplay: 'Ground, Psychic, Ice, and Dragon are the chart-based answers. Ground is often the cleanest option because it hits Poison super effectively, but Levitate, an Air Balloon, defensive Terastallization, or a partner’s immunity can punish a predictable Earthquake. Psychic attackers must respect fast Dragon pressure and Dark-type teammates. Ice coverage is widely distributed and useful, although it only deals 2× here rather than the 4× damage seen against several other Dragon combinations. Using another Dragon is inherently risky because both sides may threaten super-effective damage, making Speed and priority important. If direct coverage is unavailable, force progress with hazards, Knock Off, status, and strong neutral attacks. The typing has useful resistances, but without an immunity it cannot repeatedly enter for free when recovery is limited.',
    teamBuilding: 'Cover Ground, Psychic, Ice, and Dragon with a defensive core rather than expecting one partner to answer all four. Flying-types and Levitate users can discourage Ground attacks; Steel-types resist Ice, Psychic, and Dragon; Dark-types are immune to Psychic. Those options have their own overlaps, so check that adding a Steel partner does not leave the entire team vulnerable to Ground. Poison/Dragon repays support by absorbing Grass especially well and by resisting Fire, Water, Electric, Fighting, Poison, Bug, and Fairy attacks. Offensive versions appreciate a teammate that pressures Steel, while defensive versions benefit from recovery support and hazard removal. Run the full roster through the Team Calculator and inspect not only weakness counts but also which member can safely switch into the relevant attacker more than once.',
    faqs: [
      { question: 'What is Poison/Dragon weak to?', answer: 'Ground, Psychic, Ice, and Dragon attacks normally deal 2× damage. The combination has no inherent 4× weakness.' },
      { question: 'Is Poison/Dragon weak to Fairy?', answer: 'No. Dragon is weak to Fairy but Poison resists it, so the multipliers cancel and Fairy deals neutral 1× damage.' },
      { question: 'What does Poison/Dragon resist most?', answer: 'Grass deals only ¼ damage because both Poison and Dragon resist it. The combination also has several ½× resistances.' },
    ],
  },
  'water-flying': {
    heading: 'Water/Flying strategy: a Ground-proof pivot with one huge weakness',
    opening: 'Water/Flying is deceptively sturdy. It is immune to Ground and resists Fire, Water, Fighting, Bug, and Steel, giving Gyarados, Pelipper, and Cramorant useful switch-in lanes. Both types are weak to Electric, making it a 4× weakness that changes every turn against Thunderbolt, Wild Charge, or Electric Tera Blast. Rock is also a 2× weakness, so Stealth Rock costs one quarter of maximum HP under standard hazard rules—serious, but not the half-health loss of Fire/Flying. The individual Pokémon still matters: Gyarados can set up physically, Pelipper sets rain and pivots, and Cramorant has a disruptive role.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets; Flying STAB pressures Grass, Fighting, and Bug Pokémon. Flying can punish the Grass switch-ins that normally answer Water, but Water-resistant Dragon and opposing Water types remain awkward, while Electric and Steel targets often need coverage or a teammate. Gyarados can combine a boosting move with physical Water and Flying pressure; Pelipper more often uses rain-boosted Water attacks and slow momentum. Choose whether the slot must sweep, bring in a rain abuser, or repeatedly check Ground and Fighting attacks rather than treating the typing as a fixed moveset.',
    counterplay: 'Electric is the clearest answer, but reveal it carefully if a Ground-type can absorb it. Fast Electric attackers, Volt Switch pressure, or a predicted double switch can matter more than blindly clicking the strongest move. Rock attacks and Stealth Rock also exploit the typing; Grass is only neutral and is not a substitute. If direct coverage is unavailable, use strong neutral attacks, status, and hazards to limit pivots. A 4× weakness does not guarantee a knockout through special bulk, a defensive Tera Type, an immunity, or a well-timed switch.',
    teamBuilding: 'Pair Water/Flying with an Electric immunity or a Pokémon that reliably punishes Electric attackers. Ground-types are the direct choice, but must not leave the team overly exposed to Ice or Grass coverage. Water/Flying repays partners by checking Fire, Ground, Fighting, Bug, and Steel pressure. Rain teams should separate the weather setter, rain abuser, and Electric answer instead of assuming Pelipper covers all three. Use the Team Calculator to spot repeated Electric weaknesses, then compare this profile with the best type combinations guide. A safe core needs an answer that can enter on Electric moves, not merely revenge-kill an Electric Pokémon after Water/Flying falls.',
    faqs: [
      { question: 'What is Water/Flying 4× weak to?', answer: 'Electric attacks deal 4× damage because both Water and Flying are weak to Electric.' },
      { question: 'What is Water/Flying immune to?', answer: 'It is immune to Ground attacks through its Flying typing.' },
      { question: 'Is Water/Flying weak to Rock?', answer: 'Yes. Rock attacks normally deal 2× damage, so Stealth Rock is a meaningful entry-hazard concern.' },
    ],
  },
  'grass-poison': {
    heading: 'Grass/Poison strategy: a status-ready pivot with four attack lanes to cover',
    opening: 'Grass/Poison is a defensive utility typing with real offensive leverage. It double-resists Grass and resists Water, Electric, Fighting, Fairy, and Poison, letting Venusaur frustrate common defensive cores. Ground is neutral because Grass resists it while Poison is weak to it. The tradeoff is four 2× weaknesses—Fire, Ice, Flying, and Psychic—and no immunity. It can absorb a predicted Water or Fairy move but is not a blanket answer to special attackers. Venusaur can spread sleep or poison, pressure Water-types with Grass STAB, and become more dangerous in sun; stats, ability, recovery, and format still determine whether that plan works.',
    offense: 'Grass STAB targets Water, Ground, and Rock Pokémon, while Poison STAB threatens Grass and Fairy targets. That makes a Fairy switch less safe than it is against pure Grass and discourages Water/Ground pivots. Steel is the central answer: it resists Grass and is immune to Poison, so coverage, a pivot, or a teammate must create progress there. Fire-, Flying-, Poison-, Bug-, and Dragon-based targets can also resist Grass. A bulky set may value Leech Seed, recovery, sleep, or status more than perfect coverage; an offensive sun set may need a direct answer to Steel or Flying checks.',
    counterplay: 'Fire, Ice, Flying, and Psychic moves all deal 2× damage, but the right lane depends on the set. A Fire attacker must respect sun-boosted Grass pressure or a Water pivot, while Psychic coverage can be discouraged by Dark partners. If no super-effective move is available, deny recovery, remove items, and force hazard and status damage; the resistances create entries, not unlimited longevity. Scout for Chlorophyll, a defensive Tera Type, or a status move before giving the Grass/Poison user a setup turn.',
    teamBuilding: 'Grass/Poison needs answers to Fire, Ice, Flying, and Psychic attacks. Water-types can cover Fire and Ice but may repeat Electric weakness; Steel-types help into Ice and Flying but need a Ground plan; Dark-types block Psychic. Build a core rather than assigning every risk to one partner. In return, Grass/Poison protects Water- and Ground-based teammates from Grass, absorbs Water and Electric pressure, and checks Fairy attacks that trouble Dragons or Fighters. Use the Team Calculator to test the whole spread, then compare this utility profile with the best type combinations guide. Include a route to pressure Steel-types, or they gain too many free turns.',
    faqs: [
      { question: 'What is Grass/Poison weak to?', answer: 'Fire, Ice, Flying, and Psychic attacks each deal 2× damage. It has no inherent 4× weakness.' },
      { question: 'What does Grass/Poison resist?', answer: 'It resists Water, Electric, Fighting, Fairy, and Poison, while Grass attacks deal only ¼ damage.' },
      { question: 'Is Grass/Poison weak to Ground?', answer: 'No. Poison is weak to Ground, but Grass resists it, so Ground attacks deal neutral 1× damage.' },
    ],
  },
  'dragon-flying': {
    heading: 'Dragon/Flying strategy: broad pressure, a 4× Ice alarm, and a Ground immunity',
    opening: 'Dragon/Flying combines excellent neutral reach with a profile that rewards precise switching. It is immune to Ground, double-resists Grass, and resists Fire, Water, Fighting, and Bug. Dragonite, Salamence, and Rayquaza can use those openings to boost, force damage, or pivot. The danger is unmistakable: Ice deals 4× damage because both types are weak to it; Rock, Dragon, and Fairy are also 2× threats. Ice Beam, Ice Spinner, Freeze-Dry, or priority Ice Shard can turn a favorable matchup into a knockout, so identify every plausible Ice move before setting up. Multiscale, Intimidate, weather, Terastallization, and items may change an exchange, but do not erase the chart risk.',
    offense: 'Dragon STAB supplies wide neutral damage and threatens opposing Dragons, while Flying STAB punishes Grass, Fighting, and Bug targets. Steel resists both, Fairy is immune to Dragon and resists Flying, and Rock resists Flying while threatening the type defensively. Ground, Fire, or Steel coverage—or a teammate that lures those answers—is normally needed to avoid free turns. Dragonite may use priority and a boosting move, Salamence may exploit Speed or Intimidate, and Rayquaza has distinct tools, so do not copy one species’ plan onto another. Choose whether the slot breaks, cleans, or creates a Ground immunity before selecting moves.',
    counterplay: 'Preserve Ice coverage: it is the decisive chart answer. Priority Ice Shard is valuable against fast boosted threats, although abilities, defensive Tera Types, and Focus Sash can prevent the expected result. Fairy attacks punish Dragon STAB and also deal 2× damage, while Rock coverage pressures Flying moves. If Ice is unavailable, use Speed control, status, hazards, and repeated chip so the Dragon/Flying user cannot exploit its resistances. Ground coverage has no effect unless Gravity, Smack Down, or a similar effect removes the Flying immunity.',
    teamBuilding: 'Dragon/Flying needs a concrete Ice and Fairy plan. Steel-types are the most direct partners because they resist both, while Fire- and Water-types can help absorb Ice attacks depending on their secondary type and opposing coverage. A Rock-resistant teammate and hazard control are also useful because Rock hits for 2× and this combination may switch often. Dragon/Flying returns value by blanking Ground attacks and resisting Fire, Water, Fighting, Bug, and Grass for partners that invite them. Run the completed core through the Team Calculator, then compare its risk-reward profile in the best type combinations guide. Count actual switch-ins: the team needs an Ice answer that survives more than one predicted coverage move.',
    faqs: [
      { question: 'What is Dragon/Flying 4× weak to?', answer: 'Ice attacks deal 4× damage because both Dragon and Flying are weak to Ice.' },
      { question: 'What is Dragon/Flying immune to?', answer: 'It is immune to Ground attacks through its Flying typing.' },
      { question: 'What else is Dragon/Flying weak to?', answer: 'Rock, Dragon, and Fairy attacks normally deal 2× damage.' },
    ],
  },
};

function findCombination(type1: TypeId, type2: TypeId) {
  return popularCombinations.combinations.find(
    combination =>
      (combination.type1 === type1 && combination.type2 === type2) ||
      (combination.type1 === type2 && combination.type2 === type1)
  );
}

// Pre-generate all 153 dual-type combo pages at build time
export async function generateStaticParams() {
  const combos: { combo: string }[] = [];
  for (let i = 0; i < ALL_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_TYPES.length; j++) {
      combos.push({ combo: `${ALL_TYPES[i]}-${ALL_TYPES[j]}` });
    }
  }
  return combos;
}

// Only allow pre-generated paths
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ combo: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const [type1, type2] = resolvedParams.combo.split('-') as [TypeId, TypeId];

  const type1Data = typesData.types.find(t => t.id === type1);
  const type2Data = typesData.types.find(t => t.id === type2);
  const combo = findCombination(type1, type2);

  if (!type1Data || !type2Data) {
    return { title: 'Type Combination Not Found' };
  }

  const weaknesses = calculateDualTypeWeaknesses(type1, type2);
  const weakList = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak].slice(0, 3).join(', ');
  const resistList = [...weaknesses.quadrupleResist, ...weaknesses.doubleResist].slice(0, 3).join(', ');

  return {
    title: `${type1Data.name}/${type2Data.name} Weakness Guide - Best Counters & Resistances`,
    description: `${type1Data.name}/${type2Data.name} matchup guide. Weak to: ${weakList}. Resists: ${resistList}. Best counters and strategy tips.`,
    keywords: `${type1} ${type2} weakness, ${type1Data.name} ${type2Data.name}, dual type, type matchup, counters`,
    openGraph: {
      title: `${type1Data.name}/${type2Data.name} Type - Weaknesses & Resistances`,
      description: `${type1Data.name}/${type2Data.name} matchup guide. Weak to: ${weakList}. Resists: ${resistList}.`,
      url: `https://www.typematchup.org/types/${type1}-${type2}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${type1Data.name}/${type2Data.name} Type`,
      description: `${type1Data.name}/${type2Data.name} matchup guide. Weak to: ${weakList}. Resists: ${resistList}.`,
    },
    alternates: {
      canonical: `/types/${type1}-${type2}`,
    },
    robots: isEditorialCombination(resolvedParams.combo)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export async function DualTypeContent({ params }: { params: Promise<{ combo: string }> }) {
  const resolvedParams = await params;
  const [type1, type2] = resolvedParams.combo.split('-') as [TypeId, TypeId];

  const type1Data = typesData.types.find(t => t.id === type1);
  const type2Data = typesData.types.find(t => t.id === type2);
  const combo = findCombination(type1, type2);
  const guide = COMBINATION_GUIDES[resolvedParams.combo];

  if (!type1Data || !type2Data) {
    notFound();
  }

  const weaknesses = calculateDualTypeWeaknesses(type1, type2);

  const renderTypeList = (types: TypeId[], label: string, multiplier: string, bgColor: string) => {
    if (types.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-3 ${bgColor} text-white px-4 py-2 rounded-lg`}>
          {label} ({multiplier})
        </h3>
        <div className="flex flex-wrap gap-2">
          {types.map(typeId => (
            <Link key={typeId} href={`/types/${typeId}`}>
              <TypeBadge typeId={typeId} size="lg" clickable />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {type1Data.name}/{type2Data.name} Type
          </span>
        </h1>
        <div className="flex justify-center gap-3 mb-4">
          <TypeBadge typeId={type1} size="lg" />
          <TypeBadge typeId={type2} size="lg" />
        </div>

        {combo && combo.examples && (
          <p className="text-lg text-gray-600">
            <strong>Popular Pokemon:</strong> {combo.examples.join(', ')}
          </p>
        )}
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-red-600 mb-2">⚠️ Main Weaknesses:</h3>
            <p className="text-gray-700">
              {weaknesses.quadrupleWeak.length > 0 && (
                <span className="font-bold text-red-700">
                  4× weak to {weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
              {weaknesses.quadrupleWeak.length > 0 && weaknesses.doubleWeak.length > 0 && <br />}
              {weaknesses.doubleWeak.length > 0 && (
                <span>
                  2× weak to {weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-green-600 mb-2">✓ Main Resistances:</h3>
            <p className="text-gray-700">
              {weaknesses.quadrupleResist.length > 0 && (
                <span className="font-bold text-green-700">
                  ¼× resists {weaknesses.quadrupleResist.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
              {weaknesses.quadrupleResist.length > 0 && weaknesses.doubleResist.length > 0 && <br />}
              {weaknesses.doubleResist.length > 0 && (
                <span>
                  ½× resists {weaknesses.doubleResist.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {guide && (
        <article className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{guide.heading}</h2>
          <div className="prose max-w-none text-gray-700">
            <p>{guide.opening}</p>

            <h3>Offensive plan</h3>
            <p>{guide.offense}</p>

            <h3>Counterplay and defensive risks</h3>
            <p>{guide.counterplay}</p>

            <h3>Team-building advice</h3>
            <p>
              {guide.teamBuilding.split('Team Calculator').map((part, index, parts) => (
                <span key={part}>
                  {part}
                  {index < parts.length - 1 && <Link href="/pokemon/team-calculator">Team Calculator</Link>}
                </span>
              ))}
            </p>
            <p>
              Read the <Link href="/pokemon/best-type-combinations">best Pokémon type combinations guide</Link> for a
              side-by-side defensive comparison.
            </p>

            <h3>Frequently asked questions</h3>
            {guide.faqs.map(faq => (
              <div key={faq.question}>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </article>
      )}

      {/* Detailed Matchups */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Defensive Type Matchups</h2>

        {renderTypeList(weaknesses.quadrupleWeak, 'Quadruple Weak', '4×', 'bg-red-700')}
        {renderTypeList(weaknesses.doubleWeak, 'Weak', '2×', 'bg-red-500')}
        {renderTypeList(weaknesses.doubleResist, 'Resistant', '½×', 'bg-green-500')}
        {renderTypeList(weaknesses.quadrupleResist, 'Double Resistant', '¼×', 'bg-green-700')}
        {renderTypeList(weaknesses.immune, 'Immune', '0×', 'bg-gray-600')}

        {weaknesses.normal.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 bg-gray-100 rounded">
              Show Normal Effectiveness Types ({weaknesses.normal.length})
            </summary>
            <div className="mt-3 flex flex-wrap gap-2 px-4">
              {weaknesses.normal.map(typeId => (
                <Link key={typeId} href={`/types/${typeId}`}>
                  <TypeBadge typeId={typeId} size="sm" clickable />
                </Link>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Strategy Tips */}
      {combo && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Strategy Tips</h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Why This Combination?</h3>
            <p className="text-gray-700 mb-4">{combo.reason}</p>

            <h3 className="text-xl font-semibold mb-2">Best Counters</h3>
            <p className="text-gray-700">
              To counter {type1Data.name}/{type2Data.name} types, use Pokemon with{' '}
              {weaknesses.quadrupleWeak.length > 0 ? (
                <strong>{weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(' or ')} moves for 4× damage</strong>
              ) : weaknesses.doubleWeak.length > 0 ? (
                <strong>{weaknesses.doubleWeak.slice(0, 2).map(t => typesData.types.find(td => td.id === t)?.name).join(' or ')} moves for 2× damage</strong>
              ) : (
                'neutral coverage moves'
              )}.
            </p>
          </div>
        </div>
      )}

      {/* Related Pokemon */}
      {(() => {
        const relatedPokemon = pokemonData.pokemon.filter(
          p => (p.types[0] === type1 && p.types[1] === type2) ||
               (p.types[0] === type2 && p.types[1] === type1)
        );
        if (relatedPokemon.length === 0) return null;
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pokemon with this Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPokemon.map(p => (
                <Link key={p.id} href={`/pokemon/${p.id}`} className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{p.strengths}</p>
                  <span className="text-blue-600 text-sm font-medium">View full guide →</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Tools */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Try Our Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/calculator" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
            Dual Type Calculator
          </Link>
          <Link href="/pokemon/team-calculator" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
            Team Calculator
          </Link>
          <Link href="/battle-simulator" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center">
            Battle Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function LegacyDualTypePage({ params }: { params: Promise<{ combo: string }> }) {
  const { combo } = await params;
  permanentRedirect(`/types/${combo}`);
}
