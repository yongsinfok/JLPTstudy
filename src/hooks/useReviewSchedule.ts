import { useState, useEffect } from 'react';
import { db } from '@/db/schema';
import type { GrammarPoint } from '@/types';
import { getTodayString } from '@/utils/dateHelper';

export function useReviewSchedule() {
  const [dueGrammarIds, setDueGrammarIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDueReviews = async () => {
    try {
      const today = getTodayString();

      // Get learned grammar points from user progress
      const progress = await db.userProgress.get('user_progress');
      const learnedGrammar = progress?.learnedGrammar || [];

      // Filter for grammar points that are due for review
      const dueIds = learnedGrammar
        .filter((item) => {
          const nextReviewDate = new Date(item.nextReviewDate);
          const reviewDateStr = nextReviewDate.toISOString().split('T')[0];
          return reviewDateStr <= today;
        })
        .map((item) => item.grammarId);

      setDueGrammarIds(dueIds);
    } catch (error) {
      console.error('Failed to load due reviews:', error);
      setDueGrammarIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const completeReview = async (_grammarId: string, _wasCorrect: boolean) => {
    try {
      // In a full implementation, this would update the review schedule
      // For now, we just reload due reviews
      await loadDueReviews();
    } catch (error) {
      console.error('Failed to complete review:', error);
    }
  };

  const getDueGrammarDetails = async (): Promise<GrammarPoint[]> => {
    try {
      const grammarPoints: GrammarPoint[] = [];
      for (const id of dueGrammarIds) {
        const point = await db.grammarPoints.get(id);
        if (point) {
          grammarPoints.push(point);
        }
      }
      return grammarPoints;
    } catch (error) {
      console.error('Failed to get due grammar details:', error);
      return [];
    }
  };

  useEffect(() => {
    loadDueReviews();
  }, []);

  return {
    dueGrammarIds,
    isLoading,
    loadDueReviews,
    completeReview,
    getDueGrammarDetails,
  };
}
