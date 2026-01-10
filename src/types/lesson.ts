export interface Lesson {
  id: number;
  grammarPoints: string[];
  sentenceCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completionRate: number;
}
