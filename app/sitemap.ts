import { MetadataRoute } from 'next';
import popularCombinations from '@/data/popularCombinations.json';
import pokemonData from '@/data/pokemon.json';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const typePages = ALL_TYPES.map(type => ({
    url: `${baseUrl}/types/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add ALL dual-type combination pages (153 combos = C(18,2))
  const comboPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < ALL_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_TYPES.length; j++) {
      const isPopular = popularCombinations.combinations.some(
        c => c.type1 === ALL_TYPES[i] && c.type2 === ALL_TYPES[j]
      );
      comboPages.push({
        url: `${baseUrl}/types/${ALL_TYPES[i]}-${ALL_TYPES[j]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: isPopular ? 0.8 : 0.7,
      });
    }
  }

  // Add blog posts
  const blogDir = path.join(process.cwd(), 'content/blog');
  let blogPages: MetadataRoute.Sitemap = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    blogPages = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(blogDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);

        return {
          url: `${baseUrl}/blog/${data.slug || file.replace('.md', '')}`,
          lastModified: data.date ? new Date(data.date) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
  }

  // Add pokemon pages
  const pokemonPages = pokemonData.pokemon.map(p => ({
    url: `${baseUrl}/pokemon/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Add pokemon list page
  const pokemonListPage = {
    url: `${baseUrl}/pokemon`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Add canonical type-chart and type-quiz pages
  const pokemonToolPages = [
    {
      url: `${baseUrl}/pokemon/type-chart`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pokemon/type-quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/type-calculator-gen-9`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/type-chart-with-abilities`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/best-type-combinations`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/team-calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...typePages, ...comboPages, ...pokemonPages, pokemonListPage, ...pokemonToolPages, ...blogPages];
}
