// useQuiz hook - Phase 1 (stub with type definitions)
// Will be implemented in Phase 2

export function useQuiz() {
  return {
    questions: [],
    currentQuestion: null,
    currentIndex: 0,
    isCompleted: false,
    score: 0,
    loadQuestions: async () => {},
    submitAnswer: () => {},
    nextQuestion: () => {},
    previousQuestion: () => {},
    completeQuiz: () => {},
  };
}
