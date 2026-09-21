/** @type {import('next').NextConfig} */

const SITE = 'https://www.typematchup.org';

// HTTP Link relations (RFC 8288 / RFC 9727) advertised on every HTML page so that
// an agent can find the machine-readable surface without guessing paths.
const LINK_HEADER = [
  `<${SITE}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  `<${SITE}/openapi.json>; rel="service-desc"; type="application/openapi+json"`,
  `<${SITE}/about>; rel="service-doc"; type="text/html"`,
  `<${SITE}/.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"`,
  `<${SITE}/.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"`,
  `<${SITE}/.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"`,
  `<${SITE}/.well-known/agent-card.json>; rel="agent-card"; type="application/json"`,
  `<${SITE}/>; rel="alternate"; type="text/markdown"`,
].join(', ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Link', value: LINK_HEADER }],
      },
      {
        source: '/embed/type-calculator',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // --- Agent discovery: canonical .well-known paths -> route handlers ---
        { source: '/.well-known/api-catalog', destination: '/api/agent/api-catalog' },
        { source: '/.well-known/openid-configuration', destination: '/api/agent/openid-configuration' },
        { source: '/.well-known/oauth-authorization-server', destination: '/api/agent/oauth-authorization-server' },
        { source: '/.well-known/oauth-protected-resource', destination: '/api/agent/oauth-protected-resource' },
        { source: '/.well-known/jwks.json', destination: '/api/agent/jwks' },
        { source: '/.well-known/mcp/server-card.json', destination: '/api/agent/mcp-server-card' },
        { source: '/.well-known/mcp/server-cards.json', destination: '/api/agent/mcp-server-card' },
        { source: '/.well-known/mcp.json', destination: '/api/agent/mcp-server-card' },
        { source: '/.well-known/agent-card.json', destination: '/api/agent/agent-card' },
        { source: '/.well-known/agent-skills/index.json', destination: '/api/agent/agent-skills-index' },
        {
          source: '/.well-known/agent-skills/pokemon-type-matchup/SKILL.md',
          destination: '/api/agent/agent-skill-file',
        },
        { source: '/.well-known/skills/index.json', destination: '/api/agent/agent-skills-index' },
        { source: '/.well-known/ai-catalog.json', destination: '/api/agent/ai-catalog' },
        { source: '/openapi.json', destination: '/api/agent/openapi' },
        { source: '/auth.md', destination: '/api/agent/auth-md' },
      ],
      afterFiles: [],
      fallback: [],
    };
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
      // P2: Merge twin type-chart pages into the canonical 2026 page
      {
        source: '/blog/pokemon-type-chart-scarlet-violet',
        destination: '/blog/pokemon-type-chart-2026',
        statusCode: 301,
      },
      {
        source: '/blog/pokemon-type-chart-gen-9-scarlet-violet',
        destination: '/blog/pokemon-type-chart-2026',
        statusCode: 301,
      },
      // Merge the standalone matchup page into the canonical effectiveness calculator
      {
        source: '/type-matchup-chart',
        destination: '/type-effectiveness-calculator',
        statusCode: 301,
      },
      {
        source: '/type-matchup-chart/:path*',
        destination: '/type-effectiveness-calculator',
        statusCode: 301,
      },
    ];
  },
}

module.exports = nextConfig
