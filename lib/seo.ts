export const SITE_URL = 'https://www.typematchup.org';
export const SITE_NAME = 'TypeMatchup';

export const HOME_TITLE = 'Pokemon Type Calculator: Matchup & Weakness Tool';
export const HOME_DESCRIPTION =
  'Pokemon Type Calculator for instant matchups. Check weaknesses, resistances, immunities, team coverage, and damage multipliers for any single or dual type.';

export function getTypePageTitle(typeName: string): string {
  return `${typeName} Type Weaknesses, Resistances & Matchups | ${SITE_NAME}`;
}

export function getTypePageDescription(typeName: string): string {
  return `${typeName} type weaknesses, resistances, and immunities. Find what beats ${typeName} and what ${typeName} is strong against. Complete type matchup guide with a free calculator.`;
}

export function getComboPageTitle(type1Name: string, type2Name: string): string {
  return `${type1Name}/${type2Name} Type Combo Weaknesses & Counters | ${SITE_NAME}`;
}

export function getComboPageDescription(type1Name: string, type2Name: string): string {
  const comboName = `${type1Name}/${type2Name}`;
  return `${comboName} dual type weaknesses, resistances, and counters. Calculate type effectiveness for ${comboName} Pokemon. Free type calculator tool. Check now.`;
}

export function getPokemonPageTitle(pokemonName: string): string {
  return `${pokemonName} Type Matchups, Weaknesses & Best Counters | ${SITE_NAME}`;
}

export function getPokemonPageDescription(pokemonName: string): string {
  return `${pokemonName} type matchups, weaknesses, and best counters. Find what beats ${pokemonName} and plan your battle strategy. Free Pokemon type calculator. Check now.`;
}
