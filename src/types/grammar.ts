export interface GrammarPoint {
  id: string;
  lessonNumber: number;
  sentenceIds: string[];
  sentenceCount: number;
  grammarConnection: string;
  grammarExplanation: string;
  isLearned: boolean;
}
