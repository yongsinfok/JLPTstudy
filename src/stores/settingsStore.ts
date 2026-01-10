import { create } from 'zustand';

interface SettingsStore {
  dailyGoalSentences: number;
  dailyGoalGrammarPoints: number;
  autoPlayAudio: boolean;
  playbackRate: number;
  reviewReminderEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';

  setDailyGoalSentences: (count: number) => void;
  setDailyGoalGrammarPoints: (count: number) => void;
  setAutoPlayAudio: (enabled: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setReviewReminderEnabled: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  dailyGoalSentences: 10,
  dailyGoalGrammarPoints: 2,
  autoPlayAudio: false,
  playbackRate: 1.0,
  reviewReminderEnabled: true,
  theme: 'light',
  fontSize: 'medium',

  setDailyGoalSentences: (count) => set({ dailyGoalSentences: count }),
  setDailyGoalGrammarPoints: (count) => set({ dailyGoalGrammarPoints: count }),
  setAutoPlayAudio: (enabled) => set({ autoPlayAudio: enabled }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setReviewReminderEnabled: (enabled) => set({ reviewReminderEnabled: enabled }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (size) => set({ fontSize: size }),
}));
