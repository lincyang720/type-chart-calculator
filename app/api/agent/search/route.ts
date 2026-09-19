import pokemonData from '@/data/pokemon.json';

interface RawPokemon {
  id: string;
  name: string;
  types: string[];
  generation: number;
  category?: string;
  baseStats?: Record<string, number>;
  abilities?: string[];
}

const ALL = (pokemonData as { pokemon: RawPokemon[] }).pokemon;

// Must stay dynamic: the response depends on the query string. 'force-static'
// would prerender it and bake away the request, dropping ?q entirely.
export const dynamic = 'force-dynamic';

/**
 * Public, read-only Pokemon directory search.
 * GET /api/agent/search?q=charizard[&type=fire][&limit=10]
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  const typeFilter = (url.searchParams.get('type') || '').trim().toLowerCase();
  const limitRaw = Number.parseInt(url.searchParams.get('limit') || '10', 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 10;

  if (!q && !typeFilter) {
    return Response.json(
      { error: 'missing_query', message: 'Pass ?q=<name fragment> and/or ?type=<type id>.' },
      { status: 400 },
    );
  }

  const results = ALL.filter((p) => {
    const nameOk = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const typeOk = !typeFilter || p.types.includes(typeFilter);
    return nameOk && typeOk;
  })
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      types: p.types,
      generation: p.generation,
      url: `https://www.typematchup.org/pokemon/${p.id}`,
    }));

  return Response.json(
    { query: q || null, type: typeFilter || null, count: results.length, results },
    { status: 200, headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
  );
}
