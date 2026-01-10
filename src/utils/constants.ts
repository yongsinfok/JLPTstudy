// Application constants

export const APP_NAME = 'JLPT N2 Learning Platform';
export const APP_VERSION = '1.0.0';

export const REVIEW_INTERVALS = [1, 1, 3, 7, 15, 30]; // days for mastery levels 0-5

export const MASTERY_LEVELS = {
  0: '未学习',
  1: '刚学习',
  2: '初步掌握',
  3: '基本掌握',
  4: '熟练掌握',
  5: '完全掌握',
} as const;

export const DEFAULT_DAILY_GOAL = {
  sentences: 10,
  grammarPoints: 2,
};

export const QUIZ_OPTIONS_COUNT = 4;

export const MASTERY_LEVEL_MAX = 5;

export const WRONG_ANSWER_RESOLVE_STREAK = 3;

export const ACHIEVEMENT_CONDITIONS = {
  COMPLETE_1_GRAMMAR: 'complete_1_grammar',
  COMPLETE_LESSON_1: 'complete_lesson_1',
  STREAK_7_DAYS: 'streak_7_days',
  STREAK_30_DAYS: 'streak_30_days',
  QUIZ_PERFECT: 'quiz_perfect',
  COMPLETE_10_LESSONS: 'complete_10_lessons',
  PROGRESS_25: 'progress_25',
  PROGRESS_50: 'progress_50',
  PROGRESS_75: 'progress_75',
  COMPLETE_ALL: 'complete_all',
  SENTENCES_100: 'sentences_100',
  SENTENCES_500: 'sentences_500',
  SENTENCES_ALL: 'sentences_all',
  EXERCISES_100: 'exercises_100',
  EXERCISES_500: 'exercises_500',
  ACCURACY_90: 'accuracy_90',
  EARLY_BIRD: 'early_bird',
  NIGHT_OWL: 'night_owl',
  DAILY_GOAL_30: 'daily_goal_30',
  MASTER_ALL: 'master_all',
} as const;
