import { Metadata } from 'next';

import Link from 'next/link';
import { formatBlogDate, getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Pokemon Type Strategy Blog - Tips, Guides & Analysis',
  description: 'Expert guides on Pokemon type matchups, competitive strategies, and team building. Learn the best type combinations and battle tactics.',
  keywords: 'pokemon type guide, pokemon strategy, competitive pokemon, type matchup guide, pokemon team building, type combination analysis',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Type Strategy Blog',
    description: 'Expert guides on Pokemon type matchups and competitive strategies',
    url: 'https://www.typematchup.org/blog',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pokemon Type Strategy Blog
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Expert guides, competitive strategies, and in-depth type analysis
          </p>
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No blog posts yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>
                        {formatBlogDate(post.date) && `Published ${formatBlogDate(post.date)}`}
                        {post.updated && formatBlogDate(post.updated) && ` · Updated ${formatBlogDate(post.updated)}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
