import { MetadataRoute } from 'next';
import popularCombinations from '@/data/popularCombinations.json';
import pokemonData from '@/data/pokemon.json';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { EDITORIAL_COMBINATIONS } from '@/lib/editorialCombinations';
import { EDITORIAL_POKEMON } from '@/lib/editorialPokemon';

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
      url: `${baseUrl}/dual-type-chart`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/type-effectiveness-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/type-coverage-calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pokemon-champions-type-chart`,
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
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/embed`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
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

  // Only submit combinations with substantial editorial content. Calculator-only
  // pages stay accessible but are noindex and intentionally absent here.
  const comboPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < ALL_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_TYPES.length; j++) {
      const slug = `${ALL_TYPES[i]}-${ALL_TYPES[j]}`;
      if (!EDITORIAL_COMBINATIONS.has(slug)) continue;
      const isPopular = popularCombinations.combinations.some(
        c => c.type1 === ALL_TYPES[i] && c.type2 === ALL_TYPES[j]
      );
      comboPages.push({
        url: `${baseUrl}/types/${slug}`,
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
  const pokemonPages = pokemonData.pokemon.filter(p => EDITORIAL_POKEMON.has(p.id)).map(p => ({
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
