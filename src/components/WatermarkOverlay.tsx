'use client';

import Image from 'next/image';

interface WatermarkOverlayProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function WatermarkOverlay({
  position = 'bottom-right',
  opacity = 0.4,
  size = 'medium'
}: WatermarkOverlayProps) {
  const positions = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  const sizes = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div
      className={`absolute ${positions[position]} ${sizes[size]} pointer-events-none z-10`}
      style={{ opacity }}
    >
      <div className="relative w-full h-full">
        <Image
          src="/watermark-logo.webp"
          alt="ديار جدة العالمية - حقوق الصورة محفوظة"
          fill
          sizes="(max-width: 768px) 64px, 128px"
          className="object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
