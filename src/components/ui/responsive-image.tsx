'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={75}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
