export interface LearnedGrammar {
  grammarId: string;
  firstLearnedDate: Date;
  lastReviewedDate: Date;
  nextReviewDate: Date;
  reviewCount: number;
  masteryLevel: number;
}

export interface UserProgress {
  id: string;
  currentLessonId: number;
  currentGrammarPoint: string;
  learnedSentences: string[];
  learnedGrammar: LearnedGrammar[];
  completedLessons: number[];
  totalStudyTime: number;
  studyStreak: number;
  lastStudyDate: Date;
}

export interface DailyGoal {
  id: string;
  date: Date;
  targetSentences: number;
  targetGrammarPoints: number;
  completedSentences: number;
  completedGrammarPoints: number;
  studyTime: number;
  isCompleted: boolean;
}
