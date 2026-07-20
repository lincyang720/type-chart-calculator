import { Metadata } from 'next';
import TypeQuizClient from './TypeQuizClient';

export const metadata: Metadata = {
  title: 'Pokemon Type Quiz - Test Your Type Matchup Knowledge',
  description: 'Take the Pokemon type quiz to test your knowledge of type matchups, weaknesses, and super-effective attacks. Practice and improve your battle strategy.',
  keywords: 'pokemon type quiz, type matchup quiz, pokemon weakness quiz, type effectiveness quiz',
  openGraph: {
    title: 'Pokemon Type Quiz - Test Your Type Matchup Knowledge',
    description: 'Take the Pokemon type quiz to test your knowledge of type matchups, weaknesses, and super-effective attacks.',
    url: 'https://www.typematchup.org/pokemon/type-quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Type Quiz',
    description: 'Test your Pokemon type matchup knowledge with this interactive quiz.',
  },
  alternates: {
    canonical: '/pokemon/type-quiz',
  },
};

export default function TypeQuizPage() {
  return <TypeQuizClient />;
}
