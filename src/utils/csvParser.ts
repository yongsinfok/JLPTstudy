import Papa from 'papaparse';
import { db } from '@/db/schema';
import type { Sentence, Lesson, GrammarPoint, UserProgress, Achievement } from '@/types';

// Module-level flag to prevent concurrent loads
let isLoading = false;

export async function loadCSVData(): Promise<void> {
  // Prevent concurrent loading (e.g., React StrictMode double invocation)
  if (isLoading) {
    console.log('Data loading already in progress, skipping...');
    return;
  }

  try {
    isLoading = true;

    // 1. Check if data already exists
    const existingCount = await db.sentences.count();
    if (existingCount > 0) {
      console.log('Data already loaded, skipping...');
      return;
    }

    console.log('Starting to load CSV data...');

    // 2. Load CSV file
    const response = await fetch('/data/notes.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    // 3. Parse CSV
    const { data } = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    console.log(`Parsed ${data.length} rows`);

    // 4. Convert data format
    const sentences: Sentence[] = data.map((row, index) => ({
      id: `sentence_${index + 1}`,
      lessonNumber: parseInt(row['课号']) || 0,
      grammarPoint: (row['语法点'] || '').trim(),
      sentence: (row['例句'] || '').trim(),
      furigana: (row['假名标注'] || '').trim(),
      translation: (row['中文翻译'] || '').trim(),
      audioPath: extractAudioPath(row['音频'] || ''),
      grammarConnection: (row['语法接续'] || '').trim(),
      grammarExplanation: (row['语法解释'] || '').trim(),
      wordByWord: (row['逐词精解'] || '').trim(),
      tags: (row['标签'] || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    }));

    // 5. Bulk insert sentences (use bulkPut for idempotency)
    await db.sentences.bulkPut(sentences);
    console.log('Sentence data imported');

    // 6. Generate lessons and grammar points
    await generateLessonsAndGrammar(sentences);
    console.log('Lessons and grammar points generated');

    // 7. Initialize user progress
    await initializeUserProgress();
    console.log('User progress initialized');

    // 8. Initialize achievement system
    await initializeAchievements();
    console.log('Achievement system initialized');

    console.log('Data loading complete!');
  } catch (error) {
    console.error('Data loading failed:', error);
    throw error;
  } finally {
    isLoading = false;
  }
}

function extractAudioPath(audioField: string): string {
  // Handle "[sound:example_002.mp3]" format
  const match = audioField.match(/\[sound:(.+?)\]/);
  return match ? `/audio/${match[1]}` : '';
}

async function generateLessonsAndGrammar(sentences: Sentence[]): Promise<void> {
  // Group by lesson number
  const lessonMap = new Map<number, Sentence[]>();
  sentences.forEach(s => {
    if (!lessonMap.has(s.lessonNumber)) {
      lessonMap.set(s.lessonNumber, []);
    }
    lessonMap.get(s.lessonNumber)!.push(s);
  });

  // Generate lesson data
  const lessons: Lesson[] = [];
  lessonMap.forEach((sents, lessonNum) => {
    const grammarPoints = [...new Set(sents.map(s => s.grammarPoint))];
    lessons.push({
      id: lessonNum,
      grammarPoints,
      sentenceCount: sents.length,
      isUnlocked: lessonNum === 1, // First lesson unlocked by default
      isCompleted: false,
      completionRate: 0,
    });
  });
  await db.lessons.bulkPut(lessons);

  // Generate grammar point data
  const grammarMap = new Map<string, Sentence[]>();
  sentences.forEach(s => {
    if (!grammarMap.has(s.grammarPoint)) {
      grammarMap.set(s.grammarPoint, []);
    }
    grammarMap.get(s.grammarPoint)!.push(s);
  });

  const grammarPoints: GrammarPoint[] = [];
  grammarMap.forEach((sents, grammar) => {
    const firstSentence = sents[0];
    grammarPoints.push({
      id: grammar,
      lessonNumber: firstSentence.lessonNumber,
      sentenceIds: sents.map(s => s.id),
      sentenceCount: sents.length,
      grammarConnection: firstSentence.grammarConnection,
      grammarExplanation: firstSentence.grammarExplanation,
      isLearned: false,
    });
  });
  await db.grammarPoints.bulkPut(grammarPoints);
}

async function initializeUserProgress(): Promise<void> {
  const progress: UserProgress = {
    id: 'user_progress',
    currentLessonId: 1,
    currentGrammarPoint: '',
    learnedSentences: [],
    learnedGrammar: [],
    completedLessons: [],
    totalStudyTime: 0,
    studyStreak: 0,
    lastStudyDate: new Date(),
  };
  await db.userProgress.put(progress);
}

async function initializeAchievements(): Promise<void> {
  const achievements: Achievement[] = [
    {
      id: 'first_grammar',
      name: '🎯 开始学习',
      description: '完成第1个语法点',
      icon: '🎯',
      condition: 'complete_1_grammar',
      isUnlocked: false,
    },
    {
      id: 'first_lesson',
      name: '📚 第一课',
      description: '完成第1课',
      icon: '📚',
      condition: 'complete_lesson_1',
      isUnlocked: false,
    },
    {
      id: 'streak_7',
      name: '🔥 连续7天',
      description: '连续学习7天',
      icon: '🔥',
      condition: 'streak_7_days',
      isUnlocked: false,
    },
    {
      id: 'perfect_quiz',
      name: '💯 满分测试',
      description: '课后测试获得满分',
      icon: '💯',
      condition: 'quiz_perfect',
      isUnlocked: false,
    },
    {
      id: 'streak_30',
      name: '🔥 连续30天',
      description: '连续学习30天',
      icon: '🔥',
      condition: 'streak_30_days',
      isUnlocked: false,
    },
    {
      id: 'complete_10_lessons',
      name: '🎓 完成10课',
      description: '完成10课',
      icon: '🎓',
      condition: 'complete_10_lessons',
      isUnlocked: false,
    },
    {
      id: 'progress_25',
      name: '⭐ 25%进度',
      description: '完成25%课程',
      icon: '⭐',
      condition: 'progress_25',
      isUnlocked: false,
    },
    {
      id: 'progress_50',
      name: '🏆 50%进度',
      description: '完成50%课程',
      icon: '🏆',
      condition: 'progress_50',
      isUnlocked: false,
    },
    {
      id: 'progress_75',
      name: '💎 75%进度',
      description: '完成75%课程',
      icon: '💎',
      condition: 'progress_75',
      isUnlocked: false,
    },
    {
      id: 'complete_all',
      name: '🎊 完成全部',
      description: '完成全部50课',
      icon: '🎊',
      condition: 'complete_all',
      isUnlocked: false,
    },
    {
      id: 'sentences_100',
      name: '📖 100例句',
      description: '学习100个例句',
      icon: '📖',
      condition: 'sentences_100',
      isUnlocked: false,
    },
    {
      id: 'sentences_500',
      name: '📖 500例句',
      description: '学习500个例句',
      icon: '📖',
      condition: 'sentences_500',
      isUnlocked: false,
    },
    {
      id: 'sentences_all',
      name: '📕 全部例句',
      description: '学习全部例句',
      icon: '📕',
      condition: 'sentences_all',
      isUnlocked: false,
    },
    {
      id: 'exercises_100',
      name: '✏️ 练习100题',
      description: '完成100道练习题',
      icon: '✏️',
      condition: 'exercises_100',
      isUnlocked: false,
    },
    {
      id: 'exercises_500',
      name: '✏️ 练习500题',
      description: '完成500道练习题',
      icon: '✏️',
      condition: 'exercises_500',
      isUnlocked: false,
    },
    {
      id: 'accuracy_90',
      name: '🎯 正确率90%',
      description: '练习正确率达到90%',
      icon: '🎯',
      condition: 'accuracy_90',
      isUnlocked: false,
    },
    {
      id: 'early_bird',
      name: '⏰ 早起学习',
      description: '上午8点前学习',
      icon: '⏰',
      condition: 'early_bird',
      isUnlocked: false,
    },
    {
      id: 'night_owl',
      name: '🌙 夜猫学习',
      description: '晚上10点后学习',
      icon: '🌙',
      condition: 'night_owl',
      isUnlocked: false,
    },
    {
      id: 'daily_goal_30',
      name: '💪 每日目标30天',
      description: '连续30天完成每日目标',
      icon: '💪',
      condition: 'daily_goal_30',
      isUnlocked: false,
    },
    {
      id: 'master_all',
      name: '🧠 全部精通',
      description: '所有语法点达到Level 5',
      icon: '🧠',
      condition: 'master_all',
      isUnlocked: false,
    },
  ];
  await db.achievements.bulkPut(achievements);
}
