// Quiz generator for creating practice questions
// Will be expanded in Phase 2

import { db } from '@/db/schema';
import type { QuizQuestion } from '@/types';

export async function generateFillBlankQuestions(
  grammarPoint: string,
  count: number = 3
): Promise<QuizQuestion[]> {
  // Get sentences for this grammar point
  const sentences = await db.sentences
    .where('grammarPoint')
    .equals(grammarPoint)
    .toArray();

  if (sentences.length === 0) return [];

  // Randomly select count sentences
  const selectedSentences = shuffleArray(sentences).slice(0, count);

  // Get similar grammar points as distractors
  const distractors = await getSimilarGrammarPoints(grammarPoint, 3);

  // Generate questions
  return selectedSentences.map(sentence => ({
    id: `quiz_${sentence.id}_${Date.now()}_${Math.random()}`,
    sentenceId: sentence.id,
    sentence: sentence.sentence.replace(grammarPoint, '______'),
    grammarPoint: grammarPoint,
    translation: sentence.translation,
    options: shuffleArray([grammarPoint, ...distractors]),
    correctAnswer: grammarPoint,
    explanation: sentence.grammarExplanation,
  }));
}

async function getSimilarGrammarPoints(
  targetGrammar: string,
  count: number
): Promise<string[]> {
  // Get grammar points from same or nearby lessons as distractors
  const target = await db.grammarPoints.get(targetGrammar);
  if (!target) return [];

  const similar = await db.grammarPoints
    .where('lessonNumber')
    .between(Math.max(1, target.lessonNumber - 2), target.lessonNumber + 2)
    .and(g => g.id !== targetGrammar)
    .limit(count * 3)
    .toArray();

  return shuffleArray(similar.map(g => g.id)).slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
