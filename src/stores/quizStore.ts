import { create } from 'zustand';
import type { QuizQuestion, ExerciseRecord } from '@/types';

interface QuizStore {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, string>;
  isCompleted: boolean;
  score: number;

  setQuestions: (questions: QuizQuestion[]) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: (score: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: new Map(),
  isCompleted: false,
  score: 0,

  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0, answers: new Map(), isCompleted: false, score: 0 }),

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) => {
    const answers = new Map(get().answers);
    answers.set(questionId, answer);
    set({ answers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  completeQuiz: (score) => set({ isCompleted: true, score }),

  resetQuiz: () => set({
    questions: [],
    currentQuestionIndex: 0,
    answers: new Map(),
    isCompleted: false,
    score: 0
  }),
}));
