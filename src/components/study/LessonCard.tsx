import { Lock, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import type { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  const { id, grammarPoints, sentenceCount, isUnlocked, isCompleted, completionRate } = lesson;

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle2 className="text-green-500" size={24} />;
    if (!isUnlocked) return <Lock className="text-gray-400" size={24} />;
    if (completionRate > 0) return <Clock className="text-blue-500" size={24} />;
    return null;
  };

  const getStatusClass = () => {
    if (isCompleted) return 'border-green-500 bg-green-50';
    if (!isUnlocked) return 'border-gray-300 bg-gray-100 opacity-70';
    if (completionRate > 0) return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-white hover:border-blue-300';
  };

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative w-full max-w-xs p-6 rounded-xl border-2 transition-all shadow-md hover:shadow-lg ${getStatusClass()} ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="absolute top-4 right-4">{getStatusIcon()}</div>

      <div className="text-2xl font-bold text-gray-800 mb-2">课程 {id}</div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <BookOpen size={16} />
          <span>{grammarPoints.length} 语法点</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{sentenceCount} 例句</span>
        </div>
      </div>

      {isUnlocked && !isCompleted && completionRate > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${completionRate}%` }} />
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 text-white rounded-xl opacity-0 hover:opacity-100">
          <Lock size={32} className="mx-auto mb-2" />
          <p className="text-sm">请先完成前一课</p>
        </div>
      )}
    </button>
  );
}
