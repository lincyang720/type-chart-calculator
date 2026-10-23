'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import typesData from '@/data/types.json';
import pokemonData from '@/data/pokemon.json';
import { calculateDualTypeWeaknesses, calculateMultiplier } from '@/lib/typeCalculations';
import { TypeId } from '@/lib/types';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const TYPE_NAMES = Object.fromEntries(typesData.types.map((type) => [type.id, type.name])) as Record<TypeId, string>;

function listTypes(ids: TypeId[]) {
  return ids.map((id) => TYPE_NAMES[id]).join(', ') || 'none';
}

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findPokemon(text: string) {
  const query = normalise(text);
  return pokemonData.pokemon.find((pokemon) => normalise(pokemon.name) === query)
    ?? pokemonData.pokemon.find((pokemon) => query.includes(normalise(pokemon.name)));
}

function findTypes(text: string) {
  const normalised = ` ${text.toLowerCase().replace(/[^a-z]+/g, ' ')} `;
  return ALL_TYPES
    .map((id) => ({ id, at: normalised.indexOf(` ${id} `) }))
    .filter((item) => item.at >= 0)
    .sort((a, b) => a.at - b.at)
    .map((item) => item.id);
}

function getAnswer(text: string) {
  const pokemon = findPokemon(text);
  const mentionedTypes = findTypes(text);
  const defendingTypes = pokemon ? pokemon.types.slice(0, 2) as TypeId[] : mentionedTypes.slice(0, 2);

  if (defendingTypes.length === 0) {
    return { kind: 'empty' as const, text: 'Ask about a Pokémon or one/two defending types. Examples: “What is Charizard weak to?” or “What beats Water/Flying?”' };
  }

  const offensiveQuestion = /strong against|super effective|what does .* beat|what is .* good against/i.test(text);
  if (offensiveQuestion && !pokemon && mentionedTypes.length === 1) {
    const attackingType = mentionedTypes[0];
    const targets = ALL_TYPES.filter((target) => calculateMultiplier(attackingType, [target]) === 2);
    return {
      kind: 'answer' as const,
      text: `${TYPE_NAMES[attackingType]}-type moves are super effective against ${listTypes(targets)}.`,
      link: `/types/${attackingType}`,
      linkText: `Open the ${TYPE_NAMES[attackingType]} type guide →`,
    };
  }

  const weaknesses = calculateDualTypeWeaknesses(defendingTypes[0], defendingTypes[1]);
  const targetLabel = pokemon ? `${pokemon.name} (${listTypes(defendingTypes)})` : listTypes(defendingTypes);
  const parts = [
    `${targetLabel} is weak to ${listTypes([...weaknesses.quadrupleWeak, ...weaknesses.doubleWeak])}`,
    weaknesses.immune.length > 0 ? `immune to ${listTypes(weaknesses.immune)}` : '',
    weaknesses.doubleResist.length > 0 || weaknesses.quadrupleResist.length > 0
      ? `resists ${listTypes([...weaknesses.doubleResist, ...weaknesses.quadrupleResist])}` : '',
  ].filter(Boolean);

  return {
    kind: 'answer' as const,
    text: `${parts.join('; ')}.`,
    link: pokemon ? `/pokemon/${pokemon.id}` : `/types/${defendingTypes.join('-')}`,
    linkText: `Open the ${targetLabel} matchup page →`,
  };
}

function trackAssistantEvent(name: string, params: Record<string, string>) {
  const analyticsWindow = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.gtag?.('event', name, params);
}

function classifyQuestion(text: string) {
  const pokemon = findPokemon(text);
  if (pokemon) return 'pokemon';
  if (/strong against|super effective|what does .* beat|what is .* good against/i.test(text)) return 'offensive_type';
  if (findTypes(text).length > 1) return 'dual_type';
  if (findTypes(text).length === 1) return 'single_type';
  return 'unresolved';
}

export default function TypeMatchupAssistant() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState('What is Charizard weak to?');
  const answer = useMemo(() => getAnswer(submitted), [submitted]);

  useEffect(() => {
    const requestedQuestion = new URLSearchParams(window.location.search).get('question');
    if (requestedQuestion?.trim()) {
      const cleanQuestion = requestedQuestion.trim();
      setQuestion(cleanQuestion);
      setSubmitted(cleanQuestion);
    }
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim()) {
      const cleanQuestion = question.trim();
      setSubmitted(cleanQuestion);
      trackAssistantEvent('assistant_question', { question_type: classifyQuestion(cleanQuestion) });
    }
  };

  const askExample = (example: string) => {
    setQuestion(example);
    setSubmitted(example);
    trackAssistantEvent('assistant_question', { question_type: classifyQuestion(example) });
  };

  return (
    <section className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-5 shadow-sm sm:p-7" aria-labelledby="type-matchup-assistant-title">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-700">Restricted AI assistant</p>
        <h2 id="type-matchup-assistant-title" className="mt-1 text-2xl font-bold text-gray-900">Ask about a Pokémon matchup</h2>
        <p className="mt-2 text-gray-700">Answers are calculated from TypeMatchup&apos;s type chart and Pokémon data. It does not invent moves, abilities, or battle advice.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="matchup-question">Your matchup question</label>
        <input id="matchup-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What is Charizard weak to?" className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none ring-purple-500 focus:ring-2" />
        <button type="submit" className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800">Ask</button>
      </form>
      <div className="mt-5 rounded-lg border border-white bg-white/80 p-4" aria-live="polite">
        <p className="text-sm font-semibold text-gray-600">Answer</p>
        <p className="mt-1 text-lg text-gray-900">{answer.text}</p>
        {answer.kind === 'answer' && answer.link && <Link href={answer.link} onClick={() => trackAssistantEvent('assistant_result_click', { destination_type: answer.link?.startsWith('/pokemon/') ? 'pokemon' : 'type' })} className="mt-3 inline-block font-semibold text-blue-700 hover:underline">{answer.linkText}</Link>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {['What beats Water/Flying?', 'What is Pikachu weak to?', 'What is Fire strong against?'].map((example) => (
          <button key={example} type="button" onClick={() => askExample(example)} className="min-h-10 rounded-full border border-purple-200 bg-white px-3 py-1.5 text-purple-800 hover:bg-purple-100">{example}</button>
        ))}
      </div>
    </section>
  );
}
