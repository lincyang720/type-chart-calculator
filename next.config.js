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
    ];
  },
}

module.exports = nextConfig
