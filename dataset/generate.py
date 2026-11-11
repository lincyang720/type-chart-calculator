#!/usr/bin/env python3
"""
Generate the public dataset from this repository's canonical type chart.

Source of truth:
  ../data/typeChart.json          offensive chart the site uses
  ../data/dualTypeSpecies.json    example species for 4x rows only
  ../data/pokemon.json            the site's featured species list

Outputs (written next to this file):
  type-chart.csv
  dual-type-combinations.json
  dual-type-defensive-matrix.csv
  4x-weaknesses.md
  4x-weaknesses.csv
  featured-species-by-type.csv

Run from anywhere:
  python3 dataset/generate.py           # write the files
  python3 dataset/generate.py --check   # fail if the files on disk differ

Lists inside CSV cells are joined with "|" (no spaces). Empty lists are empty
cells. Example species are copied only from dualTypeSpecies.json and are not a
complete dex. The featured species file is the site's 100-entry list, not a
complete dex.
"""
import csv
import importlib.util
import io
import json
import os
import sys

sys.dont_write_bytecode = True

TYPES = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy",
]

DEFENSIVE_FIELDS = [
    "quad_weak_4x",
    "weak_2x",
    "resist_0_5x",
    "double_resist_0_25x",
    "immune_0x",
]

MULTIPLIERS = {
    "quad_weak_4x": 4.0,
    "weak_2x": 2.0,
    "resist_0_5x": 0.5,
    "double_resist_0_25x": 0.25,
    "immune_0x": 0.0,
}

MATRIX_COLUMNS = ["combo", "type1", "type2", *DEFENSIVE_FIELDS]
QUAD_COLUMNS = ["attacking_type", "combo", "type1", "type2", "example_species"]
FEATURED_COLUMNS = ["id", "name", "type1", "type2", "generation"]
LIST_SEP = "|"
FEATURED_COUNT = 100
CHART_GROUPS = ("superEffective", "notVeryEffective", "noEffect")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
TYPE_CHART_PATH = os.path.join(ROOT, "data", "typeChart.json")
SPECIES_PATH = os.path.join(ROOT, "data", "dualTypeSpecies.json")
POKEMON_PATH = os.path.join(ROOT, "data", "pokemon.json")
README_PATH = os.path.join(HERE, "README.md")

GENERATED_FILES = [
    "type-chart.csv",
    "dual-type-combinations.json",
    "dual-type-defensive-matrix.csv",
    "4x-weaknesses.md",
    "4x-weaknesses.csv",
    "featured-species-by-type.csv",
]

DOCUMENTED_FILES = GENERATED_FILES + ["generate.py", "index.html", "typecalc.py", "README.md"]


def fail(message):
    raise SystemExit(message)


def title_type(name):
    return name[:1].upper() + name[1:]


def english_and(names):
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return f"{names[0]} and {names[1]}"
    return ", ".join(names[:-1]) + ", and " + names[-1]


def join_list(items):
    for item in items:
        if LIST_SEP in item or "," in item or '"' in item or "\n" in item:
            fail(f"list item cannot contain '|', comma, quote, or newline: {item!r}")
    return LIST_SEP.join(items)


def split_list(cell):
    if cell == "":
        return []
    return cell.split(LIST_SEP)


def fmt(value):
    return {0: "0x", 0.25: "0.25x", 0.5: "0.5x", 1: "1x", 2: "2x", 4: "4x"}.get(value, f"{value}x")


def canonical_combo(type_a, type_b):
    ordered = sorted((type_a, type_b), key=TYPES.index)
    return f"{ordered[0]}-{ordered[1]}"


def load_matrix():
    with open(TYPE_CHART_PATH, encoding="utf-8") as handle:
        source = json.load(handle)
    if set(source) != set(TYPES):
        fail("data/typeChart.json types do not match the 18-type list")
    matrix = {defending: {attacking: 1.0 for attacking in TYPES} for defending in TYPES}
    for attacking in TYPES:
        groups = source[attacking]
        unknown = set(groups) - set(CHART_GROUPS)
        if unknown:
            fail(f"{attacking} has unknown chart groups: {sorted(unknown)}")
        seen = set()
        for defending in groups["superEffective"]:
            assign(matrix, attacking, defending, 2.0, seen)
        for defending in groups["notVeryEffective"]:
            assign(matrix, attacking, defending, 0.5, seen)
        for defending in groups["noEffect"]:
            assign(matrix, attacking, defending, 0.0, seen)
    return matrix


def assign(matrix, attacking, defending, multiplier, seen):
    if defending not in matrix:
        fail(f"unknown defending type {defending!r} under {attacking}")
    if defending in seen:
        fail(f"{attacking} lists {defending} more than once")
    seen.add(defending)
    matrix[defending][attacking] = multiplier


def defensive_profile(matrix, types):
    tiers = {4.0: [], 2.0: [], 0.5: [], 0.25: [], 0.0: []}
    for attacking in TYPES:
        multiplier = 1.0
        for defending in types:
            multiplier *= matrix[defending][attacking]
        if multiplier in tiers:
            tiers[multiplier].append(attacking)
        elif multiplier != 1.0:
            fail(f"unexpected multiplier {multiplier} for {types} vs {attacking}")
    return {field: sorted(tiers[MULTIPLIERS[field]]) for field in DEFENSIVE_FIELDS}


def build_combos(matrix):
    combos = {}
    for defending in TYPES:
        combos[defending] = {
            "types": [defending],
            "defensive": defensive_profile(matrix, [defending]),
        }
    for index, type_a in enumerate(TYPES):
        for type_b in TYPES[index + 1:]:
            combo = f"{type_a}-{type_b}"
            combos[combo] = {
                "types": [type_a, type_b],
                "defensive": defensive_profile(matrix, [type_a, type_b]),
            }
    if len(combos) != 171:
        fail(f"expected 171 combinations, built {len(combos)}")
    return combos


def load_example_species(combos):
    with open(SPECIES_PATH, encoding="utf-8") as handle:
        raw = json.load(handle)
    if not isinstance(raw, dict):
        fail("data/dualTypeSpecies.json must be an object")
    by_combo = {}
    for key, names in raw.items():
        parts = key.split("-")
        if len(parts) != 2 or any(part not in TYPES for part in parts) or parts[0] == parts[1]:
            fail(f"unrecognized dual-type key in dualTypeSpecies.json: {key}")
        if not isinstance(names, list) or not all(isinstance(name, str) and name for name in names):
            fail(f"dualTypeSpecies[{key}] must be a list of non-empty strings")
        combo = canonical_combo(parts[0], parts[1])
        if combo not in combos or len(combos[combo]["types"]) != 2:
            fail(f"{key} does not match a dual-type combination")
        if combo in by_combo:
            fail(f"duplicate example-species entry for {combo}")
        by_combo[combo] = names
    return by_combo


def load_featured():
    with open(POKEMON_PATH, encoding="utf-8") as handle:
        payload = json.load(handle)
    pokemon = payload.get("pokemon")
    if not isinstance(pokemon, list):
        fail("data/pokemon.json must contain a pokemon list")
    if len(pokemon) != FEATURED_COUNT:
        fail(
            f"featured list changed: expected {FEATURED_COUNT} entries, found {len(pokemon)}. "
            "Update the label in dataset/README.md before regenerating."
        )
    rows = []
    seen_ids = set()
    for entry in pokemon:
        for field in ("id", "name", "types", "generation"):
            if field not in entry:
                fail(f"featured species is missing {field}")
        species_id = entry["id"]
        name = entry["name"]
        types = entry["types"]
        generation = entry["generation"]
        if not isinstance(species_id, str) or not species_id:
            fail(f"featured id must be a non-empty string: {species_id!r}")
        if species_id in seen_ids:
            fail(f"duplicate featured id: {species_id}")
        seen_ids.add(species_id)
        if not isinstance(name, str) or not name:
            fail(f"featured name must be a non-empty string: {species_id}")
        if (
            not isinstance(types, list)
            or len(types) not in (1, 2)
            or any(type_name not in TYPES for type_name in types)
        ):
            fail(f"{species_id} has invalid types: {types!r}")
        for value in (species_id, name, *types):
            if any(char in value for char in (LIST_SEP, ",", '"', "\n")):
                fail(f"{species_id} has a field that CSV readers would have to quote: {value!r}")
        if type(generation) is not int:
            fail(f"{species_id} generation must be an integer")
        type2 = types[1] if len(types) == 2 else ""
        rows.append([species_id, name, types[0], type2, str(generation)])
    return rows


def quad_rows(combos, species_by_combo):
    rows = []
    for attacking in TYPES:
        for combo, entry in combos.items():
            if attacking not in entry["defensive"]["quad_weak_4x"]:
                continue
            types = entry["types"]
            if len(types) != 2:
                fail(f"single type {combo} has a 4x weakness")
            rows.append({
                "attacking_type": attacking,
                "combo": combo,
                "type1": types[0],
                "type2": types[1],
                "example_species": list(species_by_combo.get(combo, [])),
            })
    return rows


def render_csv(header, rows):
    buffer = io.StringIO(newline="")
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(header)
    writer.writerows(rows)
    return buffer.getvalue()


def render_type_chart(matrix):
    rows = [[defending] + [fmt(matrix[defending][attacking]) for attacking in TYPES] for defending in TYPES]
    return render_csv(["defending \\ attacking"] + TYPES, rows)


def render_json(matrix, combos):
    payload = {
        "schema_version": 1,
        "description": (
            "Pokemon type effectiveness, Generation 6-9 (18 types). "
            "matrix[defending][attacking] = damage multiplier. "
            "Generated from this repository's canonical data/typeChart.json."
        ),
        "types": TYPES,
        "matrix": matrix,
        "combinations": combos,
    }
    return json.dumps(payload, indent=2, ensure_ascii=False)


def matrix_rows(combos):
    rows = []
    for combo, entry in combos.items():
        types = entry["types"]
        type2 = types[1] if len(types) == 2 else ""
        defensive = entry["defensive"]
        rows.append([combo, types[0], type2] + [join_list(defensive[field]) for field in DEFENSIVE_FIELDS])
    return rows


def render_quad_csv(rows):
    csv_rows = [
        [
            row["attacking_type"],
            row["combo"],
            row["type1"],
            row["type2"],
            join_list(row["example_species"]),
        ]
        for row in rows
    ]
    return render_csv(QUAD_COLUMNS, csv_rows)


def render_quad_md(rows):
    grouped = []
    for attacking in TYPES:
        group = [row for row in rows if row["attacking_type"] == attacking]
        if group:
            grouped.append((attacking, group))
    absent = [attacking for attacking in TYPES if attacking not in {row["attacking_type"] for row in rows}]
    combo_count = len({row["combo"] for row in rows})
    repeated = {}
    for row in rows:
        repeated[row["combo"]] = repeated.get(row["combo"], 0) + 1
    multi = sum(1 for count in repeated.values() if count > 1)

    if multi:
        count_sentence = (
            f"{combo_count} dual-type combinations have a 4× weakness. "
            f"{multi} of them are 4× weak to more than one attacking type, so the tables below have {len(rows)} rows."
        )
    else:
        count_sentence = f"{combo_count} dual-type combinations have a 4× weakness ({len(rows)} rows)."

    if len(absent) == 1:
        absent_sentence = (
            f"{title_type(absent[0])} does not appear: no combination takes 4× damage from that attacking type."
        )
    elif absent:
        absent_sentence = (
            f"{english_and([title_type(name) for name in absent])} do not appear: "
            "no combination takes 4× damage from those attacking types."
        )
    else:
        absent_sentence = ""

    lines = [
        "# 4× weaknesses",
        "",
        "Every dual-type combination that takes 4× damage from an attacking type, using the Generation 6–9 chart (18 types, including Fairy). A 4× weakness is two 2× weaknesses multiplied together. Single types never reach 4×, so they are omitted.",
        "",
        " ".join(part for part in (count_sentence, absent_sentence) if part),
        "",
        "Example species are copied only from `data/dualTypeSpecies.json`. They are examples, not a complete dex. `none` means that file has no example for the combination; it does not mean the combination is unused. `4x-weaknesses.csv` has the same rows in the same order. The CSV joins multiple example species with `|`. This page separates them with commas.",
        "",
        "## Summary",
        "",
        "| Attacking type | Combinations |",
        "| --- | --- |",
    ]
    for attacking, group in grouped:
        lines.append(f"| {title_type(attacking)} | {len(group)} |")
    lines.append("")
    for attacking, group in grouped:
        lines.append(f"## {title_type(attacking)}")
        lines.append("")
        lines.append("| Combination | Type 1 | Type 2 | Example species (not a complete dex) |")
        lines.append("| --- | --- | --- | --- |")
        for row in group:
            examples = ", ".join(row["example_species"]) if row["example_species"] else "none"
            lines.append(f"| {row['combo']} | {row['type1']} | {row['type2']} | {examples} |")
        lines.append("")
    return "\n".join(lines)


def render_files(matrix, combos, quad, featured):
    return {
        "type-chart.csv": render_type_chart(matrix),
        "dual-type-combinations.json": render_json(matrix, combos),
        "dual-type-defensive-matrix.csv": render_csv(MATRIX_COLUMNS, matrix_rows(combos)),
        "4x-weaknesses.csv": render_quad_csv(quad),
        "4x-weaknesses.md": render_quad_md(quad),
        "featured-species-by-type.csv": render_csv(FEATURED_COLUMNS, featured),
    }


def parse_csv(text):
    return list(csv.DictReader(io.StringIO(text, newline="")))


def multiplier_for(matrix, types, attacking):
    multiplier = 1.0
    for defending in types:
        multiplier *= matrix[defending][attacking]
    return multiplier


def verify_outputs(files, matrix, combos, species_by_combo, quad, featured):
    payload = json.loads(files["dual-type-combinations.json"])
    if payload["types"] != TYPES:
        fail("JSON types do not match the type list")
    if payload["matrix"] != matrix or payload["combinations"] != combos:
        fail("JSON export does not match the chart computed from data/typeChart.json")
    if len(payload["combinations"]) != 171:
        fail("JSON combination count is not 171")

    chart_rows = parse_csv(files["type-chart.csv"])
    if [row["defending \\ attacking"] for row in chart_rows] != TYPES:
        fail("type-chart.csv defending types are out of order")
    for row in chart_rows:
        defending = row["defending \\ attacking"]
        for attacking in TYPES:
            if row[attacking] != fmt(matrix[defending][attacking]):
                fail(f"type-chart.csv {defending} vs {attacking} does not match the JSON matrix")

    defensive_rows = parse_csv(files["dual-type-defensive-matrix.csv"])
    if list(defensive_rows[0].keys()) != MATRIX_COLUMNS:
        fail(f"dual-type-defensive-matrix.csv columns are {list(defensive_rows[0].keys())}")
    if len(defensive_rows) != len(combos):
        fail("defensive matrix row count does not match the JSON")
    for row, (combo, entry) in zip(defensive_rows, combos.items()):
        types = entry["types"]
        expected_type2 = types[1] if len(types) == 2 else ""
        if row["combo"] != combo or row["type1"] != types[0] or row["type2"] != expected_type2:
            fail(f"defensive matrix identity does not match JSON for {combo}")
        for field, expected_multiplier in MULTIPLIERS.items():
            listed = split_list(row[field])
            if listed != entry["defensive"][field]:
                fail(f"{combo} {field} does not match the JSON: {listed} != {entry['defensive'][field]}")
            for attacking in TYPES:
                actual = multiplier_for(matrix, types, attacking)
                is_listed = attacking in listed
                if is_listed != (actual == expected_multiplier):
                    fail(f"{combo} vs {attacking} is {actual}, listed under {field}: {is_listed}")

    quad_csv = parse_csv(files["4x-weaknesses.csv"])
    if list(quad_csv[0].keys()) != QUAD_COLUMNS:
        fail("4x-weaknesses.csv columns do not match")
    if len(quad_csv) != len(quad):
        fail("4x CSV row count does not match the JSON 4x weaknesses")
    allowed_names = {name for names in species_by_combo.values() for name in names}
    for got, expected in zip(quad_csv, quad):
        if [got[column] for column in QUAD_COLUMNS[:4]] != [
            expected["attacking_type"], expected["combo"], expected["type1"], expected["type2"]
        ]:
            fail(f"4x CSV row does not match JSON for {expected['combo']} vs {expected['attacking_type']}")
        names = split_list(got["example_species"])
        if names != expected["example_species"] or names != species_by_combo.get(expected["combo"], []):
            fail(f"example species for {expected['combo']} are not exactly the dualTypeSpecies.json entry")
        if any(name not in allowed_names for name in names):
            fail(f"example species for {expected['combo']} include a name that is not in dualTypeSpecies.json")
        profile = combos[expected["combo"]]["defensive"]["quad_weak_4x"]
        if expected["attacking_type"] not in profile:
            fail(f"{expected['combo']} is not 4x weak to {expected['attacking_type']}")

    json_pairs = [
        (attacking, combo)
        for attacking in TYPES
        for combo, entry in combos.items()
        if attacking in entry["defensive"]["quad_weak_4x"]
    ]
    if json_pairs != [(row["attacking_type"], row["combo"]) for row in quad]:
        fail("4x rows are not the JSON quad weaknesses grouped by attacking type")

    markdown = files["4x-weaknesses.md"]
    if "examples, not a complete dex" not in markdown or "not a complete dex" not in markdown:
        fail("4x-weaknesses.md must label example species as examples, not a complete dex")
    verify_markdown(markdown, quad)

    featured_rows = parse_csv(files["featured-species-by-type.csv"])
    if list(featured_rows[0].keys()) != FEATURED_COLUMNS:
        fail("featured-species-by-type.csv columns do not match")
    parsed = [[row[column] for column in FEATURED_COLUMNS] for row in featured_rows]
    if parsed != featured or len(parsed) != FEATURED_COUNT:
        fail("featured-species-by-type.csv does not match data/pokemon.json")

    verify_calculators(matrix)
    verify_readme(combos, quad)


def verify_markdown(markdown, quad):
    sections = {}
    current = None
    for line in markdown.splitlines():
        if line.startswith("## ") and line != "## Summary":
            current = line[3:].strip().lower()
            sections[current] = []
            continue
        if current is None or not line.startswith("| "):
            continue
        if line.startswith("| Combination") or line.startswith("| ---"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != 4:
            fail(f"4x markdown row does not have 4 cells: {line}")
        sections[current].append(cells)

    expected_groups = []
    for attacking in TYPES:
        group = [row for row in quad if row["attacking_type"] == attacking]
        if group:
            expected_groups.append((attacking, group))
    if list(sections) != [attacking for attacking, _group in expected_groups]:
        fail("4x markdown sections are not grouped by attacking type")
    for attacking, group in expected_groups:
        got = sections[attacking]
        if len(got) != len(group):
            fail(f"4x markdown section {attacking} does not match the CSV")
        for cells, row in zip(got, group):
            examples = ", ".join(row["example_species"]) if row["example_species"] else "none"
            expected_cells = [row["combo"], row["type1"], row["type2"], examples]
            if cells != expected_cells:
                fail(f"4x markdown row for {row['combo']} vs {attacking} does not match the CSV")


def verify_calculators(matrix):
    html_path = os.path.join(HERE, "index.html")
    with open(html_path, encoding="utf-8") as handle:
        html = handle.read()
    for defending in TYPES:
        marker = f"  {defending}:["
        start = html.find(marker)
        if start < 0:
            fail(f"dataset/index.html is missing the {defending} row")
        end = html.find("]", start)
        numbers = [float(part) for part in html[start + len(marker):end].split(",") if part != ""]
        expected = [matrix[defending][attacking] for attacking in TYPES]
        if numbers != expected:
            fail(f"dataset/index.html {defending} row does not match data/typeChart.json")

    spec = importlib.util.spec_from_file_location("dataset_typecalc", os.path.join(HERE, "typecalc.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    if list(module.TYPES) != TYPES:
        fail("dataset/typecalc.py type order does not match the dataset")
    for defending in TYPES:
        numbers = [float(value) for value in module.MATRIX[defending]]
        expected = [matrix[defending][attacking] for attacking in TYPES]
        if numbers != expected:
            fail(f"dataset/typecalc.py {defending} row does not match data/typeChart.json")


def verify_readme(combos, quad):
    with open(README_PATH, encoding="utf-8") as handle:
        text = handle.read()
    combo_count = len({row["combo"] for row in quad})
    required = [
        f"{len(combos)} combinations",
        f"{combo_count} dual-type combinations",
        f"{len(quad)} rows",
        "featured list (100 entries), not a complete dex",
        "examples, not a complete dex",
        "python3 generate.py",
        LIST_SEP,
    ]
    for snippet in required:
        if snippet not in text:
            fail(f"dataset/README.md is missing {snippet!r}")
    for name in DOCUMENTED_FILES:
        if name not in text:
            fail(f"dataset/README.md does not document {name}")
    if text.count("https://www.typematchup.org") != 1:
        fail("dataset/README.md must link to the calculator in a single sentence")


def check_on_disk(files):
    mismatches = []
    for name, text in files.items():
        path = os.path.join(HERE, name)
        if not os.path.exists(path):
            mismatches.append(f"{name} (missing)")
            continue
        with open(path, encoding="utf-8", newline="") as handle:
            current = handle.read()
        if current != text:
            mismatches.append(name)
    if mismatches:
        fail(
            "Generated dataset does not match the files on disk: "
            + ", ".join(mismatches)
            + ". Run python3 dataset/generate.py."
        )


def write_files(files):
    for name, text in files.items():
        path = os.path.join(HERE, name)
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
        print(f"wrote {name}")


def main(argv):
    unknown = [arg for arg in argv if arg != "--check"]
    if unknown:
        fail("usage: python3 generate.py [--check]")
    matrix = load_matrix()
    combos = build_combos(matrix)
    species_by_combo = load_example_species(combos)
    featured = load_featured()
    quad = quad_rows(combos, species_by_combo)
    files = render_files(matrix, combos, quad, featured)
    verify_outputs(files, matrix, combos, species_by_combo, quad, featured)
    if "--check" in argv:
        check_on_disk(files)
        print(
            f"ok: {len(combos)} combinations, {len(quad)} 4x rows, "
            f"{len(featured)} featured species"
        )
        return
    write_files(files)
    combo_count = len({row["combo"] for row in quad})
    print(f"{len(combos)} combinations ({len(TYPES)} single + {len(combos) - len(TYPES)} dual)")
    print(f"{combo_count} dual-type combinations with a 4x weakness, {len(quad)} rows")
    print(f"{len(featured)} featured species")


if __name__ == "__main__":
    main(sys.argv[1:])
