import { useState, useEffect } from 'react';
import {
  Target,
  Bell,
  Volume2,
  Palette,
  Database,
  Info,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun
} from 'lucide-react';
import Button from '@/components/common/Button';
import { db } from '@/db/schema';

const SettingsPage = () => {
  // Learning settings
  const [targetSentences, setTargetSentences] = useState(10);
  const [targetGrammarPoints, setTargetGrammarPoints] = useState(2);

  // Review settings
  const [reviewReminder, setReviewReminder] = useState(true);
  const [showReviewOnHome, setShowReviewOnHome] = useState(true);

  // Audio settings
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Display settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Data management
  const dataSize = '2.3 MB';

  // Modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      await db.userProgress.get('user_progress');
      // Load settings from progress or use defaults
      // In a full implementation, settings would be stored separately
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const progress = await db.userProgress.get('user_progress');
      const goals = await db.dailyGoals.toArray();
      const achievements = await db.achievements.toArray();

      const data = {
        userProgress: progress,
        dailyGoals: goals,
        achievements,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jlpt-n2-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('导出失败，请重试');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Import data
        if (data.userProgress) {
          await db.userProgress.put(data.userProgress);
        }
        if (data.dailyGoals) {
          await db.dailyGoals.bulkPut(data.dailyGoals);
        }
        if (data.achievements) {
          await db.achievements.bulkPut(data.achievements);
        }

        alert('导入成功！');
        window.location.reload();
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('导入失败，请检查文件格式');
      }
    };
    input.click();
  };

  const handleResetData = async () => {
    try {
      await db.userProgress.clear();
      await db.dailyGoals.clear();
      await db.achievements.clear();

      alert('数据已重置');
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset data:', error);
      alert('重置失败，请重试');
    }
    setShowResetConfirm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">设置</h1>
      <p className="text-gray-600 mb-8">自定义你的学习体验</p>

      {/* Learning Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">学习设置</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每日例句目标
            </label>
            <select
              value={targetSentences}
              onChange={(e) => setTargetSentences(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={5}>5 句/天</option>
              <option value={10}>10 句/天 (推荐)</option>
              <option value={15}>15 句/天</option>
              <option value={20}>20 句/天</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每日语法点目标
            </label>
            <select
              value={targetGrammarPoints}
              onChange={(e) => setTargetGrammarPoints(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={1}>1 个/天</option>
              <option value={2}>2 个/天 (推荐)</option>
              <option value={3}>3 个/天</option>
              <option value={5}>5 个/天</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">复习设置</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">启用复习提醒</p>
              <p className="text-sm text-gray-500">在复习日显示提醒通知</p>
            </div>
            <button
              onClick={() => setReviewReminder(!reviewReminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reviewReminder ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reviewReminder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">首页显示复习提醒</p>
              <p className="text-sm text-gray-500">在首页显示待复习项目</p>
            </div>
            <button
              onClick={() => setShowReviewOnHome(!showReviewOnHome)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showReviewOnHome ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showReviewOnHome ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">音频设置</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">自动播放音频</p>
              <p className="text-sm text-gray-500">例句页面自动播放日语发音</p>
            </div>
            <button
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoPlayAudio ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoPlayAudio ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              播放速度
            </label>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1.0x (正常)</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">显示设置</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主题
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>浅色</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>深色</span>
              </button>
              <button
                onClick={() => setTheme('auto')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  theme === 'auto'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span>自动</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              字体大小
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="small">小</option>
              <option value="medium">中 (推荐)</option>
              <option value="large">大</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">数据管理</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">已学习例句</span>
            <span className="text-gray-800">0 个</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">练习记录</span>
            <span className="text-gray-800">0 条</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">数据占用</span>
            <span className="text-gray-800">{dataSize}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleExportData}
            className="flex items-center justify-center gap-2"
          >
            <Download size={16} />
            导出学习数据
          </Button>
          <Button
            variant="secondary"
            onClick={handleImportData}
            className="flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            导入学习数据
          </Button>
          <Button
            variant="error"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            重置数据
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">关于</h2>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium text-gray-800">版本:</span> v1.0.0</p>
          <p><span className="font-medium text-gray-800">数据来源:</span> shin-kanzen N2 grammar</p>
          <p><span className="font-medium text-gray-800">开源许可:</span> CC BY-NC 4.0</p>
          <p className="text-xs text-gray-500 mt-4">
            本网站使用的学习数据来自开源项目，仅供个人学习使用，严禁商业用途。
          </p>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">确认重置数据？</h3>
            <p className="text-gray-600 mb-6">
              此操作将删除所有学习进度、练习记录和成就数据，且无法恢复。
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="error"
                onClick={handleResetData}
                className="flex-1"
              >
                确认重置
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
