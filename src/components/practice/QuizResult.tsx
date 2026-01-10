import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Trophy, Clock } from 'lucide-react';
import type { QuizQuestion } from '@/types';
import { useQuizStore } from '@/stores/quizStore';

interface QuizResultProps {
  questions: QuizQuestion[];
  onRetry?: () => void;
  onContinue?: () => void;
  onReviewWrong?: () => void;
}

export function QuizResult({
  questions,
  onRetry,
  onContinue,
  onReviewWrong,
}: QuizResultProps) {
  const navigate = useNavigate();
  const { userAnswers, getScore, getTimeSpent, getResultsByGrammar } = useQuizStore();
  const score = getScore();
  const timeSpent = getTimeSpent();
  const resultsByGrammar = getResultsByGrammar();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wrongAnswers = questions.filter(
    q => userAnswers.get(q.id) !== q.correctAnswer
  );

  const handleReviewWrong = async () => {
    if (wrongAnswers.length > 0) {
      navigate('/quiz/wrong-answers');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
        <div className="flex justify-center mb-4">
          {score.percentage >= 70 ? (
            <Trophy className="w-16 h-16 text-warning" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">{score.percentage}</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {score.percentage >= 70 ? '恭喜通过！' : '测试完成'}
        </h2>

        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {score.correct}/{score.total}
            </p>
            <p className="text-sm text-gray-600">正确题数</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">
              {score.percentage}%
            </p>
            <p className="text-sm text-gray-600">正确率</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-5 h-5 text-gray-500" />
              <p className="text-2xl font-bold text-gray-800">
                {formatTime(timeSpent)}
              </p>
            </div>
            <p className="text-sm text-gray-600">用时</p>
          </div>
        </div>

        {score.percentage >= 70 && (
          <p className="text-gray-600 mb-6">
            {score.percentage >= 90 ? '优秀！' : score.percentage >= 80 ? '做得很好！' : '继续保持！'}
          </p>
        )}
      </div>

      {resultsByGrammar.size > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">按语法点统计</h3>
          <div className="space-y-3">
            {Array.from(resultsByGrammar.entries()).map(([grammar, result]) => {
              const percentage = Math.round((result.correct / result.total) * 100);
              const isGood = percentage >= 70;
              return (
                <div key={grammar} className="flex items-center justify-between">
                  <span className="text-gray-700">{grammar}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isGood ? 'text-success' : 'text-error'}`}>
                      {result.correct}/{result.total}
                    </span>
                    <span className={`text-sm font-medium ${isGood ? 'text-success' : 'text-error'}`}>
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">题目详情</h3>
        <div className="space-y-3">
          {questions.map((q, index) => {
            const userAnswer = userAnswers.get(q.id);
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {index + 1}. {q.sentence}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-gray-600 mt-1">
                      你的答案: {userAnswer || '未答'} | 正确答案: {q.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {wrongAnswers.length > 0 && onReviewWrong && (
          <button
            onClick={handleReviewWrong}
            className="flex-1 px-6 py-3 bg-warning hover:bg-warning-hover text-white rounded-lg font-medium transition-colors"
          >
            复习错题 ({wrongAnswers.length}题)
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            重新测试
          </button>
        )}
        {onContinue && score.percentage >= 70 && (
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            继续学习
          </button>
        )}
        <button
          onClick={() => navigate('/practice')}
          className="flex-1 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
        >
          返回练习
        </button>
      </div>
    </div>
  );
}

export default QuizResult;
