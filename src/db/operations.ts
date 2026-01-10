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
