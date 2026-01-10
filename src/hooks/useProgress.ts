import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '@/types';
import { getUserProgress } from '@/db/operations';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await getUserProgress();
      setProgress(p || null);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const getOverallProgress = useCallback(() => {
    if (!progress) return { lessons: 0, grammar: 0, sentences: 0 };

    // Mock calculations or simple counts based on progress
    return {
      lessons: Math.min(100, Math.round((progress.completedLessons.length / 50) * 100)),
      grammar: Math.min(100, Math.round((progress.learnedGrammar.length / 200) * 100)),
      sentences: Math.min(100, Math.round((progress.learnedSentences.length / 1000) * 100)),
    };
  }, [progress]);

  return {
    progress,
    isLoading,
    loadProgress,
    getOverallProgress,
  };
}
