/**
 * Single source of truth for the site's agent-discovery surface.
 *
 * Every document below is served from the SAME bytes at two paths:
 *   - the canonical .well-known path (via rewrite in next.config.js)
 *   - the /api/agent/<doc> path (the actual Next route handler)
 *
 * The Skill file lives here as a string so the SHA256 advertised in the
 * skills index is computed over exactly the bytes that get served.
 */

export const SITE = 'https://www.typematchup.org';
export const ORIGIN = SITE;

export const MCP_ENDPOINT = `${SITE}/api/mcp`;
export const A2A_ENDPOINT = `${SITE}/api/a2a`;
export const SEARCH_ENDPOINT = `${SITE}/api/agent/search`;
export const OPENAPI_URL = `${SITE}/openapi.json`;
export const API_CATALOG_URL = `${SITE}/.well-known/api-catalog`;
export const MCP_CARD_URL = `${SITE}/.well-known/mcp/server-card.json`;
export const AI_CATALOG_URL = `${SITE}/.well-known/ai-catalog.json`;
export const SKILLS_INDEX_URL = `${SITE}/.well-known/agent-skills/index.json`;
export const SKILL_FILE_URL = `${SITE}/.well-known/agent-skills/pokemon-type-matchup/SKILL.md`;
export const AGENT_CARD_URL = `${SITE}/.well-known/agent-card.json`;
export const AUTH_MD_URL = `${SITE}/auth.md`;
export const JWKS_URL = `${SITE}/.well-known/jwks.json`;
export const PRM_URL = `${SITE}/.well-known/oauth-protected-resource`;
export const AS_URL = `${SITE}/.well-known/oauth-authorization-server`;
export const OIDC_URL = `${SITE}/.well-known/openid-configuration`;

export const REPO_URL = 'https://github.com/lincyang720/type-chart-calculator';

export const MCP_PROTOCOL_VERSION = '2025-06-18';
export const SERVER_VERSION = '1.0.0';

export const SERVER_DESCRIPTION =
  'Pokemon type effectiveness data and calculation: 18x18 type chart, single and dual-type ' +
  'defensive profiles, damage multipliers, and Pokemon type lookup. Read-only, no authentication required.';

/* ------------------------------------------------------------------ */
/* Agent Skill artifact                                                */
/* ------------------------------------------------------------------ */

export const SKILL_NAME = 'pokemon-type-matchup';

export const SKILL_MD = [
  '---',
  'name: pokemon-type-matchup',
  'description: >-',
  '  Look up Pokemon type effectiveness and weaknesses. Use when asked about type matchups,',
  '  super effective or not very effective moves, a Pokemon\'s weaknesses, dual-type defensive',
  '  profiles, STAB, damage multipliers, or the 18x18 type chart.',
  `version: ${SERVER_VERSION}`,
  'license: MIT',
  'tags:',
  '  - pokemon',
  '  - type-chart',
  '  - game-data',
  '  - calculator',
  '---',
  '',
  '# Pokemon Type Matchup',
  '',
  'Answer Pokemon type-effectiveness questions with authoritative data instead of recall.',
  '',
  '## When to use',
  '',
  '- "What is Charizard weak to?"',
  '- "Is Fire super effective against Steel?"',
  '- "What resists Fairy?"',
  '- "Give me the full type chart."',
  '- "What is the defensive profile of Water/Ground?"',
  '',
  '## Preferred path: MCP server',
  '',
  `A read-only MCP server is available over Streamable HTTP at \`${MCP_ENDPOINT}\`.`,
  '',
  'Tools exposed:',
  '',
  '| Tool | Arguments | Returns |',
  '| --- | --- | --- |',
  '| `list_types` | none | The 18 types with id, name and description |',
  '| `get_offensive_profile` | `type` | Super effective / not very effective / no effect lists |',
  '| `get_defensive_profile` | `type`, optional `type2` | 4x, 2x, 1x, 0.5x, 0.25x and immune buckets |',
  '| `calculate_matchup` | `attacking`, `defending` (array) | Multiplier and effectiveness label |',
  '| `lookup_pokemon` | `name` | Types, generation, base stats and abilities |',
  '',
  '## Fallback path: plain HTTP',
  '',
  `- Search: \`GET ${SEARCH_ENDPOINT}?q=charizard\``,
  `- OpenAPI 3.1 description: \`${OPENAPI_URL}\``,
  `- API catalog (RFC 9727 linkset): \`${API_CATALOG_URL}\``,
  '',
  '## Rules',
  '',
  '- Multipliers are 0x, 0.25x, 0.5x, 1x, 2x or 4x. Dual types multiply the two single-type factors.',
  '- An immunity (0x) from either type makes the whole matchup 0x.',
  '- Report the exact multiplier, not just "weak" or "strong".',
  '- If a type name is unknown, call `list_types` rather than guessing.',
  '',
  '## Source',
  '',
  `- Live site: ${SITE}`,
  `- Data and code: ${REPO_URL}`,
  '',
].join('\n');

/* ------------------------------------------------------------------ */
/* Discovery documents                                                 */
/* ------------------------------------------------------------------ */

export function apiCatalogDocument() {
  return {
    linkset: [
      {
        anchor: SITE,
        'api-catalog': [
          { href: API_CATALOG_URL, type: 'application/linkset+json', title: 'TypeMatchup API catalog' },
        ],
        'service-desc': [
          { href: OPENAPI_URL, type: 'application/openapi+json', title: 'TypeMatchup API (OpenAPI 3.1)' },
        ],
        'service-doc': [
          { href: `${SITE}/about`, type: 'text/html', title: 'About TypeMatchup' },
        ],
        describedby: [
          { href: AI_CATALOG_URL, type: 'application/json', title: 'Agent capability manifest (ARD)' },
          { href: MCP_CARD_URL, type: 'application/json', title: 'MCP Server Card' },
        ],
        alternate: [
          { href: `${SITE}/`, type: 'text/markdown', title: 'Markdown representation (Accept: text/markdown)' },
          { href: `${SITE}/llms.txt`, type: 'text/plain', title: 'LLM-oriented site summary' },
        ],
        'mcp-server-card': [
          { href: MCP_CARD_URL, type: 'application/json', title: 'MCP Server Card' },
        ],
        'agent-skills': [
          { href: SKILLS_INDEX_URL, type: 'application/json', title: 'Agent Skills index' },
        ],
      },
    ],
  };
}

export function mcpServerCardDocument() {
  return {
    $schema: 'https://static.modelcontextprotocol.io/schemas/2025-09-29/server-card/draft/schema.json',
    name: 'typematchup',
    title: 'TypeMatchup Pokemon Type Calculator',
    description: SERVER_DESCRIPTION,
    version: SERVER_VERSION,
    protocolVersion: MCP_PROTOCOL_VERSION,
    url: MCP_ENDPOINT,
    websiteUrl: SITE,
    transport: { type: 'streamable-http', url: MCP_ENDPOINT },
    remotes: [{ type: 'streamable-http', url: MCP_ENDPOINT }],
    capabilities: { tools: { listChanged: false } },
    authentication: { required: false, schemes: [] },
    repository: { url: REPO_URL, source: 'github' },
    icons: [],
    tools: [
      { name: 'list_types', description: 'List the 18 Pokemon types with descriptions.' },
      { name: 'get_offensive_profile', description: 'What a given attacking type is strong or weak against.' },
      { name: 'get_defensive_profile', description: 'Weakness, resistance and immunity buckets for one or two types.' },
      { name: 'calculate_matchup', description: 'Damage multiplier for an attacking type against one or two defending types.' },
      { name: 'lookup_pokemon', description: 'Look up a Pokemon by name and return its types, generation and stats.' },
    ],
  };
}

export function agentCardDocument() {
  return {
    name: 'TypeMatchup Pokemon Type Calculator',
    description: SERVER_DESCRIPTION,
    url: SITE,
    version: SERVER_VERSION,
    protocolVersion: '0.3.0',
    preferredTransport: 'JSONRPC',
    documentationUrl: `${SITE}/about`,
    provider: { organization: 'TypeMatchup', url: SITE },
    capabilities: { streaming: false, pushNotifications: false, extensions: [] },
    securitySchemes: {},
    security: [],
    defaultInputModes: ['text', 'application/json'],
    defaultOutputModes: ['text', 'application/json'],
    supportedInterfaces: [
      {
        protocolBinding: 'JSONRPC',
        protocolVersion: '0.3.0',
        url: A2A_ENDPOINT,
        description: 'A2A JSON-RPC 2.0 endpoint. Accepts message/send with a single text part.',
      },
    ],
    skills: [
      {
        id: 'type-effectiveness',
        name: 'Type effectiveness lookup',
        description: 'Return the damage multiplier and effectiveness label for any attacking type against any single or dual defending type.',
        tags: ['pokemon', 'type-chart', 'calculator'],
        examples: ['Is Fire super effective against Steel?', 'What is the multiplier for Ice against Dragon/Flying?'],
      },
      {
        id: 'defensive-profile',
        name: 'Defensive profile',
        description: 'List 4x, 2x, 1x, 0.5x, 0.25x weaknesses/resistances and immunities for one or two types.',
        tags: ['pokemon', 'weakness', 'dual-type'],
        examples: ['What is Water/Ground weak to?', 'Show the resistances of Steel/Fairy.'],
      },
      {
        id: 'pokemon-lookup',
        name: 'Pokemon lookup',
        description: 'Look up a Pokemon by name and return its types, generation, abilities and base stats.',
        tags: ['pokemon', 'lookup'],
        examples: ['What type is Charizard?'],
      },
    ],
  };
}

export function aiCatalogDocument() {
  return {
    $schema: 'https://ard.dev/schema/ai-catalog.json',
    specVersion: '1.0',
    name: 'TypeMatchup',
    description: SERVER_DESCRIPTION,
    url: SITE,
    identifier: 'did:web:www.typematchup.org',
    version: SERVER_VERSION,
    protocols: ['mcp', 'openapi', 'http'],
    capabilities: [
      {
        id: 'type-effectiveness',
        type: 'data',
        name: 'Type effectiveness',
        description: 'Damage multipliers across the 18x18 type chart, including dual-type stacking.',
        protocols: ['mcp', 'http'],
        endpoints: { mcp: MCP_ENDPOINT, openapi: OPENAPI_URL },
      },
      {
        id: 'defensive-profile',
        type: 'data',
        name: 'Defensive profile',
        description: 'Weakness, resistance and immunity buckets for single and dual types.',
        protocols: ['mcp', 'http'],
        endpoints: { mcp: MCP_ENDPOINT, openapi: OPENAPI_URL },
      },
      {
        id: 'pokemon-directory',
        type: 'data',
        name: 'Pokemon directory',
        description: 'Searchable directory of Pokemon with types, generation, abilities and base stats.',
        protocols: ['http'],
        endpoints: { search: SEARCH_ENDPOINT },
      },
    ],
    endpoints: {
      mcp: MCP_ENDPOINT,
      a2a: A2A_ENDPOINT,
      openapi: OPENAPI_URL,
      apiCatalog: API_CATALOG_URL,
      mcpServerCard: MCP_CARD_URL,
      agentSkills: SKILLS_INDEX_URL,
      search: SEARCH_ENDPOINT,
      auth: AUTH_MD_URL,
    },
    discoveryMechanisms: [
      { type: 'well-known-ai-catalog', url: AI_CATALOG_URL },
      { type: 'well-known-api-catalog', url: API_CATALOG_URL },
      { type: 'well-known-mcp-server-card', url: MCP_CARD_URL },
      { type: 'well-known-agent-skills', url: SKILLS_INDEX_URL },
      { type: 'http-link-header', url: `${SITE}/` },
      { type: 'robots-sitemap', url: `${SITE}/sitemap.xml` },
    ],
    searchEndpoints: [
      {
        url: SEARCH_ENDPOINT,
        method: 'GET',
        params: { q: 'string' },
        description: 'Search Pokemon by name and list matching types.',
      },
    ],
    authentication: { required: false, status: 'under_construction', docs: AUTH_MD_URL },
  };
}

/** OAuth 2.0 Authorization Server metadata — disclosed placeholder. */
export function authorizationServerDocument() {
  return {
    issuer: SITE,
    authorization_endpoint: `${SITE}/oauth/authorize`,
    token_endpoint: `${SITE}/oauth/token`,
    registration_endpoint: `${SITE}/oauth/register`,
    jwks_uri: JWKS_URL,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: ['type:read'],
    service_documentation: AUTH_MD_URL,
    ui_locales_supported: ['en'],
    status: 'under_construction',
    under_construction: true,
    note:
      'TypeMatchup is currently an unauthenticated, read-only public API. This discovery document is ' +
      'published as a declared placeholder: the endpoints above are NOT live yet and will return HTTP 503 ' +
      'until the authorization server is deployed. Clients must not send credentials to these endpoints.',
  };
}

/** OAuth 2.0 Protected Resource Metadata (RFC 9728) — disclosed placeholder. */
export function protectedResourceDocument() {
  return {
    resource: SITE,
    resource_name: 'TypeMatchup API',
    authorization_servers: [SITE],
    scopes_supported: ['type:read'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${SITE}/about`,
    resource_signing_alg_values_supported: ['RS256'],
    status: 'under_construction',
    under_construction: true,
    note:
      'No credentials are required today: every documented capability is public and read-only. This ' +
      'metadata reserves the resource identifier for a future OAuth 2.0 rollout. See ' + AUTH_MD_URL + '.',
  };
}

/** Empty JWKS key set — declared alongside the under-construction AS. */
export function jwksDocument() {
  return {
    keys: [],
    status: 'under_construction',
    under_construction: true,
    note: 'No signing keys are published yet. The authorization server is under construction; see ' + AUTH_MD_URL + '.',
  };
}

export const AUTH_MD = [
  '# auth.md — Authentication for TypeMatchup',
  '',
  '**Status: under construction. No authentication is required today.**',
  '',
  'Every capability described on ' + SITE + ' is public and read-only. There is no API key,',
  'no bearer token and no login step. An agent can call the MCP server or the HTTP API',
  'directly and anonymously.',
  '',
  '## What is live right now',
  '',
  '| Capability | Endpoint | Auth |',
  '| --- | --- | --- |',
  '| MCP server (Streamable HTTP) | `' + MCP_ENDPOINT + '` | none |',
  '| A2A endpoint (JSON-RPC) | `' + A2A_ENDPOINT + '` | none |',
  '| Pokemon / type search | `GET ' + SEARCH_ENDPOINT + '?q=` | none |',
  '| OpenAPI 3.1 description | `' + OPENAPI_URL + '` | none |',
  '',
  'Anonymous access is rate-limited by the edge (Vercel). If you receive HTTP 429, back off',
  'exponentially rather than retrying in a tight loop.',
  '',
  '## What is under construction',
  '',
  'An OAuth 2.0 authorization server is planned so that higher-volume and write-capable',
  'clients can be identified. The following documents are published **in advance and marked',
  '`under_construction: true`** so that discovery tooling can find a stable identifier:',
  '',
  '| Document | URL |',
  '| --- | --- |',
  '| Authorization Server metadata | `' + OIDC_URL + '` |',
  '| Authorization Server metadata (RFC 8414 path) | `' + AS_URL + '` |',
  '| Protected Resource Metadata (RFC 9728) | `' + PRM_URL + '` |',
  '| JWK Set | `' + JWKS_URL + '` |',
  '',
  'The `authorization_endpoint`, `token_endpoint` and `registration_endpoint` values in those',
  'documents **are not live** and will return HTTP 503 until the authorization server is',
  'deployed. The JWK Set is published empty (`{"keys":[]}`).',
  '',
  '**Do not send credentials, tokens or personal data to these endpoints while they return',
  '503.** They are reserved identifiers, not functioning services.',
  '',
  '## Planned scope',
  '',
  '- `type:read` — read type chart, matchups and Pokemon data (the only scope planned).',
  '',
  '## Contact',
  '',
  'Questions about agent access: open an issue at ' + REPO_URL + '.',
  '',
].join('\n');

export function openApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'TypeMatchup API',
      version: SERVER_VERSION,
      description: SERVER_DESCRIPTION,
      license: { name: 'MIT', url: `${REPO_URL}/blob/main/LICENSE` },
      contact: { name: 'TypeMatchup', url: `${SITE}/contact` },
    },
    servers: [{ url: SITE, description: 'Production' }],
    tags: [
      { name: 'types', description: 'Pokemon type chart data' },
      { name: 'directory', description: 'Pokemon directory search' },
      { name: 'mcp', description: 'Model Context Protocol JSON-RPC endpoint' },
    ],
    paths: {
      '/api/agent/search': {
        get: {
          tags: ['directory'],
          summary: 'Search the Pokemon directory',
          operationId: 'searchPokemon',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Free-text name fragment.' },
            { name: 'type', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter by type id, e.g. "fire".' },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } },
          ],
          responses: {
            '200': {
              description: 'Matching Pokemon.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      query: { type: 'string' },
                      count: { type: 'integer' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            types: { type: 'array', items: { type: 'string' } },
                            generation: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/mcp': {
        post: {
          tags: ['mcp'],
          summary: 'MCP JSON-RPC 2.0 endpoint (Streamable HTTP)',
          operationId: 'mcpRpc',
          description:
            'Accepts MCP JSON-RPC 2.0 requests. Supported methods: `initialize`, `notifications/initialized`, ' +
            '`tools/list`, `tools/call`. Tools are read-only and require no authentication.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jsonrpc: { type: 'string', enum: ['2.0'] },
                    id: { type: ['integer', 'string', 'null'] },
                    method: { type: 'string' },
                    params: { type: 'object' },
                  },
                  required: ['jsonrpc', 'method'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'JSON-RPC 2.0 response.' },
          },
        },
      },
      '/api/a2a': {
        post: {
          tags: ['mcp'],
          summary: 'A2A JSON-RPC 2.0 endpoint',
          operationId: 'a2aMessageSend',
          description:
            'Accepts A2A `message/send` requests with a single text part. The message is scanned for ' +
            'Pokemon type names and answered with the same engine that backs the MCP server. Returns ' +
            '`input-required` when no type can be identified.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jsonrpc: { type: 'string', enum: ['2.0'] },
                    id: { type: ['integer', 'string', 'null'] },
                    method: { type: 'string', enum: ['message/send'] },
                    params: { type: 'object' },
                  },
                  required: ['jsonrpc', 'method'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'A2A task object.' },
          },
        },
      },
    },
  };
}
