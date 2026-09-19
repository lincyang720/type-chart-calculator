import typesData from '@/data/types.json';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/seo';
import { TypeId } from '@/lib/types';
import {
  calculateDualTypeWeaknesses,
  calculateMultiplier,
  formatMultiplier,
} from '@/lib/typeCalculations';

export const dynamic = 'force-static';

const SITE = 'https://www.typematchup.org';

interface RawType {
  id: string;
  name: string;
  color: string;
  description: string;
}

const TYPES = (typesData as { types: RawType[] }).types;
const ALL_TYPES = TYPES.map((t) => t.id as TypeId);
const NAME: Record<string, string> = Object.fromEntries(TYPES.map((t) => [t.id, t.name]));
const DESCRIPTION: Record<string, string> = Object.fromEntries(TYPES.map((t) => [t.id, t.description]));

function isTypeId(v: string): v is TypeId {
  return ALL_TYPES.includes(v as TypeId);
}

function names(ids: TypeId[]): string {
  return ids.length ? ids.map((id) => NAME[id]).join(', ') : 'none';
}

function markdown(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      vary: 'Accept',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
      'x-content-negotiation': 'text/markdown',
    },
  });
}

function notFound(slug: string[]): Response {
  return new Response(
    ['# Not available as Markdown', '', `No Markdown representation exists for \`/${slug.join('/')}\`.`, '',
      `The HTML version is at <${SITE}/${slug.join('/')}>.`, ''].join('\n'),
    { status: 404, headers: { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept' } },
  );
}

function footer(canonicalPath: string): string {
  return [
    '',
    '---',
    '',
    `Source: <${SITE}${canonicalPath}> (HTML) · Machine-readable: <${SITE}/openapi.json> (OpenAPI 3.1) · ` +
      `<${SITE}/api/mcp> (MCP)`,
    '',
  ].join('\n');
}

function profileBlock(ids: TypeId[]): string {
  const p = calculateDualTypeWeaknesses(ids[0], ids[1]);
  return [
    '## Defensive profile',
    '',
    `| Damage taken | Types |`,
    `| --- | --- |`,
    `| 4x (double weakness) | ${names(p.quadrupleWeak)} |`,
    `| 2x (weakness) | ${names(p.doubleWeak)} |`,
    `| 1x (neutral) | ${names(p.normal)} |`,
    `| 0.5x (resistance) | ${names(p.doubleResist)} |`,
    `| 0.25x (double resistance) | ${names(p.quadrupleResist)} |`,
    `| 0x (immune) | ${names(p.immune)} |`,
    '',
  ].join('\n');
}

function chartTable(): string {
  const head = ['| Attacking ↓ \\ Defending → |', ...TYPES.map((t) => ` ${t.name} |`)].join('');
  const divider = `| --- |${TYPES.map(() => ' --- |').join('')}`;
  const rows = TYPES.map((a) => {
    const cells = TYPES.map((d) => ` ${formatMultiplier(calculateMultiplier(a.id as TypeId, [d.id as TypeId]))} |`);
    return `| **${a.name}** |${cells.join('')}`;
  });
  return ['## Full 18x18 type chart', '', head, divider, ...rows, ''].join('\n');
}

function typeIndex(): string {
  return [
    '## Single types',
    '',
    ...TYPES.map((t) => `- [${t.name}](${SITE}/types/${t.id}) — ${t.description}`),
    '',
  ].join('\n');
}

export async function GET(_request: Request, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  const parts = slug ?? [];

  /* ------------------------------- home ------------------------------- */
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'index')) {
    return markdown(
      [
        `# ${HOME_TITLE}`,
        '',
        HOME_DESCRIPTION,
        '',
        '- Type calculator: pick attacking and defending types to get the exact damage multiplier.',
        '- Dual type chart: all 153 type combinations with their weaknesses and resistances.',
        '- Type coverage: check what your move pool covers.',
        '',
        typeIndex(),
        chartTable(),
        '## Machine access',
        '',
        `- MCP server (Streamable HTTP): \`${SITE}/api/mcp\``,
        `- OpenAPI 3.1 description: \`${SITE}/openapi.json\``,
        `- Pokemon search: \`GET ${SITE}/api/agent/search?q=charizard\``,
        `- Agent skill: \`${SITE}/.well-known/agent-skills/pokemon-type-matchup/SKILL.md\``,
        '',
        footer('/'),
      ].join('\n'),
    );
  }

  /* ---------------------------- single type --------------------------- */
  if (parts[0] === 'types' && parts.length === 2 && isTypeId(parts[1])) {
    const id = parts[1];
    const name = NAME[id];
    const ids: TypeId[] = [id];
    return markdown(
      [
        `# ${name} Type`,
        '',
        DESCRIPTION[id],
        '',
        profileBlock(ids),
        '## Offensive profile',
        '',
        `When a ${name}-type move is used, the damage multiplier against each defending type is read from ` +
          `the chart below.`,
        '',
        `| Defending type | Multiplier |`,
        `| --- | --- |`,
        ...TYPES.map(
          (d) => `| ${d.name} | ${formatMultiplier(calculateMultiplier(id, [d.id as TypeId]))} |`,
        ),
        '',
        `## Related`,
        '',
        `- Dual type chart: ${SITE}/dual-type-chart`,
        `- Type calculator: ${SITE}/type-effectiveness-calculator`,
        '',
        footer(`/types/${id}`),
      ].join('\n'),
    );
  }

  /* ----------------------------- dual type ---------------------------- */
  if (parts[0] === 'combo' && parts.length === 2) {
    const [a, b] = parts[1].split('-');
    if (isTypeId(a) && isTypeId(b)) {
      const ids: TypeId[] = [a, b];
      return markdown(
        [
          `# ${NAME[a]}/${NAME[b]} Type`,
          '',
          `Defensive profile for a Pokémon that is both ${NAME[a]} and ${NAME[b]} type. ` +
            `Each attacking type's multiplier is the product of its multiplier against ${NAME[a]} ` +
            `and against ${NAME[b]}.`,
          '',
          profileBlock(ids),
          '## Matchup table',
          '',
          `| Attacking type | Multiplier |`,
          `| --- | --- |`,
          ...TYPES.map(
            (t) => `| ${t.name} | ${formatMultiplier(calculateMultiplier(t.id as TypeId, ids))} |`,
          ),
          '',
          footer(`/combo/${parts[1]}`),
        ].join('\n'),
      );
    }
  }

  /* -------------------------- dual type chart ------------------------- */
  if (parts.length === 1 && parts[0] === 'dual-type-chart') {
    return markdown(
      [
        '# Dual Type Chart',
        '',
        'Every two-type combination and the weaknesses that result from stacking the two single-type charts.',
        '',
        `- Browse all combinations: ${SITE}/dual-type-chart`,
        '',
        chartTable(),
        footer('/dual-type-chart'),
      ].join('\n'),
    );
  }

  return notFound(parts);
}
