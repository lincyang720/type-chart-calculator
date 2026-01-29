import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content/blog');

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fileContent = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data } = matter(fileContent);
      return {
        slug: data.slug || file.replace('.md', ''),
      };
    });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir);

  const file = files.find(f => {
    const fileContent = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    const { data } = matter(fileContent);
    return data.slug === resolvedParams.slug;
  });

  if (!file) {
    return { title: 'Post Not Found' };
  }

  const fileContent = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(fileContent);

  return {
    title: `${data.title} | Type Matchup Blog`,
    description: data.description || '',
    keywords: data.tags?.join(', ') || '',
    authors: [{ name: data.author || 'Type Chart Calculator Team' }],
    openGraph: {
      title: data.title,
      description: data.description || '',
      url: `https://www.typematchup.org/blog/${resolvedParams.slug}`,
      type: 'article',
      publishedTime: data.date,
      images: data.image ? [{ url: data.image }] : [],
    },
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir);

  const file = files.find(f => {
    const fileContent = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    const { data } = matter(fileContent);
    return data.slug === resolvedParams.slug;
  });

  if (!file) {
    notFound();
  }

  const fileContent = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data, content } = matter(fileContent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {data.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h1>

            <div className="flex items-center justify-between text-sm text-gray-600 border-b pb-4">
              <span>{data.author}</span>
              <time dateTime={data.date}>
                {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <Link
                    href={props.href || '#'}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {props.children}
                  </Link>
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-8 border-gray-300" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back to Blog (bottom) */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
