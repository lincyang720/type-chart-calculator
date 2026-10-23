import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TypeMatchup Pokémon Type Calculator',
    short_name: 'TypeMatchup',
    description: 'Fast Pokémon type matchups, weaknesses, resistances, and team coverage tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
