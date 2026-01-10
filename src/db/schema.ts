import Dexie, { Table } from 'dexie';
import type {
  Sentence,
  Lesson,
  GrammarPoint,
  UserProgress,
  DailyGoal,
  ExerciseRecord,
  WrongAnswer,
  Achievement
} from '@/types';

export class JLPTN2Database extends Dexie {
  sentences!: Table<Sentence, string>;
  lessons!: Table<Lesson, number>;
  grammarPoints!: Table<GrammarPoint, string>;
  userProgress!: Table<UserProgress, string>;
  dailyGoals!: Table<DailyGoal, string>;
  exerciseHistory!: Table<ExerciseRecord, string>;
  wrongAnswers!: Table<WrongAnswer, string>;
  achievements!: Table<Achievement, string>;

  constructor() {
    super('JLPTN2DB');

    this.version(1).stores({
      sentences: 'id, lessonNumber, grammarPoint',
      lessons: 'id',
      grammarPoints: 'id, lessonNumber',
      userProgress: 'id',
      dailyGoals: 'id, date',
      exerciseHistory: 'id, sentenceId, timestamp, isCorrect',
      wrongAnswers: 'id, grammarPoint, resolved',
      achievements: 'id, isUnlocked',
    });
  }
}

export const db = new JLPTN2Database();
