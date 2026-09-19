import { createHash } from 'crypto';
import {
  AUTH_MD,
  SKILL_MD,
  SKILL_NAME,
  SERVER_VERSION,
  aiCatalogDocument,
  apiCatalogDocument,
  authorizationServerDocument,
  agentCardDocument,
  jwksDocument,
  mcpServerCardDocument,
  openApiDocument,
  protectedResourceDocument,
} from '@/lib/agentReady';

export const dynamic = 'force-static';

const JSON_HEADERS = { 'cache-control': 'public, max-age=3600, s-maxage=3600' };

function json(body: unknown, contentType = 'application/json'): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { 'content-type': `${contentType}; charset=utf-8`, ...JSON_HEADERS },
  });
}

function text(body: string, contentType: string): Response {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': `${contentType}; charset=utf-8`, ...JSON_HEADERS },
  });
}

function notFound(): Response {
  return new Response(JSON.stringify({ error: 'not_found' }), {
    status: 404,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function skillSha256(): string {
  return createHash('sha256').update(SKILL_MD, 'utf8').digest('hex');
}

export async function GET(_request: Request, context: { params: Promise<{ doc: string }> }) {
  const { doc } = await context.params;

  switch (doc) {
    case 'api-catalog':
      return json(apiCatalogDocument(), 'application/linkset+json');

    case 'openapi':
      return json(openApiDocument(), 'application/openapi+json');

    case 'ai-catalog':
      return json(aiCatalogDocument());

    case 'mcp-server-card':
      return json(mcpServerCardDocument());

    case 'agent-card':
      return json(agentCardDocument());

    case 'openid-configuration':
    case 'oauth-authorization-server':
      return json(authorizationServerDocument());

    case 'oauth-protected-resource':
      return json(protectedResourceDocument());

    case 'jwks':
      return json(jwksDocument());

    case 'agent-skills-index':
      return json({
        $schema: 'https://agent-skills.dev/schema/index.json',
        version: '0.2.0',
        name: 'TypeMatchup Agent Skills',
        description: 'Skills for answering Pokemon type-effectiveness questions using TypeMatchup data.',
        updated: '2026-09-19',
        skills: [
          {
            name: SKILL_NAME,
            description:
              'Look up Pokemon type effectiveness, weaknesses and dual-type defensive profiles from authoritative data.',
            path: '/.well-known/agent-skills/pokemon-type-matchup/SKILL.md',
            url: 'https://www.typematchup.org/.well-known/agent-skills/pokemon-type-matchup/SKILL.md',
            version: SERVER_VERSION,
            license: 'MIT',
            tags: ['pokemon', 'type-chart', 'game-data', 'calculator'],
            sha256: skillSha256(),
          },
        ],
      });

    case 'agent-skill-file':
      return text(SKILL_MD, 'text/markdown');

    case 'auth-md':
      return text(AUTH_MD, 'text/markdown');

    default:
      return notFound();
  }
}
