#!/usr/bin/env python3
"""
Generate public, machine-readable exports of the Pokemon type chart
straight from this project's own canonical data (../data/typeChart.json),
so the exports can never drift from what the site actually uses.

../data/typeChart.json stores the chart in its offensive form:
  typeChart[attacking] = { superEffective: [...], notVeryEffective: [...], noEffect: [...] }
This script inverts it into the familiar defensive matrix:
  matrix[defending][attacking] = damage multiplier

Outputs (written next to this file):
  type-chart.csv                 rows = defending type, columns = attacking type
  dual-type-combinations.json    every single (18) and dual (153) combination with
                                 its defensive 4x / 2x / 0.5x / 0.25x / 0x summary
"""
import csv
import json
import os

TYPES = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy",
]

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "data", "typeChart.json")


def load_matrix():
    with open(SRC, encoding="utf-8") as f:
        src = json.load(f)
    matrix = {d: {a: 1.0 for a in TYPES} for d in TYPES}
    for attacking, groups in src.items():
        for d in groups.get("superEffective", []):
            matrix[d][attacking] = 2.0
        for d in groups.get("notVeryEffective", []):
            matrix[d][attacking] = 0.5
        for d in groups.get("noEffect", []):
            matrix[d][attacking] = 0.0
    return matrix


def fmt(v):
    return {0: "0x", 0.25: "0.25x", 0.5: "0.5x", 1: "1x", 2: "2x", 4: "4x"}.get(v, f"{v}x")


def defensive_profile(matrix, types):
    tiers = {4.0: [], 2.0: [], 0.5: [], 0.25: [], 0.0: []}
    for a in TYPES:
        m = 1.0
        for t in types:
            m *= matrix[t][a]
        if m in tiers:
            tiers[m].append(a)
    return {
        "quad_weak_4x": sorted(tiers[4.0]),
        "weak_2x": sorted(tiers[2.0]),
        "resist_0_5x": sorted(tiers[0.5]),
        "double_resist_0_25x": sorted(tiers[0.25]),
        "immune_0x": sorted(tiers[0.0]),
    }


def main():
    matrix = load_matrix()

    csv_path = os.path.join(HERE, "type-chart.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["defending \\ attacking"] + TYPES)
        for d in TYPES:
            w.writerow([d] + [fmt(matrix[d][a]) for a in TYPES])

    combos = {}
    for d in TYPES:
        combos[d] = {"types": [d], "defensive": defensive_profile(matrix, [d])}
    for i in range(len(TYPES)):
        for j in range(i + 1, len(TYPES)):
            a, b = TYPES[i], TYPES[j]
            combos[f"{a}-{b}"] = {
                "types": [a, b],
                "defensive": defensive_profile(matrix, [a, b]),
            }

    json_path = os.path.join(HERE, "dual-type-combinations.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "schema_version": 1,
                "description": (
                    "Pokemon type effectiveness, Generation 6-9 (18 types). "
                    "matrix[defending][attacking] = damage multiplier. "
                    "Generated from this repository's canonical data/typeChart.json."
                ),
                "types": TYPES,
                "matrix": matrix,
                "combinations": combos,
            },
            f, indent=2, ensure_ascii=False,
        )

    print(f"wrote {csv_path}")
    print(f"wrote {json_path} ({len(combos)} combinations: 18 single + 153 dual)")
    print("fire-flying:", json.dumps(combos["fire-flying"]["defensive"]))


if __name__ == "__main__":
    main()
