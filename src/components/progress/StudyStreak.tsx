import { Flame } from 'lucide-react';

export interface StudyStreakProps {
  streak: number;
  className?: string;
}

const StudyStreak = ({ streak, className = '' }: StudyStreakProps) => {
  const getNextMilestone = (currentStreak: number) => {
    if (currentStreak < 7) return { target: 7, name: '7天连学' };
    if (currentStreak < 30) return { target: 30, name: '30天连学' };
    if (currentStreak < 100) return { target: 100, name: '100天连学' };
    return { target: currentStreak + 30, name: `${currentStreak + 30}天连学` };
  };

  const { target: nextMilestone, name } = getNextMilestone(streak);
  const milestoneProgress = Math.min(100, (streak / nextMilestone) * 100);

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return '开始你的学习之旅吧！';
    if (streak < 3) return '好的开始，继续保持！';
    if (streak < 7) return '坚持就是胜利！';
    if (streak < 14) return '太棒了，连续学习一周！';
    if (streak < 30) return '你的毅力令人敬佩！';
    if (streak < 60) return '学习已经成为了习惯！';
    if (streak < 100) return '百炼成钢，继续加油！';
    return '学习大师，佩服佩服！';
  };

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 ${className}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${streak > 0 ? 'bg-orange-500' : 'bg-gray-300'} transition-all duration-300`}>
          <Flame className={`w-8 h-8 ${streak > 0 ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-600">{streak}</span>
            <span className="text-sm text-orange-500 font-medium">天连续学习</span>
          </div>
          <p className="text-sm text-orange-700 mt-1">{getMotivationalMessage(streak)}</p>
        </div>
      </div>

      {streak > 0 && streak < nextMilestone && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-orange-600 mb-1">
            <span>进度: {name}</span>
            <span>{streak}/{nextMilestone}天</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          streak >= 7 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-400'
        }`}>
          7天
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          streak >= 30 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-400'
        }`}>
          30天
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          streak >= 100 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-400'
        }`}>
          100天
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;
