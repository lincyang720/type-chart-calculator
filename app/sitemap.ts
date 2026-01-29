import { MetadataRoute } from 'next';
import popularCombinations from '@/data/popularCombinations.json';
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

  // Add popular type combination pages
  const comboPages = popularCombinations.combinations.map(combo => ({
    url: `${baseUrl}/combo/${combo.type1}-${combo.type2}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8, // Higher priority than single types as these are more specific queries
  }));

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

  return [...staticPages, ...typePages, ...comboPages, ...blogPages];
}
