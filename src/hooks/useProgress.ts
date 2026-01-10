import { useState, useEffect } from 'react';
import { db } from '@/db/schema';
import type { UserProgress } from '@/types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = async () => {
    try {
      const data = await db.userProgress.get('user_progress');
      setProgress(data || null);
    } catch (error) {
      console.error('Failed to load progress:', error);
      setProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    try {
      const currentProgress = await db.userProgress.get('user_progress');
      const updatedData = { ...currentProgress, ...updates } as UserProgress;
      await db.userProgress.put(updatedData, 'user_progress');
      setProgress(updatedData);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const getOverallProgress = () => {
    if (!progress) {
      return { lessons: 0, grammar: 0, sentences: 0 };
    }

    const totalLessons = 50;
    const totalGrammar = 200;
    const totalSentences = 1000;

    const lessons = (progress.completedLessons.length / totalLessons) * 100;
    const grammar = (progress.learnedGrammar.length / totalGrammar) * 100;
    const sentences = (progress.learnedSentences.length / totalSentences) * 100;

    return { lessons, grammar, sentences };
  };

  const getTodayGoal = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const goal = await db.dailyGoals.where('date').equals(new Date(today)).first();
      return goal || null;
    } catch (error) {
      console.error('Failed to get today goal:', error);
      return null;
    }
  };

  const updateTodayGoal = async (updates: { completedSentences?: number; completedGrammarPoints?: number }) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingGoal = await db.dailyGoals.where('date').equals(new Date(today)).first();

      if (existingGoal) {
        const updatedGoal = { ...existingGoal, ...updates };
        await db.dailyGoals.put(updatedGoal);
      } else {
        // Create new goal with default targets
        const newGoal = {
          id: crypto.randomUUID(),
          date: new Date(),
          targetSentences: 10,
          targetGrammarPoints: 2,
          completedSentences: updates.completedSentences || 0,
          completedGrammarPoints: updates.completedGrammarPoints || 0,
          studyTime: 0,
          isCompleted: false,
        };
        await db.dailyGoals.add(newGoal);
      }
    } catch (error) {
      console.error('Failed to update today goal:', error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  return {
    progress,
    isLoading,
    loadProgress,
    updateProgress,
    getOverallProgress,
    getTodayGoal,
    updateTodayGoal,
  };
}
