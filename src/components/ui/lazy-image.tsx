'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  fill = false,
  sizes,
  quality = 75,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate a simple blur placeholder
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">جاري التحميل...</text>
    </svg>`
  ).toString('base64')}`;

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        fill && 'absolute inset-0',
        className
      )}
      {...props}
      suppressHydrationWarning
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
          fill ? 'w-full h-full' : `w-[${width}px] h-[${height}px]`
        )}>
          <div className="text-gray-400 text-sm">جاري التحميل...</div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className={cn(
          'absolute inset-0 bg-gray-100 flex items-center justify-center',
          fill ? 'w-full h-full' : `w-[${width}px] h-[${height}px]`
        )}>
          <div className="text-gray-400 text-sm">فشل في تحميل الصورة</div>
        </div>
      )}

      {/* Actual image */}
      {(isInView || priority) && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes || (fill ? defaultSizes : undefined)}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            fill ? 'object-cover' : ''
          )}
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
          }}
        />
      )}
    </div>
  );
}

export default LazyImage;