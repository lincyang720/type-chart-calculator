/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/embed/type-calculator',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'typematchup.org' }],
        destination: 'https://www.typematchup.org/:path*',
        permanent: true,
      },
      // P1: Consolidate duplicate type-chart pages to resolve cannibalization
      {
        source: '/pokemon/pokemon-type-chart',
        destination: '/pokemon/type-chart',
        statusCode: 301,
      },
      // P1: Consolidate duplicate type-quiz pages to resolve cannibalization
      {
        source: '/pokemon/pokemon-type-quiz',
        destination: '/pokemon/type-quiz',
        statusCode: 301,
      },
    ];
  },
}

module.exports = nextConfig
