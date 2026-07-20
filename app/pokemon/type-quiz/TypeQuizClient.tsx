'use client';

import { useState, useCallback } from 'react';
import TypeBadge from '@/components/TypeBadge';
import { TypeId } from '@/lib/types';
import { calculateMultiplier } from '@/lib/typeCalculations';
import Link from 'next/link';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function getRandomType(): TypeId {
  return ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
}

function getSuperEffectiveTypes(defendingType: TypeId): TypeId[] {
  return ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) >= 2);
}

function getNonSuperEffectiveTypes(defendingType: TypeId): TypeId[] {
  return ALL_TYPES.filter(attackingType => calculateMultiplier(attackingType, [defendingType]) < 2);
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateQuestion() {
  const defendingType = getRandomType();
  const correctPool = getSuperEffectiveTypes(defendingType);

  // Ensure the question has at least one correct answer
  if (correctPool.length === 0) {
    return generateQuestion();
  }

  const correctAnswer = correctPool[Math.floor(Math.random() * correctPool.length)];
  const distractorPool = getNonSuperEffectiveTypes(defendingType);
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);

  return {
    defendingType,
    correctAnswer,
    options,
  };
}

export default function TypeQuizPage() {
  const [question, setQuestion] = useState(() => generateQuestion());
  const [selected, setSelected] = useState<TypeId | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const handleAnswer = useCallback((answer: TypeId) => {
    if (selected) return;

    setSelected(answer);
    setTotal(prev => prev + 1);

    if (answer === question.correctAnswer) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  }, [selected, question.correctAnswer]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelected(null);
  }, []);

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pokemon Type Quiz
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Test your type matchup knowledge. Which attacking type is super effective against the defending type?
        </p>

        {/* Scoreboard */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-2xl font-bold text-blue-600">{score}/{total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-500">Streak</p>
            <p className="text-2xl font-bold text-purple-600">{streak}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-500">Best</p>
            <p className="text-2xl font-bold text-green-600">{bestStreak}</p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-center">
          <p className="text-gray-600 mb-4">Which type is super effective against:</p>
          <div className="flex justify-center mb-8">
            <TypeBadge typeId={question.defendingType} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map(option => {
              let buttonClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-transparent';
              if (selected) {
                if (option === question.correctAnswer) {
                  buttonClass = 'bg-green-500 text-white border-2 border-green-500';
                } else if (option === selected) {
                  buttonClass = 'bg-red-500 text-white border-2 border-red-500';
                } else {
                  buttonClass = 'bg-gray-100 text-gray-400 border-2 border-transparent';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selected}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-colors ${buttonClass}`}
                >
                  <TypeBadge typeId={option} size="sm" />
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-6">
              <p className={`text-lg font-semibold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Correct! 🎉' : `Wrong! The correct answer was ${question.correctAnswer.charAt(0).toUpperCase() + question.correctAnswer.slice(1)}.`}
              </p>
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <section className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Study Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Memorize the classic starters: Water beats Fire, Fire beats Grass, Grass beats Water.</li>
            <li>Ghost and Dark are super effective against each other.</li>
            <li>Steel resists many types but is weak to Fire, Fighting, and Ground.</li>
            <li>Ground is immune to Electric, and Electric is immune to Ground? No — Electric is weak to Ground!</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Back to Type Matchup Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
