import { type NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { checkAdminAuth } from '@/lib/auth';

// التحقق من توفر إعدادات Cloudinary
const isCloudinaryAvailable = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo'
);

// دالة لتحسين أسماء الملفات لـ SEO
function generateSEOFriendlyName(originalName: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return nameWithoutExt
    .toLowerCase()
    .replace(/[\s_]+/g, '-') // استبدال المسافات بـ -
    .replace(/[^\w\u0600-\u06FF-]/g, '') // الحفاظ على الأحرف العربية والإنجليزية فقط
    .replace(/-+/g, '-') // إزالة الشرطات المتكررة
    .replace(/^-|-$/g, '') // إزالة الشرطات من البداية والنهاية
    .substring(0, 50) || 'aldeyar-project'; // تحديد الطول
}

// إعدادات محسنة للرفع
const UPLOAD_CONFIG = {
  maxFileSize: isCloudinaryAvailable ? 100 * 1024 * 1024 : 50 * 1024 * 1024, // 100MB/50MB
  maxVideoSize: 200 * 1024 * 1024, // 200MB للفيديو على Cloudinary
  maxFiles: 20, // حد أقصى 20 ملف في المرة الواحدة
  allowedImageTypes: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
    'image/gif', 'image/bmp', 'image/tiff'
  ],
  allowedVideoTypes: [
    'video/mp4', 'video/mov', 'video/avi', 'video/webm', 
    'video/quicktime', 'video/x-msvideo', 'video/mkv', 'video/x-matroska'
  ],
  compressionQuality: {
    image: { quality: 85, width: 1920, height: 1080 },
    video: { quality: 'auto', width: 1280, height: 720 }
  }
};

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح - يرجى تسجيل الدخول' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // دعم رفع ملف واحد أو عدة ملفات
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File;

    console.log('📤 محاولة رفع ملف:', {
      singleFile: !!singleFile,
      singleFileName: singleFile?.name,
      singleFileType: singleFile?.type,
      singleFileSize: singleFile?.size,
      multipleFiles: files.length,
      cloudinaryAvailable: isCloudinaryAvailable
    });

    let filesToProcess: File[] = [];

    if (singleFile && singleFile.size > 0) {
      filesToProcess = [singleFile];
    } else if (files && files.length > 0) {
      // تصفية الملفات الفارغة
      filesToProcess = files.filter(file => file && file.size > 0);
    }

    if (filesToProcess.length === 0) {
      console.log('❌ لم يتم تحديد أي ملفات');
      return NextResponse.json(
        { error: 'لم يتم تحديد أي ملفات' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    // إعداد التخزين المحلي كـ fallback
    let uploadDir = '';
    if (!isCloudinaryAvailable) {
      uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
        console.log('📁 تم إنشاء مجلد uploads (fallback mode)');
      }
    }

    for (const file of filesToProcess) {
      if (!file || file.size === 0) {
        console.log('⚠️ تجاهل ملف فارغ');
        continue;
      }

      console.log('🔍 معالجة ملف:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // التحقق من نوع الملف مع دعم أفضل
      const isImage = UPLOAD_CONFIG.allowedImageTypes.includes(file.type);
      const isVideo = UPLOAD_CONFIG.allowedVideoTypes.includes(file.type);
      
      if (!isImage && !isVideo) {
        console.log('❌ نوع ملف غير مدعوم:', file.type);
        uploadedFiles.push({
          originalName: file.name,
          error: `نوع الملف ${file.type} غير مدعوم`,
          type: 'ERROR'
        });
        continue;
      }

      // التحقق من حجم الملف مع رسائل مفصلة (حجم مختلف للفيديو)
      const maxAllowedSize = isVideo && isCloudinaryAvailable ? UPLOAD_CONFIG.maxVideoSize : UPLOAD_CONFIG.maxFileSize;
      if (file.size > maxAllowedSize) {
        const maxSizeMB = (maxAllowedSize / 1024 / 1024).toFixed(0);
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
        console.log(`❌ ملف كبير جداً: ${fileSizeMB}MB > ${maxSizeMB}MB`);
        uploadedFiles.push({
          originalName: file.name,
          error: `حجم الملف ${fileSizeMB}MB يتجاوز الحد الأقصى ${maxSizeMB}MB${isVideo ? ' للفيديو' : ''}`,
          type: 'ERROR'
        });
        continue;
      }

      // التحقق من امتداد الملف للأمان
      const fileExtension = path.extname(file.name).toLowerCase();
      const validImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];
      const validVideoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
      
      if (isImage && !validImageExts.includes(fileExtension)) {
        uploadedFiles.push({
          originalName: file.name,
          error: `امتداد الملف ${fileExtension} لا يتطابق مع نوع الصورة`,
          type: 'ERROR'
        });
        continue;
      }
      
      if (isVideo && !validVideoExts.includes(fileExtension)) {
        uploadedFiles.push({
          originalName: file.name,
          error: `امتداد الملف ${fileExtension} لا يتطابق مع نوع الفيديو`,
          type: 'ERROR'
        });
        continue;
      }

      try {
        let uploadedFile;
        let useLocalFallback = !isCloudinaryAvailable;

        if (isCloudinaryAvailable) {
          try {
            // رفع إلى Cloudinary مع إعدادات محسنة
            console.log('☁️ محاولة رفع إلى Cloudinary...');
            
            // تحسين أسماء الملفات لـ SEO
            const seoFriendlyName = generateSEOFriendlyName(file.name);
            
            const cloudinaryOptions = {
              folder: 'articles',
              resource_type: (isVideo ? 'video' : 'image') as 'image' | 'video',
              public_id: `${Date.now()}-${seoFriendlyName}`
            };

            const result = await uploadToCloudinary(file, cloudinaryOptions);

            console.log('✅ تم رفع الملف إلى Cloudinary:', result.secure_url);
            console.log('📊 معلومات المعالجة:', {
              watermark: result.watermarkApplied,
              originalSize: `${(result.originalSize || 0) / 1024 / 1024}MB`,
              processedSize: `${(result.processedSize || 0) / 1024 / 1024}MB`,
              compression: `${result.compressionRatio?.toFixed(1)}%`,
              processingTime: `${result.processingTime}ms`
            });

            uploadedFile = {
              originalName: file.name,
              fileName: result.public_id,
              src: result.secure_url,
              url: result.secure_url,
              type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
              size: result.bytes,
              mimeType: file.type,
              width: result.width || null,
              height: result.height || null,
              duration: result.duration || null,
              cloudinary_public_id: result.public_id,
              cloudinary_url: result.secure_url,
              resource_type: result.resource_type,
              storage_type: 'cloudinary',
              watermarkApplied: result.watermarkApplied,
              originalSize: result.originalSize,
              processedSize: result.processedSize,
              compressionRatio: result.compressionRatio,
              processingTime: result.processingTime
            };

            // التحقق من صحة النتيجة
            if (!uploadedFile.src) {
              throw new Error('لم يتم الحصول على رابط صحيح من Cloudinary');
            }
          } catch (cloudinaryError) {
            console.warn('⚠️ فشل رفع Cloudinary، التحويل للتخزين المحلي:', cloudinaryError);
            useLocalFallback = true;
          }
        }

        if (useLocalFallback) {
          // رفع محلي (fallback)
          console.log('💾 رفع محلي (fallback mode)...');

          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = path.extname(file.name);
          const fileName = `${timestamp}_${randomString}${fileExtension}`;

          const filePath = path.join(uploadDir, fileName);
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          await writeFile(filePath, buffer);
          console.log('✅ تم حفظ الملف محلياً:', fileName);

          uploadedFile = {
            originalName: file.name,
            fileName: fileName,
            src: `/uploads/${fileName}`,
            url: `/uploads/${fileName}`,
            type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            size: file.size,
            mimeType: file.type,
            storage_type: 'local'
          };
        }

        uploadedFiles.push(uploadedFile);

      } catch (uploadError) {
        console.error('❌ خطأ في رفع الملف:', uploadError);

        uploadedFiles.push({
          originalName: file.name,
          error: `فشل في رفع ${file.name}: ${uploadError instanceof Error ? uploadError.message : 'خطأ غير معروف'}`,
          type: 'ERROR'
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'لم يتم رفع أي ملفات بنجاح' },
        { status: 400 }
      );
    }

    // فصل الملفات الناجحة عن الخاطئة
    const successfulFiles = uploadedFiles.filter(f => f && f.type !== 'ERROR');
    const failedFiles = uploadedFiles.filter(f => f && f.type === 'ERROR');

    console.log('📊 نتيجة الرفع:', {
      successful: successfulFiles.length,
      failed: failedFiles.length,
      total: uploadedFiles.length,
      storageType: isCloudinaryAvailable ? 'cloudinary' : 'local'
    });

    return NextResponse.json({
      success: true,
      message: `تم رفع ${successfulFiles.length} ملف بنجاح${failedFiles.length > 0 ? ` و فشل ${failedFiles.length} ملف` : ''}`,
      files: successfulFiles,
      errors: failedFiles.length > 0 ? failedFiles : undefined,
      count: successfulFiles.length,
      storage_type: isCloudinaryAvailable ? 'cloudinary' : 'local'
    });

  } catch (error) {
    console.error('❌ خطأ عام في رفع الملفات:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في رفع الملفات',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
