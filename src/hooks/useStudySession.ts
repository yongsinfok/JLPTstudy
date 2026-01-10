import { useState, useCallback } from 'react';
import { useStudyStore } from '@/stores/studyStore';
import type { Sentence } from '@/types';
import { markSentenceAsLearned } from '@/db/operations';

export function useStudySession() {
  const {
    sentences,
    currentSentence,
    currentSentenceIndex,
    loadGrammar,
    nextSentence: storeNextSentence,
    prevSentence: storePrevSentence,
    markAsLearned: storeMarkAsLearned,
    goToSentence: storeGoToSentence,
    reset,
  } = useStudyStore();

  const [isCompleted, setIsCompleted] = useState(false);

  const startSession = async (grammarId: string) => {
    setIsCompleted(false);
    await loadGrammar(grammarId);
  };

  const nextSentence = () => {
    const newIndex = currentSentenceIndex + 1;
    if (newIndex >= sentences.length) {
      setIsCompleted(true);
    } else {
      storeNextSentence();
    }
  };

  const previousSentence = () => {
    setIsCompleted(false);
    storePrevSentence();
  };

  const markAsLearnedCallback = async (sentenceId: string) => {
    await markSentenceAsLearned(sentenceId);
    await storeMarkAsLearned(sentenceId);
  };

  const endSession = () => {
    reset();
    setIsCompleted(false);
  };

  const goToSentenceCallback = (index: number) => {
    setIsCompleted(false);
    storeGoToSentence(index);
  };

  return {
    currentSentence,
    currentIndex: currentSentenceIndex,
    totalSentences: sentences.length,
    isCompleted,
    startSession,
    nextSentence,
    previousSentence,
    markAsLearned: markAsLearnedCallback,
    endSession,
    goToSentence: goToSentenceCallback,
  };
}
