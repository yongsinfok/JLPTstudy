import { Bell, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useState } from 'react';

export interface ReviewReminderProps {
  dueCount: number;
  estimatedTime?: number;
  onReview: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ReviewReminder = ({
  dueCount,
  estimatedTime,
  onReview,
  onDismiss,
  className = '',
}: ReviewReminderProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || dueCount === 0) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 relative ${className}`}>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="关闭提醒"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-full flex-shrink-0">
          <Bell className="w-6 h-6 text-purple-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            今日需要复习
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {dueCount} 个语法点到期需要复习
            {estimatedTime && ` • 预计用时 ${estimatedTime} 分钟`}
          </p>

          <div className="flex gap-3">
            <Button size="sm" onClick={onReview}>
              开始复习
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
            >
              稍后提醒
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReminder;
