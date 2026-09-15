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

function getTypeName(typeId: TypeId) {
  return typesData.types.find(typeItem => typeItem.id === typeId)?.name ?? typeId;
}

function formatTypeList(typeIds: TypeId[]) {
  if (typeIds.length === 0) return 'none';
  return typeIds.map(getTypeName).join(', ');
}

function getCoverageValue(weaknesses: ReturnType<typeof calculateDualTypeWeaknesses>) {
  return weaknesses.immune.length * 3
    + weaknesses.quadrupleResist.length * 2
    + weaknesses.doubleResist.length
    - weaknesses.doubleWeak.length * 2
    - weaknesses.quadrupleWeak.length * 4;
}

function describeCoverageValue(score: number) {
  if (score >= 8) return 'excellent defensive compression';
  if (score >= 4) return 'strong defensive compression';
  if (score >= 0) return 'balanced defensive tradeoff';
  if (score >= -5) return 'high-maintenance defensive profile';
  return 'fragile defensive profile';
}

function getPartnerCandidates(type1: TypeId, type2: TypeId, weaknesses: ReturnType<typeof calculateDualTypeWeaknesses>) {
  const pressureTypes = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak];

  return ALL_TYPES
    .filter(candidateType => candidateType !== type1 && candidateType !== type2)
    .map(candidateType => {
      const candidateWeaknesses = calculateDualTypeWeaknesses(candidateType);
      const coveredThreats = pressureTypes.filter(pressureType =>
        candidateWeaknesses.doubleResist.includes(pressureType) ||
        candidateWeaknesses.quadrupleResist.includes(pressureType) ||
        candidateWeaknesses.immune.includes(pressureType)
      );

      return { candidateType, coveredThreats };
    })
    .filter(candidate => candidate.coveredThreats.length > 0)
    .sort((a, b) => b.coveredThreats.length - a.coveredThreats.length)
    .slice(0, 5);
}

type CombinationGuide = {
  heading: string;
  opening: string;
  offense: string;
  counterplay: string;
  teamBuilding: string;
  extraLinks?: { href: string; label: string }[];
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

type GeneratedCombinationGuideConfig = {
  slug: string;
  type1: TypeId;
  type2: TypeId;
  headline: string;
  examples: string[];
  role: string;
  offense: string;
  teamBuilding: string;
  related: string[];
};

function makeMultiplierPhrase(types: TypeId[], multiplier: string) {
  if (types.length === 0) return `no ${multiplier} weakness`;
  return `${multiplier} weak to ${formatTypeList(types)}`;
}

function makeResistancePhrase(types: TypeId[], multiplier: string) {
  if (types.length === 0) return `no ${multiplier} resistance`;
  return `${multiplier} resists ${formatTypeList(types)}`;
}

function makeGeneratedCombinationGuide(config: GeneratedCombinationGuideConfig): CombinationGuide {
  const type1Name = getTypeName(config.type1);
  const type2Name = getTypeName(config.type2);
  const displayName = `${type1Name}/${type2Name}`;
  const reverseName = `${type2Name}/${type1Name}`;
  const weaknesses = calculateDualTypeWeaknesses(config.type1, config.type2);
  const weakPhrase = [
    makeMultiplierPhrase(weaknesses.quadrupleWeak, '4×'),
    makeMultiplierPhrase(weaknesses.doubleWeak, '2×'),
  ].join(' and ');
  const resistPhrase = [
    makeResistancePhrase(weaknesses.quadrupleResist, '¼×'),
    makeResistancePhrase(weaknesses.doubleResist, '½×'),
  ].join('; ');
  const immunePhrase = weaknesses.immune.length > 0
    ? `It is immune to ${formatTypeList(weaknesses.immune)}.`
    : 'It has no type immunity under the standard chart.';
  const examples = config.examples.length > 0
    ? `Representative Pokémon include ${config.examples.join(', ')}.`
    : `There are no established Pokémon with this exact ${displayName} typing.`;
  const pressureTypes = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak];
  const pressureText = pressureTypes.length > 0 ? formatTypeList(pressureTypes) : 'strong neutral coverage';
  const firstPressure = pressureTypes.length > 0 ? formatTypeList(pressureTypes.slice(0, 2)) : 'neutral attacks';

  return {
    heading: `${displayName} strategy: ${config.headline}`,
    opening: `${displayName} and ${reverseName} are the same defensive pairing; this page uses ${config.slug} as the canonical URL. ${config.role} ${examples} The standard type chart gives this combination ${weakPhrase}. ${immunePhrase} Its main defensive value comes from ${resistPhrase}, but stats, ability, item, and format still decide whether a real Pokémon can use those entries repeatedly.`,
    offense: config.offense,
    counterplay: `To counter ${displayName}, start with the chart pressure: ${pressureText}. If a 4× weakness is listed, preserve that attack type before revealing it; if there is no 4× weakness, repeated 2× pressure and hazard chip usually matter more than a single surprise hit. Scout for abilities, Terastallization, weather, recovery, and pivot moves before assuming the visible multiplier ends the exchange.`,
    teamBuilding: `${config.teamBuilding} Use the Team Calculator to check whether the rest of the six stacks the same ${firstPressure} problem, then compare the full defensive chart before choosing moves or teammates.`,
    extraLinks: [
      { href: '/pokemon/type-chart', label: 'Type Chart' },
      { href: '/calculator', label: 'Dual Type Calculator' },
      ...config.related.map(slug => ({
        href: `/types/${slug}`,
        label: `${slug.split('-').map(typeId => getTypeName(typeId as TypeId)).join('/')} guide`,
      })),
    ],
    faqs: [
      {
        question: `What is ${displayName} weak to?`,
        answer: `${displayName} is ${weakPhrase} under the standard type chart.`,
      },
      {
        question: `Is ${reverseName} a different type combination?`,
        answer: `No. ${reverseName} and ${displayName} use the same two types, so they share the same weaknesses, resistances, and immunities.`,
      },
      {
        question: `What is ${displayName} immune to?`,
        answer: immunePhrase,
      },
    ],
  };
}

const GENERATED_COMBINATION_GUIDE_CONFIGS: GeneratedCombinationGuideConfig[] = [
  {
    slug: 'water-electric',
    type1: 'water',
    type2: 'electric',
    headline: 'pivot pressure with only two direct weaknesses',
    examples: ['Lanturn', 'Chinchou', 'Rotom-Wash'],
    role: 'Water/Electric is a flexible pivot typing that can pressure Fire, Flying, Ground, and Water-based structures while resisting several common utility attacks.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Electric STAB pressures Water and Flying targets. The pairing is especially useful on pivots because the opponent often has to choose between respecting Hydro Pump-style Water damage and blocking Volt Switch-style momentum. Grass and Dragon resist the Water side, and Ground can block Electric attacks unless an ability or move changes the interaction, so coverage and prediction still matter.',
    teamBuilding: 'Water/Electric appreciates Grass answers and a plan for Ground pressure. Flying, Grass, or Bug partners can soften Ground lanes, while Steel or Fire partners may help against Grass attacks depending on the format.',
    related: ['water-ground', 'flying-steel'],
  },
  {
    slug: 'psychic-dark',
    type1: 'psychic',
    type2: 'dark',
    headline: 'Psychic immunity with a severe Bug alarm',
    examples: ['Inkay', 'Malamar', 'Hoopa Unbound'],
    role: 'Psychic/Dark is a tricky offensive pairing that blocks Psychic attacks while threatening Psychic- and Ghost-type opponents back.',
    offense: 'Psychic STAB pressures Fighting and Poison targets, while Dark STAB threatens Psychic and Ghost targets. That gives the pairing good anti-utility value, but Fairy can punish the Dark side and Bug is the severe defensive warning. Because the typing has few resistances, it needs speed, disruption, or strong immediate pressure rather than relying on safe repeated switches.',
    teamBuilding: 'Psychic/Dark wants Fairy and Bug answers nearby. Steel, Poison, Fire, Flying, or Rock teammates can help depending on the specific threats, while hazard support can make its forced switches more valuable.',
    related: ['psychic-fairy', 'flying-dark'],
  },
  {
    slug: 'psychic-fairy',
    type1: 'psychic',
    type2: 'fairy',
    headline: 'Dragon immunity and steady special pressure',
    examples: ['Gardevoir', 'Galarian Rapidash', 'Hatterene', 'Tapu Lele', 'Mr. Mime'],
    role: 'Psychic/Fairy is best at punishing Fighting, Dragon, Dark, and Poison-adjacent game plans while giving a team a clean Dragon immunity.',
    offense: 'Psychic STAB pressures Fighting and Poison targets, while Fairy STAB handles Dragon, Dark, and Fighting targets. Steel is the most important shared answer because it resists both STAB types and threatens back, while Ghost and Poison can also force the defensive side. The pairing works best when its user can punish Steel entries with coverage, hazards, or a teammate.',
    teamBuilding: 'Psychic/Fairy needs Steel, Poison, and Ghost counterplay. Ground, Fire, Dark, or Steel partners can cover those lanes, and the Psychic/Fairy slot repays them by checking Fighting and Dragon pressure.',
    related: ['psychic-dark', 'steel-fairy'],
  },
  {
    slug: 'dragon-steel',
    type1: 'dragon',
    type2: 'steel',
    headline: 'Dragon power without the usual Dragon liabilities',
    examples: ['Dialga', 'Duraludon', 'Archaludon', 'Hisuian Sliggoo', 'Hisuian Goodra'],
    role: 'Dragon/Steel is a premium defensive-offensive mix because Steel removes several classic Dragon problems while Dragon adds useful Fire and Water neutrality.',
    offense: 'Dragon STAB supplies broad neutral pressure, while Steel STAB targets Fairy, Ice, and Rock opponents. The important offensive problem is that Steel-types can sit on both sides unless the user carries Fire, Ground, or Fighting coverage. Defensively, the typing gives many switch-in chances but must still respect Fighting and Ground attacks.',
    teamBuilding: 'Dragon/Steel pairs well with Flying, Levitate, Fairy, Ghost, or bulky Water teammates that can absorb Ground and Fighting pressure. It also appreciates partners that punish Steel mirrors and bulky Ground answers.',
    related: ['flying-steel', 'ground-dragon'],
  },
  {
    slug: 'fire-fighting',
    type1: 'fire',
    type2: 'fighting',
    headline: 'starter-style offense with four clear answers',
    examples: ['Blaziken', 'Infernape', 'Emboar', 'Pignite', 'Combusken'],
    role: 'Fire/Fighting is an aggressive wallbreaking combination associated with several starters and fast pressure roles.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel targets, while Fighting STAB breaks Normal, Rock, Steel, Ice, and Dark targets. Together they punish many defensive cores, especially Steel-heavy teams. Water, Ground, Flying, and Psychic pressure keeps the typing honest, so its best users usually rely on Speed, setup, priority, or pivot support rather than raw defensive safety.',
    teamBuilding: 'Fire/Fighting needs dependable Water, Ground, Flying, and Psychic answers. Grass, Water, Dark, Flying, or Steel teammates can cover different parts of that spread, and hazard support helps turn forced switches into real progress.',
    related: ['fire-flying', 'steel-fairy'],
  },
  {
    slug: 'ground-ghost',
    type1: 'ground',
    type2: 'ghost',
    headline: 'three immunities with many pressure points',
    examples: ['Golett', 'Golurk', 'Sandygast', 'Palossand', 'Runerigus'],
    role: 'Ground/Ghost is unusual because it combines Electric, Normal, and Fighting immunities with practical offensive pressure.',
    offense: 'Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets, while Ghost STAB pressures Ghost and Psychic targets. Normal types block Ghost attacks and Flying or Levitate users avoid Ground, so the pairing needs coverage or prediction to avoid obvious blanks. Its five 2× weaknesses mean it should be used as a targeted switch-in, not a universal wall.',
    teamBuilding: 'Ground/Ghost wants Water, Grass, Ice, Ghost, and Dark answers around it. Fairy, Dark, Water, Steel, and Grass partners can each cover part of the problem while benefiting from its immunities.',
    related: ['water-ground', 'poison-ghost'],
  },
  {
    slug: 'ground-flying',
    type1: 'ground',
    type2: 'flying',
    headline: 'double immunity with a major Ice emergency',
    examples: ['Gligar', 'Gliscor', 'Landorus', 'Landorus-Therian'],
    role: 'Ground/Flying is a high-value pivot typing because it blocks both Electric and Ground attacks while resisting Fighting, Poison, and Bug.',
    offense: 'Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets, while Flying STAB pressures Grass, Fighting, and Bug targets. Ice is the main defensive alarm and Water is the other direct weakness, so the user needs to avoid careless entries into common coverage. Flying and Levitate targets can avoid Ground attacks, which makes Rock, Flying, or utility coverage important.',
    teamBuilding: 'Ground/Flying needs a strong Ice plan and a Water answer. Steel, Fire, Water, or bulky Grass partners can help, while this typing repays them by blanking Electric and Ground attacks.',
    related: ['ground-dragon', 'flying-steel'],
  },
  {
    slug: 'flying-dark',
    type1: 'flying',
    type2: 'dark',
    headline: 'two immunities and a crowded weakness list',
    examples: ['Murkrow', 'Honchkrow', 'Vullaby', 'Mandibuzz', 'Yveltal'],
    role: 'Dark/Flying and Flying/Dark give a team Psychic and Ground immunities in one slot, which can be valuable for pivots and revenge killers.',
    offense: 'Dark STAB threatens Psychic and Ghost targets, while Flying STAB pressures Grass, Fighting, and Bug targets. Electric, Ice, Rock, and Fairy all hit for 2×, so the typing often needs either strong Speed or defensive recovery to remain useful. Rock is especially important because it may also appear through entry hazards.',
    teamBuilding: 'Dark/Flying needs Electric, Ice, Rock, and Fairy answers. Steel and Ground partners can cover several of those lanes, while the Dark/Flying slot can absorb Ground and Psychic pressure for them.',
    related: ['psychic-dark', 'dragon-flying'],
  },
  {
    slug: 'ice-ground',
    type1: 'ice',
    type2: 'ground',
    headline: 'excellent attacking reach with five weaknesses',
    examples: ['Swinub', 'Piloswine', 'Mamoswine'],
    role: 'Ice/Ground is one of the strongest offensive type pairings because it pressures many common defensive structures at once.',
    offense: 'Ice STAB threatens Dragon, Flying, Grass, and Ground targets, while Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets. The result is excellent coverage, but defensively the type must account for Fire, Water, Grass, Fighting, and Steel pressure. Its Electric immunity is valuable, but it does not make the pairing easy to switch in repeatedly.',
    teamBuilding: 'Ice/Ground needs teammates that cover Fire, Water, Grass, Fighting, and Steel. Bulky Water, Fairy, Flying, and Fire-resistant partners can help create safer entries so the Ice/Ground slot can focus on attacking.',
    related: ['water-ground', 'ground-flying'],
  },
  {
    slug: 'poison-bug',
    type1: 'poison',
    type2: 'bug',
    headline: 'strong Fighting and Grass control with common counters',
    examples: ['Weedle', 'Kakuna', 'Beedrill', 'Venipede', 'Scolipede'],
    role: 'Poison/Bug is a niche defensive pairing that sharply resists Fighting and Grass while checking some Fairy and Poison interactions.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Bug STAB threatens Psychic, Dark, and Grass targets. Fire, Flying, Psychic, and Rock all punish the typing, so a Poison/Bug Pokémon needs a clear role such as speed, hazards, status, or priority rather than relying on broad defensive coverage.',
    teamBuilding: 'Poison/Bug wants Rock, Fire, Flying, and Psychic answers. Steel, Rock, Water, Dark, or Ground partners can help cover those lanes while benefiting from the Grass and Fighting resistances.',
    related: ['grass-poison', 'bug-steel'],
  },
  {
    slug: 'ground-rock',
    type1: 'ground',
    type2: 'rock',
    headline: 'Electric immunity with two severe 4× weaknesses',
    examples: ['Geodude', 'Graveler', 'Golem', 'Rhydon', 'Rhyperior'],
    role: 'Rock/Ground and Ground/Rock are powerful into Electric, Fire, Flying, and Poison pressure, but the defensive price is high.',
    offense: 'Rock STAB threatens Flying, Fire, Ice, and Bug targets, while Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets. Together they create strong physical pressure, but Water and Grass both hit for 4× and can erase the advantage immediately. Ice, Fighting, Ground, and Steel also hit for 2×, so prediction and support are mandatory.',
    teamBuilding: 'Rock/Ground needs real Water and Grass answers before anything else. Grass, Dragon, Water, Flying, and bulky Steel partners can help depending on the format, while the Rock/Ground slot repays them with Electric immunity and strong Rock pressure.',
    related: ['water-ground', 'ground-dragon'],
  },
  {
    slug: 'grass-ice',
    type1: 'grass',
    type2: 'ice',
    headline: 'useful coverage with a Fire crisis',
    examples: ['Snover', 'Abomasnow', 'Mega Abomasnow'],
    role: 'Grass/Ice is a rare pairing that pressures Water, Ground, Flying, Dragon, and Grass-based structures, but it has a demanding defensive chart.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Ice STAB threatens Dragon, Flying, Grass, and Ground targets. That offensive spread is useful, but Fire is a 4× weakness and Fighting, Poison, Flying, Bug, Rock, and Steel all hit for 2×. The typing should normally be used to force progress, not to absorb many attacks.',
    teamBuilding: 'Grass/Ice needs a dedicated Fire answer and several secondary covers. Water, Dragon, Fire-resistant, Steel-resistant, and Flying-resistant teammates can help keep its many weaknesses from becoming a constant liability.',
    related: ['grass-poison', 'water-ground'],
  },
  {
    slug: 'normal-flying',
    type1: 'normal',
    type2: 'flying',
    headline: 'classic early-route utility with two immunities',
    examples: ['Pidgey', 'Pidgeotto', 'Pidgeot', 'Spearow', 'Fearow'],
    role: 'Normal/Flying is a classic utility pairing that combines Ghost and Ground immunities with straightforward Flying pressure.',
    offense: 'Flying STAB pressures Grass, Fighting, and Bug targets, while Normal STAB gives neutral coverage against many opponents that do not resist it. Electric, Ice, and Rock are the direct weaknesses, and Rock also matters because of common hazard pressure. The type is simple, but speed, pivoting, and support moves can make it useful.',
    teamBuilding: 'Normal/Flying needs Electric, Ice, and Rock answers. Ground partners block Electric, Steel partners help against Ice and Rock, and bulky Water partners can soften Rock pressure.',
    related: ['flying-steel', 'dragon-flying'],
  },
  {
    slug: 'bug-fairy',
    type1: 'bug',
    type2: 'fairy',
    headline: 'Dragon immunity with a broad weakness spread',
    examples: ['Cutiefly', 'Ribombee', 'Totem Ribombee'],
    role: 'Bug/Fairy and Fairy/Bug are rare, fast-support leaning typings that combine a Dragon immunity with strong Fighting resistance.',
    offense: 'Bug STAB threatens Psychic, Dark, and Grass targets, while Fairy STAB threatens Dragon, Dark, and Fighting targets. Fire, Poison, Flying, Rock, and Steel all hit for 2×, so the typing needs speed, utility, or a support role to avoid being overwhelmed by common coverage. Its Dragon immunity is valuable, but it does not cover the rest of the chart by itself.',
    teamBuilding: 'Bug/Fairy wants Fire, Poison, Flying, Rock, and Steel answers. Ground, Water, Steel, and Fire-resistant partners can cover those lanes, while Bug/Fairy can help into Fighting, Dark, Grass, and Dragon pressure.',
    related: ['bug-steel', 'steel-fairy'],
  },
  {
    slug: 'grass-fairy',
    type1: 'grass',
    type2: 'fairy',
    headline: 'Dragon immunity with a severe Poison warning',
    examples: ['Cottonee', 'Whimsicott', 'Morelull', 'Shiinotic', 'Tapu Bulu'],
    role: 'Grass/Fairy is a utility-friendly pairing that can check Water, Ground, Dragon, Dark, and Fighting pressure while threatening common defensive pivots.',
    offense: 'Grass STAB pressures Water, Ground, and Rock targets, while Fairy STAB threatens Dragon, Dark, and Fighting targets. Poison is the emergency matchup because both types are weak to it, and Steel also resists both STAB options while striking back. The pairing works best when it uses status, terrain, recovery, or pivot support to create progress instead of trying to brute-force every answer.',
    teamBuilding: 'Grass/Fairy needs a strong Poison and Steel plan before it can use its Dragon immunity comfortably. Steel, Ground, Fire, and Psychic partners can cover those lanes, while Grass/Fairy repays them by handling Water, Ground, Dragon, Dark, and Fighting pressure.',
    related: ['steel-fairy', 'grass-poison'],
  },
  {
    slug: 'ghost-dark',
    type1: 'ghost',
    type2: 'dark',
    headline: 'three immunities with only Fairy pressure',
    examples: ['Sableye', 'Spiritomb'],
    role: 'Ghost/Dark is a disruption-heavy defensive pairing that blocks Normal, Fighting, and Psychic attacks while keeping the weakness list unusually short.',
    offense: 'Ghost STAB pressures Ghost and Psychic targets, while Dark STAB also threatens Psychic and Ghost targets. That overlap makes the typing excellent at punishing those lanes, but Fairy is the direct chart answer and bulky Dark-resistant targets can slow progress. The best users usually lean on utility, recovery, priority, or status rather than expecting the STAB pair to solve every matchup.',
    teamBuilding: 'Ghost/Dark needs a dependable Fairy answer and teammates that can make progress against bulky neutral targets. Steel, Poison, and Fire partners can help absorb Fairy pressure, while the Ghost/Dark slot protects them from Normal, Fighting, and Psychic attacks.',
    related: ['poison-ghost', 'psychic-dark'],
  },
  {
    slug: 'ghost-steel',
    type1: 'ghost',
    type2: 'steel',
    headline: 'three immunities and elite resistance spread',
    examples: ['Honedge', 'Doublade', 'Aegislash', 'Gholdengo'],
    role: 'Ghost/Steel compresses several defensive jobs into one slot by combining Normal, Fighting, and Poison immunities with many useful resistances.',
    offense: 'Ghost STAB pressures Ghost and Psychic targets, while Steel STAB threatens Fairy, Ice, and Rock targets. Fire, Ground, Ghost, and Dark are the chart pressure points, so the user must scout coverage before assuming its long resistance list creates a safe entry. A Ghost/Steel Pokemon can often force progress with utility or setup, but it still needs support against strong Fire and Ground attackers.',
    teamBuilding: 'Ghost/Steel pairs well with Water, Flying, Dark, and Fairy teammates that can cover Fire, Ground, Ghost, and Dark pressure. It repays that support by absorbing Normal, Fighting, Poison, Fairy, Rock, and Ice interactions for the rest of the team.',
    related: ['flying-steel', 'poison-ghost'],
  },
  {
    slug: 'dragon-ghost',
    type1: 'dragon',
    type2: 'ghost',
    headline: 'two immunities with five direct weaknesses',
    examples: ['Dreepy', 'Drakloak', 'Dragapult', 'Giratina'],
    role: 'Dragon/Ghost is a fast-pressure pairing that uses Normal and Fighting immunities to find entries and then threatens broad neutral damage.',
    offense: 'Dragon STAB pressures opposing Dragons, while Ghost STAB threatens Ghost and Psychic targets. Steel resists Dragon and Normal blocks Ghost, so coverage and prediction remain important even on very strong attackers. Ice, Ghost, Dragon, Dark, and Fairy all hit for 2×, which means Dragon/Ghost should usually enter through immunities, pivots, or revenge-kill windows rather than raw bulk.',
    teamBuilding: 'Dragon/Ghost needs Fairy, Dark, Ice, Ghost, and Dragon answers nearby. Steel, Fairy, Dark, and bulky Water partners can cover different parts of that spread, while Dragon/Ghost offers valuable Normal and Fighting immunities in return.',
    related: ['dragon-flying', 'poison-ghost'],
  },
  {
    slug: 'water-fighting',
    type1: 'water',
    type2: 'fighting',
    headline: 'physical pressure with five clean answers',
    examples: ['Poliwrath', 'Keldeo', 'Urshifu Rapid Strike', 'Quaquaval', 'Paldean Tauros Aqua Breed'],
    role: 'Water/Fighting is an aggressive breaker typing that threatens Rock, Steel, Fire, Dark, and Ground-based structures.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets. The combination creates strong offensive pressure, but Electric, Grass, Flying, Psychic, and Fairy all hit for 2×. It works best with speed control, pivot support, or enough bulk to choose its entries carefully.',
    teamBuilding: 'Water/Fighting needs Electric, Grass, Flying, Psychic, and Fairy counterplay. Steel, Poison, Electric, Grass, and Dark teammates can cover those lanes while the Water/Fighting slot pressures Rock and Steel answers for them.',
    related: ['water-rock', 'fire-fighting'],
  },
  {
    slug: 'water-grass',
    type1: 'water',
    type2: 'grass',
    headline: 'Water control with only three weaknesses',
    examples: ['Lotad', 'Lombre', 'Ludicolo', 'Ogerpon-Wellspring'],
    role: 'Water/Grass is a compact defensive pairing that turns many Water, Ground, and Electric exchanges into workable entry points.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Grass STAB pressures Water, Ground, and Rock targets from the other side. The overlap is useful into Ground and Rock cores, but Poison, Flying, and Bug attacks are the main chart risks. The typing often wants utility, weather, recovery, or coverage to avoid being too predictable offensively.',
    teamBuilding: 'Water/Grass appreciates Poison, Flying, and Bug answers. Steel, Rock, Fire, and Flying-resistant partners can cover those lanes, while Water/Grass helps them against Water, Ground, and Electric pressure.',
    related: ['water-ground', 'grass-poison'],
  },
  {
    slug: 'fire-steel',
    type1: 'fire',
    type2: 'steel',
    headline: 'Poison immunity with a 4× Ground alarm',
    examples: ['Heatran'],
    role: 'Fire/Steel is a resistance-heavy pairing that can punish Fairy, Ice, Grass, Bug, and Steel structures while blanking Poison attacks.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel targets, while Steel STAB pressures Fairy, Ice, and Rock targets. Ground is the severe 4× weakness, and Water and Fighting also force respect. The typing is strongest when it can punish predicted switches but weakest when the opponent can click Ground coverage safely.',
    teamBuilding: 'Fire/Steel needs Ground immunity or strong Ground resistance beside it. Flying, Levitate, Grass, and bulky Water teammates can help, while Fire/Steel gives them a Poison immunity and many resistances in return.',
    related: ['bug-steel', 'flying-steel'],
  },
  {
    slug: 'electric-dragon',
    type1: 'electric',
    type2: 'dragon',
    headline: 'rare coverage with four direct weaknesses',
    examples: ['Mega Ampharos', 'Zekrom', 'Dracozolt', 'Miraidon', 'Raging Bolt'],
    role: 'Electric/Dragon combines strong neutral pressure with useful Fire, Water, Grass, Electric, Flying, and Steel resistances.',
    offense: 'Electric STAB threatens Water and Flying targets, while Dragon STAB supplies broad neutral damage and punishes opposing Dragons. Ground blocks Electric and also hits this pairing for 2×, while Ice, Dragon, and Fairy are the other direct weaknesses. The typing is best when coverage or teammates punish Ground and Fairy answers.',
    teamBuilding: 'Electric/Dragon wants Ground, Ice, Dragon, and Fairy answers. Steel, Flying, Water, and Fairy teammates can help cover those lanes, while Electric/Dragon pressures Water and Flying cores for them.',
    related: ['dragon-steel', 'water-electric'],
  },
  {
    slug: 'dragon-ice',
    type1: 'dragon',
    type2: 'ice',
    headline: 'premium coverage with five 2× weaknesses',
    examples: ['Kyurem', 'Black Kyurem', 'White Kyurem', 'Frigibax', 'Baxcalibur'],
    role: 'Dragon/Ice is an offense-first pairing that pressures Dragon, Flying, Grass, and Ground targets with very little defensive forgiveness.',
    offense: 'Dragon STAB threatens opposing Dragons, while Ice STAB pressures Dragon, Flying, Grass, and Ground targets. Fighting, Rock, Dragon, Steel, and Fairy all hit for 2×, so the typing should usually be treated as a breaker or cleaner rather than a broad switch-in. Steel is especially important because it resists both STAB types and can threaten back.',
    teamBuilding: 'Dragon/Ice needs Steel, Fairy, Fighting, and Rock counterplay. Fire, Steel, Fairy, and bulky Water partners can help create safer entries while Dragon/Ice focuses on forcing damage.',
    related: ['ice-ground', 'dragon-flying'],
  },
  {
    slug: 'dragon-psychic',
    type1: 'dragon',
    type2: 'psychic',
    headline: 'special pressure with six 2× weaknesses',
    examples: ['Latias', 'Latios', 'Mega Latias', 'Mega Latios', 'Ultra Necrozma'],
    role: 'Dragon/Psychic is a special-pressure pairing that can punish Fighting, Poison, Dragon, and neutral defensive structures.',
    offense: 'Dragon STAB gives broad neutral pressure, while Psychic STAB threatens Fighting and Poison targets. The defensive chart is demanding because Ice, Bug, Ghost, Dragon, Dark, and Fairy all deal 2× damage. The typing needs speed, recovery, bulk, or support to avoid being overwhelmed by common coverage.',
    teamBuilding: 'Dragon/Psychic needs Dark, Fairy, Ice, Ghost, Bug, and Dragon answers. Steel and Fairy partners are especially useful, while Dark-resistant support helps keep Psychic STAB from becoming a liability.',
    related: ['psychic-fairy', 'dragon-steel'],
  },
  {
    slug: 'fire-ground',
    type1: 'fire',
    type2: 'ground',
    headline: 'Electric immunity with a 4× Water problem',
    examples: ['Numel', 'Camerupt', 'Mega Camerupt', 'Primal Groudon'],
    role: 'Fire/Ground is a powerful anti-Steel and anti-Electric pairing that can punish many defensive cores if Water is controlled.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel targets, while Ground STAB hits Electric, Fire, Poison, Rock, and Steel targets. Water is the severe 4× weakness and Ground also hits for 2×, so careless switching is dangerous. The pairing is strongest when it forces Steel, Poison, Fire, and Electric targets to respect both STAB options.',
    teamBuilding: 'Fire/Ground needs a real Water answer and a Ground plan. Grass, Water, Flying, and Dragon partners can help cover those lanes, while Fire/Ground offers Electric immunity and strong Steel-breaking pressure.',
    related: ['fire-steel', 'water-ground'],
  },
  {
    slug: 'grass-dark',
    type1: 'grass',
    type2: 'dark',
    headline: 'Psychic immunity with a 4× Bug alarm',
    examples: ['Nuzleaf', 'Shiftry', 'Cacturne', 'Zarude', 'Meowscarada'],
    role: 'Grass/Dark is a disruptive offensive pairing that can pressure Water, Ground, Psychic, and Ghost lanes while blanking Psychic attacks.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Dark STAB pressures Psychic and Ghost targets. Bug is the severe 4× weakness, and Fire, Ice, Fighting, Poison, Flying, and Fairy all hit for 2×. The typing needs momentum, speed, or utility to avoid giving common coverage easy progress.',
    teamBuilding: 'Grass/Dark needs Bug and Fairy answers first, then support against Fire, Ice, Fighting, Poison, and Flying. Steel, Fire, Poison, and Flying-resistant partners can help while Grass/Dark handles Water, Ground, Psychic, and Ghost pressure.',
    related: ['grass-fairy', 'psychic-dark'],
  },
  {
    slug: 'grass-fighting',
    type1: 'grass',
    type2: 'fighting',
    headline: 'Rock and Ground pressure with a 4× Flying risk',
    examples: ['Breloom', 'Virizion', 'Chesnaught', 'Hisuian Lilligant', 'Hisuian Decidueye'],
    role: 'Grass/Fighting is an active pressure pairing that threatens Water, Ground, Rock, Steel, Normal, and Dark targets.',
    offense: 'Grass STAB pressures Water, Ground, and Rock targets, while Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets. Flying is the severe 4× weakness, and Fire, Ice, Poison, Psychic, and Fairy also hit for 2×. The typing works best when it enters through resistance or speed rather than trying to tank broad neutral damage.',
    teamBuilding: 'Grass/Fighting needs Flying answers and support against Fire, Ice, Poison, Psychic, and Fairy. Steel, Electric, Rock, and Fire-resistant partners can cover those lanes while Grass/Fighting pressures Water, Ground, Rock, Dark, and Steel structures.',
    related: ['grass-poison', 'fire-fighting'],
  },
  {
    slug: 'poison-dark',
    type1: 'poison',
    type2: 'dark',
    headline: 'Psychic immunity with only Ground weakness',
    examples: ['Stunky', 'Skuntank', 'Drapion', 'Alolan Muk', 'Overqwil'],
    role: 'Poison/Dark is a sturdy utility pairing that compresses Fairy resistance, Poison absorption, and Psychic immunity into one slot.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Dark STAB threatens Psychic and Ghost targets. Ground is the only chart weakness, so the matchup often turns on whether the opponent can land Earthquake or Earth Power safely. The typing still needs recovery, bulk, or utility because neutral hits and hazards can wear it down.',
    teamBuilding: 'Poison/Dark wants a Ground immunity or reliable Ground-resistant teammate. Flying, Levitate, Grass, and Bug partners can cover that lane, while Poison/Dark answers Psychic and Fairy pressure for them.',
    related: ['poison-ghost', 'flying-dark'],
  },
  {
    slug: 'dark-steel',
    type1: 'dark',
    type2: 'steel',
    headline: 'dual immunity with a 4× Fighting alarm',
    examples: ['Pawniard', 'Bisharp', 'Kingambit'],
    role: 'Dark/Steel is a powerful defensive-offensive pairing that blocks Poison and Psychic while pressuring Fairy, Ghost, and Psychic targets.',
    offense: 'Dark STAB threatens Psychic and Ghost targets, while Steel STAB pressures Fairy, Ice, and Rock targets. Fighting is the severe 4× weakness, and Fire and Ground also deal 2× damage. The typing is strongest when teammates or abilities stop Fighting coverage from becoming a free answer.',
    teamBuilding: 'Dark/Steel needs Fighting counterplay before anything else, plus Fire and Ground support. Fairy, Ghost, Flying, Water, and Ground-immune partners can help, while Dark/Steel gives the team Poison and Psychic immunities.',
    related: ['steel-fairy', 'psychic-dark'],
  },
  {
    slug: 'dark-fairy',
    type1: 'dark',
    type2: 'fairy',
    headline: 'Psychic and Dragon immunity with three weaknesses',
    examples: ['Impidimp', 'Morgrem', 'Grimmsnarl'],
    role: 'Dark/Fairy is a valuable support and disruption typing because it blocks both Psychic and Dragon attacks while threatening common offensive types.',
    offense: 'Dark STAB threatens Psychic and Ghost targets, while Fairy STAB pressures Dragon, Dark, and Fighting targets. Poison, Steel, and Fairy are the direct chart weaknesses, so the user needs help against bulky Steel and Poison answers. The pairing is strongest when it uses screens, status, priority, or pivot support to create tempo.',
    teamBuilding: 'Dark/Fairy wants Poison, Steel, and opposing Fairy answers. Steel, Ground, Fire, and Poison partners can help, while Dark/Fairy protects them from Psychic and Dragon pressure.',
    related: ['psychic-fairy', 'flying-dark'],
  },
  {
    slug: 'fire-bug',
    type1: 'fire',
    type2: 'bug',
    headline: 'dangerous setup pressure with a 4× Rock alarm',
    examples: ['Larvesta', 'Volcarona', 'Sizzlipede', 'Centiskorch'],
    role: 'Fire/Bug is an offense-first pairing that can punish Grass, Ice, Bug, Steel, Psychic, and Dark targets.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel targets, while Bug STAB pressures Psychic, Dark, and Grass targets. Rock is the severe 4× weakness, and Water and Flying also hit for 2×. Hazard control matters because Rock pressure often appears through both attacks and entry hazards.',
    teamBuilding: 'Fire/Bug needs Rock management, Water answers, and Flying counterplay. Ground, Water, Steel, and hazard-removal partners can help create safe entries while Fire/Bug focuses on forcing offensive progress.',
    related: ['fire-flying', 'bug-steel'],
  },
  {
    slug: 'electric-steel',
    type1: 'electric',
    type2: 'steel',
    headline: 'Poison immunity with a 4× Ground risk',
    examples: ['Magnemite', 'Magneton', 'Magnezone', 'Togedemaru'],
    role: 'Electric/Steel is a resistance-heavy pairing that can check Flying, Fairy, Steel, Electric, and Ice lanes while pressuring Water and Flying targets.',
    offense: 'Electric STAB threatens Water and Flying targets, while Steel STAB pressures Fairy, Ice, and Rock targets. Ground is the severe 4× weakness, and Fire and Fighting also hit for 2×. The type is best when Ground immunity, Magnet Pull-style utility, pivoting, or coverage keeps its biggest answer from switching freely.',
    teamBuilding: 'Electric/Steel needs Ground protection first, then Fire and Fighting support. Flying, Levitate, Grass, Water, and Fairy partners can cover those lanes while Electric/Steel supplies Poison immunity and many resistances.',
    related: ['flying-steel', 'water-electric'],
  },
  {
    slug: 'electric-flying',
    type1: 'electric',
    type2: 'flying',
    headline: 'Ground immunity with only Ice and Rock weaknesses',
    examples: ['Zapdos', 'Emolga', 'Thundurus', 'Wattrel', 'Kilowattrel'],
    role: 'Electric/Flying is a strong pivot typing because it blocks Ground while threatening Water, Flying, Grass, Fighting, and Bug lanes.',
    offense: 'Electric STAB threatens Water and Flying targets, while Flying STAB pressures Grass, Fighting, and Bug targets. Ice and Rock are the only direct weaknesses, but Rock may also show up as entry-hazard pressure. The typing is especially valuable when it can pivot repeatedly without letting Rock damage accumulate.',
    teamBuilding: 'Electric/Flying needs Ice and Rock answers. Steel, Water, Fighting, and Ground-resistant partners can cover those lanes, while Electric/Flying gives them a Ground immunity and useful pivot pressure.',
    related: ['water-electric', 'flying-steel'],
  },
  {
    slug: 'grass-steel',
    type1: 'grass',
    type2: 'steel',
    headline: 'Poison immunity with a 4× Fire emergency',
    examples: ['Ferroseed', 'Ferrothorn', 'Kartana'],
    role: 'Grass/Steel is a high-compression defensive pairing that blocks Poison and resists many common attacking types.',
    offense: 'Grass STAB pressures Water, Ground, and Rock targets, while Steel STAB threatens Fairy, Ice, and Rock targets. Fire is the severe 4× weakness and Fighting also hits for 2×, so the typing needs careful matchup control. It is strongest when its many resistances create utility turns rather than when it is forced into Fire coverage.',
    teamBuilding: 'Grass/Steel needs Fire protection and a Fighting plan. Water, Dragon, Fire-resistant, Ghost, and Flying partners can help, while Grass/Steel handles Water, Electric, Grass, Rock, Fairy, and Poison-related pressure.',
    related: ['grass-poison', 'bug-steel'],
  },
  {
    slug: 'ice-psychic',
    type1: 'ice',
    type2: 'psychic',
    headline: 'special coverage with six weaknesses',
    examples: ['Smoochum', 'Jynx', 'Galarian Mr. Mime', 'Mr. Rime', 'Calyrex Ice Rider'],
    role: 'Ice/Psychic is an offense-leaning pairing that can threaten Dragon, Flying, Grass, Ground, Fighting, and Poison targets.',
    offense: 'Ice STAB pressures Dragon, Flying, Grass, and Ground targets, while Psychic STAB threatens Fighting and Poison targets. Fire, Bug, Rock, Ghost, Dark, and Steel all hit for 2×, so the typing has little room for careless switching. It needs speed, bulk, or support to make its coverage matter before the opponent exploits the chart.',
    teamBuilding: 'Ice/Psychic needs Fire, Bug, Rock, Ghost, Dark, and Steel answers. Steel, Fairy, Water, Dark, and Fighting partners can cover different parts of that spread while Ice/Psychic focuses on offensive pressure.',
    related: ['psychic-fairy', 'grass-ice'],
  },
  {
    slug: 'fighting-dark',
    type1: 'fighting',
    type2: 'dark',
    headline: 'Psychic immunity with a 4× Fairy problem',
    examples: ['Scraggy', 'Scrafty', 'Pangoro', 'Urshifu Single Strike'],
    role: 'Fighting/Dark is an aggressive anti-Psychic pairing that can pressure Steel, Rock, Normal, Ghost, and Dark lanes.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Dark STAB threatens Ghost and Psychic targets. Fairy is the severe 4× weakness, and Fighting and Flying also hit for 2×. The typing rewards momentum and prediction because the opponent will often protect Fairy answers carefully.',
    teamBuilding: 'Fighting/Dark needs Fairy control first, then Fighting and Flying answers. Steel, Poison, Fire, Fairy, and Electric partners can help, while Fighting/Dark gives the team a Psychic immunity and strong breaking pressure.',
    related: ['fire-fighting', 'psychic-dark'],
  },
  {
    slug: 'fighting-psychic',
    type1: 'fighting',
    type2: 'psychic',
    headline: 'dual STAB pressure with three weaknesses',
    examples: ['Meditite', 'Medicham', 'Mega Medicham', 'Gallade', 'Mega Mewtwo X'],
    role: 'Fighting/Psychic blends physical and special pressure by threatening Normal, Steel, Rock, Fighting, and Poison targets.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Psychic STAB pressures Fighting and Poison targets. Flying, Ghost, and Fairy are the direct weaknesses, and Ghost can be especially awkward because Psychic offers no defensive help there. The typing needs coverage or team support for Ghost and bulky Psychic-resistant answers.',
    teamBuilding: 'Fighting/Psychic wants Ghost, Flying, and Fairy answers. Dark, Steel, Electric, Poison, and Ghost-resistant partners can help, while Fighting/Psychic pressures common Steel and Poison structures.',
    related: ['psychic-fairy', 'fire-fighting'],
  },
  {
    slug: 'poison-fire',
    type1: 'poison',
    type2: 'fire',
    headline: 'Fairy control with a 4× Ground alarm',
    examples: ['Salandit', 'Salazzle', 'Iron Moth'],
    role: 'Poison/Fire is an offensive utility pairing that punishes Fairy, Grass, Bug, Ice, and Steel targets while resisting several common status lanes.',
    offense: 'Poison STAB threatens Fairy and Grass targets, while Fire STAB pressures Grass, Ice, Bug, and Steel targets. Ground is the severe 4× weakness, and Water, Psychic, and Rock also hit for 2×. The typing needs Ground protection before it can repeatedly use its many resistances.',
    teamBuilding: 'Poison/Fire needs Ground immunity or Ground resistance first, plus Water, Psychic, and Rock support. Flying, Levitate, Grass, Dark, and bulky Water partners can cover those lanes while Poison/Fire handles Fairy and Grass pressure.',
    related: ['fire-steel', 'grass-poison'],
  },
  {
    slug: 'flying-psychic',
    type1: 'flying',
    type2: 'psychic',
    headline: 'Ground immunity with five 2× weaknesses',
    examples: ['Natu', 'Xatu', 'Lugia', 'Woobat', 'Sigilyph'],
    role: 'Flying/Psychic is a utility and speed-friendly pairing that blocks Ground while pressuring Fighting, Grass, Poison, and Bug targets.',
    offense: 'Flying STAB pressures Grass, Fighting, and Bug targets, while Psychic STAB threatens Fighting and Poison targets. Electric, Ice, Rock, Ghost, and Dark all hit for 2×, so the typing needs careful entries and often appreciates recovery, screens, or pivot support. Dark targets also block Psychic attacks, making coverage or teammates important.',
    teamBuilding: 'Flying/Psychic needs Electric, Ice, Rock, Ghost, and Dark answers. Steel, Fairy, Dark, and Ground partners can cover different parts of that spread while Flying/Psychic supplies a Ground immunity and Fighting resistance.',
    related: ['psychic-fairy', 'flying-steel'],
  },
  {
    slug: 'water-rock',
    type1: 'water',
    type2: 'rock',
    headline: 'Fire control with a 4× Grass problem',
    examples: ['Omanyte', 'Omastar', 'Kabuto', 'Kabutops', 'Drednaw'],
    role: 'Water/Rock is a physical-pressure pairing that checks Fire, Flying, Ice, and Rock lanes but must respect Grass coverage.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Rock STAB pressures Flying, Fire, Ice, and Bug targets. Grass is the severe 4× weakness, and Electric, Fighting, and Ground also hit for 2×. The typing is strongest when it can punish Fire and Flying targets without giving Grass attackers free entry.',
    teamBuilding: 'Water/Rock needs a dedicated Grass answer and support against Electric, Fighting, and Ground. Steel, Flying, Poison, Grass, and Dragon partners can cover those lanes while Water/Rock pressures Fire, Flying, and Ice structures.',
    related: ['water-ground', 'ground-rock'],
  },
  {
    slug: 'fire-dark',
    type1: 'fire',
    type2: 'dark',
    headline: 'Psychic immunity with four clean weaknesses',
    examples: ['Houndour', 'Houndoom', 'Mega Houndoom', 'Incineroar', 'Chi-Yu'],
    role: 'Fire/Dark is a disruptive attacking pairing that threatens Steel, Grass, Ice, Bug, Psychic, and Ghost targets while blanking Psychic attacks.',
    offense: 'Fire STAB threatens Grass, Ice, Bug, and Steel targets, while Dark STAB pressures Psychic and Ghost targets. Water, Fighting, Ground, and Rock all hit for 2×, so the typing needs strong positioning or utility to stay on the field. Intimidate, pivoting, setup, or wallbreaking stats can change the role, but the chart risks remain.',
    teamBuilding: 'Fire/Dark needs Water, Fighting, Ground, and Rock answers. Grass, Fairy, Flying, Water, and Ground-immune partners can help, while Fire/Dark gives the team Psychic immunity and Steel pressure.',
    related: ['fire-fighting', 'flying-dark'],
  },
  {
    slug: 'dragon-dark',
    type1: 'dragon',
    type2: 'dark',
    headline: 'Psychic immunity with a 4× Fairy alarm',
    examples: ['Deino', 'Zweilous', 'Hydreigon', 'Guzzlord', 'Roaring Moon'],
    role: 'Dragon/Dark is a strong offensive pairing that combines broad Dragon pressure with Psychic immunity and Dark STAB.',
    offense: 'Dragon STAB threatens opposing Dragons, while Dark STAB pressures Psychic and Ghost targets. Fairy is the severe 4× weakness, and Ice, Fighting, Bug, and Dragon also hit for 2×. The typing needs Fairy control and often benefits from coverage that punishes Steel and Fairy switch-ins.',
    teamBuilding: 'Dragon/Dark needs a reliable Fairy answer before anything else, plus Ice, Fighting, Bug, and Dragon support. Steel, Poison, Fire, Fairy, and Flying partners can help while Dragon/Dark pressures Psychic and Ghost structures.',
    related: ['dragon-flying', 'psychic-dark'],
  },
  {
    slug: 'water-ice',
    type1: 'water',
    type2: 'ice',
    headline: 'Ice coverage with four 2× weaknesses',
    examples: ['Dewgong', 'Cloyster', 'Lapras', 'Spheal', 'Walrein'],
    role: 'Water/Ice is an offense-leaning pairing that threatens Fire, Ground, Rock, Dragon, Flying, and Grass targets.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Ice STAB pressures Dragon, Flying, Grass, and Ground targets. Electric, Grass, Fighting, and Rock all hit for 2×, so the typing needs support before switching into common coverage. It often works best when it can force damage rather than repeatedly absorb hits.',
    teamBuilding: 'Water/Ice needs Electric, Grass, Fighting, and Rock answers. Grass, Ground, Fairy, Steel, and Fighting-resistant partners can cover those lanes while Water/Ice pressures Dragon, Ground, Flying, and Fire targets.',
    related: ['water-rock', 'grass-ice'],
  },
  {
    slug: 'poison-fighting',
    type1: 'poison',
    type2: 'fighting',
    headline: 'Fairy pressure with a 4× Psychic alarm',
    examples: ['Croagunk', 'Toxicroak', 'Sneasler', 'Okidogi'],
    role: 'Poison/Fighting is an active offensive pairing that threatens Fairy, Grass, Normal, Rock, Steel, Ice, and Dark targets.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets. Psychic is the severe 4× weakness, and Ground and Flying also hit for 2×. The typing needs ways to avoid Psychic revenge killers and bulky Ground or Flying answers.',
    teamBuilding: 'Poison/Fighting needs Psychic control first, then Ground and Flying support. Dark, Steel, Flying-resistant, and Ground-immune partners can help while Poison/Fighting pressures Fairy, Steel, and Dark structures.',
    related: ['fire-fighting', 'grass-poison'],
  },
  {
    slug: 'flying-bug',
    type1: 'flying',
    type2: 'bug',
    headline: 'Ground immunity with a 4× Rock emergency',
    examples: ['Butterfree', 'Scyther', 'Yanma', 'Ninjask', 'Vespiquen'],
    role: 'Flying/Bug is a mobility-oriented pairing that blocks Ground and strongly resists Grass and Fighting pressure.',
    offense: 'Flying STAB pressures Grass, Fighting, and Bug targets, while Bug STAB threatens Psychic, Dark, and Grass targets. Rock is the severe 4× weakness, and Fire, Electric, Ice, and Flying also hit for 2×. Hazard control matters because Rock pressure can punish repeated entries even before an attack is used.',
    teamBuilding: 'Flying/Bug needs Rock management and answers to Fire, Electric, Ice, and Flying. Steel, Ground, Water, and hazard-removal partners can help while Flying/Bug provides Ground immunity and strong Grass and Fighting resistance.',
    related: ['bug-steel', 'fire-flying'],
  },
  {
    slug: 'fighting-rock',
    type1: 'fighting',
    type2: 'rock',
    headline: 'wide offensive pressure with seven weaknesses',
    examples: ['Terrakion'],
    role: 'Fighting/Rock is an attack-first pairing that threatens Normal, Ice, Rock, Dark, Steel, Flying, Fire, Bug, and Ice targets.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Rock STAB threatens Flying, Fire, Ice, and Bug targets. Water, Grass, Fighting, Ground, Psychic, Steel, and Fairy all hit for 2×, so the typing needs speed, bulk, or careful support to function. Its value is offensive reach rather than defensive safety.',
    teamBuilding: 'Fighting/Rock needs broad defensive support against Water, Grass, Fighting, Ground, Psychic, Steel, and Fairy. Flying, Ghost, Steel, Water, and Grass partners can cover different lanes while Fighting/Rock focuses on forcing progress.',
    related: ['fire-fighting', 'ground-rock'],
  },
];

const BATCH3_COMBINATION_GUIDE_CONFIGS: GeneratedCombinationGuideConfig[] = [
  {
    slug: 'water-dragon',
    type1: 'water',
    type2: 'dragon',
    headline: 'two weaknesses and strong neutral pressure',
    examples: ['Kingdra', 'Palkia', 'Dracovish', 'Tatsugiri', 'Walking Wake'],
    role: 'Water/Dragon is a compact offensive and defensive pairing that keeps Fire and Water pressure manageable while threatening many neutral targets.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Dragon STAB supplies wide neutral pressure and punishes opposing Dragons. Dragon and Fairy are the only direct chart weaknesses, so the typing can look sturdy, but Fairy also blocks Dragon STAB and can steal momentum. The best users pair their STAB attacks with coverage or teammates that pressure Fairy and bulky Water answers.',
    teamBuilding: 'Water/Dragon wants Fairy and Dragon answers nearby. Steel, Fairy, Poison, and bulky Water-resistant partners can help, while Water/Dragon gives them Fire and Water stability in return.',
    related: ['water-fairy', 'dragon-steel'],
  },
  {
    slug: 'ghost-fairy',
    type1: 'ghost',
    type2: 'fairy',
    headline: 'three immunities with only Ghost and Steel pressure',
    examples: ['Mimikyu', 'Flutter Mane'],
    role: 'Ghost/Fairy is a tricky pressure pairing that blocks Normal, Fighting, and Dragon attacks while threatening common offensive cores.',
    offense: 'Ghost STAB pressures Ghost and Psychic targets, while Fairy STAB threatens Dragon, Dark, and Fighting targets. Ghost and Steel are the only direct weaknesses, and Steel also resists Fairy, so coverage or teammates must discourage Steel answers. The typing is strongest when it uses immunities to create setup, revenge-kill, or disruption turns.',
    teamBuilding: 'Ghost/Fairy needs Steel and Ghost counterplay. Dark, Fire, Ground, and Steel-resistant partners can cover those lanes while Ghost/Fairy protects the team from Normal, Fighting, and Dragon attacks.',
    related: ['ghost-dark', 'psychic-fairy'],
  },
  {
    slug: 'ghost-water',
    type1: 'ghost',
    type2: 'water',
    headline: 'two immunities with four common weaknesses',
    examples: ['Frillish', 'Jellicent', 'Basculegion'],
    role: 'Ghost/Water is a flexible utility pairing that blocks Normal and Fighting while checking Fire, Water, Ice, Bug, and Steel pressure.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Ghost STAB pressures Ghost and Psychic targets. Electric, Grass, Ghost, and Dark all hit for 2×, so the user needs to choose entries carefully. The pairing often works best with recovery, status, or strong immediate damage that punishes predicted switch-ins.',
    teamBuilding: 'Ghost/Water wants Electric, Grass, Ghost, and Dark answers. Grass, Dark, Fairy, and Steel partners can cover those lanes while Ghost/Water offers Normal and Fighting immunities.',
    related: ['water-dragon', 'poison-ghost'],
  },
  {
    slug: 'grass-psychic',
    type1: 'grass',
    type2: 'psychic',
    headline: 'utility pressure with a 4× Bug alarm',
    examples: ['Exeggcute', 'Exeggutor', 'Celebi', 'Calyrex'],
    role: 'Grass/Psychic is a utility-oriented pairing that pressures Water, Ground, Rock, Fighting, and Poison targets but asks for careful defensive support.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Psychic STAB pressures Fighting and Poison targets. Bug is the severe 4× weakness, and Fire, Ice, Poison, Flying, Ghost, and Dark also hit for 2×. The typing should lean on recovery, status, terrain, or pivot support rather than trying to absorb broad coverage.',
    teamBuilding: 'Grass/Psychic needs Bug control first, then support against Fire, Ice, Poison, Flying, Ghost, and Dark. Steel, Fairy, Fire, Flying-resistant, and Dark-resistant teammates can cover those lanes.',
    related: ['grass-fairy', 'psychic-fairy'],
  },
  {
    slug: 'water-steel',
    type1: 'water',
    type2: 'steel',
    headline: 'Poison immunity with no 4× weakness',
    examples: ['Empoleon'],
    role: 'Water/Steel is a sturdy compression typing that resists many common attacks and blanks Poison while keeping Fire pressure neutral.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Steel STAB pressures Fairy, Ice, and Rock targets. Electric, Fighting, and Ground are the direct weaknesses, so the typing needs careful support against common coverage. It is most valuable when its long resistance list creates utility turns without inviting a predictable Ground attack.',
    teamBuilding: 'Water/Steel wants Electric, Fighting, and Ground answers. Grass, Flying, Fairy, Ghost, and Ground-immune partners can help, while Water/Steel handles Poison, Ice, Fairy, Rock, and Steel pressure.',
    related: ['water-rock', 'flying-steel'],
  },
  {
    slug: 'water-poison',
    type1: 'water',
    type2: 'poison',
    headline: 'Fairy control with three direct weaknesses',
    examples: ['Tentacool', 'Tentacruel', 'Qwilfish', 'Mareanie', 'Toxapex'],
    role: 'Water/Poison is a defensive utility pairing that checks Fairy, Fire, Water, Ice, Fighting, Poison, Bug, and Steel lanes.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Poison STAB pressures Fairy and Grass targets. Electric, Ground, and Psychic are the chart weaknesses, so the user must respect common special coverage and Earthquake-style pressure. The typing is especially useful on bulky utility Pokemon that can recover, spread status, or set hazards.',
    teamBuilding: 'Water/Poison needs Electric, Ground, and Psychic answers. Grass, Ground-immune, Dark, and Steel partners can cover those lanes while Water/Poison absorbs Fairy and Water pressure.',
    related: ['water-steel', 'grass-poison'],
  },
  {
    slug: 'dragon-fire',
    type1: 'dragon',
    type2: 'fire',
    headline: 'strong breaking pressure with three 2× weaknesses',
    examples: ['Mega Charizard X', 'Reshiram', 'Turtonator', 'Gouging Fire'],
    role: 'Dragon/Fire is a high-pressure attacking pairing that threatens Grass, Ice, Bug, Steel, Dragon, and many neutral targets.',
    offense: 'Dragon STAB supplies broad neutral damage, while Fire STAB punishes Grass, Ice, Bug, and Steel targets. Ground, Rock, and Dragon are the direct weaknesses, and Fairy still blocks Dragon attacks even though Fire can pressure many Fairy partners. The typing rewards strong positioning because it can punish Steel answers that usually wall Dragon moves.',
    teamBuilding: 'Dragon/Fire wants Ground, Rock, and Dragon support. Flying, Water, Fairy, Steel, and Ground-immune partners can cover those lanes while Dragon/Fire provides Fire-resistant breaking power.',
    related: ['fire-ground', 'dragon-dark'],
  },
  {
    slug: 'fighting-ground',
    type1: 'fighting',
    type2: 'ground',
    headline: 'Electric immunity with six 2× risks',
    examples: ['Great Tusk'],
    role: 'Fighting/Ground is an aggressive physical pairing that threatens Steel, Rock, Electric, Dark, Normal, Fire, and Poison structures.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets. Water, Grass, Ice, Flying, Psychic, and Fairy all hit for 2×, so the typing needs momentum, bulk, or speed to avoid being overloaded. Electric immunity gives it a valuable entry point if the opponent lacks immediate coverage.',
    teamBuilding: 'Fighting/Ground needs answers to Water, Grass, Ice, Flying, Psychic, and Fairy. Steel, Water, Fire, Flying, and Fairy partners can cover different lanes while Fighting/Ground pressures Electric and Steel cores.',
    related: ['fire-fighting', 'ground-dark'],
  },
  {
    slug: 'grass-ground',
    type1: 'grass',
    type2: 'ground',
    headline: 'Electric immunity with a 4× Ice alarm',
    examples: ['Torterra', 'Toedscool', 'Toedscruel'],
    role: 'Grass/Ground is a utility and hazard-friendly pairing that blocks Electric while pressuring Water, Ground, Rock, Fire, Poison, and Steel targets.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Ground STAB pressures Electric, Fire, Poison, Rock, and Steel targets. Ice is the severe 4× weakness, and Fire, Flying, and Bug also hit for 2×. The typing is useful when it can control Electric lanes without being exposed to common Ice coverage.',
    teamBuilding: 'Grass/Ground needs Ice protection first, then support against Fire, Flying, and Bug. Steel, Fire, Water, and Rock-resistant partners can cover those lanes while Grass/Ground handles Electric and Ground pressure.',
    related: ['water-ground', 'grass-steel'],
  },
  {
    slug: 'ice-steel',
    type1: 'ice',
    type2: 'steel',
    headline: 'Poison immunity with two 4× emergencies',
    examples: ['Alolan Sandshrew', 'Alolan Sandslash'],
    role: 'Ice/Steel combines useful offensive Ice pressure with Steel utility, but its defensive chart is defined by severe Fire and Fighting risk.',
    offense: 'Ice STAB threatens Dragon, Flying, Grass, and Ground targets, while Steel STAB pressures Fairy, Ice, and Rock targets. Fire and Fighting both hit for 4×, Ground hits for 2×, and Poison is fully blocked. The typing needs strict support because its many resistances do not save it from the two major emergency lanes.',
    teamBuilding: 'Ice/Steel needs Fire and Fighting answers before anything else, plus a Ground plan. Water, Fairy, Ghost, Flying, and Ground-immune partners can help while Ice/Steel handles Poison, Ice, Fairy, and Dragon-adjacent pressure.',
    related: ['electric-steel', 'dragon-ice'],
  },
  {
    slug: 'fighting-steel',
    type1: 'fighting',
    type2: 'steel',
    headline: 'Poison immunity with three 2× weaknesses',
    examples: ['Lucario', 'Mega Lucario', 'Cobalion', 'Zamazenta-Crowned'],
    role: 'Fighting/Steel is an offensive compression typing that pressures Fairy, Ice, Rock, Dark, Steel, and Normal targets while blocking Poison.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Steel STAB threatens Fairy, Ice, and Rock targets. Fire, Fighting, and Ground are the direct weaknesses, and all three are common coverage lanes. The typing is strongest when speed, priority, or defensive support lets it choose when to take the field.',
    teamBuilding: 'Fighting/Steel needs Fire, Fighting, and Ground answers. Flying, Fairy, Water, Ghost, and Ground-immune partners can cover those lanes while Fighting/Steel absorbs Poison and pressures Rock, Steel, and Fairy targets.',
    related: ['dark-steel', 'fire-fighting'],
  },
  {
    slug: 'psychic-steel',
    type1: 'psychic',
    type2: 'steel',
    headline: 'Poison immunity with four 2× weaknesses',
    examples: ['Bronzor', 'Bronzong', 'Metagross', 'Jirachi', 'Solgaleo'],
    role: 'Psychic/Steel is a durable utility and offense pairing that checks Fairy, Ice, Rock, Poison, Fighting, and Psychic lanes.',
    offense: 'Psychic STAB pressures Fighting and Poison targets, while Steel STAB threatens Fairy, Ice, and Rock targets. Fire, Ground, Ghost, and Dark are the chart weaknesses, so the user must account for common coverage and Knock Off-style pressure. The typing often shines when its many resistances create room for setup, hazards, or pivoting.',
    teamBuilding: 'Psychic/Steel wants Fire, Ground, Ghost, and Dark answers. Water, Flying, Fairy, Dark, and Ground-immune teammates can cover those lanes while Psychic/Steel handles Poison and Fairy pressure.',
    related: ['steel-fairy', 'psychic-dark'],
  },
  {
    slug: 'grass-dragon',
    type1: 'grass',
    type2: 'dragon',
    headline: 'Water control with a 4× Ice alarm',
    examples: ['Alolan Exeggutor', 'Mega Sceptile', 'Applin', 'Flapple', 'Appletun'],
    role: 'Grass/Dragon is a pressure pairing that checks Water, Electric, Grass, and Ground lanes while threatening Water, Ground, Rock, and Dragon targets.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Dragon STAB supplies neutral pressure and punishes Dragons. Ice is the severe 4× weakness, and Poison, Flying, Bug, Dragon, and Fairy also hit for 2×. The typing needs careful support because several common coverage moves line up well against it.',
    teamBuilding: 'Grass/Dragon needs Ice protection first, then Poison, Flying, Bug, Dragon, and Fairy support. Steel, Fire, Water, and Fairy partners can cover those lanes while Grass/Dragon checks Water and Electric pressure.',
    related: ['grass-ground', 'dragon-fire'],
  },
  {
    slug: 'water-fairy',
    type1: 'water',
    type2: 'fairy',
    headline: 'Dragon immunity with three 2× weaknesses',
    examples: ['Marill', 'Azumarill', 'Primarina', 'Tapu Fini'],
    role: 'Water/Fairy is a strong defensive-offensive pairing that blocks Dragon while checking Fire, Water, Ice, Fighting, Bug, and Dark pressure.',
    offense: 'Water STAB threatens Fire, Ground, and Rock targets, while Fairy STAB pressures Dragon, Dark, and Fighting targets. Electric, Grass, and Poison are the direct weaknesses, and Poison can be especially important because it also threatens Fairy teams in general. The typing is best when teammates punish Poison and bulky Water answers.',
    teamBuilding: 'Water/Fairy needs Electric, Grass, and Poison answers. Ground, Steel, Poison, and Grass-resistant partners can cover those lanes while Water/Fairy handles Dragon and Fire pressure.',
    related: ['water-dragon', 'dark-fairy'],
  },
  {
    slug: 'flying-fairy',
    type1: 'flying',
    type2: 'fairy',
    headline: 'Ground and Dragon immunities with five weaknesses',
    examples: ['Togetic', 'Togekiss', 'Enamorus'],
    role: 'Flying/Fairy is a support-friendly pairing that blocks Ground and Dragon while resisting Fighting, Bug, Grass, and Dark pressure.',
    offense: 'Flying STAB pressures Grass, Fighting, and Bug targets, while Fairy STAB threatens Dragon, Dark, and Fighting targets. Electric, Ice, Poison, Rock, and Steel all hit for 2×, so the typing needs help against common coverage and hazard pressure. It is strongest when it can use immunities to create safe utility turns.',
    teamBuilding: 'Flying/Fairy needs Electric, Ice, Poison, Rock, and Steel answers. Ground, Steel, Fire, and Water partners can cover those lanes while Flying/Fairy gives Ground and Dragon immunities in return.',
    related: ['bug-fairy', 'electric-flying'],
  },
  {
    slug: 'electric-fairy',
    type1: 'electric',
    type2: 'fairy',
    headline: 'Dragon immunity with only Poison and Ground weaknesses',
    examples: ['Dedenne', 'Tapu Koko'],
    role: 'Electric/Fairy is a fast-pressure pairing that blocks Dragon while threatening Water, Flying, Dragon, Dark, and Fighting targets.',
    offense: 'Electric STAB threatens Water and Flying targets, while Fairy STAB pressures Dragon, Dark, and Fighting targets. Poison and Ground are the only direct weaknesses, although Ground also blocks Electric attacks unless an ability or move changes the exchange. The typing works best with pivoting, speed, or coverage that punishes Ground entries.',
    teamBuilding: 'Electric/Fairy needs Poison and Ground support. Steel, Flying, Psychic, Grass, and Ground-immune partners can cover those lanes while Electric/Fairy handles Dragon and Water pressure.',
    related: ['water-electric', 'dark-fairy'],
  },
  {
    slug: 'poison-ground',
    type1: 'poison',
    type2: 'ground',
    headline: 'Electric immunity with four 2× weaknesses',
    examples: ['Nidoqueen', 'Nidoking', 'Paldean Wooper', 'Clodsire'],
    role: 'Poison/Ground is a utility pairing that blocks Electric while pressuring Fairy, Poison, Fire, Rock, Steel, and Electric targets.',
    offense: 'Poison STAB threatens Fairy and Grass targets, while Ground STAB pressures Electric, Fire, Poison, Rock, and Steel targets. Water, Ice, Ground, and Psychic all hit for 2×, so the user needs support before switching into broad coverage. The typing is valuable because it combines Electric immunity with Poison utility.',
    teamBuilding: 'Poison/Ground wants Water, Ice, Ground, and Psychic answers. Grass, Water, Flying, Dark, and Steel partners can cover those lanes while Poison/Ground absorbs Electric and Fairy pressure.',
    related: ['poison-dark', 'ground-ghost'],
  },
  {
    slug: 'psychic-rock',
    type1: 'psychic',
    type2: 'rock',
    headline: 'wide offense with seven 2× weaknesses',
    examples: ['Lunatone', 'Solrock'],
    role: 'Psychic/Rock is an attack-leaning pairing that pressures Fighting, Poison, Flying, Fire, Ice, and Bug targets but needs heavy defensive support.',
    offense: 'Psychic STAB threatens Fighting and Poison targets, while Rock STAB pressures Flying, Fire, Ice, and Bug targets. Water, Grass, Ground, Bug, Ghost, Dark, and Steel all hit for 2×, making this one of the more demanding defensive charts. The typing should focus on creating offensive value rather than absorbing repeated attacks.',
    teamBuilding: 'Psychic/Rock needs broad defensive support against Water, Grass, Ground, Bug, Ghost, Dark, and Steel. Steel, Fairy, Grass, Water, and Dark-resistant partners can cover different parts of that spread.',
    related: ['ice-rock', 'psychic-steel'],
  },
  {
    slug: 'grass-ghost',
    type1: 'grass',
    type2: 'ghost',
    headline: 'two immunities with five 2× weaknesses',
    examples: ['Phantump', 'Trevenant', 'Pumpkaboo', 'Gourgeist', 'Decidueye'],
    role: 'Grass/Ghost is a utility pairing that blocks Normal and Fighting while pressuring Water, Ground, Rock, Ghost, and Psychic lanes.',
    offense: 'Grass STAB threatens Water, Ground, and Rock targets, while Ghost STAB pressures Ghost and Psychic targets. Fire, Ice, Flying, Ghost, and Dark all hit for 2×, so the typing must use immunities and resistances carefully. It often fits best with recovery, status, spinblocking, or disruption rather than pure defensive bulk.',
    teamBuilding: 'Grass/Ghost needs Fire, Ice, Flying, Ghost, and Dark answers. Water, Fairy, Dark, Steel, and Rock-resistant partners can cover those lanes while Grass/Ghost handles Normal and Fighting attacks.',
    related: ['ghost-water', 'grass-dark'],
  },
  {
    slug: 'fighting-flying',
    type1: 'fighting',
    type2: 'flying',
    headline: 'Ground immunity with five 2× weaknesses',
    examples: ['Hawlucha', 'Galarian Zapdos', 'Flamigo'],
    role: 'Fighting/Flying is a fast offensive pairing that blocks Ground while threatening Normal, Rock, Steel, Grass, Bug, and Dark targets.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Flying STAB pressures Grass, Fighting, and Bug targets. Electric, Ice, Flying, Psychic, and Fairy all hit for 2×, so the typing needs speed, setup, or pivot support. It is strongest when it turns a Ground immunity into an immediate offensive threat.',
    teamBuilding: 'Fighting/Flying needs Electric, Ice, Flying, Psychic, and Fairy answers. Steel, Electric, Poison, and bulky Water partners can cover those lanes while Fighting/Flying pressures Rock and Steel cores.',
    related: ['fighting-dark', 'flying-fairy'],
  },
  {
    slug: 'psychic-ghost',
    type1: 'psychic',
    type2: 'ghost',
    headline: 'two immunities with two 4× weaknesses',
    examples: ['Hoopa Confined', 'Lunala', 'Necrozma Dawn Wings', 'Calyrex-Shadow'],
    role: 'Psychic/Ghost is a high-pressure special pairing that blocks Normal and Fighting while threatening Fighting, Poison, Ghost, and Psychic targets.',
    offense: 'Psychic STAB pressures Fighting and Poison targets, while Ghost STAB threatens Ghost and Psychic targets. It has no 2× weaknesses, but Ghost and Dark both deal 4× damage, so the matchup can swing violently around priority, Speed, and coverage. The typing should be positioned to attack first or force switches rather than absorb hits.',
    teamBuilding: 'Psychic/Ghost needs reliable Ghost and Dark answers. Dark-resistant Fairy, Steel, Normal, and bulky Dark partners can cover those lanes while Psychic/Ghost provides Normal and Fighting immunities.',
    related: ['ghost-fairy', 'ice-ghost'],
  },
  {
    slug: 'ghost-electric',
    type1: 'ghost',
    type2: 'electric',
    headline: 'two immunities with three direct weaknesses',
    examples: ['Rotom'],
    role: 'Ghost/Electric is a pivot-friendly pairing that blocks Normal and Fighting while threatening Water, Flying, Ghost, and Psychic targets.',
    offense: 'Ghost STAB pressures Ghost and Psychic targets, while Electric STAB threatens Water and Flying targets. Ground, Ghost, and Dark are the direct weaknesses, and Ground also blocks Electric attacks. The typing benefits from pivoting, status, or ability support that keeps Ground answers from switching in freely.',
    teamBuilding: 'Ghost/Electric wants Ground, Ghost, and Dark answers. Flying, Grass, Fairy, Dark, and Normal partners can cover those lanes while Ghost/Electric gives Normal and Fighting immunities.',
    related: ['water-electric', 'psychic-ghost'],
  },
  {
    slug: 'ground-dark',
    type1: 'ground',
    type2: 'dark',
    headline: 'Electric and Psychic immunities with six weaknesses',
    examples: ['Sandile', 'Krokorok', 'Krookodile', 'Ting-Lu'],
    role: 'Ground/Dark is a disruptive pairing that blocks Electric and Psychic while threatening Steel, Fire, Poison, Rock, Ghost, and Psychic targets.',
    offense: 'Ground STAB threatens Electric, Fire, Poison, Rock, and Steel targets, while Dark STAB pressures Ghost and Psychic targets. Water, Grass, Ice, Fighting, Bug, and Fairy all hit for 2×, so the typing needs careful support despite its two immunities. It often fits bulky disruption or revenge pressure roles.',
    teamBuilding: 'Ground/Dark needs Water, Grass, Ice, Fighting, Bug, and Fairy answers. Flying, Poison, Steel, Fire, and Fairy partners can cover those lanes while Ground/Dark blocks Electric and Psychic pressure.',
    related: ['grass-dark', 'poison-ground'],
  },
  {
    slug: 'ice-ghost',
    type1: 'ice',
    type2: 'ghost',
    headline: 'two immunities with five 2× weaknesses',
    examples: ['Froslass'],
    role: 'Ice/Ghost is an offensive utility pairing that blocks Normal and Fighting while threatening Dragon, Flying, Grass, Ground, Ghost, and Psychic targets.',
    offense: 'Ice STAB pressures Dragon, Flying, Grass, and Ground targets, while Ghost STAB threatens Ghost and Psychic targets. Fire, Rock, Ghost, Dark, and Steel all hit for 2×, so the typing must rely on speed, disruption, or careful entry. Its immunities are useful, but they do not make repeated switching easy.',
    teamBuilding: 'Ice/Ghost needs Fire, Rock, Ghost, Dark, and Steel answers. Water, Fairy, Fighting, Dark, and Steel-resistant partners can cover those lanes while Ice/Ghost offers Normal and Fighting immunities.',
    related: ['psychic-ghost', 'ghost-fire'],
  },
  {
    slug: 'poison-flying',
    type1: 'poison',
    type2: 'flying',
    headline: 'Ground immunity with four 2× weaknesses',
    examples: ['Zubat', 'Golbat', 'Crobat'],
    role: 'Poison/Flying is a fast utility pairing that blocks Ground while resisting Fighting, Poison, Bug, Grass, and Fairy pressure.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Flying STAB threatens Grass, Fighting, and Bug targets. Electric, Ice, Psychic, and Rock all hit for 2×, so the user must respect common coverage and entry hazards. The typing is strongest when speed, pivoting, or status lets it use its resistances repeatedly.',
    teamBuilding: 'Poison/Flying needs Electric, Ice, Psychic, and Rock answers. Ground, Steel, Dark, and Water partners can cover those lanes while Poison/Flying handles Ground, Fairy, Fighting, and Grass pressure.',
    related: ['flying-bug', 'poison-dark'],
  },
  {
    slug: 'poison-steel',
    type1: 'poison',
    type2: 'steel',
    headline: 'Poison immunity with a 4× Ground problem',
    examples: ['Varoom', 'Revavroom'],
    role: 'Poison/Steel is a resistance-heavy pairing that blocks Poison and compresses Fairy, Grass, Ice, Bug, Rock, Dragon, and Steel interactions.',
    offense: 'Poison STAB pressures Fairy and Grass targets, while Steel STAB threatens Fairy, Ice, and Rock targets. Ground is the severe 4× weakness, while Fire hits for 2×. The typing needs Ground control before its large resistance profile can safely matter.',
    teamBuilding: 'Poison/Steel needs Ground immunity or strong Ground resistance, plus Fire support. Flying, Levitate, Water, Dragon, and Ground-resistant partners can cover those lanes while Poison/Steel absorbs Fairy and Poison pressure.',
    related: ['electric-steel', 'grass-steel'],
  },
  {
    slug: 'fighting-fairy',
    type1: 'fighting',
    type2: 'fairy',
    headline: 'Dragon immunity with five 2× weaknesses',
    examples: ['Iron Valiant'],
    role: 'Fighting/Fairy is an aggressive pairing that blocks Dragon while threatening Dark, Dragon, Normal, Steel, Rock, and Fighting targets.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Fairy STAB pressures Dragon, Dark, and Fighting targets. Poison, Flying, Psychic, Steel, and Fairy all hit for 2×, so the typing needs strong positioning and support. Its offensive reach is excellent, but the defensive chart is not passive.',
    teamBuilding: 'Fighting/Fairy needs Poison, Flying, Psychic, Steel, and Fairy answers. Steel, Poison, Electric, Dark, and Fire partners can cover those lanes while Fighting/Fairy blocks Dragon pressure.',
    related: ['dark-fairy', 'fighting-psychic'],
  },
  {
    slug: 'ice-rock',
    type1: 'ice',
    type2: 'rock',
    headline: 'two 4× weaknesses and strong offensive reach',
    examples: ['Amaura', 'Aurorus', 'Hisuian Avalugg'],
    role: 'Ice/Rock is an offense-first pairing that pressures Dragon, Flying, Grass, Ground, Fire, Ice, and Bug targets.',
    offense: 'Ice STAB threatens Dragon, Flying, Grass, and Ground targets, while Rock STAB pressures Flying, Fire, Ice, and Bug targets. Fighting and Steel both hit for 4×, while Water, Grass, Ground, and Rock hit for 2×. The typing needs careful entry support because common priority and coverage can punish it hard.',
    teamBuilding: 'Ice/Rock needs Fighting and Steel answers before anything else, plus Water, Grass, Ground, and Rock support. Ghost, Flying, Water, Steel, and Fighting-resistant partners can help create safer attack windows.',
    related: ['psychic-rock', 'dragon-ice'],
  },
  {
    slug: 'ghost-fire',
    type1: 'ghost',
    type2: 'fire',
    headline: 'two immunities with five 2× weaknesses',
    examples: ['Litwick', 'Lampent', 'Chandelure', 'Blacephalon', 'Skeledirge'],
    role: 'Ghost/Fire is a dangerous offensive pairing that blocks Normal and Fighting while threatening Steel, Grass, Ice, Bug, Ghost, and Psychic targets.',
    offense: 'Ghost STAB pressures Ghost and Psychic targets, while Fire STAB threatens Grass, Ice, Bug, and Steel targets. Water, Ground, Rock, Ghost, and Dark all hit for 2×, so the user needs positioning before committing to a switch-in. The typing rewards strong special pressure and punishes passive targets that cannot threaten its weaknesses.',
    teamBuilding: 'Ghost/Fire needs Water, Ground, Rock, Ghost, and Dark answers. Grass, Flying, Fairy, Dark, and Water partners can cover those lanes while Ghost/Fire supplies Normal and Fighting immunities.',
    related: ['fire-dark', 'psychic-ghost'],
  },
  {
    slug: 'fighting-ghost',
    type1: 'fighting',
    type2: 'ghost',
    headline: 'two immunities with four 2× weaknesses',
    examples: ['Marshadow', 'Annihilape'],
    role: 'Fighting/Ghost is an aggressive pairing that blocks Normal and Fighting while threatening Normal, Steel, Rock, Dark, Ghost, and Psychic targets.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Ghost STAB pressures Ghost and Psychic targets. Flying, Psychic, Ghost, and Fairy all hit for 2×, so the typing needs support against common revenge-kill lanes. Its STAB pairing is difficult to wall but not difficult to pressure defensively.',
    teamBuilding: 'Fighting/Ghost wants Flying, Psychic, Ghost, and Fairy answers. Steel, Dark, Fairy, Electric, and Normal partners can cover those lanes while Fighting/Ghost provides Normal and Fighting immunities.',
    related: ['fighting-dark', 'ghost-dark'],
  },
  {
    slug: 'dark-rock',
    type1: 'dark',
    type2: 'rock',
    headline: 'Psychic immunity with a 4× Fighting alarm',
    examples: ['Tyranitar', 'Mega Tyranitar'],
    role: 'Dark/Rock is a physical-pressure pairing that blocks Psychic and threatens Flying, Fire, Ice, Bug, Ghost, and Psychic targets.',
    offense: 'Dark STAB threatens Ghost and Psychic targets, while Rock STAB pressures Flying, Fire, Ice, and Bug targets. Fighting is the severe 4× weakness, and Water, Grass, Ground, Bug, Steel, and Fairy also hit for 2×. The typing needs dedicated defensive support despite its strong offensive profile.',
    teamBuilding: 'Dark/Rock needs Fighting control first, then Water, Grass, Ground, Bug, Steel, and Fairy support. Fairy, Flying, Ghost, Water, and Steel partners can cover different lanes while Dark/Rock blocks Psychic pressure.',
    related: ['ground-rock', 'dragon-dark'],
  },
  {
    slug: 'fighting-bug',
    type1: 'fighting',
    type2: 'bug',
    headline: 'strong resistance profile with a 4× Flying risk',
    examples: ['Heracross', 'Mega Heracross', 'Buzzwole', 'Pheromosa'],
    role: 'Fighting/Bug is an offense-oriented pairing that pressures Normal, Dark, Steel, Psychic, Grass, and Rock targets while resisting several physical lanes.',
    offense: 'Fighting STAB breaks Normal, Ice, Rock, Dark, and Steel targets, while Bug STAB threatens Psychic, Dark, and Grass targets. Flying is the severe 4× weakness, while Fire, Psychic, and Fairy hit for 2×. The typing wants speed, bulk, or matchup control so its strong offensive coverage is not erased by Flying pressure.',
    teamBuilding: 'Fighting/Bug needs Flying answers first, plus Fire, Psychic, and Fairy support. Steel, Electric, Rock, Fire-resistant, and Dark partners can cover those lanes while Fighting/Bug pressures Dark, Steel, Grass, and Psychic structures.',
    related: ['fighting-flying', 'poison-bug'],
  },
];

Object.assign(
  COMBINATION_GUIDES,
  Object.fromEntries([...GENERATED_COMBINATION_GUIDE_CONFIGS, ...BATCH3_COMBINATION_GUIDE_CONFIGS].map(config => [config.slug, makeGeneratedCombinationGuide(config)]))
);

COMBINATION_GUIDES['dragon-flying'].extraLinks = [
  { href: '/pokemon/type-chart', label: 'Type Chart' },
  { href: '/calculator', label: 'Dual Type Calculator' },
  { href: '/types/ground-dragon', label: 'Ground/Dragon guide' },
  { href: '/types/flying-steel', label: 'Flying/Steel guide' },
];

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
    siteName: 'TypeMatchup',
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
  const pressureTypes = [...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak];
  const safeEntryTypes = [...weaknesses.immune, ...weaknesses.quadrupleResist, ...weaknesses.doubleResist];
  const coverageValue = getCoverageValue(weaknesses);
  const partnerCandidates = getPartnerCandidates(type1, type2, weaknesses);
  const hasSevereWeakness = weaknesses.quadrupleWeak.length > 0;

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

            {guide.extraLinks && guide.extraLinks.length > 0 && (
              <p>
                Continue with{' '}
                {guide.extraLinks.map((link, index) => (
                  <span key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                    {index < guide.extraLinks!.length - 2 ? ', ' : index === guide.extraLinks!.length - 2 ? ', and ' : ''}
                  </span>
                ))}.
              </p>
            )}

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

      <article className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          TypeMatchup Original Analysis
        </h2>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Coverage Value</h3>
            <p className="text-2xl font-bold text-blue-700">{coverageValue}</p>
            <p className="text-sm text-gray-600">
              Internal score from immunities, resistances, weaknesses, and 4× pressure.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
            <p className="text-sm text-gray-700">{describeCoverageValue(coverageValue)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Main Planning Risk</h3>
            <p className="text-sm text-gray-700">
              {hasSevereWeakness
                ? `Protect the ${formatTypeList(weaknesses.quadrupleWeak)} 4× weakness before relying on this pairing as a switch-in.`
                : pressureTypes.length > 0
                  ? `No 4× weakness, but repeated ${formatTypeList(pressureTypes.slice(0, 3))} pressure can still force predictable switches.`
                  : 'This pairing has no listed weakness in the standard chart, so matchup value depends heavily on stats, moves, and format rules.'}
            </p>
          </div>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">How to interpret this pairing</h3>
            <p>
              {type1Data.name}/{type2Data.name} should be judged by the trade it creates, not by the raw number of
              weaknesses alone. It offers safe entry into {formatTypeList(safeEntryTypes.slice(0, 6))}, which means it can
              buy turns when those attack types are predictable. In exchange, the opponent will usually try to line up
              {pressureTypes.length > 0 ? formatTypeList(pressureTypes) : 'strong neutral damage'}, so the pairing needs
              either speed, bulk, recovery, pivoting, or a teammate ready to absorb that pressure.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team-building partners</h3>
            <p>
              Based on TypeMatchup&apos;s own defensive coverage pass, useful single-type partners to test first are{' '}
              {partnerCandidates.length > 0
                ? partnerCandidates.map(candidate =>
                    `${getTypeName(candidate.candidateType)} for ${formatTypeList(candidate.coveredThreats)}`
                  ).join('; ')
                : 'format-specific bulky pivots, because this pairing has unusually few direct chart weaknesses'}.
              These are not automatic best teammates; they are a shortlist for reducing repeated weaknesses before you
              choose actual Pokémon, moves, items, abilities, and battle format.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">When this combination is worth using</h3>
            <p>
              Use this combination when its resisted or immune entries match threats you expect to face repeatedly. Avoid
              using it only because the summary looks efficient: a 4× weakness can dominate a matchup, while even a
              strong resistance profile can fail if the Pokémon lacks recovery, speed control, or meaningful pressure
              after switching in. For a six-Pokémon build, run this pairing through the <Link href="/pokemon/team-calculator">Team Calculator</Link> and
              check whether another teammate shares the same {pressureTypes.length > 0 ? formatTypeList(pressureTypes.slice(0, 2)) : 'neutral coverage'} problem.
            </p>
          </section>
        </div>
      </article>

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
