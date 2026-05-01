'use client';

import Image from 'next/image';
import { generateOptimizedAltText, type ImageMetadata } from '@/lib/image-seo-utils';
import WatermarkOverlay from '@/components/WatermarkOverlay';

interface SEOImageProps {
  src: string;
  alt?: string | null;
  title?: string;
  projectTitle?: string;
  projectCategory?: string;
  projectLocation?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  showWatermark?: boolean;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  index?: number;
}

/**
 * مكون صورة محسّن لمحركات البحث
 * يقوم تلقائياً بتوليد alt text، title، وmetadata للصور
 */
export default function SEOImage({
  src,
  alt,
  title,
  projectTitle,
  projectCategory,
  projectLocation,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes,
  quality = 85,
  showWatermark = true,
  watermarkPosition = 'bottom-right',
  index = 0
}: SEOImageProps) {
  // توليد metadata محسّن دائماً (مباشرة أثناء الرندرة لضمان وجودها في SSR وتجنب hydration mismatch)
  const generatedMetadata = generateOptimizedAltText(src, {
    projectTitle,
    projectCategory,
    projectLocation
  });
  
  // استخدام alt المخصص إذا كان موجود وصالح، وإلا استخدم المولّد
  const metadata: ImageMetadata = {
    alt: (alt && alt.trim().length >= 10) ? alt : generatedMetadata.alt,
    title: title || generatedMetadata.title,
    description: generatedMetadata.description,
    keywords: generatedMetadata.keywords.length > 0 
      ? generatedMetadata.keywords 
      : [projectCategory || '', projectLocation || 'جدة', 'ديار جدة العالمية'].filter(Boolean),
    context: generatedMetadata.context || 'project'
  };

  const imageProps = {
    src,
    alt: metadata.alt,
    title: metadata.title,
    quality,
    priority,
    className,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    ...(fill ? { fill: true } : { width: width || 800, height: height || 600 })
  };

  return (
    <div className="relative">
      <Image {...imageProps} />
      
      {showWatermark && (
        <WatermarkOverlay 
          position={watermarkPosition}
          size="medium"
          opacity={0.3}
        />
      )}

      {/* 
        ملاحظة: Structured Data تم نقله إلى server-side في صفحات الخدمات
        لتجنب hydration warnings وضمان SEO موثوق
        راجع: src/app/services/[service]/page.tsx
      */}
    </div>
  );
}
