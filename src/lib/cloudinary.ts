import { v2 as cloudinary } from 'cloudinary';
import { 
  getImageTransformation, 
  getVideoTransformation, 
  getProcessingInfo,
  estimateProcessedSize 
} from './cloudinary-transformations';

// هذا الملف للاستخدام في Server Components فقط
// لاستخدام دوال Cloudinary في Client Components، استخدم cloudinary-helpers.ts

// تكوين Cloudinary
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  });
  console.log('✅ Cloudinary configured successfully with cloud:', process.env.CLOUDINARY_CLOUD_NAME?.trim());
} else {
  console.log('⚠️ Cloudinary not configured. Using local fallback mode.');
  console.log('📋 Environment variables status:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'configured' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'configured' : 'missing'
  });
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at: string;
  watermarkApplied?: boolean;
  originalSize?: number;
  processedSize?: number;
  compressionRatio?: number;
  processingTime?: number;
}

/**
 * رفع الشعار إلى Cloudinary (يتم استدعاؤها مرة واحدة فقط)
 */
export async function uploadWatermarkToCloudinary(): Promise<void> {
  if (!isCloudinaryConfigured) {
    console.warn('⚠️ Cloudinary غير مُعَدّ. تخطي رفع الشعار.');
    return;
  }

  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // قراءة ملف الشعار من public folder
    const watermarkPath = path.join(process.cwd(), 'public', 'watermark-logo.webp');
    
    // التحقق من وجود الملف
    if (!fs.existsSync(watermarkPath)) {
      console.warn('⚠️ ملف الشعار غير موجود في:', watermarkPath);
      return;
    }

    const watermarkBuffer = fs.readFileSync(watermarkPath);

    // رفع الشعار إلى Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'watermarks',
          public_id: 'company-watermark',
          resource_type: 'image',
          overwrite: true,
          invalidate: true
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(watermarkBuffer);
    });

    console.log('✅ تم رفع الشعار بنجاح إلى Cloudinary:', result);
  } catch (error) {
    console.error('❌ خطأ في رفع الشعار:', error);
  }
}

/**
 * رفع ملف إلى Cloudinary مع علامة مائية تلقائية
 */
export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: 'auto' | 'image' | 'video' | 'raw';
    transformation?: any;
    timeout?: number;
    applyWatermark?: boolean;
  } = {}
): Promise<CloudinaryUploadResult> {
  // التحقق من إعداد Cloudinary
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary غير مُعَدّ. يرجى إضافة بيانات الاعتماد في ملف .env');
  }

  try {
    // التحقق من صحة الملف أولاً
    if (!file || file.size === 0) {
      throw new Error('الملف فارغ أو غير صالح');
    }

    // تحويل File إلى Buffer مع معالجة الأخطاء
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);

      if (buffer.length === 0) {
        throw new Error('فشل في قراءة محتوى الملف');
      }
    } catch (error) {
      throw new Error(`فشل في معالجة الملف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    // تحديد نوع الملف مع فحص أعمق
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new Error(`نوع الملف غير مدعوم: ${file.type}`);
    }

    // تحديد timeout حسب نوع الملف (أطول للفيديو)
    const uploadTimeout = options.timeout || (isVideo ? 300000 : 120000); // 5 دقائق للفيديو، 2 دقيقة للصور

    // تطبيق العلامة المائية افتراضياً
    const applyWatermark = options.applyWatermark !== false;
    let transformation = options.transformation;

    // إضافة العلامة المائية للصور والفيديوهات
    if (applyWatermark) {
      if (isImage) {
        transformation = getImageTransformation({
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 'auto',
          format: 'auto'
        });
      } else if (isVideo) {
        transformation = getVideoTransformation({
          maxWidth: 1280,
          maxHeight: 720,
          quality: 'auto',
          bitrate: '2000k'
        });
      }
    }

    const startTime = Date.now();
    const originalSize = file.size;

    const defaultOptions = {
      folder: options.folder || 'portfolio',
      resource_type: options.resource_type || (isVideo ? 'video' : isImage ? 'image' : 'auto'),
      public_id: options.public_id,
      transformation: transformation,
      timeout: uploadTimeout,
      chunk_size: isVideo ? 6000000 : undefined, // 6MB chunks للفيديو لتحسين الرفع
      ...options
    };

    console.log('🚀 رفع ملف إلى Cloudinary:', {
      name: file.name,
      type: file.type,
      size: file.size,
      folder: defaultOptions.folder,
      resource_type: defaultOptions.resource_type,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      timeout: `${uploadTimeout / 1000}s`,
      watermark: applyWatermark
    });

    // رفع الملف مع timeout مدمج من Cloudinary
    const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) {
            console.error('❌ خطأ في رفع Cloudinary:', error);
            reject(error);
          } else if (result) {
            console.log('✅ تم رفع الملف بنجاح:', {
              url: result.secure_url,
              public_id: result.public_id,
              resource_type: result.resource_type,
              bytes: result.bytes
            });

            // التحقق من صحة النتيجة
            if (!result.secure_url) {
              reject(new Error('لم يتم إرجاع رابط آمن من Cloudinary'));
              return;
            }

            // إضافة معلومات المعالجة
            const processingTime = Date.now() - startTime;
            const processedSize = result.bytes;
            const processingInfo = getProcessingInfo(
              originalSize,
              processedSize,
              applyWatermark,
              processingTime
            );

            const enrichedResult = {
              ...result,
              watermarkApplied: applyWatermark,
              originalSize,
              processedSize,
              compressionRatio: processingInfo.compressionRatio,
              processingTime
            } as CloudinaryUploadResult;

            resolve(enrichedResult);
          } else {
            reject(new Error('لم يتم إرجاع نتيجة من Cloudinary'));
          }
        }
      );
      uploadStream.end(buffer);
    });

    return result;
  } catch (error) {
    console.error('❌ خطأ في رفع الملف:', error);

    // رسائل خطأ مخصصة حسب نوع الخطأ
    let errorMessage = 'خطأ غير معروف';

    if (error instanceof Error) {
      if (error.message.includes('Invalid cloud_name')) {
        errorMessage = 'اسم Cloud غير صحيح في إعدادات Cloudinary';
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'API Key غير صحيح في إعدادات Cloudinary';
      } else if (error.message.includes('file size') || error.message.includes('File size too large')) {
        errorMessage = 'حجم الملف كبير جداً. الحد الأقصى للفيديو 200MB';
      } else if (error.message.includes('timeout') || error.message.includes('انتهت مهلة')) {
        errorMessage = 'انتهت مهلة رفع الملف. يرجى المحاولة مرة أخرى أو استخدام ملف أصغر';
      } else if (error.message.includes('resource_type') || error.message.includes('unsupported format')) {
        errorMessage = 'نوع الملف غير مدعوم. الصيغ المدعومة: MP4, MOV, AVI, WebM';
      } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'خطأ في الاتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(`فشل في رفع الملف: ${errorMessage}`);
  }
}

/**
 * حذف ملف من Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<any> {
  try {
    console.log('🗑️ حذف ملف من Cloudinary:', publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true
    });

    console.log('✅ تم حذف الملف:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في حذف الملف:', error);
    throw error;
  }
}

/**
 * الحصول على رابط محسن للصورة
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: Record<string, unknown> = {}
): string {
  return cloudinary.url(publicId, {
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    flags: 'progressive',
    ...options
  });
}

/**
 * الحصول على رابط محسن للفيديو
 */
export function getOptimizedVideoUrl(
  publicId: string,
  options: Record<string, unknown> = {}
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
    width: options.width,
    height: options.height,
    ...options
  });
}

/**
 * إنشاء thumbnail للفيديو
 */
export function getVideoThumbnail(
  publicId: string,
  options: Record<string, unknown> = {}
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    quality: 'auto',
    width: options.width || 300,
    height: options.height || 200,
    crop: 'fill',
    start_offset: options.start_offset || '0',
    ...options
  });
}

/**
 * تحسين الصورة تلقائياً حسب الاستخدام
 */
export function getResponsiveImageUrl(
  publicId: string,
  usage: 'thumbnail' | 'card' | 'hero' | 'gallery' = 'card'
): string {
  const configs = {
    thumbnail: { width: 150, height: 150, crop: 'thumb', gravity: 'face' },
    card: { width: 400, height: 300, crop: 'fill' },
    hero: { width: 1200, height: 600, crop: 'fill' },
    gallery: { width: 800, height: 600, crop: 'fill' }
  };

  const config = configs[usage];

  return cloudinary.url(publicId, {
    ...config,
    quality: 'auto',
    fetch_format: 'auto',
    flags: 'progressive',
    dpr: 'auto'
  });
}

/**
 * إنشاء مجموعة من الصور بأحجام مختلفة (responsive images)
 */
export function getImageSrcSet(publicId: string): string {
  const sizes = [320, 640, 768, 1024, 1280, 1920];

  return sizes.map(size => {
    const url = cloudinary.url(publicId, {
      width: size,
      quality: 'auto',
      fetch_format: 'auto',
      flags: 'progressive'
    });
    return `${url} ${size}w`;
  }).join(', ');
}

// إعادة تصدير دوال المساعدة من cloudinary-helpers
export { isCloudinaryUrl, extractPublicIdFromUrl } from './cloudinary-helpers';

// تصدير Cloudinary client
export { cloudinary as default };
export { cloudinary };