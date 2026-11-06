import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  author: string;
  description: string;
  image?: string;
  tags: string[];
}

const EXCLUDED_SLUGS = new Set([
  'pokemon-type-chart-2026',
  'dragon-types-chart',
  'dragon-type-weakness',
  'eeveelution-chart',
]);

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), 'content/blog');

  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const slug = asString(data.slug, file.replace(/\.md$/, ''));

      return {
        slug,
        title: asString(data.title, 'Untitled'),
        date: asString(data.date),
        updated: asString(data.updated) || undefined,
        author: asString(data.author, 'TypeMatchup'),
        description: asString(data.description),
        image: asString(data.image) || undefined,
        tags: asStringList(data.tags),
      };
    })
    .filter(post => !EXCLUDED_SLUGS.has(post.slug))
    .sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (byDate !== 0 && !Number.isNaN(byDate)) return byDate;
      return a.slug.localeCompare(b.slug);
    });
}

export function getLatestBlogPosts(limit = 4): BlogPost[] {
  return getBlogPosts().slice(0, limit);
}

export function formatBlogDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
