'use client';

import { useState, useRef, useEffect } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onCanPlay?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

export default function OptimizedVideo({
  src,
  poster,
  alt,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  onLoadedData,
  onCanPlay,
  onError,
  onMouseEnter
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedOnce) {
            setIsInView(true);
            if (autoPlay) {
              // محاولة التشغيل بعد delay قصير
              setTimeout(() => {
                video.play().catch(() => {
                  // إعادة المحاولة مع تأخير أكبر
                  setTimeout(() => {
                    video.play().catch(() => {});
                  }, 500);
                });
              }, 100);
              setHasPlayedOnce(true);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [autoPlay, hasPlayedOnce]);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (autoPlay && isInView) {
      video.play().catch(() => {});
    }
    onLoadedData?.(e);
  };

  const handleCanPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (autoPlay && isInView && !hasPlayedOnce) {
      video.play().catch(() => {});
      setHasPlayedOnce(true);
    }
    onCanPlay?.(e);
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload="metadata"
      onLoadedData={handleLoadedData}
      onCanPlay={handleCanPlay}
      onError={onError}
      onMouseEnter={onMouseEnter}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      متصفحك لا يدعم عرض الفيديو
    </video>
  );
}