import { TypeId } from '@/lib/types';
import {
  calculateDualTypeWeaknesses,
  calculateMultiplier,
  getEffectivenessLabel,
} from '@/lib/typeCalculations';
import { findTypesInText, typeName, typeNames } from '@/lib/typeFacts';
import { SERVER_VERSION } from '@/lib/agentReady';

export const dynamic = 'force-dynamic';

/**
 * Minimal A2A (Agent2Agent) JSON-RPC endpoint.
 *
 * It is deliberately narrow: `message/send` with a single text part. The message is
 * scanned for Pokemon type names in order of appearance, and the answer is produced
 * by the same calculation engine the site and the MCP server use — so this is a real
 * responder, not a stub. When no type can be identified it returns `input-required`
 * rather than inventing an answer.
 */

const MATCHUP_HINT = /\b(against|super[- ]?effective|not very|resist|weak to|hit|damage|multiplier)\b/i;

type JsonRpc = { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };

function textOf(message: unknown): string {
  const m = message as { parts?: Array<{ kind?: string; text?: string }> } | undefined;
  if (!m || !Array.isArray(m.parts)) return '';
  return m.parts
    .filter((p) => p && (p.kind === 'text' || typeof p.text === 'string'))
    .map((p) => p.text || '')
    .join(' ')
    .trim();
}

function summarizeProfile(ids: TypeId[]): string {
  const p = calculateDualTypeWeaknesses(ids[0], ids[1]);
  const fmt = (k: string, v: TypeId[]) => (v.length ? `${k}: ${typeNames(v).join(', ')}` : null);
  const lines = [
    `Defensive profile for ${ids.map(typeName).join('/')}:`,
    fmt('4x weak to', p.quadrupleWeak),
    fmt('2x weak to', p.doubleWeak),
    fmt('0.5x resists', p.doubleResist),
    fmt('0.25x resists', p.quadrupleResist),
    fmt('0x immune to', p.immune),
  ].filter(Boolean);
  return lines.join('\n');
}

function summarizeMatchup(attacking: TypeId, defending: TypeId[]): string {
  const m = calculateMultiplier(attacking, defending);
  return (
    `${typeName(attacking)} against ${defending.map(typeName).join('/')}: ${m}x ` +
    `(${getEffectivenessLabel(m)}).`
  );
}

function answer(prompt: string): { text: string; state: 'completed' | 'input-required' } {
  const found = findTypesInText(prompt);
  if (found.length === 0) {
    return {
      state: 'input-required',
      text:
        'Name one or two Pokemon types and I will compute the matchup. Example: ' +
        '"Is Ice super effective against Dragon/Flying?" or "What is Water/Ground weak to?"',
    };
  }
  if (found.length === 1) return { state: 'completed', text: summarizeProfile([found[0]]) };
  if (MATCHUP_HINT.test(prompt)) {
    return { state: 'completed', text: summarizeMatchup(found[0], found.slice(1, 3)) };
  }
  return { state: 'completed', text: summarizeProfile(found.slice(0, 2)) };
}

function rpcResult(id: unknown, result: unknown) {
  return { jsonrpc: '2.0', id: id ?? null, result };
}
function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

function handle(req: JsonRpc) {
  const id = req.id;
  const params = req.params ?? {};

  switch (req.method) {
    case 'message/send':
    case 'tasks/send': {
      const message = params.message;
      const prompt = textOf(message);
      const { text, state } = answer(prompt);
      const taskId = `task-${Date.now()}`;
      const reply = {
        kind: 'message',
        role: 'agent',
        messageId: `msg-${Date.now()}`,
        parts: [{ kind: 'text', text }],
      };
      return rpcResult(id, {
        id: taskId,
        contextId: `ctx-${taskId}`,
        kind: 'task',
        status: { state, message: state === 'input-required' ? reply : undefined, timestamp: new Date().toISOString() },
        artifacts: [
          { artifactId: `art-${taskId}`, name: 'answer', parts: [{ kind: 'text', text }] },
        ],
        history: message ? [message, reply] : [reply],
      });
    }

    case 'agent/getAuthenticatedExtendedCard':
    case 'agent/card':
      return rpcResult(id, { url: 'https://www.typematchup.org/.well-known/agent-card.json' });

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
  const payload = handle((body ?? {}) as JsonRpc);
  return Response.json(payload, { status: 200, headers: { 'cache-control': 'no-store' } });
}

export async function GET() {
  return Response.json(
    {
      name: 'TypeMatchup Pokemon Type Calculator',
      version: SERVER_VERSION,
      card: 'https://www.typematchup.org/.well-known/agent-card.json',
      methods: ['message/send'],
      note: 'Send A2A JSON-RPC 2.0 requests via POST.',
    },
    { status: 200 },
  );
}
