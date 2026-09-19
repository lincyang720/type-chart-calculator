import typeChartData from '@/data/typeChart.json';
import pokemonData from '@/data/pokemon.json';
import {
  MCP_PROTOCOL_VERSION,
  SERVER_DESCRIPTION,
  SERVER_VERSION,
} from '@/lib/agentReady';
import { TypeId, TypeChart } from '@/lib/types';
import {
  calculateDualTypeWeaknesses,
  calculateMultiplier,
  getEffectivenessLabel,
} from '@/lib/typeCalculations';

export const dynamic = 'force-dynamic';

const typeChart = typeChartData as TypeChart;

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const TYPE_NAMES: Record<TypeId, string> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass', ice: 'Ice',
  fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying', psychic: 'Psychic',
  bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark', steel: 'Steel', fairy: 'Fairy',
};

const TYPE_DESCRIPTIONS: Record<TypeId, string> = {
  normal: 'Balanced and versatile; only walled by Rock and Steel, and cannot touch Ghost.',
  fire: 'Strong against Grass, Ice, Bug and Steel; resisted by Fire, Water, Rock and Dragon.',
  water: 'Strong against Fire, Ground and Rock; resisted by Water, Grass and Dragon.',
  electric: 'Strong against Water and Flying; useless against Ground.',
  grass: 'Strong against Water, Ground and Rock; resisted by a wide spread of types.',
  ice: 'Strong against Grass, Ground, Flying and Dragon; resisted by Fire, Water, Ice and Steel.',
  fighting: 'Strong against Normal, Ice, Rock, Dark and Steel; cannot touch Ghost.',
  poison: 'Strong against Grass and Fairy; useless against Steel.',
  ground: 'Strong against Fire, Electric, Poison, Rock and Steel; cannot touch Flying.',
  flying: 'Strong against Grass, Fighting and Bug; resisted by Electric, Rock and Steel.',
  psychic: 'Strong against Fighting and Poison; useless against Dark.',
  bug: 'Strong against Grass, Psychic and Dark; resisted by a wide spread of types.',
  rock: 'Strong against Fire, Ice, Flying and Bug; resisted by Fighting, Ground and Steel.',
  ghost: 'Strong against Psychic and Ghost; useless against Normal.',
  dragon: 'Strong only against Dragon; resisted by Steel and useless against Fairy.',
  dark: 'Strong against Psychic and Ghost; resisted by Fighting, Dark and Fairy.',
  steel: 'Strong against Ice, Rock and Fairy; resisted by Fire, Water, Electric and Steel.',
  fairy: 'Strong against Fighting, Dragon and Dark; resisted by Fire, Poison and Steel.',
};

interface RawPokemon {
  id: string;
  name: string;
  types: string[];
  generation: number;
  category?: string;
  baseStats?: Record<string, number>;
  abilities?: string[];
}

const POKEMON = (pokemonData as { pokemon: RawPokemon[] }).pokemon;

function isTypeId(value: unknown): value is TypeId {
  return typeof value === 'string' && (ALL_TYPES as string[]).includes(value);
}

function label(id: TypeId): string {
  return TYPE_NAMES[id];
}

function list(ids: TypeId[]): string[] {
  return ids.map(label);
}

/* ---------------------------- tool implementations --------------------------- */

const TOOLS = [
  {
    name: 'list_types',
    description: 'List all 18 Pokemon types with a short description of each.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_offensive_profile',
    description:
      'What a given attacking type is super effective against, not very effective against, and has no effect on.',
    inputSchema: {
      type: 'object',
      properties: { type: { type: 'string', description: 'Attacking type id, e.g. "fire".' } },
      required: ['type'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_defensive_profile',
    description:
      'Weaknesses, resistances and immunities for a single type or a dual type combination.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'First defending type id, e.g. "water".' },
        type2: { type: 'string', description: 'Optional second defending type id, e.g. "ground".' },
      },
      required: ['type'],
      additionalProperties: false,
    },
  },
  {
    name: 'calculate_matchup',
    description:
      'Damage multiplier when an attacking type hits one or two defending types. Returns 0x, 0.25x, 0.5x, 1x, 2x or 4x.',
    inputSchema: {
      type: 'object',
      properties: {
        attacking: { type: 'string', description: 'Attacking type id, e.g. "ice".' },
        defending: {
          type: 'array',
          items: { type: 'string' },
          description: 'One or two defending type ids, e.g. ["dragon", "flying"].',
          minItems: 1,
          maxItems: 2,
        },
      },
      required: ['attacking', 'defending'],
      additionalProperties: false,
    },
  },
  {
    name: 'lookup_pokemon',
    description: 'Look up a Pokemon by name and return its types, generation, abilities and base stats.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Pokemon name, e.g. "Charizard".' } },
      required: ['name'],
      additionalProperties: false,
    },
  },
];

function callTool(name: string, args: Record<string, unknown>): unknown {
  switch (name) {
    case 'list_types':
      return {
        count: ALL_TYPES.length,
        types: ALL_TYPES.map((id) => ({ id, name: label(id), description: TYPE_DESCRIPTIONS[id] })),
      };

    case 'get_offensive_profile': {
      const t = args.type;
      if (!isTypeId(t)) throw new ToolError(`Unknown type "${String(t)}".`);
      const entry = typeChart[t];
      return {
        attackingType: t,
        attackingTypeName: label(t),
        superEffective: list(entry.superEffective),
        notVeryEffective: list(entry.notVeryEffective),
        noEffect: list(entry.noEffect),
      };
    }

    case 'get_defensive_profile': {
      const t1 = args.type;
      if (!isTypeId(t1)) throw new ToolError(`Unknown type "${String(t1)}".`);
      const t2Raw = args.type2;
      const t2 = t2Raw === undefined || t2Raw === null || t2Raw === '' ? undefined : t2Raw;
      if (t2 !== undefined && !isTypeId(t2)) throw new ToolError(`Unknown type "${String(t2)}".`);

      const profile = calculateDualTypeWeaknesses(t1, t2);
      return {
        defendingTypes: t2 ? [t1, t2] : [t1],
        defendingTypeNames: t2 ? [label(t1), label(t2)] : [label(t1)],
        quadrupleWeak: list(profile.quadrupleWeak),
        doubleWeak: list(profile.doubleWeak),
        normal: list(profile.normal),
        doubleResist: list(profile.doubleResist),
        quadrupleResist: list(profile.quadrupleResist),
        immune: list(profile.immune),
      };
    }

    case 'calculate_matchup': {
      const attacking = args.attacking;
      if (!isTypeId(attacking)) throw new ToolError(`Unknown attacking type "${String(attacking)}".`);
      const defending = args.defending;
      if (!Array.isArray(defending) || defending.length === 0) {
        throw new ToolError('"defending" must be an array of one or two type ids.');
      }
      const parsed: TypeId[] = [];
      for (const d of defending.slice(0, 2)) {
        if (!isTypeId(d)) throw new ToolError(`Unknown defending type "${String(d)}".`);
        parsed.push(d);
      }
      const multiplier = calculateMultiplier(attacking, parsed);
      return {
        attackingType: attacking,
        attackingTypeName: label(attacking),
        defendingTypes: parsed,
        defendingTypeNames: parsed.map(label),
        multiplier,
        displayMultiplier: `${multiplier}x`,
        effectiveness: getEffectivenessLabel(multiplier),
      };
    }

    case 'lookup_pokemon': {
      const name = String(args.name || '').trim().toLowerCase();
      if (!name) throw new ToolError('"name" is required.');
      const exact = POKEMON.find((p) => p.name.toLowerCase() === name || p.id === name);
      const match = exact || POKEMON.find((p) => p.name.toLowerCase().includes(name) || p.id.includes(name));
      if (!match) {
        return { found: false, query: name, message: `No Pokemon matching "${name}" in the directory.` };
      }
      return {
        found: true,
        id: match.id,
        name: match.name,
        types: match.types,
        typeNames: match.types.map((t) => (isTypeId(t) ? label(t) : t)),
        generation: match.generation,
        category: match.category ?? null,
        abilities: match.abilities ?? [],
        baseStats: match.baseStats ?? null,
        url: `https://www.typematchup.org/pokemon/${match.id}`,
      };
    }

    default:
      throw new ToolError(`Unknown tool "${name}".`);
  }
}

class ToolError extends Error {}

/* ------------------------------- JSON-RPC layer ------------------------------ */

function rpcResult(id: unknown, result: unknown) {
  return { jsonrpc: '2.0', id: id ?? null, result };
}

function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

function handle(req: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> }) {
  const id = req.id;
  const params = req.params ?? {};

  switch (req.method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'typematchup', title: 'TypeMatchup Pokemon Type Calculator', version: SERVER_VERSION },
        instructions:
          'Read-only Pokemon type data. Use tools/list then tools/call. Every tool is safe, deterministic and requires no authentication.',
      });

    case 'notifications/initialized':
    case 'initialized':
      return null; // notification: no response

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list':
      return rpcResult(id, { tools: TOOLS });

    case 'tools/call': {
      const name = String(params.name || '');
      const args = (params.arguments as Record<string, unknown>) ?? {};
      try {
        const structured = callTool(name, args);
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify(structured, null, 2) }],
          structuredContent: structured,
          isError: false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Tool execution failed.';
        return rpcResult(id, {
          content: [{ type: 'text', text: message }],
          isError: true,
        });
      }
    }

    case 'resources/list':
      return rpcResult(id, { resources: [] });

    case 'prompts/list':
      return rpcResult(id, { prompts: [] });

    default:
      return rpcError(id, -32601, `Method not found: ${String(req.method)}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(rpcError(null, -32700, 'Parse error'), { status: 400 });
  }

  const batches = Array.isArray(body) ? body : [body];
  const responses = batches
    .map((b) => handle((b ?? {}) as Parameters<typeof handle>[0]))
    .filter((r): r is NonNullable<ReturnType<typeof handle>> => r !== null);

  if (responses.length === 0) {
    return new Response(null, { status: 202 });
  }

  const payload = Array.isArray(body) ? responses : responses[0];
  return Response.json(payload, {
    status: 200,
    headers: { 'cache-control': 'no-store', 'mcp-protocol-version': MCP_PROTOCOL_VERSION },
  });
}

export async function GET() {
  return Response.json(
    {
      error: 'method_not_allowed',
      message: 'This MCP server speaks Streamable HTTP with POST only. Send JSON-RPC 2.0 requests here.',
      serverDescription: SERVER_DESCRIPTION,
      tools: TOOLS.map((t) => t.name),
    },
    { status: 405, headers: { allow: 'POST, OPTIONS' } },
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { allow: 'POST, OPTIONS', 'mcp-protocol-version': MCP_PROTOCOL_VERSION },
  });
}
