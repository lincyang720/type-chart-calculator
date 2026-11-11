---
slug: pokemon-type-chart-attack-vs-defense-direction
title: "Pokémon Type Chart: Why Attack and Defense Are Not Reversible"
description: "The Pokémon type chart is directional: 75 of 153 distinct type pairs have different multipliers when attack and defense are reversed. Check 10 verified examples and avoid reading the chart backward."
date: "2026-11-09"
author: "TypeMatchup"
image: "/seo/type-chart-directionality.svg"
updated: "2026-11-09"
tags: ["pokemon type chart", "type effectiveness", "attacking vs defending", "type matchups"]
faq:
  - question: "Can you reverse the attack and defense columns on the Pokémon type chart?"
    answer: "No. A type chart maps the attacking move type to the defending Pokémon type. For example, Ground attacks Electric for 2×, while Electric attacks Ground for 0×."
  - question: "How many type pairs give different damage when reversed?"
    answer: "For the modern 18-type chart, 75 of the 153 different unordered type pairs produce different base multipliers in the two directions. This is calculated from TypeMatchup's defensive type chart data, counting each distinct pair once."
  - question: "Does Ghost against Normal work both ways?"
    answer: "Yes. Normal-type and Ghost-type attacks both deal 0× to the other pure type. This is an exception: both directions are immune."
  - question: "Is Fire against Steel the same as Steel against Fire?"
    answer: "No. Fire moves deal 2× to pure Steel defenders. Steel moves deal 0.5× to pure Fire defenders."
  - question: "Does STAB change the direction of the Pokémon type chart?"
    answer: "No. Same-Type Attack Bonus is a separate offensive multiplier; it does not reverse which type is attacking or defending."
---

# Pokémon Type Chart: Why Attack and Defense Are Not Reversible

**No—you cannot read the Pokémon type chart backward.** The type of the **move** goes on the attacking axis, and the type of the **target Pokémon** goes on the defending axis. Ground-type moves hit pure Electric-type targets for **2×**, but Electric-type moves hit pure Ground-type targets for **0×**. Reversing the two types changes the question.

![Original infographic: Ground attacks Electric for 2×, Electric attacks Ground for 0×](/seo/type-chart-directionality.svg)

This is not a rare technicality. We compared every pair of *different* types in the current 18-type main-series chart using [TypeMatchup's underlying data](/pokemon/type-chart). Of the **153 unordered type pairs**, **75 have different multipliers when attacker and defender are switched**; **78 have matching multipliers**. These counts describe **base single-type effectiveness only**—not a Pokémon's actual total battle damage. The full calculation and the ten case studies are below.

![TypeMatchup audit: 75 of 153 different-type pairs behave differently when reversed](/seo/type-chart-audit.svg)

## A direction-check table: ten matchups that fool people

The left and right results answer **different questions**. Each column says the attacking move type first.

| First attack → defender | Multiplier | Reverse attack → defender | Multiplier | What changed? |
| --- | ---: | --- | ---: | --- |
| Ground → Electric | 2× | Electric → Ground | 0× | An immunity applies only to one direction |
| Fire → Steel | 2× | Steel → Fire | ½× | A weakness becomes a resistance |
| Dark → Psychic | 2× | Psychic → Dark | 0× | Dark is immune to Psychic moves |
| Ice → Dragon | 2× | Dragon → Ice | 1× | Dragon is weak to Ice, Ice is not weak to Dragon |
| Fairy → Dragon | 2× | Dragon → Fairy | 0× | Fairy blocks Dragon moves |
| Steel → Poison | 1× | Poison → Steel | 0× | Steel is immune to Poison moves |
| Water → Rock | 2× | Rock → Water | 1× | Water resists Rock? No: Rock is neutral against Water |
| Flying → Ground | 1× | Ground → Flying | 0× | Flying's Ground immunity is defensive |
| Ghost → Fighting | 1× | Fighting → Ghost | 0× | Ghost blocks Fighting moves |
| Fire → Grass | 2× | Grass → Fire | ½× | Fire attacks Grass well and resists Grass |

*All results come from the site's modern type matrix, not search-volume estimates. An arrow means **attacking move → defending Pokémon**. Pokémon abilities and battle-specific effects can alter the outcome.*

### The correct way to read the chart

Ask these three questions in order:

1. **What is the move's type?** That is the attacker.
2. **What type or types does the Pokémon receiving the hit have?** Those are defenders.
3. **What does the chart say for each defending type?** Multiply the factors only if the Pokémon has two defensive types.

For the full modern matrix, open the [Pokémon type chart](/pokemon/type-chart). For live calculations, select two defensive types in the [dual-type calculator](/calculator).

## Original data check: 75 asymmetric pairs out of 153

With 18 types, there are `18 × 17 ÷ 2 = 153` ways to choose two **different** types without counting the reverse as another pair. We then computed two values for each unordered pair:

- the effectiveness of an attack of type A against a pure type B defender;
- the effectiveness of an attack of type B against a pure type A defender.

If the two numbers differed, we counted that pair as **asymmetric**. Otherwise it was **symmetric**.

| Category | Distinct pure-type pairs | Definition |
| --- | ---: | --- |
| Asymmetric | **75** | `A → B` differs from `B → A` |
| Symmetric | **78** | Both directions have the same multiplier |
| **Total** | **153** | All unordered pairs of 18 different types |

This figure is reproducible against the website's maintained `data/defensiveTypeChart.json` using the same underlying rules as the calculator. It is a property of the **modern main-series chart**, not an official survey statistic or a claim that 75% of all battles play differently.

### Some pairs really *are* symmetric

Not every reversal changes the answer. For example, a pure Normal-type move versus a pure Ghost-type defender is **0×**, and a pure Ghost-type move versus a pure Normal-type defender is also **0×**. Both directions are immune. By contrast, Ground/Electric is maximally directional: Ground hits Electric super effectively, Electric has no effect on Ground.

This is why remembering a type *pair* is not enough. Remember the attack direction—or check the chart.

## When the target has two types

Direction comes **before** multiplication. Suppose you use an Electric move on a Water/Flying Pokémon such as Gyarados:

`Electric → Water = 2×` and `Electric → Flying = 2×`, therefore `2 × 2 = 4×`.

Now reverse the roles. A Water move into a pure Electric Pokémon is **1×** and a Flying move into Electric is **½×**. Those are *separate attacks* with separate move types; they are not a reverse “Water/Flying attack.” Reversing defenders and attack types would confuse both the direction and the dual-type multiplication step.

For more examples, see [how to read a dual-type chart](/blog/how-to-read-dual-type-chart), which covers 4× weaknesses, ¼× resistances and immunity cancellation.

## A quick decision routine during a battle

If an opponent switches a Pokémon into your move, look up the move's type **against that Pokémon**. Do not reason from “that Pokémon's type is strong against mine”; offensive strength and defensive resistance are separate relations. When changing moves, repeat the lookup for the new move. When switching Pokémon, repeat it for the new defender.

The table reports only the base type multiplier. The actual damage also depends on factors including move power, stats, STAB, weather, abilities, held items and battle mechanics. In Scarlet/Violet, a normal Tera type can replace the Pokémon's original defensive typing; then you must look up the new defender. See our [Tera type guide](/blog/tera-type-type-chart).

## A tiny paper exercise

Try answering each before checking:

- **Electric move into Ground?** **0×**.
- **Ground move into Electric?** **2×**.
- **Poison move into Steel?** **0×**.
- **Steel move into Poison?** **1×**.
- **Dragon move into Fairy?** **0×**.
- **Fairy move into Dragon?** **2×**.

Each is a direction check rather than a memory test about which type sounds “stronger.” If you can state **move → defender**, you can always recover the answer from the matrix.

### Reference charts

We independently cross-checked the type-chart convention with [Pokémon Database's type matrix](https://pokemondb.net/type) and the [official Pokémon Singapore type chart](https://sg.portal-pokemon.com/game/type-chart/). The pair counts above were calculated from **TypeMatchup's local type data**, not copied from either site. For Pokémon GO, use the [separate GO chart guide](/blog/pokemon-go-type-chart-2026): its damage multipliers and treatment of immunities differ from the main-series rules.
