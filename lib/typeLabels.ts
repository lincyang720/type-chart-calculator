import { TypeId } from './types';

export const TYPE_ORDER: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export function displayType(typeId: string): string {
  return typeId.charAt(0).toUpperCase() + typeId.slice(1);
}

export function formatTypeList(typeIds: string[]): string {
  const names = typeIds.map(displayType);
  if (names.length === 0) return 'none';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export function formatChartMultiplier(value: number): string {
  if (value === 0.25) return '¼×';
  if (value === 0.5) return '½×';
  if (value === 0) return '0×';
  return `${value}×`;
}
