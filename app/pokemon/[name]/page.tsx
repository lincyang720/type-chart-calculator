import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateDualTypeWeaknesses } from '@/lib/typeCalculations';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';
import Link from 'next/link';
import { isEditorialPokemon } from '@/lib/editorialPokemon';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getComboSlug(t1: TypeId, t2: TypeId): string {
  const i1 = ALL_TYPES.indexOf(t1);
  const i2 = ALL_TYPES.indexOf(t2);
  return i1 < i2 ? `${t1}-${t2}` : `${t2}-${t1}`;
}

// Pre-generate all pokemon pages at build time
export async function generateStaticParams() {
  return pokemonData.pokemon.map((p) => ({ name: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    return { title: 'Pokemon Not Found' };
  }

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name).join('/');
  const weaknesses = pokemon.types.length === 2
    ? calculateDualTypeWeaknesses(pokemon.types[0] as TypeId, pokemon.types[1] as TypeId)
    : null;

  return {
    title: `${pokemon.name} Weakness & Counters - ${typeNames} Type Guide`,
    description: `${pokemon.name} (${typeNames}) weakness guide. ${pokemon.strategy.slice(0, 120)}. Best counters, moveset, and battle strategy.`,
    keywords: `${pokemon.name} weakness, ${pokemon.name} counters, ${pokemon.name} best moveset, ${pokemon.name} type, ${pokemon.name} strategy`,
    openGraph: {
      title: `${pokemon.name} - Weakness, Counters & Strategy Guide`,
      description: `Complete ${pokemon.name} guide: weaknesses, best counters, recommended moveset, and competitive strategy.`,
      url: `https://www.typematchup.org/pokemon/${pokemon.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pokemon.name} Weakness & Counters`,
      description: `${pokemon.name} (${typeNames}) - weaknesses, counters, and strategy guide.`,
    },
    alternates: {
      canonical: `/pokemon/${pokemon.id}`,
    },
    robots: isEditorialPokemon(pokemon.id)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemon = pokemonData.pokemon.find(p => p.id === name);

  if (!pokemon) {
    notFound();
  }

  const type1 = pokemon.types[0] as TypeId;
  const type2 = pokemon.types.length > 1 ? pokemon.types[1] as TypeId : null;

  const weaknesses = type2
    ? calculateDualTypeWeaknesses(type1, type2)
    : null;

  const typeNames = pokemon.types.map(t => typesData.types.find(td => td.id === t)?.name);
  const relatedPokemon = pokemonData.pokemon
    .filter(candidate =>
      candidate.id !== pokemon.id &&
      candidate.types.some(candidateType => pokemon.types.includes(candidateType))
    )
    .slice(0, 3);

  // Build FAQ data for JSON-LD
  const faqItems = [
    {
      '@type': 'Question' as const,
      name: `What is ${pokemon.name} weak to?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: weaknesses
          ? `${pokemon.name} (${typeNames.join('/')}) is ${weaknesses.quadrupleWeak.length > 0 ? `4× weak to ${weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')} and ` : ''}weak to ${weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.`
          : `${pokemon.name} is a ${typeNames[0]} type. Check the type page for detailed matchups.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `What is the best moveset for ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `The recommended moveset for ${pokemon.name} is: ${pokemon.recommendedMoves.join(', ')}. ${pokemon.strategy}`,
      },
    },
    {
      '@type': 'Question' as const,
      name: `How to counter ${pokemon.name}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `Best counters for ${pokemon.name}: ${pokemon.counters.join(', ')}.`,
      },
    },
  ];

  const statTotal = pokemon.baseStats.hp + pokemon.baseStats.attack + pokemon.baseStats.defense +
    pokemon.baseStats.spAtk + pokemon.baseStats.spDef + pokemon.baseStats.speed;
  const maxStat = Math.max(pokemon.baseStats.hp, pokemon.baseStats.attack, pokemon.baseStats.defense,
    pokemon.baseStats.spAtk, pokemon.baseStats.spDef, pokemon.baseStats.speed);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems,
          }),
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/pokemon" className="hover:text-blue-600">Pokemon</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{pokemon.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {pokemon.name}
            </span>
          </h1>
          <div className="flex items-center gap-3 mb-4">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`}>
                <TypeBadge typeId={t as TypeId} size="lg" clickable />
              </Link>
            ))}
            <span className="text-sm text-gray-500 ml-2">Gen {pokemon.generation} · {pokemon.category}</span>
          </div>
          <p className="text-lg text-gray-600">{pokemon.strengths}</p>
        </div>

        {/* Type Weaknesses */}
        {weaknesses && (
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Type Weaknesses & Resistances</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-red-600 mb-3">⚠️ Weaknesses</h3>
                {weaknesses.quadrupleWeak.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-red-700 block mb-1">4× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleWeak.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-red-600 block mb-1">2× Super Effective:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleWeak.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-3">✓ Resistances</h3>
                {weaknesses.quadrupleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-700 block mb-1">¼× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.quadrupleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.doubleResist.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-600 block mb-1">½× Resistant:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.doubleResist.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.immune.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">0× Immune:</span>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.immune.map(t => (
                        <Link key={t} href={`/types/${t}`}><TypeBadge typeId={t} size="sm" clickable /></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type2 && (
              <div className="mt-4 text-center">
                <Link href={`/types/${getComboSlug(type1, type2)}`} className="text-blue-600 hover:underline text-sm">
                  View full {typeNames.join('/')} type matchup →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Base Stats */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Base Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'HP', value: pokemon.baseStats.hp, color: 'bg-green-500' },
              { label: 'Attack', value: pokemon.baseStats.attack, color: 'bg-red-500' },
              { label: 'Defense', value: pokemon.baseStats.defense, color: 'bg-orange-500' },
              { label: 'Sp. Atk', value: pokemon.baseStats.spAtk, color: 'bg-blue-500' },
              { label: 'Sp. Def', value: pokemon.baseStats.spDef, color: 'bg-purple-500' },
              { label: 'Speed', value: pokemon.baseStats.speed, color: 'bg-pink-500' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-600">{stat.label}</span>
                <span className="w-10 text-sm font-bold text-right">{stat.value}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`${stat.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(stat.value / 255) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t">
              <span className="w-16 text-sm font-bold text-gray-800">Total</span>
              <span className="w-10 text-sm font-bold text-right">{statTotal}</span>
            </div>
          </div>
        </section>

        {/* Recommended Moveset */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Moveset</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {pokemon.recommendedMoves.map(move => (
              <div key={move} className="bg-gray-50 rounded-lg p-3 text-center font-medium">
                {move}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(ability => (
                <span key={ability} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Strategy */}
        {pokemon.id === 'ferrothorn' && (
          <article className="bg-white rounded-lg shadow-lg p-6 mb-8 prose max-w-none text-gray-700">
            <h2>How to Use Ferrothorn: Complete Battle Guide</h2>
            <p>
              Ferrothorn is a defensive Grass/Steel Pokémon whose value comes from role compression. It can set entry
              hazards, drain opponents with Leech Seed, punish contact through Iron Barbs, and threaten meaningful damage
              without investing heavily in Speed. Its 131 base Defense and 116 Special Defense let it check attacks from
              both sides, but 74 HP means those defenses are not unlimited. Ferrothorn works best when it enters on a
              resisted move, advances the team&apos;s position, and leaves before the opponent turns its Fire weakness into
              a free knockout. It is a support Pokémon with offensive consequences, not a wall that should remain in
              against every neutral attack.
            </p>

            <h3>Understanding the Grass/Steel matchup</h3>
            <p>
              Grass/Steel gives Ferrothorn a 4× Fire weakness and a 2× Fighting weakness. Fire is the emergency: even
              modest coverage such as Flamethrower, Mystical Fire, Fire Punch, or Tera Blast can overwhelm it. Fighting
              attacks are less catastrophic but still demand a reliable switch. In exchange, Ferrothorn resists Normal,
              Water, Electric, Psychic, Rock, Dragon, Steel, and Fairy, double-resists Grass, and is immune to Poison.
              Those resistances create entries against many Water- and Electric-type attacks, but abilities and move
              effects still matter. Freeze-Dry, Knock Off, Trick, Taunt, and boosted neutral attacks can punish a switch
              even when the simple type multiplier looks favorable.
            </p>

            <h3>Moves, item choices, and ability</h3>
            <p>
              Stealth Rock or Spikes gives every forced switch lasting value. Leech Seed supplies gradual recovery and
              makes passive opponents choose between losing health and switching through hazards. Power Whip prevents
              Water- and Ground-type Pokémon from treating Ferrothorn as harmless, while Gyro Ball uses its extremely low
              Speed to pressure fast targets. Protect can scout a coverage move and collect another turn of recovery;
              Knock Off removes Boots, Leftovers, or a Choice item. Leftovers improves longevity, whereas Rocky Helmet
              stacks with Iron Barbs to punish contact. Anticipation can reveal dangerous coverage, but Iron Barbs is
              usually the defining ability because it converts physical contact into reliable chip damage.
            </p>

            <h3>Positioning and common mistakes</h3>
            <p>
              Bring Ferrothorn in through a slow pivot, after a teammate faints, or against an attack it comfortably
              resists. On the first safe turn, decide whether hazards, Leech Seed, direct damage, or an immediate switch
              creates the most progress. Automatically setting hazards is a mistake if a Fire attacker can enter for free
              and force the whole team backward. Another mistake is allowing Ferrothorn&apos;s item to be removed too early
              when it is the only long-term answer to a Water attacker. Preserve enough health for the matchup it was
              selected to handle, and remember that Leech Seed is not dependable recovery against Grass targets, Magic
              Guard users, or opponents that can repeatedly force it out.
            </p>

            <h3>Team partners and defensive cores</h3>
            <p>
              Ferrothorn needs teammates that can repeatedly absorb Fire and Fighting attacks. Bulky Water-types are
              natural Fire answers, while Ghost, Fairy, Flying, or Poison partners can help against Fighting depending on
              the format. A Fire-resistant partner that is also weak to Electric or Grass forms a productive exchange:
              Ferrothorn covers those attacks and receives Fire protection in return. Hazard removal is still valuable
              because Ferrothorn may pivot frequently and lacks instant recovery. Avoid building a core where every Fire
              answer is vulnerable to the same Ground or Rock coverage. Check all six team members in the Team Calculator
              and identify a real switch-in rather than counting only the number of resistances.
            </p>

            <h3>How to counter Ferrothorn</h3>
            <p>
              Fire coverage is the fastest answer, especially when delivered by a Pokémon that does not fear Power Whip
              or Gyro Ball. Fighting attacks also work, but contact moves may take Iron Barbs and Rocky Helmet damage.
              Taunt blocks hazards, Leech Seed, and Protect; Trick can lock Ferrothorn into one move; Knock Off removes
              its recovery or contact-punishing item. Substitute users may exploit a passive set if its attacking move
              cannot break the substitute. Pressure it with hazards and repeated forced switches when direct coverage is
              unavailable. Always verify the ruleset: Terastallization can remove the usual weaknesses, and different
              generations or competitive formats may change available moves, items, and legal teammates.
            </p>
          </article>
        )}

        <section className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Competitive Strategy</h2>
          <p className="text-gray-700 leading-relaxed">{pokemon.strategy}</p>
        </section>

        {/* Counters */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Best Counters</h2>
          <ul className="space-y-2">
            {pokemon.counters.map(counter => (
              <li key={counter} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-700">{counter}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is {pokemon.name} weak to?</h3>
              <p className="text-gray-700">
                {weaknesses && weaknesses.quadrupleWeak.length > 0 && (
                  <>{pokemon.name} is 4× weak to {weaknesses.quadrupleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}. </>
                )}
                {weaknesses && weaknesses.doubleWeak.length > 0 && (
                  <>{pokemon.name} is 2× weak to {weaknesses.doubleWeak.map(t => typesData.types.find(td => td.id === t)?.name).join(', ')}.</>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is the best moveset for {pokemon.name}?</h3>
              <p className="text-gray-700">
                The recommended moveset is: {pokemon.recommendedMoves.join(', ')}.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How to counter {pokemon.name}?</h3>
              <p className="text-gray-700">
                Best counters: {pokemon.counters.join(', ')}.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Explore More</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {pokemon.types.map(t => (
              <Link key={t} href={`/types/${t}`} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm">
                {typesData.types.find(td => td.id === t)?.name} Type Guide
              </Link>
            ))}
            <Link href="/calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
              Type Calculator
            </Link>
            <Link href="/pokemon/team-calculator" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center text-sm">
              Team Calculator
            </Link>
            {relatedPokemon.map(related => (
              <Link
                key={related.id}
                href={`/pokemon/${related.id}`}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm"
              >
                {related.name} Weakness Guide
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
