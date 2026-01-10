// Ebbinghaus forgetting curve review algorithm
// Will be expanded in Phase 3

import type { LearnedGrammar } from '@/types';

export const REVIEW_INTERVALS = [1, 1, 3, 7, 15, 30]; // days

export interface ReviewSchedule {
  nextLevel: number;
  nextReviewDate: Date;
}

export function calculateNextReview(
  currentLevel: number,
  wasCorrect: boolean
): ReviewSchedule {
  // Correct: level + 1 (max 5)
  // Wrong: level - 1 (min 1)
  let nextLevel = wasCorrect
    ? Math.min(currentLevel + 1, 5)
    : Math.max(currentLevel - 1, 1);

  // Calculate review interval based on new level
  const daysToAdd = REVIEW_INTERVALS[nextLevel];

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  nextReviewDate.setHours(0, 0, 0, 0);

  return { nextLevel, nextReviewDate };
}

export function getDueReviews(
  learnedGrammar: LearnedGrammar[]
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return learnedGrammar
    .filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    })
    .map(item => item.grammarId);
}
