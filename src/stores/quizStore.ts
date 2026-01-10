import { create } from 'zustand';
import type { QuizQuestion } from '@/types';

interface ScoreResult {
  correct: number;
  total: number;
  percentage: number;
}

interface GrammarResult {
  correct: number;
  total: number;
}

interface QuizStore {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, string>;
  userAnswers: Map<string, string>;
  isCompleted: boolean;
  score: number;
  startTime: number;
  endTime: number;

  setQuestions: (questions: QuizQuestion[]) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: (score: number) => void;
  resetQuiz: () => void;
  getScore: () => ScoreResult;
  getTimeSpent: () => number;
  getResultsByGrammar: () => Map<string, GrammarResult>;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: new Map(),
  userAnswers: new Map(),
  isCompleted: false,
  score: 0,
  startTime: 0,
  endTime: 0,

  setQuestions: (questions) => set({
    questions,
    currentQuestionIndex: 0,
    answers: new Map(),
    userAnswers: new Map(),
    isCompleted: false,
    score: 0,
    startTime: Date.now(),
    endTime: 0,
  }),

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) => {
    const answers = new Map(get().answers);
    const userAnswers = new Map(get().userAnswers);
    answers.set(questionId, answer);
    userAnswers.set(questionId, answer);
    set({ answers, userAnswers });
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

  completeQuiz: (score) => set({ isCompleted: true, score, endTime: Date.now() }),

  resetQuiz: () => set({
    questions: [],
    currentQuestionIndex: 0,
    answers: new Map(),
    userAnswers: new Map(),
    isCompleted: false,
    score: 0,
    startTime: 0,
    endTime: 0,
  }),

  getScore: () => {
    const { questions, userAnswers } = get();
    const total = questions.length;
    const correct = questions.filter(q => userAnswers.get(q.id) === q.correctAnswer).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  },

  getTimeSpent: () => {
    const { startTime, endTime, isCompleted } = get();
    if (startTime === 0) return 0;
    const end = isCompleted && endTime > 0 ? endTime : Date.now();
    return Math.floor((end - startTime) / 1000);
  },

  getResultsByGrammar: () => {
    const { questions, userAnswers } = get();
    const results = new Map<string, GrammarResult>();

    questions.forEach(q => {
      const grammar = q.grammarPoint;
      const existing = results.get(grammar) || { correct: 0, total: 0 };
      existing.total++;
      if (userAnswers.get(q.id) === q.correctAnswer) {
        existing.correct++;
      }
      results.set(grammar, existing);
    });

    return results;
  },
}));
