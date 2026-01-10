import { useAudio } from '@/hooks/useAudio';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioPath: string;
  className?: string;
}

const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function AudioPlayer({ audioPath, className = '' }: AudioPlayerProps) {
  const {
    isPlaying,
    duration,
    currentTime,
    playbackRate,
    toggle,
    setPlaybackRate,
    seek,
  } = useAudio(audioPath);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  if (!audioPath) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        <span className="text-sm">No audio available</span>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
        <div className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500" style={{ width: `${progress}%` }} />
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!duration}
          />
        </div>
        <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={toggle}
          disabled={!duration}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Speed:</span>
          {PLAYBACK_RATES.map(rate => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-2 py-1 text-xs rounded ${
                playbackRate === rate
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
