/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
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
