import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Filter,
  Calendar,
} from 'lucide-react';
import { db } from '@/db/schema';
import type { WrongAnswer } from '@/types';

interface WrongAnswerGroup {
  grammarPoint: string;
  wrongAnswers: WrongAnswer[];
  totalWrong: number;
}

export default function WrongAnswersPage() {
  const navigate = useNavigate();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [groupedAnswers, setGroupedAnswers] = useState<WrongAnswerGroup[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWrongAnswers();
  }, []);

  const loadWrongAnswers = async () => {
    try {
      // Get all unresolved wrong answers
      const allWrong = await db.wrongAnswers
        .filter(w => !w.resolved)
        .toArray();

      // Sort by last wrong date (most recent first)
      allWrong.sort((a, b) =>
        new Date(b.lastWrongDate).getTime() - new Date(a.lastWrongDate).getTime()
      );

      setWrongAnswers(allWrong);

      // Group by grammar point
      const grouped = new Map<string, WrongAnswer[]>();
      for (const wrong of allWrong) {
        const existing = grouped.get(wrong.grammarPoint) || [];
        existing.push(wrong);
        grouped.set(wrong.grammarPoint, existing);
      }

      const groupArray: WrongAnswerGroup[] = Array.from(grouped.entries()).map(
        ([grammarPoint, wrongs]) => ({
          grammarPoint,
          wrongAnswers: wrongs,
          totalWrong: wrongs.reduce((sum, w) => sum + w.wrongCount, 0),
        })
      );

      // Sort groups by total wrong count (most wrong first)
      groupArray.sort((a, b) => b.totalWrong - a.totalWrong);

      setGroupedAnswers(groupArray);
    } catch (error) {
      console.error('Failed to load wrong answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${Math.floor(days / 30)}月前`;
  };

  const startReview = (grammarPoint?: string) => {
    navigate(`/quiz?type=wrong-answers&targetId=${grammarPoint || 'all'}`);
  };

  const reviewSelectedGrammar = () => {
    if (selectedGrammar) {
      startReview(selectedGrammar);
    }
  };

  const reviewAll = () => {
    startReview();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalCount = wrongAnswers.length;
  const totalUniqueGrammar = groupedAnswers.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-warning" />
          <h1 className="text-3xl font-bold text-gray-900">错题本</h1>
        </div>
        <p className="text-gray-600">
          共 {totalCount} 道错题，涉及 {totalUniqueGrammar} 个语法点
        </p>
      </div>

      {/* Empty state */}
      {totalCount === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">太棒了！</h2>
          <p className="text-gray-600 mb-6">
            你目前没有错题，继续保持！
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            开始练习
          </button>
        </div>
      ) : (
        <>
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={reviewAll}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-warning text-white rounded-lg font-medium hover:bg-warning-hover transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              复习全部错题 ({totalCount}题)
            </button>
            <button
              onClick={reviewSelectedGrammar}
              disabled={!selectedGrammar}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
                ${selectedGrammar
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <BookOpen className="w-5 h-5" />
              复习选中的语法点
            </button>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">按语法点筛选</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGrammar(null)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${!selectedGrammar
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                全部 ({totalCount}题)
              </button>
              {groupedAnswers.map(group => (
                <button
                  key={group.grammarPoint}
                  onClick={() => setSelectedGrammar(
                    selectedGrammar === group.grammarPoint ? null : group.grammarPoint
                  )}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedGrammar === group.grammarPoint
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {group.grammarPoint} ({group.wrongAnswers.length}题)
                </button>
              ))}
            </div>
          </div>

          {/* Wrong answers list */}
          <div className="space-y-4">
            {groupedAnswers
              .filter(g => !selectedGrammar || g.grammarPoint === selectedGrammar)
              .map(group => (
                <div
                  key={group.grammarPoint}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                >
                  {/* Grammar point header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{group.grammarPoint}</h3>
                      <p className="text-sm text-gray-600">
                        共 {group.wrongAnswers.length} 道错题，
                        累计答错 {group.totalWrong} 次
                      </p>
                    </div>
                    <button
                      onClick={() => startReview(group.grammarPoint)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      复习
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wrong answer items */}
                  <div className="space-y-3">
                    {group.wrongAnswers.map(wrong => (
                      <div
                        key={wrong.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            <span>答错 {wrong.wrongCount} 次</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(wrong.lastWrongDate)}</span>
                            </div>
                          </div>
                          {wrong.correctStreak > 0 && (
                            <div className="text-xs text-success">
                              连续答对 {wrong.correctStreak} 次，
                              还需答对 {3 - wrong.correctStreak} 次即可移除
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">关于错题本</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 答错的题目会自动加入错题本</li>
              <li>• 连续答对 3 次后，题目会自动从错题本移除</li>
              <li>• 建议优先复习答错次数多的题目</li>
              <li>• 可以按语法点筛选，针对性练习薄弱环节</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
