// Database operations helper functions
// Will be expanded in later phases

import { db } from './schema';
import type { Sentence, Lesson, GrammarPoint, UserProgress } from '@/types';

export async function getAllSentences(): Promise<Sentence[]> {
  return await db.sentences.toArray();
}

export async function getSentenceById(id: string): Promise<Sentence | undefined> {
  return await db.sentences.get(id);
}

export async function getSentencesByLesson(lessonNumber: number): Promise<Sentence[]> {
  return await db.sentences.where('lessonNumber').equals(lessonNumber).toArray();
}

export async function getSentencesByGrammarPoint(grammarPoint: string): Promise<Sentence[]> {
  return await db.sentences.where('grammarPoint').equals(grammarPoint).toArray();
}

export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.toArray();
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  return await db.lessons.get(id);
}

export async function getAllGrammarPoints(): Promise<GrammarPoint[]> {
  return await db.grammarPoints.toArray();
}

export async function getGrammarPointById(id: string): Promise<GrammarPoint | undefined> {
  return await db.grammarPoints.get(id);
}

export async function getUserProgress(): Promise<UserProgress | undefined> {
  return await db.userProgress.get('user_progress');
}

export async function updateUserProgress(updates: Partial<UserProgress>): Promise<void> {
  await db.userProgress.put({ id: 'user_progress', ...updates } as UserProgress);
}

// Lesson related operations
export async function updateLesson(id: number, updates: Partial<Lesson>): Promise<void> {
  await db.lessons.update(id, updates);
}

// Grammar point related operations
export async function getGrammarPointsByLesson(lessonId: number): Promise<GrammarPoint[]> {
  return await db.grammarPoints.where('lessonNumber').equals(lessonId).toArray();
}

export async function updateGrammarPoint(id: string, updates: Partial<GrammarPoint>): Promise<void> {
  await db.grammarPoints.update(id, updates);
}

// User learning progress operations
export async function markSentenceAsLearned(sentenceId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) {
    await db.userProgress.put({
      id: 'user_progress',
      currentLessonId: 1,
      currentGrammarPoint: '',
      learnedSentences: [sentenceId],
      learnedGrammar: [],
      completedLessons: [],
      totalStudyTime: 0,
      studyStreak: 0,
      lastStudyDate: new Date(),
    } as UserProgress);
    return;
  }

  if (!progress.learnedSentences.includes(sentenceId)) {
    progress.learnedSentences.push(sentenceId);
    await updateUserProgress({ learnedSentences: progress.learnedSentences });
  }
}

export async function markGrammarAsLearned(grammarId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  const existing = progress.learnedGrammar.find(g => g.grammarId === grammarId);
  if (!existing) {
    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    progress.learnedGrammar.push({
      grammarId,
      firstLearnedDate: now,
      lastReviewedDate: now,
      nextReviewDate: nextReview,
      reviewCount: 0,
      masteryLevel: 1,
    });

    await updateUserProgress({ learnedGrammar: progress.learnedGrammar });
  }

  await updateGrammarPoint(grammarId, { isLearned: true });
}

export async function markLessonAsCompleted(lessonId: number): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    await updateUserProgress({ completedLessons: progress.completedLessons });
  }

  await updateLesson(lessonId, { isCompleted: true });
}

export async function unlockNextLesson(currentLessonId: number): Promise<void> {
  const nextLesson = await db.lessons.get(currentLessonId + 1);
  if (nextLesson && !nextLesson.isUnlocked) {
    await updateLesson(currentLessonId + 1, { isUnlocked: true });
  }
}

export async function calculateLessonCompletion(lessonId: number): Promise<number> {
  const lesson = await getLessonById(lessonId);
  const progress = await getUserProgress();

  if (!lesson || !progress) return 0;

  const sentences = await getSentencesByLesson(lessonId);
  if (sentences.length === 0) return 0;

  const learnedCount = sentences.filter(s => progress.learnedSentences.includes(s.id)).length;
  return Math.round((learnedCount / sentences.length) * 100);
}

export async function calculateGrammarCompletion(grammarId: string): Promise<number> {
  const grammar = await getGrammarPointById(grammarId);
  const progress = await getUserProgress();

  if (!grammar || !progress) return 0;

  if (grammar.sentenceIds.length === 0) return 0;

  const learnedCount = grammar.sentenceIds.filter(id => progress.learnedSentences.includes(id)).length;
  return Math.round((learnedCount / grammar.sentenceIds.length) * 100);
}
