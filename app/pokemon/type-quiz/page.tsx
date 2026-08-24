import { Metadata } from 'next';
import TypeQuizClient from './TypeQuizClient';

export const metadata: Metadata = {
  title: 'Pokemon Type Quiz - Easy and Hard Type Matchup Questions',
  description: 'Take an easy or hard Pokemon type quiz covering single and dual-type matchups, weaknesses, and super-effective attacks.',
  keywords: 'pokemon type quiz, pokemon type quiz hard, hard pokemon quiz, type matchup quiz, pokemon weakness quiz, type effectiveness quiz',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Pokemon Type Quiz - Easy and Hard Matchup Questions',
    description: 'Test single-type matchups or try Hard mode with dual-type Pokemon weakness questions.',
    url: 'https://www.typematchup.org/pokemon/type-quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Type Quiz - Easy and Hard Modes',
    description: 'Test your Pokemon matchup knowledge with single and dual-type questions.',
  },
  alternates: {
    canonical: '/pokemon/type-quiz',
  },
};

export default function TypeQuizPage() {
  return <TypeQuizClient />;
}
