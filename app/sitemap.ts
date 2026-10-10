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
      // Omit lastModified when the page has no tracked content date.
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculator`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/battle-simulator`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dual-type-chart`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/type-effectiveness-calculator`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/type-coverage-calculator`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pokemon-champions-type-chart`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/types`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/embed`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const typePages = ALL_TYPES.map(type => ({
    url: `${baseUrl}/types/${type}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Only submit combinations with substantial editorial content. Calculator-only
  // pages stay accessible but are noindex and intentionally absent here.
  const comboPages: MetadataRoute.Sitemap = [];
  for (const slug of EDITORIAL_COMBINATIONS) {
    const [type1, type2] = slug.split('-');
    const isPopular = popularCombinations.combinations.some(
      c => (c.type1 === type1 && c.type2 === type2) ||
        (c.type1 === type2 && c.type2 === type1)
    );
    comboPages.push({
      url: `${baseUrl}/types/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: isPopular ? 0.8 : 0.7,
    });
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
        const contentDate = data.updated || data.date;

        return {
          url: `${baseUrl}/blog/${data.slug || file.replace('.md', '')}`,
          ...(contentDate ? { lastModified: new Date(contentDate) } : {}),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      })
      .filter(page => ![
        `${baseUrl}/blog/pokemon-type-chart-2026`,
        `${baseUrl}/blog/dragon-types-chart`,
        `${baseUrl}/blog/dragon-type-weakness`,
        `${baseUrl}/blog/eeveelution-chart`,
      ].includes(page.url));
  }

  // Add pokemon pages
  const pokemonPages = pokemonData.pokemon.filter(p => EDITORIAL_POKEMON.has(p.id)).map(p => ({
    url: `${baseUrl}/pokemon/${p.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Add pokemon list page
  const pokemonListPage = {
    url: `${baseUrl}/pokemon`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Add canonical type-chart and type-quiz pages
  const pokemonToolPages = [
    {
      url: `${baseUrl}/pokemon/type-chart`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pokemon/type-quiz`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/type-calculator-gen-9`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/type-chart-with-abilities`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/best-type-combinations`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon/team-calculator`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...typePages, ...comboPages, ...pokemonPages, pokemonListPage, ...pokemonToolPages, ...blogPages];
}
