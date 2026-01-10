import { useEffect, useState } from 'react';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import WeeklyChart from '@/components/progress/WeeklyChart';
import { formatDuration } from '@/utils/dateHelper';


const ProgressPage = () => {
  const { progress, getOverallProgress } = useProgress();
  const [overallProgress, setOverallProgress] = useState<{
    lessons: number;
    grammar: number;
    sentences: number;
  }>({ lessons: 0, grammar: 0, sentences: 0 });
  useEffect(() => {
    setOverallProgress(getOverallProgress());
  }, [progress, getOverallProgress]);

  // Calculate stats
  const totalStudyTime = progress?.totalStudyTime || 0;
  const avgDailyTime = totalStudyTime / Math.max(1, progress?.studyStreak || 1);

  // Mock exercise statistics
  const totalExercises = 45;
  const correctRate = 82;

  // Mastery level distribution
  const masteryDistribution = [
    { level: 5, count: 0, name: '完全掌握' },
    { level: 4, count: 2, name: '熟练掌握' },
    { level: 3, count: 3, name: '基本掌握' },
    { level: 2, count: 3, name: '初步掌握' },
    { level: 1, count: 0, name: '刚学习' },
  ];

  // Weak grammar points (mock data)
  const weakGrammarPoints = [
    { name: '～において', correctRate: 60, total: 5 },
    { name: '～について', correctRate: 67, total: 3 },
    { name: '～に対して', correctRate: 75, total: 4 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">学习统计</h1>
      <p className="text-gray-600 mb-8">查看你的学习进度和统计数据</p>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">总体进度</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lessons */}
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${overallProgress.lessons * 3.52} 352`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {overallProgress.lessons.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">课程完成度</p>
            <p className="text-xs text-gray-500">{progress?.completedLessons.length || 0}/50 课</p>
          </div>

          {/* Grammar */}
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${overallProgress.grammar * 3.52} 352`}
                  className="text-success transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {overallProgress.grammar.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">语法点掌握</p>
            <p className="text-xs text-gray-500">{progress?.learnedGrammar.length || 0}/200 个</p>
          </div>

          {/* Sentences */}
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${overallProgress.sentences * 3.52} 352`}
                  className="text-purple-600 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {overallProgress.sentences.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">例句学习</p>
            <p className="text-xs text-gray-500">{progress?.learnedSentences.length || 0}/1000 句</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Study Time Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">学习时长</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总学习时长</span>
              <span className="text-lg font-semibold text-gray-800">
                {formatDuration(totalStudyTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">平均每天</span>
              <span className="text-lg font-semibold text-gray-800">
                {formatDuration(avgDailyTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">连续学习</span>
              <span className="text-lg font-semibold text-orange-600">
                {progress?.studyStreak || 0} 天
              </span>
            </div>
          </div>
        </div>

        {/* Practice Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">练习统计</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总练习题数</span>
              <span className="text-lg font-semibold text-gray-800">{totalExercises} 题</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总正确率</span>
              <span className="text-lg font-semibold text-success">{correctRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">填空题正确率</span>
              <span className="text-lg font-semibold text-gray-800">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">选择题正确率</span>
              <span className="text-lg font-semibold text-gray-800">78%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <WeeklyChart />

      {/* Mastery Distribution */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">掌握程度分布</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {masteryDistribution.map((item) => (
            <div
              key={item.level}
              className="text-center p-4 rounded-lg bg-gray-50"
            >
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              <p className="text-xs text-gray-600 mt-1">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Grammar Points */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-warning" />
          <h2 className="text-xl font-semibold text-gray-800">薄弱知识点</h2>
        </div>

        <div className="space-y-3">
          {weakGrammarPoints.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.total} 道练习</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-red-600">{item.correctRate}%</p>
                <p className="text-xs text-gray-500">正确率</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 px-4 bg-warning hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
          针对性练习
        </button>
      </div>
    </div>
  );
};

export default ProgressPage;
