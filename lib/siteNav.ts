export interface SiteNavItem {
  href: string;
  label: string;
  primary?: boolean;
}

export const siteNavItems: SiteNavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator', primary: true },
  { href: '/dual-type-chart', label: 'Dual Type Chart', primary: true },
  { href: '/pokemon/team-calculator', label: 'Team Calculator', primary: true },
  { href: '/blog', label: 'Blog', primary: true },
  { href: '/assistant', label: 'AI Assistant' },
  { href: '/pokemon/type-chart-with-abilities', label: 'Ability Matchups' },
  { href: '/battle-simulator', label: 'Battle Simulator' },
  { href: '/types', label: 'All Types' },
  { href: '/pokemon', label: 'Pokemon' },
  { href: '/support', label: 'Support' },
];
