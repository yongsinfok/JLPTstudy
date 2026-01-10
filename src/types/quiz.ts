export interface QuizQuestion {
  id: string;
  sentenceId: string;
  sentence: string;
  grammarPoint: string;
  translation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExerciseRecord {
  id: string;
  sentenceId: string;
  grammarPoint: string;
  questionType: 'fill' | 'choice';
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface WrongAnswer {
  id: string;
  sentenceId: string;
  grammarPoint: string;
  wrongCount: number;
  lastWrongDate: Date;
  resolved: boolean;
  correctStreak: number;
}
