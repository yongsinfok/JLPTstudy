// useAudio hook - Phase 1 (stub with type definitions)
// Will be implemented in Phase 1

export interface UseAudioReturn {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setPlaybackRate: (rate: number) => void;
}

export function useAudio(audioPath: string): UseAudioReturn {
  return {
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    play: () => {},
    pause: () => {},
    toggle: () => {},
    setPlaybackRate: () => {},
  };
}
