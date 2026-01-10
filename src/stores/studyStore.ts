import { create } from 'zustand';
import type { Sentence, Lesson, GrammarPoint } from '@/types';
import {
  getLessonById,
  getSentencesByGrammarPoint,
  markSentenceAsLearned,
  markGrammarAsLearned,
  unlockNextLesson,
  markLessonAsCompleted,
  calculateGrammarCompletion,
  calculateLessonCompletion,
} from '@/db/operations';

interface StudyStore {
  currentLesson: Lesson | null;
  currentGrammar: GrammarPoint | null;
  sentences: Sentence[];
  currentSentenceIndex: number;
  currentSentence: Sentence | null;
  showFurigana: boolean;
  showTranslation: boolean;
  showAnalysis: boolean;
  isLoading: boolean;
  loadLesson: (lessonId: number) => Promise<void>;
  loadGrammar: (grammarId: string) => Promise<void>;
  nextSentence: () => void;
  prevSentence: () => void;
  markAsLearned: (sentenceId: string) => Promise<void>;
  toggleFurigana: () => void;
  toggleTranslation: () => void;
  toggleAnalysis: () => void;
  reset: () => void;
  goToSentence: (index: number) => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  currentLesson: null,
  currentGrammar: null,
  sentences: [],
  currentSentenceIndex: 0,
  currentSentence: null,
  showFurigana: false,
  showTranslation: false,
  showAnalysis: false,
  isLoading: false,

  loadLesson: async (lessonId: number) => {
    set({ isLoading: true });
    try {
      const lesson = await getLessonById(lessonId);
      set({ currentLesson: lesson || null, isLoading: false });
    } catch (error) {
      console.error('Failed to load lesson:', error);
      set({ isLoading: false });
    }
  },

  loadGrammar: async (grammarId: string) => {
    set({ isLoading: true });
    try {
      const sentences = await getSentencesByGrammarPoint(grammarId);
      set({
        sentences,
        currentSentenceIndex: 0,
        currentSentence: sentences[0] || null,
        currentGrammar: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load grammar point:', error);
      set({ isLoading: false });
    }
  },

  nextSentence: () => {
    const { sentences, currentSentenceIndex } = get();
    if (currentSentenceIndex < sentences.length - 1) {
      const newIndex = currentSentenceIndex + 1;
      set({
        currentSentenceIndex: newIndex,
        currentSentence: sentences[newIndex],
      });
    }
  },

  prevSentence: () => {
    const { currentSentenceIndex } = get();
    if (currentSentenceIndex > 0) {
      const newIndex = currentSentenceIndex - 1;
      set({
        currentSentenceIndex: newIndex,
        currentSentence: get().sentences[newIndex],
      });
    }
  },

  goToSentence: (index: number) => {
    const { sentences } = get();
    if (index >= 0 && index < sentences.length) {
      set({
        currentSentenceIndex: index,
        currentSentence: sentences[index],
      });
    }
  },

  markAsLearned: async (sentenceId: string) => {
    try {
      await markSentenceAsLearned(sentenceId);
      const { currentLesson, currentGrammar } = get();
      if (currentGrammar) {
        const completion = await calculateGrammarCompletion(currentGrammar.id);
        if (completion >= 100) {
          await markGrammarAsLearned(currentGrammar.id);
          if (currentLesson) {
            const lessonCompletion = await calculateLessonCompletion(currentLesson.id);
            if (lessonCompletion >= 100) {
              await markLessonAsCompleted(currentLesson.id);
              await unlockNextLesson(currentLesson.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to mark as learned:', error);
    }
  },

  toggleFurigana: () => set(state => ({ showFurigana: !state.showFurigana })),
  toggleTranslation: () => set(state => ({ showTranslation: !state.showTranslation })),
  toggleAnalysis: () => set(state => ({ showAnalysis: !state.showAnalysis })),

  reset: () => set({
    currentLesson: null,
    currentGrammar: null,
    sentences: [],
    currentSentenceIndex: 0,
    currentSentence: null,
    showFurigana: false,
    showTranslation: false,
    showAnalysis: false,
    isLoading: false,
  }),
}));
