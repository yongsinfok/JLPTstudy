import { Target, CheckCircle2 } from 'lucide-react';
import ProgressBar from '@/components/common/ProgressBar';
import type { DailyGoal as DailyGoalType } from '@/types';

export interface DailyGoalProps {
  goal: DailyGoalType | null;
  className?: string;
}

const DailyGoal = ({ goal, className = '' }: DailyGoalProps) => {
  if (!goal) {
    return (
      <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">今日目标</h3>
        </div>
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    );
  }

  const sentenceProgress = (goal.completedSentences / goal.targetSentences) * 100;
  const grammarProgress = (goal.completedGrammarPoints / goal.targetGrammarPoints) * 100;
  const overallProgress = ((sentenceProgress + grammarProgress) / 2);

  const isCompleted = goal.isCompleted || overallProgress >= 100;

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Target className="w-6 h-6 text-primary" />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {isCompleted ? '今日目标已完成！' : '今日目标'}
          </h3>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">例句</span>
          <span className="text-gray-600">
            {goal.completedSentences}/{goal.targetSentences}
          </span>
        </div>
        <ProgressBar
          progress={sentenceProgress}
          size="sm"
          color={sentenceProgress >= 100 ? 'success' : 'primary'}
          showLabel={false}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">语法点</span>
          <span className="text-gray-600">
            {goal.completedGrammarPoints}/{goal.targetGrammarPoints}
          </span>
        </div>
        <ProgressBar
          progress={grammarProgress}
          size="sm"
          color={grammarProgress >= 100 ? 'success' : 'primary'}
          showLabel={false}
        />
      </div>

      <div className="bg-white rounded-lg p-3 mt-4">
        {isCompleted ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold">太棒了！今日目标已完成！</p>
            <p className="text-gray-500 text-sm mt-1">明天继续加油！</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">总体进度</span>
              <span className="text-primary font-semibold">{overallProgress.toFixed(0)}%</span>
            </div>
            <ProgressBar
              progress={overallProgress}
              size="sm"
              color="primary"
              showLabel={false}
            />
            <p className="text-gray-600 text-sm mt-3">
              {overallProgress >= 80
                ? `还差一点点就能完成今日目标了！`
                : overallProgress >= 50
                ? `已完成一半，继续加油！`
                : `今天的学习刚开始，加油！`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyGoal;
