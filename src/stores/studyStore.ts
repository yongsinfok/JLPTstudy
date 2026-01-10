import { create } from 'zustand';
import type { Sentence, Lesson, GrammarPoint } from '@/types';
import { getLessonById, getSentencesByGrammarPoint } from '@/db/operations';

interface StudyStore {
  currentLesson: Lesson | null;
  currentGrammarPoint: GrammarPoint | null;
  currentSentence: Sentence | null;
  sentenceIndex: number;
  isLoading: boolean;

  setCurrentLesson: (lesson: Lesson | null) => void;
  setCurrentGrammarPoint: (grammar: GrammarPoint | null) => void;
  setCurrentSentence: (sentence: Sentence | null) => void;
  setSentenceIndex: (index: number) => void;
  loadLesson: (lessonId: number) => Promise<void>;
  loadGrammarPoint: (grammarId: string) => Promise<void>;
}

export const useStudyStore = create<StudyStore>((set) => ({
  currentLesson: null,
  currentGrammarPoint: null,
  currentSentence: null,
  sentenceIndex: 0,
  isLoading: false,

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setCurrentGrammarPoint: (grammar) => set({ currentGrammarPoint: grammar }),
  setCurrentSentence: (sentence) => set({ currentSentence: sentence }),
  setSentenceIndex: (index) => set({ sentenceIndex: index }),

  loadLesson: async (lessonId) => {
    set({ isLoading: true });
    try {
      const lesson = await getLessonById(lessonId);
      set({ currentLesson: lesson || null, isLoading: false });
    } catch (error) {
      console.error('Failed to load lesson:', error);
      set({ isLoading: false });
    }
  },

  loadGrammarPoint: async (grammarId) => {
    set({ isLoading: true });
    try {
      const grammar = await getSentencesByGrammarPoint(grammarId);
      if (grammar.length > 0) {
        set({
          currentSentence: grammar[0],
          sentenceIndex: 0,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Failed to load grammar point:', error);
      set({ isLoading: false });
    }
  },
}));
