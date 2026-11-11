#!/usr/bin/env python3
"""
Minimal, dependency-free Pokemon type-effectiveness CLI.

Usage:
  python3 typecalc.py fire flying        # show defensive profile of Fire/Flying
  python3 typecalc.py water              # show defensive profile of Water
  python3 typecalc.py --list             # print the full 18x18 matrix

Data: Generation 6-9 (18 types). Matrix layout: matrix[defending][attacking].
Source: official type effectiveness rules (Fairy added Gen 6; unchanged Gen 7-9),
transcribed from https://www.typematchup.org/pokemon/type-chart and verifiable
against Bulbapedia's "Type" chart.
"""
import sys

TYPES = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy",
]

MATRIX = {
    "normal":   [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    "fire":     [1, 0.5, 2, 1, 0.5, 0.5, 1, 1, 2, 1, 1, 0.5, 2, 1, 1, 1, 0.5, 0.5],
    "water":    [1, 0.5, 0.5, 2, 2, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1],
    "electric": [1, 1, 1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 1],
    "grass":    [1, 2, 0.5, 0.5, 0.5, 2, 1, 2, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 1],
    "ice":      [1, 2, 1, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    "fighting": [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 0.5, 1, 1, 0.5, 1, 2],
    "poison":   [1, 1, 1, 1, 0.5, 1, 0.5, 0.5, 2, 1, 2, 0.5, 1, 1, 1, 1, 1, 0.5],
    "ground":   [1, 1, 2, 0, 2, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1],
    "flying":   [1, 1, 1, 2, 0.5, 2, 0.5, 1, 0, 1, 1, 0.5, 2, 1, 1, 1, 1, 1],
    "psychic":  [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 0.5, 2, 1, 2, 1, 2, 1, 1],
    "bug":      [1, 2, 1, 1, 0.5, 1, 0.5, 1, 0.5, 2, 1, 1, 2, 1, 1, 1, 1, 1],
    "rock":     [0.5, 0.5, 2, 1, 2, 1, 2, 0.5, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 1],
    "ghost":    [0, 1, 1, 1, 1, 1, 0, 0.5, 1, 1, 1, 0.5, 1, 2, 1, 2, 1, 1],
    "dragon":   [1, 0.5, 0.5, 0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2],
    "dark":     [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, 0.5, 1, 0.5, 1, 2],
    "steel":    [0.5, 2, 1, 1, 0.5, 0.5, 2, 0, 2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 1, 0.5, 0.5],
    "fairy":    [1, 1, 1, 1, 1, 1, 0.5, 2, 1, 1, 1, 0.5, 1, 1, 0, 0.5, 2, 1],
}

LABELS = {4: "4x (quadruple weak)", 2: "2x (weak)", 0.5: "0.5x (resists)",
          0.25: "0.25x (double resists)", 0: "0x (immune)"}


def profile(types):
    buckets = {4: [], 2: [], 0.5: [], 0.25: [], 0: []}
    for i, atk in enumerate(TYPES):
        m = 1.0
        for t in types:
            m *= MATRIX[t][i]
        if m in buckets:
            buckets[m].append(atk)
    return buckets


def main():
    args = [a.lower() for a in sys.argv[1:]]
    if not args or args[0] == "--list":
        print("defending \\ attacking\t" + "\t".join(TYPES))
        for d in TYPES:
            print(d + "\t" + "\t".join(str(x) for x in MATRIX[d]))
        return
    types = args[:2]
    for t in types:
        if t not in TYPES:
            print(f"Unknown type: {t}. Valid: {', '.join(TYPES)}")
            sys.exit(1)
    print(f"Defensive profile for: {'/'.join(types)}")
    for val in (4, 2, 0.5, 0.25, 0):
        arr = profile(types)[val]
        print(f"  {LABELS[val]:24} {', '.join(arr) if arr else '—'}")


if __name__ == "__main__":
    main()
