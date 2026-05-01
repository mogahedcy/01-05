/**
 * نظام التحويلات والعلامات المائية في Cloudinary
 * يوفر دوال لإضافة علامة مائية تلقائية وضغط وتحسين الصور والفيديوهات
 */

/**
 * رقم الهاتف الذي سيظهر كعلامة مائية
 */
export const WATERMARK_TEXT = '+966553719009';

/**
 * إعدادات العلامة المائية للصور
 */
export interface WatermarkOptions {
  text?: string;
  position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  fontSize?: number;
  opacity?: number;
  color?: string;
  fontFamily?: string;
}

/**
 * إعدادات معالجة الصور
 */
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  watermark?: WatermarkOptions;
}

/**
 * إعدادات معالجة الفيديو
 */
export interface VideoProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number | 'auto';
  bitrate?: string;
  watermark?: WatermarkOptions;
}

/**
 * توليد transformation للصورة مع علامة مائية
 */
export function getImageTransformation(options: ImageProcessingOptions = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 'auto',
    format = 'auto',
    watermark = {}
  } = options;

  const {
    text = WATERMARK_TEXT,
    position = 'center',
    fontSize = 48,
    opacity = 70,
    color = 'white',
    fontFamily = 'Arial'
  } = watermark;

  // تحديد الموضع
  const positionMap: Record<string, { gravity: string }> = {
    'center': { gravity: 'center' },
    'bottom-right': { gravity: 'south_east' },
    'bottom-left': { gravity: 'south_west' },
    'top-right': { gravity: 'north_east' },
    'top-left': { gravity: 'north_west' }
  };

  const positionConfig = positionMap[position] || positionMap['center'];

  const transformation = [
    // تصغير الصورة إذا كانت أكبر من الحد الأقصى
    {
      width: maxWidth,
      height: maxHeight,
      crop: 'limit',
      quality: quality,
      fetch_format: format
    },
    // إضافة العلامة المائية
    {
      overlay: {
        font_family: fontFamily,
        font_size: fontSize,
        font_weight: 'bold',
        text: text
      },
      ...positionConfig,
      opacity: opacity,
      color: color,
      effect: 'shadow:50' // إضافة ظل للنص لجعله أكثر وضوحاً
    }
  ];

  return transformation;
}

/**
 * توليد transformation للفيديو مع علامة مائية
 */
export function getVideoTransformation(options: VideoProcessingOptions = {}) {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    quality = 'auto',
    bitrate = '2000k',
    watermark = {}
  } = options;

  const {
    text = WATERMARK_TEXT,
    position = 'center',
    fontSize = 40,
    opacity = 70,
    color = 'white',
    fontFamily = 'Arial'
  } = watermark;

  // تحديد الموضع
  const positionMap: Record<string, { gravity: string }> = {
    'center': { gravity: 'center' },
    'bottom-right': { gravity: 'south_east' },
    'bottom-left': { gravity: 'south_west' },
    'top-right': { gravity: 'north_east' },
    'top-left': { gravity: 'north_west' }
  };

  const positionConfig = positionMap[position] || positionMap['center'];

  const transformation = [
    // تصغير الفيديو وضبط الجودة
    {
      width: maxWidth,
      height: maxHeight,
      crop: 'limit',
      quality: quality,
      video_codec: 'h264',
      audio_codec: 'aac',
      bit_rate: bitrate
    },
    // إضافة العلامة المائية
    {
      overlay: {
        font_family: fontFamily,
        font_size: fontSize,
        font_weight: 'bold',
        text: text
      },
      ...positionConfig,
      opacity: opacity,
      color: color,
      effect: 'shadow:50'
    }
  ];

  return transformation;
}

/**
 * توليد URL محسّن للصورة مع علامة مائية
 */
export function getWatermarkedImageUrl(
  publicId: string,
  cloudName: string,
  options: ImageProcessingOptions = {}
): string {
  const transformation = getImageTransformation(options);
  
  // بناء URL يدوياً
  const transformationStr = transformation.map((t: any) => {
    const parts = [];
    
    if (t.width) parts.push(`w_${t.width}`);
    if (t.height) parts.push(`h_${t.height}`);
    if (t.crop) parts.push(`c_${t.crop}`);
    if (t.quality) parts.push(`q_${t.quality}`);
    if (t.fetch_format) parts.push(`f_${t.fetch_format}`);
    
    if (t.overlay) {
      const overlayText = t.overlay.text.replace(/\+/g, '%2B');
      parts.push(`l_text:${t.overlay.font_family}_${t.overlay.font_size}_${t.overlay.font_weight}:${overlayText}`);
    }
    
    if (t.gravity) parts.push(`g_${t.gravity}`);
    if (t.opacity) parts.push(`o_${t.opacity}`);
    if (t.color) parts.push(`co_rgb:${t.color}`);
    if (t.effect) parts.push(`e_${t.effect}`);
    
    return parts.join(',');
  }).join('/');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}/${publicId}`;
}

/**
 * توليد URL محسّن للفيديو مع علامة مائية
 */
export function getWatermarkedVideoUrl(
  publicId: string,
  cloudName: string,
  options: VideoProcessingOptions = {}
): string {
  const transformation = getVideoTransformation(options);
  
  // بناء URL يدوياً
  const transformationStr = transformation.map((t: any) => {
    const parts = [];
    
    if (t.width) parts.push(`w_${t.width}`);
    if (t.height) parts.push(`h_${t.height}`);
    if (t.crop) parts.push(`c_${t.crop}`);
    if (t.quality) parts.push(`q_${t.quality}`);
    if (t.video_codec) parts.push(`vc_${t.video_codec}`);
    if (t.audio_codec) parts.push(`ac_${t.audio_codec}`);
    if (t.bit_rate) parts.push(`br_${t.bit_rate}`);
    
    if (t.overlay) {
      const overlayText = t.overlay.text.replace(/\+/g, '%2B');
      parts.push(`l_text:${t.overlay.font_family}_${t.overlay.font_size}_${t.overlay.font_weight}:${overlayText}`);
    }
    
    if (t.gravity) parts.push(`g_${t.gravity}`);
    if (t.opacity) parts.push(`o_${t.opacity}`);
    if (t.color) parts.push(`co_rgb:${t.color}`);
    if (t.effect) parts.push(`e_${t.effect}`);
    
    return parts.join(',');
  }).join('/');

  return `https://res.cloudinary.com/${cloudName}/video/upload/${transformationStr}/${publicId}`;
}

/**
 * حساب حجم الملف التقريبي بعد المعالجة
 * (تقريبي فقط، الحجم الفعلي يعتمد على المحتوى)
 */
export function estimateProcessedSize(
  originalSize: number,
  type: 'image' | 'video',
  quality = 85
): number {
  if (type === 'image') {
    // الصور عادةً تنخفض بنسبة 30-50% بعد التحسين
    const compressionRatio = quality < 80 ? 0.5 : 0.7;
    return Math.floor(originalSize * compressionRatio);
  } else {
    // الفيديوهات تنخفض بنسبة 40-60% بعد الضغط
    return Math.floor(originalSize * 0.5);
  }
}

/**
 * معلومات المعالجة
 */
export interface ProcessingInfo {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  watermarkApplied: boolean;
  processingTime?: number;
}

/**
 * الحصول على معلومات المعالجة
 */
export function getProcessingInfo(
  originalSize: number,
  processedSize: number,
  watermarkApplied = true,
  processingTime?: number
): ProcessingInfo {
  return {
    originalSize,
    processedSize,
    compressionRatio: ((originalSize - processedSize) / originalSize) * 100,
    watermarkApplied,
    processingTime
  };
}
