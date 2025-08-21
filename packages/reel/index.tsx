'use client';

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  ComponentProps,
  HTMLAttributes,
  MouseEventHandler,
  TouchEventHandler,
  VideoHTMLAttributes,
} from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

type ReelContextType<T = any> = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  data: T[];
  currentItem: T;
};

const ReelContext = createContext<ReelContextType<any> | undefined>(undefined);

const useReelContext = () => {
  const context = useContext(ReelContext);
  if (!context) {
    throw new Error('useReelContext must be used within a Reel');
  }
  return context;
};

export type ReelProps<T = any> = HTMLAttributes<HTMLDivElement> & {
  data: T[];
  defaultIndex?: number;
  autoPlay?: boolean;
  defaultMuted?: boolean;
  onIndexChange?: (index: number) => void;
};

export const Reel = <T extends any = any>({
  className,
  children,
  data,
  defaultIndex = 0,
  autoPlay = true,
  defaultMuted = true,
  onIndexChange,
  ...props
}: ReelProps<T>) => {
  const [currentIndex, setCurrentIndexState] = useState(defaultIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const setCurrentIndex = useCallback(
    (index: number) => {
      setCurrentIndexState(index);
      setProgress(0);
      onIndexChange?.(index);
    },
    [onIndexChange]
  );

  const currentItem = data[currentIndex];

  return (
    <ReelContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        progress,
        setProgress,
        duration,
        setDuration,
        data,
        currentItem,
      }}
    >
      <div
        className={cn(
          'relative isolate h-full w-full overflow-hidden rounded-xl bg-black',
          'aspect-[9/16]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ReelContext.Provider>
  );
};

export type ReelContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ((item: any, index: number) => React.ReactNode) | React.ReactNode;
};

export const ReelContent = ({
  className,
  children,
  ...props
}: ReelContentProps) => {
  const { currentIndex, data, currentItem } = useReelContext();

  const renderContent = () => {
    if (typeof children === 'function') {
      return children(currentItem, currentIndex);
    }
    const childrenArray = Array.isArray(children) ? children : [children];
    return childrenArray[currentIndex];
  };

  return (
    <div
      className={cn('relative h-full w-full', className)}
      data-reel-content
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={currentIndex}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export type ReelItemProps = HTMLAttributes<HTMLDivElement>;

export const ReelItem = ({ className, children, ...props }: ReelItemProps) => (
  <div
    className={cn('relative h-full w-full overflow-hidden', className)}
    data-reel-item
    {...props}
  >
    {children}
  </div>
);

export type ReelVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  onLoadedMetadata?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
};

export const ReelVideo = ({
  className,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  ...props
}: ReelVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isPlaying,
    isMuted,
    setDuration,
    setProgress,
    currentIndex,
    setCurrentIndex,
    data,
  } = useReelContext();
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
  }, [isMuted]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    setVideoDuration(duration);
    setDuration(duration);
    onLoadedMetadata?.(duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!(video && videoDuration)) return;

    const currentTime = video.currentTime;
    const progress = (currentTime / videoDuration) * 100;
    setProgress(progress);
    onTimeUpdate?.(currentTime);
  };

  // Use requestAnimationFrame for smoother progress updates
  useEffect(() => {
    if (!isPlaying || !videoRef.current) return;

    let animationFrameId: number;
    
    const updateProgress = () => {
      const video = videoRef.current;
      if (video && videoDuration && !video.paused && !video.ended) {
        const progress = (video.currentTime / videoDuration) * 100;
        setProgress(progress);
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, videoDuration, setProgress]);

  const handleEnded = () => {
    onEnded?.();
    const totalItems = data?.length || 0;

    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setProgress(0);
      if (isPlaying) {
        video.play().catch(() => { });
      }
    }
  }, [currentIndex]); // Only reset when index changes, not when pausing
  
  // Separate effect for play/pause without resetting
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  return (
    <video
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      muted={isMuted}
      onEnded={handleEnded}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      playsInline
      ref={videoRef}
      {...props}
    />
  );
};

export type ReelImageProps = ComponentProps<'img'> & {
  alt: string;
  duration?: number;
};

export const ReelImage = ({
  className,
  alt,
  duration = 5,
  ...props
}: ReelImageProps) => {
  const { isPlaying, setDuration, setProgress, currentIndex, setCurrentIndex, data, progress } =
    useReelContext();
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const pausedProgressRef = useRef<number>(0);

  // Reset progress when index changes
  useEffect(() => {
    setDuration(duration);
    setProgress(0);
    pausedProgressRef.current = 0;
  }, [currentIndex, duration, setDuration, setProgress]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      const elapsedTime = (pausedProgressRef.current * duration) / 100;
      startTimeRef.current = performance.now() - (elapsedTime * 1000);

      const updateProgress = (currentTime: number) => {
        const elapsed = (currentTime - (startTimeRef.current || 0)) / 1000;
        const newProgress = (elapsed / duration) * 100;

        if (newProgress >= 100) {
          const totalItems = data?.length || 0;

          if (currentIndex < totalItems - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setCurrentIndex(0);
          }
        } else {
          setProgress(newProgress);
          pausedProgressRef.current = newProgress;
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      pausedProgressRef.current = progress;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isPlaying,
    duration,
    currentIndex,
    setProgress,
    setCurrentIndex,
    data,
    progress,
  ]);

  return (
    <img
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      {...props}
    />
  );
};

export type ReelProgressProps = HTMLAttributes<HTMLDivElement> & {
  children?: ((item: any, index: number, isActive: boolean, progress: number) => React.ReactNode);
};

export const ReelProgress = ({ className, children, ...props }: ReelProgressProps) => {
  const { progress, currentIndex, data, duration, isPlaying } = useReelContext();

  if (typeof children === 'function') {
    return (
      <div
        className={cn(
          'absolute top-0 right-0 left-0 z-20 flex gap-1 p-2',
          className
        )}
        {...props}
      >
        {data.map((item, index) => (
          <div key={index} className="relative flex-1">
            {children(
              item,
              index,
              index === currentIndex,
              index < currentIndex ? 100 : index === currentIndex ? progress : 0
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 z-20 flex gap-1 p-2',
        className
      )}
      {...props}
    >
      {data.map((_, index) => (
        <div
          className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          key={index}
        >
          <div
            className='absolute top-0 left-0 h-full bg-white'
            style={{
              width:
                index < currentIndex
                  ? '100%'
                  : index === currentIndex
                    ? `${progress}%`
                    : '0%',
              transition: index === currentIndex && isPlaying 
                ? 'none' 
                : 'width 0.3s ease-out',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export type ReelControlsProps = HTMLAttributes<HTMLDivElement>;

export const ReelControls = ({ className, ...props }: ReelControlsProps) => {
  const {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    currentIndex,
    setCurrentIndex,
    data,
  } = useReelContext();
  const totalItems = data?.length || 0;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between p-4',
        'bg-gradient-to-t from-black/60 to-transparent',
        className
      )}
      {...props}
    >
      <button
        aria-label="Previous"
        className='rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50'
        disabled={currentIndex === 0}
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      <div className="flex gap-2">
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white" />
          )}
        </button>

        <button
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      <button
        aria-label="Next"
        className='rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50'
        disabled={currentIndex === totalItems - 1}
        onClick={handleNext}
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export type ReelNavigationProps = HTMLAttributes<HTMLDivElement>;

export const ReelNavigation = ({
  className,
  ...props
}: ReelNavigationProps) => {
  const { setCurrentIndex, currentIndex, data } = useReelContext();
  const totalItems = data?.length || 0;

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 2) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div
      className={cn('absolute inset-0 z-10 flex', className)}
      onClick={handleClick}
      {...props}
    >
      <div className="flex-1 cursor-pointer" />
      <div className="flex-1 cursor-pointer" />
    </div>
  );
};

export type ReelOverlayProps = HTMLAttributes<HTMLDivElement>;

export const ReelOverlay = ({
  className,
  children,
  ...props
}: ReelOverlayProps) => (
  <div
    className={cn('pointer-events-none absolute inset-0 z-30', className)}
    {...props}
  >
    {children}
  </div>
);

export type ReelHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ReelHeader = ({
  className,
  children,
  ...props
}: ReelHeaderProps) => (
  <div
    className={cn(
      'absolute top-0 right-0 left-0 z-20 p-4',
      'bg-gradient-to-b from-black/60 to-transparent',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type ReelFooterProps = HTMLAttributes<HTMLDivElement>;

export const ReelFooter = ({
  className,
  children,
  ...props
}: ReelFooterProps) => (
  <div
    className={cn(
      'absolute right-0 bottom-0 left-0 z-20 p-4',
      'bg-gradient-to-t from-black/60 to-transparent',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
