---
slug: how-to-read-dual-type-chart
title: "How to Read a Dual-Type Chart (with 4× Examples)"
description: "Read a Pokémon dual-type chart by multiplying the two defensive matchups. Worked 4× examples for Charizard, Heatran, Water/Ground, and Steel/Fairy, plus the calculator."
date: "2026-11-06"
author: "TypeMatchup"
tags: ["dual type chart", "type effectiveness", "calculator", "competitive"]
faq:
  - question: "How do you calculate a dual-type multiplier?"
    answer: "Multiply the attacking type's effectiveness against each defending type. Two 2× weaknesses become 4×. A 2× weakness times a 0.5× resistance becomes 1×. A 0× immunity makes the whole product 0×."
  - question: "What is Charizard 4× weak to?"
    answer: "Charizard is Fire/Flying. Rock is 2× against both types, so Rock moves deal 4× damage. Water and Electric stay at 2×. Ground deals 0× because Flying is immune to Ground."
  - question: "Why does Water/Ground have only one weakness?"
    answer: "Grass is the only type that is super effective against both Water and Ground, so Grass deals 4×. Electric is 0× because Ground is immune to it. Water and Ice are super effective against Ground and resisted by Water, so both come out at 1×."
  - question: "Does Steel/Fairy have a 4× weakness?"
    answer: "No. Steel is weak to Fire, Fighting, and Ground. Fairy is weak to Poison and Steel. Those lists do not overlap. Fire and Ground stay at 2×. Fighting and Steel cancel to 1×. Poison and Dragon are 0×."
  - question: "Do these dual-type multipliers work in Pokémon GO?"
    answer: "No. This guide uses the Generation 6 through Generation 9 main-series chart: super effective is 2×, resisted is 0.5×, and immune is 0×. Pokémon GO uses different multipliers, and immunities deal reduced damage instead of 0×."
  - question: "Does Terastallization still use the dual-type chart?"
    answer: "A normal Tera type replaces both defending types while the Pokémon is Terastallized, so you read that single type. Stellar Tera, used in Tera Raid Battles, keeps the original dual-type defense."
---

# How to Read a Dual-Type Chart (with 4× Examples)

A dual-type chart answers a different question from the single-type chart. Fire is weak to Water, Ground, and Rock. Charizard is Fire/Flying, and only one of those three stays a simple weakness. Rock becomes 4×, Ground becomes 0×, and Ice, which threatens Flying and never shows up on Fire's weakness list, comes out neutral.

This guide uses the Generation 6–9 main-series chart, Fairy included, and multiplies four matchups you have to play: Charizard's Rock weakness, Heatran's Ground weakness, Water/Ground's single Grass hole, and Steel/Fairy, which never reaches 4×.

The figures below are type multipliers only. Stats, base power, items, and weather come afterward. The [STAB calculator guide](/blog/stab-calculator-guide) picks up the separate 1.5× Same-Type Attack Bonus.

## Multiply the two types

Each defending type contributes one factor: 2× if it is weak to the attack, 1× if it is neutral, 0.5× if it resists, and 0× if it is immune. The dual-type result is the product. Add nothing.

| First factor | Second factor | Product | What you do with it |
| --- | --- | --- | --- |
| 2× | 2× | 4× | Both types are weak. This is the switch punish. |
| 2× | 1× | 2× | Ordinary super effective damage. |
| 2× | 0.5× | 1× | A weakness cancelled by a resistance. Neutral. |
| 2× | 0× | 0× | The immunity wins. The move deals no damage. |
| 0.5× | 0.5× | 0.25× | Resisted twice. Usually a wasted click. |
| 0.5× | 1× | 0.5× | An ordinary resist. |
| 0× | anything | 0× | Still immune. The other type does not leak damage through. |

Fire/Flying and Flying/Fire are the same defensive chart. A 4× line exists only when the same attacking type sits on both weakness lists. Charizard is threatened by Rock, Water, and Electric as three separate rows: Rock at 4×, Water at 2×, Electric at 2×.

From a team sheet, write both types. If a cell is fuzzy, check the [Pokémon type chart](/pokemon/type-chart) or a single-type page such as [Fire](/types/fire) or [Flying](/types/flying). Shared weaknesses are the 4× candidates. A one-sided weakness stays 2× when the other type is neutral, drops to 1× when the other type resists, and drops to 0× on an immunity. Hit the 4× or leave. At 0×, pick another move.

| Pair | Pokémon | 4× | Still 2× | Immunity that rewrote a weakness | Cancelled to 1× |
| --- | --- | --- | --- | --- | --- |
| Fire/Flying | Charizard, Moltres, Talonflame, Ho-Oh | Rock | Water, Electric | Ground | Ice |
| Fire/Steel | Heatran | Ground | Water, Fighting | Poison | Fire, Rock |
| Water/Ground | Swampert, Gastrodon, Quagsire | Grass | none | Electric | Water, Ice |
| Steel/Fairy | Tinkaton, Klefki, Magearna, Mawile | none | Fire, Ground | Poison, Dragon | Fighting, Steel |

## Charizard: Rock is the only 4×

Fire is weak to Water, Ground, and Rock. Flying is weak to Electric, Ice, and Rock. Rock is the shared type, so it is 4× on Charizard, Moltres, Talonflame, and Ho-Oh. The [Fire/Flying guide](/types/fire-flying) is the longer matchup page.

| Attacking type | vs Fire | vs Flying | Product | The decision |
| --- | --- | --- | --- | --- |
| Rock | 2× | 2× | 4× | Stone Edge, Rock Slide, Stealth Rock. |
| Water | 2× | 1× | 2× | Surf and Scald when you have no Rock move. |
| Electric | 1× | 2× | 2× | Thunderbolt. Same bucket as Water. |
| Ground | 2× | 0× | 0× | Earthquake does nothing. |
| Ice | 0.5× | 2× | 1× | Ice Beam is neutral. |
| Grass or Bug | 0.5× | 0.5× | 0.25× | Double resisted. |
| Fire | 0.5× | 1× | 0.5× | Incoming Fire STAB is resisted. |
| Fighting | 1× | 0.5× | 0.5× | Close Combat is resisted. |

Sort your moves into those rows during preview. Stone Edge against a slower Charizard is the attack. Earthquake as your only Fire answer means you switch.

Stealth Rock charges the same Rock product on entry: one eighth of max HP, times Rock effectiveness, rounded down to a whole HP.

| Pokémon | Types | Rock factors | Product | Entry damage without Boots |
| --- | --- | --- | --- | --- |
| Charizard | Fire/Flying | 2× × 2× | 4× | Half of max HP |
| Gyarados | Water/Flying | 1× × 2× | 2× | A quarter of max HP |
| Heatran | Fire/Steel | 2× × 0.5× | 1× | One eighth of max HP |
| Swampert | Water/Ground | 1× × 0.5× | 0.5× | One sixteenth of max HP |
| Tinkaton | Steel/Fairy | 0.5× × 1× | 0.5× | One sixteenth of max HP |

"Flying dies to rocks" flattens two products. Gyarados takes a quarter. Charizard takes half. Heavy-Duty Boots, from Sword and Shield onward, zero that chip until Knock Off removes them. From X and Y through Ultra Sun and Ultra Moon, Boots do not exist, so the hazard is the punish.

The chart also moves during the turn. Roost removes Flying until the turn ends, so Charizard defends as pure Fire: Rock drops from 4× to 2×, and Ground rises from 0× to 2×. A slower Earthquake connects. Smack Down and Gravity remove the Ground immunity until Charizard switches, and a later Earthquake is then 2× into Fire.

Turtonator and Reshiram are Fire/Dragon, so Rock there is 2× × 1× = 2×, and Water falls to 1× because Dragon resists it. Same first type, different chart.

## Heatran: Ground is 4×, and Fire is neutral

Heatran is the Fire/Steel Pokémon. Fire is weak to Water, Ground, and Rock. Steel is weak to Fire, Fighting, and Ground. Ground is the only shared weakness. The [Fire/Steel guide](/types/fire-steel) covers the team slot.

| Attacking type | vs Fire | vs Steel | Product | The decision |
| --- | --- | --- | --- | --- |
| Ground | 2× | 2× | 4× | Earthquake and Earth Power. |
| Water | 2× | 1× | 2× | The line when Ground is blocked. |
| Fighting | 1× | 2× | 2× | Close Combat and Focus Blast. |
| Fire | 0.5× | 2× | 1× | Neutral on the raw chart. |
| Rock | 2× | 0.5× | 1× | Stone Edge is neutral here. |
| Poison | 1× | 0× | 0× | Sludge Bomb does nothing. |
| Grass, Ice, Bug, Steel, Fairy | 0.5× | 0.5× | 0.25× | Double resisted. |
| Normal, Flying, Psychic, Dragon | 1× | 0.5× | 0.5× | Resisted by Steel. |

Rock-for-Fire and Fire-for-Steel both land at 1×. The second type paid for the first type's problem and moved the bill onto Ground.

Flash Fire then replaces that neutral Fire cell: a Fire move deals 0 and boosts Heatran's own Fire attacks. Compare the layers on the [Fire/Steel chart with Flash Fire](/pokemon/type-chart-with-abilities?type1=fire&type2=steel&ability=flash-fire). Air Balloon is an item, so that page will not model it. While the balloon is up, Heatran ignores Ground. The 4× returns when any damaging hit pops it. If Earthquake is your only answer, break the balloon with something else first.

## Water/Ground: one weakness, and it is 4×

Water is weak to Electric and Grass. Ground is weak to Water, Grass, and Ice. Grass is the only overlap. Swampert, Gastrodon, Quagsire, and Seismitoad share it. The [Water/Ground guide](/types/water-ground) is the team-building page.

| Attacking type | vs Water | vs Ground | Product | The decision |
| --- | --- | --- | --- | --- |
| Grass | 2× | 2× | 4× | The only super effective type. |
| Electric | 2× | 0× | 0× | Thunderbolt does nothing. |
| Water | 0.5× | 2× | 1× | Surf into Swampert is neutral. |
| Ice | 0.5× | 2× | 1× | Ice Beam is neutral. |
| Fire, Steel | 0.5× | 1× | 0.5× | Resisted by Water. |
| Poison, Rock | 1× | 0.5× | 0.5× | Resisted by Ground. |

Nothing else is super effective. If the Grass move is unavailable, there is no second door. A neutral special attack can grind a slow Swampert. A Grass move ends the switch.

Storm Drain Gastrodon and Water Absorb Quagsire take nothing from Water. Unaware Quagsire does not: Unaware ignores the opponent's stat changes, and the 1× Water hit still connects. Open [Water/Ground with Storm Drain](/pokemon/type-chart-with-abilities?type1=water&type2=ground&ability=storm-drain) when the ability is Storm Drain, and use the plain chart for Unaware or Sticky Hold.

Freeze-Dry rewrites the Ice row. It treats Water as super effective, so the Water factor flips from 0.5× to 2×, Ground stays 2×, and the product is 4×. Into this typing, Freeze-Dry is the same emergency as Grass. The same flip hits Gyarados: ordinary Ice into Water/Flying is 1×, and Freeze-Dry is 4×.

## Steel/Fairy: no shared weakness, so no 4×

Steel is weak to Fire, Fighting, and Ground. Fairy is weak to Poison and Steel. Nothing appears on both lists, so Tinkaton, Klefki, Magearna, and Mawile have no 4× weakness. Crowned Zacian joins them while it holds the Rusted Sword. The [Steel/Fairy guide](/types/steel-fairy) is the strategy page.

| Attacking type | vs Steel | vs Fairy | Product | The decision |
| --- | --- | --- | --- | --- |
| Fire | 2× | 1× | 2× | One of the two real weaknesses. |
| Ground | 2× | 1× | 2× | The other. |
| Fighting | 2× | 0.5× | 1× | Close Combat is neutral. |
| Poison | 0× | 2× | 0× | Sludge Bomb does nothing. |
| Steel | 0.5× | 2× | 1× | Iron Head is neutral before STAB. |
| Dragon | 0.5× | 0× | 0× | Outrage does nothing. |
| Bug | 0.5× | 0.5× | 0.25× | The double resist. |
| Dark | 1× | 0.5× | 0.5× | Resisted by Fairy. |

A weakness count puts Steel/Fairy next to Water/Ground. Water/Ground's only weakness is 4×. Steel/Fairy's weaknesses are ordinary 2× hits, plus two immunities and a 0.25× Bug resist. Iron Head still feels like the Fairy answer, and it is 1×. Fire or Ground is the type check. Knock Off and denying recovery do the rest.

## Check it on the calculator and the chart

The [Dual Type Calculator](/calculator) opens on Fire/Flying, and the quick answer should name Rock at 4×. Open **Show multiplier calculations** for the two factors. Preset buttons load Water/Ground and Steel/Fairy. For Heatran, set Fire and Steel or open [Fire/Steel in the calculator](/calculator?type1=fire&type2=steel): Ground under Quadruple Weak, Water and Fighting under Weak, Poison under Immune, Fire and Rock under normal effectiveness. The Dragon/Ground preset is Garchomp. Ice is 4×, Dragon and Fairy stay 2×, Water and Grass cancel to 1×, and Electric is 0×.

The [dual-type chart](/dual-type-chart) lists all 153 pairs with 4× split from 2×. Sort by fewest weaknesses, then turn on **Has a 4× weakness**. Water/Ground and Steel/Fairy sit near each other by weakness count. The filter separates a 4× Grass hole from two ordinary 2× weaknesses.

The [counter chart](/blog/pokemon-counter-chart) supplies single-type candidates. Drop any candidate whose product falls to 1× or 0×. One 4× Rock weakness is a switch plan. Two Rock-weak teammates is a team problem, which is what the [team calculator](/pokemon/team-calculator) and the [team-building guide](/blog/how-to-build-balanced-pokemon-team) are for.

STAB is a further 1.5× after the type product. A Ground-type Earthquake into Heatran is 4× from this chart and 6× once STAB is included, before stats, items, and weather. The [STAB guide](/blog/stab-calculator-guide) walks that stack. Rock Slide and Stone Edge are both 4× into Charizard. Power changes the hit, not the bucket.

## Where the chart stops

The [ability chart](/pokemon/type-chart-with-abilities) prints an ability beside the base multiplier. Items, contact, weather, and Mold Breaker stay outside it.

A normal Tera type replaces both defending types until it ends. Fire Tera Charizard drops Rock from 4× to 2× and loses the Flying immunity, so Ground hits at 2×. Stellar Tera, in Tera Raid Battles, keeps the original defense.

Fairy is why the Steel/Fairy Dragon immunity exists. Before Generation 6, Steel also resisted Dark and Ghost, so an older Steel chart disagrees on those two rows. Pokémon GO is a different table: super effective is 1.6×, a double weakness is 2.56× rather than 4×, and an immunity deals reduced damage instead of 0×. Use the [Pokémon GO type chart](/blog/pokemon-go-type-chart-2026) for raids and GO Battle League.

## FAQ

### How do you calculate a dual-type multiplier?

Multiply the attacking type's effectiveness against each defending type. Two 2× weaknesses become 4×. A 2× weakness times a 0.5× resistance becomes 1×. A 0× immunity makes the whole product 0×.

### What is Charizard 4× weak to?

Charizard is Fire/Flying. Rock is 2× against both types, so Rock moves deal 4× damage. Water and Electric stay at 2×. Ground deals 0× because Flying is immune to Ground.

### Why does Water/Ground have only one weakness?

Grass is the only type that is super effective against both Water and Ground, so Grass deals 4×. Electric is 0× because Ground is immune to it. Water and Ice are super effective against Ground and resisted by Water, so both come out at 1×.

### Does Steel/Fairy have a 4× weakness?

No. Steel is weak to Fire, Fighting, and Ground. Fairy is weak to Poison and Steel. Those lists do not overlap. Fire and Ground stay at 2×. Fighting and Steel cancel to 1×. Poison and Dragon are 0×.

### Do these dual-type multipliers work in Pokémon GO?

No. This guide uses the Generation 6 through Generation 9 main-series chart: super effective is 2×, resisted is 0.5×, and immune is 0×. Pokémon GO uses different multipliers, and immunities deal reduced damage instead of 0×. The [Pokémon GO type chart](/blog/pokemon-go-type-chart-2026) is the raid and GO Battle League version.

### Does Terastallization still use the dual-type chart?

A normal Tera type replaces both defending types while the Pokémon is Terastallized, so you read that single type. Stellar Tera, used in Tera Raid Battles, keeps the original dual-type defense.

## Lock the preview on the product

Confirm the buckets on the [calculator](/calculator) or the [dual-type chart](/dual-type-chart) before you lock the preview. Rock deletes a switch into Charizard, Ground does the same to Heatran, Grass is Water/Ground's only super effective hit, and Steel/Fairy never reaches 4×.
