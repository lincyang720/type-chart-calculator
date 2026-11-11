# Type Chart Dataset

Open, machine-readable Pokemon type-effectiveness data for Generation 6–9 (18 types, including Fairy). This `README.md` documents every file in the folder.

`generate.py` builds the tables from `../data/typeChart.json`, the same chart the site uses, so the exports are not maintained by hand. Run `python3 generate.py --check` to confirm the files on disk still match that chart.

## Files

| File | Records | Generated |
| --- | --- | --- |
| `type-chart.csv` | 18 defending types × 18 attacking types | yes |
| `dual-type-combinations.json` | 171 combinations (18 single + 153 dual) plus the numeric matrix | yes |
| `dual-type-defensive-matrix.csv` | 171 combinations, one row each | yes |
| `4x-weaknesses.md` | 53 dual-type combinations, grouped by attacking type | yes |
| `4x-weaknesses.csv` | 61 rows (one per attacking type and combination) | yes |
| `featured-species-by-type.csv` | 100 species | yes |
| `generate.py` | Regenerates the six files above and checks the two calculators | no |
| `index.html` | One-page calculator, no dependencies | no |
| `typecalc.py` | Command-line calculator | no |
| `README.md` | This document | no |

## Shared rules

Type order, used as column order and as the order inside a combination key:

`normal`, `fire`, `water`, `electric`, `grass`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`

A combination key is the single type name (`fire`) or two types joined with `-` in that order (`fire-flying`, never `flying-fire`). Defensive lists inside a cell use the same type names, sorted A–Z, and joined with `|`. An empty list is an empty cell. Split on `|` and ignore empty strings. No generated cell contains a comma or a double quote.

Multipliers are the standard chart only. Abilities, items, weather, terrain, Terastallization, and move-specific effects are not included. A 4× weakness is two 2× weaknesses multiplied together. A 0× result is an immunity from either defending type. Generations 7, 8, and 9 did not change this chart.

## `type-chart.csv`

One defending type per row. The first column is `defending \ attacking`. The other 18 columns are the attacking types, in the type order above. Each cell is `0x`, `0.5x`, `1x`, or `2x`.

There are 18 data rows. Read the Steel row, Electric column as `0.5x`: Electric is resisted by Steel.

## `dual-type-combinations.json`

Top-level fields:

| Field | Meaning |
| --- | --- |
| `schema_version` | `1` |
| `description` | Chart scope |
| `types` | The 18 type names, in type order |
| `matrix` | `matrix[defending][attacking]` is a number: `0`, `0.5`, `1`, or `2` |
| `combinations` | One entry per single type and per dual-type pair |

Each combination has `types` (one or two names, already in type order) and `defensive`:

| Field | Multiplier |
| --- | --- |
| `quad_weak_4x` | 4 |
| `weak_2x` | 2 |
| `resist_0_5x` | 0.5 |
| `double_resist_0_25x` | 0.25 |
| `immune_0x` | 0 |

Neutral 1× attacking types are omitted. Keys are the combination keys described above. There are 171 combinations: 18 single and 153 dual.

## `dual-type-defensive-matrix.csv`

The same 171 combinations as the JSON, in the same order: the 18 single types first, then dual types in type-list order.

| Column | Meaning |
| --- | --- |
| `combo` | Combination key |
| `type1` | First defending type |
| `type2` | Second defending type, or empty for a single type |
| `quad_weak_4x` | Attacking types at 4×, joined with `\|` |
| `weak_2x` | Attacking types at 2× |
| `resist_0_5x` | Attacking types at 0.5× |
| `double_resist_0_25x` | Attacking types at 0.25× |
| `immune_0x` | Attacking types at 0× |

`fire-flying` is `rock` at 4×, `electric|water` at 2×, `fairy|fighting|fire|steel` at 0.5×, `bug|grass` at 0.25×, and `ground` at 0×.

## 4× weaknesses

`4x-weaknesses.md` and `4x-weaknesses.csv` list every dual-type combination with a 4× weakness. 53 dual-type combinations qualify. Eight of them are 4× weak to more than one attacking type, so the CSV has 61 rows. Normal and Dragon are absent, because nothing takes 4× damage from either attacking type.

Rows are grouped by attacking type, in type order. Inside a group, combinations follow the same order as `dual-type-combinations.json`. A combination with two 4× weaknesses appears twice, once under each attacking type.

| Column | Meaning |
| --- | --- |
| `attacking_type` | Lowercase attacking type that deals 4× |
| `combo` | Defending combination key |
| `type1`, `type2` | The two defending types |
| `example_species` | Example species joined with `\|`, or empty |

Example species in these two files are examples, not a complete dex. They are copied only from `../data/dualTypeSpecies.json`. An empty CSV cell, and `none` in the Markdown, means that file has no example for the combination. It does not mean no species has those types. Fire/Flying (`fire-flying`) is 4× weak to Rock and currently has no bundled example. Fire/Bug (`fire-bug`) is 4× weak to Rock, with examples `Larvesta|Volcarona|Sizzlipede|Centiskorch`.

## `featured-species-by-type.csv`

This file is the site's featured list (100 entries), not a complete dex. It is the `pokemon` array in `../data/pokemon.json`, in that order, with only the columns below.

| Column | Meaning |
| --- | --- |
| `id` | Site slug, unique in this file |
| `name` | Display name |
| `type1` | First type, in the order stored for that species |
| `type2` | Second type, or empty when the species has one type |
| `generation` | Generation number |

`type1` and `type2` are not rewritten into combination-key order. Charizard is `charizard,Charizard,fire,flying,1`, and its combination key is `fire-flying`. Garchomp is stored as Dragon then Ground, so its combination key is `ground-dragon`.

## Calculators

`index.html` is a calculator you can open in a browser. It has no build step and no dependencies.

`typecalc.py` prints a defensive profile:

```bash
python3 typecalc.py fire flying
python3 typecalc.py --list
```

Both calculators embed their own copy of the 18×18 chart. `generate.py` does not rewrite them. `python3 generate.py --check` fails if either copy disagrees with `data/typeChart.json`.

## Regenerate

The script uses only the Python 3 standard library. Paths are based on the script file, so the working directory does not matter.

```bash
python3 generate.py
python3 generate.py --check
```

From the repository root those commands are `python3 dataset/generate.py` and `python3 dataset/generate.py --check`. `--check` exits non-zero when a generated file, either calculator, or a count in this README disagrees with the chart.

## Examples

### Python

```python
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parent

chart = json.loads((root / "dual-type-combinations.json").read_text(encoding="utf-8"))
profile = chart["combinations"]["fire-flying"]["defensive"]
assert profile["quad_weak_4x"] == ["rock"]
assert profile["immune_0x"] == ["ground"]

with (root / "dual-type-defensive-matrix.csv").open(encoding="utf-8", newline="") as handle:
    rows = list(csv.DictReader(handle))

assert len(rows) == len(chart["combinations"]) == 171
fire_flying = next(row for row in rows if row["combo"] == "fire-flying")
assert fire_flying["quad_weak_4x"].split("|") == ["rock"]
assert fire_flying["weak_2x"].split("|") == ["electric", "water"]

TYPES = chart["types"]

def combo_key(type1, type2):
    if not type2:
        return type1
    ordered = sorted((type1, type2), key=TYPES.index)
    return "-".join(ordered)

with (root / "featured-species-by-type.csv").open(encoding="utf-8", newline="") as handle:
    featured = list(csv.DictReader(handle))

assert len(featured) == 100
garchomp = next(row for row in featured if row["id"] == "garchomp")
assert combo_key(garchomp["type1"], garchomp["type2"]) == "ground-dragon"

with (root / "4x-weaknesses.csv").open(encoding="utf-8", newline="") as handle:
    quad = list(csv.DictReader(handle))

fire_bug = next(
    row for row in quad
    if row["attacking_type"] == "rock" and row["combo"] == "fire-bug"
)
assert fire_bug["example_species"].split("|")[0] == "Larvesta"
```

### JavaScript

No field in the generated CSVs contains a comma or a double quote, so splitting each line on `,` is enough. Run this from the `dataset` directory with Node.js.

```javascript
const { readFileSync } = require("node:fs");
const path = require("node:path");

function readCsv(name) {
  const text = readFileSync(path.join(__dirname, name), "utf8").replace(/\n$/, "");
  const [header, ...lines] = text.split("\n");
  const columns = header.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(columns.map((column, index) => [column, cells[index] ?? ""]));
  });
}

const chart = JSON.parse(readFileSync(path.join(__dirname, "dual-type-combinations.json"), "utf8"));
console.log(chart.combinations["fire-flying"].defensive.quad_weak_4x); // ["rock"]

const matrix = readCsv("dual-type-defensive-matrix.csv");
const fireFlying = matrix.find((row) => row.combo === "fire-flying");
console.log(fireFlying.quad_weak_4x.split("|").filter(Boolean));

const types = chart.types;
function comboKey(type1, type2) {
  if (!type2) return type1;
  return [type1, type2].sort((a, b) => types.indexOf(a) - types.indexOf(b)).join("-");
}

const featured = readCsv("featured-species-by-type.csv");
const garchomp = featured.find((row) => row.id === "garchomp");
console.log(comboKey(garchomp.type1, garchomp.type2)); // ground-dragon
```

## License

MIT. Copyright lincyang720. See [LICENSE](../LICENSE).

The interactive calculator built on this data is https://www.typematchup.org.
