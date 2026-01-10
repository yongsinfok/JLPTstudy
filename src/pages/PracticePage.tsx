import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Headphones,
  AlertCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { db } from '@/db/schema';

type PracticeMode = 'fill' | 'choice' | 'listening' | 'wrong';

interface LessonSummary {
  id: number;
  grammarPointsCount: number;
  sentencesCount: number;
}

export default function PracticePage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load available lessons
      const allLessons = await db.lessons.toArray();
      const lessonSummaries: LessonSummary[] = allLessons
        .filter(l => l.isUnlocked)
        .map(l => ({
          id: l.id,
          grammarPointsCount: l.grammarPoints.length,
          sentencesCount: l.sentenceCount,
        }))
        .sort((a, b) => a.id - b.id);

      setLessons(lessonSummaries);

      // Select all unlocked lessons by default
      setSelectedLessons(lessonSummaries.map(l => l.id));

      // Load wrong answers count
      const wrongCount = await db.wrongAnswers.filter(w => !w.resolved).count();
      setWrongAnswersCount(wrongCount);
    } catch (error) {
      console.error('Failed to load practice data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLesson = (lessonId: number) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const selectAllLessons = () => {
    setSelectedLessons(lessons.map(l => l.id));
  };

  const clearAllLessons = () => {
    setSelectedLessons([]);
  };

  const startPractice = (mode: PracticeMode) => {
    if (mode === 'wrong') {
      navigate('/quiz?type=wrong-answers&targetId=all');
    } else {
      if (selectedLessons.length === 0) {
        alert('请至少选择一个课程');
        return;
      }
      navigate(`/quiz?type=practice&targetId=${selectedLessons.join(',')}`);
    }
  };

  const practiceModes = [
    {
      id: 'fill' as PracticeMode,
      title: '填空练习',
      description: '随机抽取例句，填写语法点',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      id: 'choice' as PracticeMode,
      title: '选择题练习',
      description: '选择正确的语法点填入空白处',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      id: 'listening' as PracticeMode,
      title: '听力练习',
      description: '听音频，填写完整句子',
      icon: Headphones,
      color: 'bg-purple-500',
    },
    {
      id: 'wrong' as PracticeMode,
      title: '错题本复习',
      description: `复习你做错的题目 (${wrongAnswersCount}道)`,
      icon: AlertCircle,
      color: 'bg-orange-500',
      disabled: wrongAnswersCount === 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">练习模式</h1>
        <p className="text-gray-600">选择练习方式，巩固你的N2语法知识</p>
      </div>

      {/* Practice mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {practiceModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => startPractice(mode.id)}
            disabled={mode.disabled}
            className={`
              relative bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-200
              ${mode.disabled
                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`${mode.color} p-3 rounded-lg`}>
                <mode.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.title}</h3>
                <p className="text-gray-600">{mode.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
            </div>
          </button>
        ))}
      </div>

      {/* Lesson filter */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">练习范围</h2>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={selectAllLessons}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            全选
          </button>
          <button
            onClick={clearAllLessons}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            清空
          </button>
          <span className="ml-auto text-sm text-gray-600">
            已选择 {selectedLessons.length} / {lessons.length} 个课程
          </span>
        </div>

        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            暂无可用的课程，请先开始学习
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
            {lessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => toggleLesson(lesson.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-center
                  ${selectedLessons.includes(lesson.id)
                    ? 'border-primary bg-blue-50 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <div className="text-sm font-medium mb-1">课程 {lesson.id}</div>
                <div className="text-xs text-gray-500">
                  {lesson.grammarPointsCount} 语法点
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-2">练习建议</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 建议每天练习 15-20 分钟，保持学习连贯性</li>
          <li>• 优先复习错题本中的题目，巩固薄弱知识点</li>
          <li>• 练习后查看结果解析，理解错题原因</li>
          <li>• 连续答对 3 次的题目会自动从错题本移除</li>
        </ul>
      </div>
    </div>
  );
}
