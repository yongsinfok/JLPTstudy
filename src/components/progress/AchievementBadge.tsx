import { Award } from 'lucide-react';
import type { Achievement } from '@/types';

export interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

const AchievementBadge = ({ achievement, onClick }: AchievementBadgeProps) => {
  const getIconByType = () => {
    // For a full implementation, you'd have different icons for different achievement types
    return <Award className="w-8 h-8" />;
  };

  const getGradientByType = (icon: string): string => {
    // Use icon name to determine gradient
    const gradients: Record<string, string> = {
      'flame': 'from-orange-500 to-amber-500',
      'book': 'from-blue-500 to-indigo-500',
      'star': 'from-purple-500 to-pink-500',
      'target': 'from-green-500 to-emerald-500',
      'check': 'from-cyan-500 to-teal-500',
      'trophy': 'from-yellow-500 to-orange-500',
    };
    return gradients[icon] || 'from-gray-500 to-gray-600';
  };

  const getLockedStyle = () => {
    return achievement.isUnlocked
      ? `bg-gradient-to-br ${getGradientByType(achievement.icon)}`
      : 'bg-gray-300 grayscale opacity-50';
  };

  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        achievement.isUnlocked
          ? 'border-amber-300 shadow-lg hover:shadow-xl hover:scale-105'
          : 'border-gray-200'
      }`}
    >
      <div className={`p-3 rounded-full ${getLockedStyle()} mb-2`}>
        <div className={achievement.isUnlocked ? 'text-white' : 'text-gray-500'}>
          {getIconByType()}
        </div>
      </div>

      <p className={`text-sm font-semibold text-center ${
        achievement.isUnlocked ? 'text-gray-800' : 'text-gray-400'
      }`}>
        {achievement.name}
      </p>

      {achievement.isUnlocked && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
};

export default AchievementBadge;
