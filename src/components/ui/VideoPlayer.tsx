import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { videoService } from '../../services/videoService';
import type { PlaybackAccess } from '../../services/videoService';

interface VideoPlayerProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  onEnded
}) => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [playbackAccess, setPlaybackAccess] = useState<PlaybackAccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Player state controls
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Fetch token-based HLS stream info when lesson changes
  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      setError(null);
      setPlaying(false);
      setProgress(0);
      try {
        const access = await videoService.getVideoPlaybackInfo(courseId, lessonId);
        if (access.success) {
          setPlaybackAccess(access);
        } else {
          setError('Failed to authorize playback session.');
        }
      } catch (err) {
        setError('Network error securing stream link.');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [courseId, lessonId]);

  // Handle Play/Pause toggles
  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        setError('Playback failed or was blocked by the browser.');
      });
    }
  };

  // Track progress updating
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    
    if (dur) {
      setProgress((current / dur) * 100);
      
      const format = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      setCurrentTime(format(current));
      setDuration(format(dur));
    }
  };

  // Volume control slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setMuted(value === 0);
    }
  };

  // Mute volume toggle
  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  // Fullscreen trigger
  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  // Seek bar interaction
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
    setProgress(pos * 100);
  };

  return (
    <div 
      ref={playerRef} 
      className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-slate-800 select-none group"
    >
      {/* Video element playing a public demo file to test visuals, but abstracting paths */}
      {playbackAccess && !error && (
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          onClick={handlePlayToggle}
          playsInline
        />
      )}

      {/* Loading Skeleton state */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-20">
          <Loader2 className="w-12 h-12 text-royal-blue-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm font-medium">Securing playback session token...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-20 p-6 text-center">
          <RotateCcw className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-slate-200 font-semibold mb-1">Authorization Failed</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      )}

      {/* Floating security indicators: mock watermark & token display */}
      {!loading && !error && (
        <>
          {/* Security watermark to prevent screen recording piracy */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-20 text-[10px] text-white bg-black/40 px-2 py-1 rounded border border-white/10 select-none font-mono">
            SECURE STREAM // Edqoo USER // {playbackAccess?.token}
          </div>

          <div className="absolute top-4 right-4 pointer-events-none opacity-80 z-10 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 backdrop-blur border border-emerald-500/30 text-emerald-400 text-[11px] font-medium px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              DRM Token Verified
            </span>
          </div>

          {/* Central Play/Pause button on Hover */}
          {!playing && (
            <div 
              onClick={handlePlayToggle}
              className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer transition-colors duration-300 hover:bg-black/40"
            >
              <div className="p-5 rounded-full bg-royal-blue-900 text-white shadow-lg transform scale-100 hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Player controls bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {/* Seek/Progress bar */}
            <div 
              onClick={handleSeek}
              className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2.5 transition-all group/seek"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-royal-blue-500 rounded-full flex items-center justify-end"
                style={{ width: `${progress}%` }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-royal-blue-600 scale-0 group-hover/seek:scale-100 transition-transform" />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayToggle}
                  className="hover:text-royal-blue-400 transition-colors p-1"
                >
                  {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleMuteToggle}
                    className="hover:text-royal-blue-400 transition-colors p-1"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-royal-blue-500 hover:h-1.5 transition-all"
                  />
                </div>

                <span className="text-xs font-medium text-slate-300 font-mono">
                  {currentTime} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                  {lessonTitle}
                </span>
                <button 
                  onClick={handleFullscreen}
                  className="hover:text-royal-blue-400 transition-colors p-1"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
