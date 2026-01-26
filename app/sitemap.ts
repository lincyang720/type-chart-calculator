import { MetadataRoute } from 'next';
import popularCombinations from '@/data/popularCombinations.json';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.typematchup.org';

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/battle-simulator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/types`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  const typePages = ALL_TYPES.map(type => ({
    url: `${baseUrl}/types/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add popular type combination pages
  const comboPages = popularCombinations.combinations.map(combo => ({
    url: `${baseUrl}/combo/${combo.type1}-${combo.type2}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8, // Higher priority than single types as these are more specific queries
  }));

  return [...staticPages, ...typePages, ...comboPages];
}
