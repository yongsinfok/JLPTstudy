import { create } from 'zustand';
import type { UserProgress } from '@/types';
import { getUserProgress, updateUserProgress } from '@/db/operations';

interface UserStore {
  progress: UserProgress | null;
  isLoading: boolean;
  loadProgress: () => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  progress: null,
  isLoading: false,

  loadProgress: async () => {
    set({ isLoading: true });
    try {
      const progress = await getUserProgress();
      set({ progress: progress || null, isLoading: false });
    } catch (error) {
      console.error('Failed to load user progress:', error);
      set({ isLoading: false });
    }
  },

  updateProgress: async (updates) => {
    const currentProgress = get().progress;
    if (!currentProgress) return;

    try {
      const updated = { ...currentProgress, ...updates };
      await updateUserProgress(updates);
      set({ progress: updated });
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  },

  resetProgress: async () => {
    // Will be implemented in settings page
    set({ progress: null });
  },
}));
