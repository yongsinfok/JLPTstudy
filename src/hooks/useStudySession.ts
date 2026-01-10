// useStudySession hook - Phase 1 (stub with type definitions)
// Will be implemented in Phase 1

export function useStudySession() {
  return {
    currentSentence: null,
    currentIndex: 0,
    isCompleted: false,
    startSession: async () => {},
    nextSentence: () => {},
    previousSentence: () => {},
    markAsLearned: async () => {},
    endSession: async () => {},
  };
}
