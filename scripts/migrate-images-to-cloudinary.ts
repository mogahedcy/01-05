import { v2 as cloudinary } from 'cloudinary';
import { readdir, readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

interface MigrationResult {
  totalFiles: number;
  uploaded: number;
  failed: number;
  skipped: number;
  updatedProjects: number;
  updatedArticles: number;
  errors: Array<{ file: string; error: string }>;
}

// دالة مساعدة للحصول على جميع الملفات بشكل recursive
async function getAllFiles(dirPath: string, baseDir: string = dirPath): Promise<Array<{ path: string; relativePath: string }>> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files: Array<{ path: string; relativePath: string }> = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // البحث في المجلدات الفرعية
      const subFiles = await getAllFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      // إضافة الملف مع المسار النسبي
      const relativePath = path.relative(baseDir, fullPath);
      files.push({ path: fullPath, relativePath });
    }
  }

  return files;
}

async function uploadLocalFileToCloudinary(
  filePath: string,
  fileName: string
): Promise<{ secure_url: string; public_id: string } | null> {
  try {
    // تحديد نوع الملف قبل قراءته (لتوفير الذاكرة)
    const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(fileName);
    
    // تخطي الفيديوهات إذا لم يتم تفعيل دعم الفيديو في Cloudinary
    if (isVideo) {
      console.log(`⏭️ تخطي: ${fileName} (ملف فيديو - يحتاج إعدادات خاصة في Cloudinary)`);
      return null;
    }
    
    const fileBuffer = await readFile(filePath);
    const folder = 'migrated-images';
    
    console.log(`📤 رفع: ${fileName} إلى Cloudinary...`);
    
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          public_id: fileName.replace(/\.[^/.]+$/, ''), // إزالة الامتداد
          overwrite: false,
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    console.log(`✅ نجح: ${fileName} -> ${result.secure_url}`);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`❌ فشل: ${fileName}`, error);
    return null;
  }
}

async function migrateImages(): Promise<MigrationResult> {
  const result: MigrationResult = {
    totalFiles: 0,
    uploaded: 0,
    failed: 0,
    skipped: 0,
    updatedProjects: 0,
    updatedArticles: 0,
    errors: [],
  };

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // التحقق من وجود المجلد
  if (!existsSync(uploadsDir)) {
    console.log('⚠️ مجلد uploads غير موجود');
    return result;
  }

  console.log('📁 قراءة الملفات المحلية (بما في ذلك المجلدات الفرعية)...');
  const allFiles = await getAllFiles(uploadsDir);
  result.totalFiles = allFiles.length;

  console.log(`📊 تم العثور على ${allFiles.length} ملف محلي`);

  // خريطة لتتبع الروابط القديمة والجديدة
  const urlMapping = new Map<string, string>();

  // رفع كل ملف إلى Cloudinary
  for (const { path: filePath, relativePath } of allFiles) {
    const oldUrl = `/uploads/${relativePath}`;

    const uploadResult = await uploadLocalFileToCloudinary(filePath, relativePath);

    if (uploadResult) {
      urlMapping.set(oldUrl, uploadResult.secure_url);
      result.uploaded++;
    } else {
      // تحديد نوع الفشل
      const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(relativePath);
      if (isVideo) {
        result.skipped++;
        result.errors.push({ file: relativePath, error: 'تم تخطي ملف الفيديو' });
      } else {
        result.failed++;
        result.errors.push({ file: relativePath, error: 'فشل الرفع إلى Cloudinary' });
      }
    }

    // تأخير صغير لتجنب تجاوز حدود API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📝 تحديث قاعدة البيانات...');

  // تحديث المشاريع
  try {
    const projects = await prisma.projects.findMany({
      include: { media_items: true },
    });

    for (const project of projects) {
      let needsUpdate = false;

      // تحديث عناصر الوسائط
      for (const media of project.media_items) {
        if (media.src.startsWith('/uploads/')) {
          const newUrl = urlMapping.get(media.src);
          if (newUrl) {
            await prisma.media_items.update({
              where: { id: media.id },
              data: { src: newUrl },
            });
            needsUpdate = true;
            console.log(`  ✅ تحديث صورة المشروع: ${media.src} -> ${newUrl}`);
          }
        }

        if (media.thumbnail?.startsWith('/uploads/')) {
          const newUrl = urlMapping.get(media.thumbnail);
          if (newUrl) {
            await prisma.media_items.update({
              where: { id: media.id },
              data: { thumbnail: newUrl },
            });
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        result.updatedProjects++;
      }
    }

    console.log(`✅ تم تحديث ${result.updatedProjects} مشروع`);
  } catch (error) {
    console.error('❌ خطأ في تحديث المشاريع:', error);
    result.errors.push({ file: 'projects', error: String(error) });
  }

  // تحديث المقالات
  try {
    const articles = await prisma.articles.findMany({
      include: { article_media_items: true },
    });

    for (const article of articles) {
      let needsUpdate = false;

      // تحديث عناصر الوسائط
      for (const media of article.article_media_items) {
        if (media.src.startsWith('/uploads/')) {
          const newUrl = urlMapping.get(media.src);
          if (newUrl) {
            await prisma.article_media_items.update({
              where: { id: media.id },
              data: { src: newUrl },
            });
            needsUpdate = true;
            console.log(`  ✅ تحديث صورة المقالة: ${media.src} -> ${newUrl}`);
          }
        }

        if (media.thumbnail?.startsWith('/uploads/')) {
          const newUrl = urlMapping.get(media.thumbnail);
          if (newUrl) {
            await prisma.article_media_items.update({
              where: { id: media.id },
              data: { thumbnail: newUrl },
            });
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        result.updatedArticles++;
      }
    }

    console.log(`✅ تم تحديث ${result.updatedArticles} مقالة`);
  } catch (error) {
    console.error('❌ خطأ في تحديث المقالات:', error);
    result.errors.push({ file: 'articles', error: String(error) });
  }

  return result;
}

async function main() {
  console.log('🚀 بدء ترحيل الصور إلى Cloudinary...\n');

  // التحقق من إعداد Cloudinary
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ خطأ: لم يتم إعداد متغيرات Cloudinary البيئية');
    process.exit(1);
  }

  console.log('✅ Cloudinary مُعَدّ بنجاح\n');

  const result = await migrateImages();

  console.log('\n' + '='.repeat(60));
  console.log('📊 نتائج الترحيل:');
  console.log('='.repeat(60));
  console.log(`إجمالي الملفات: ${result.totalFiles}`);
  console.log(`تم الرفع بنجاح: ${result.uploaded} ✅`);
  console.log(`فشل الرفع: ${result.failed} ❌`);
  console.log(`تم تخطيها: ${result.skipped} ⏭️`);
  console.log(`المشاريع المحدثة: ${result.updatedProjects} 📦`);
  console.log(`المقالات المحدثة: ${result.updatedArticles} 📝`);
  console.log('='.repeat(60));

  if (result.errors.length > 0) {
    console.log('\n⚠️ أخطاء:');
    result.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.error}`);
    });
  }

  console.log('\n✅ اكتمل الترحيل!');
  
  await prisma.$disconnect();
}

main().catch(error => {
  console.error('❌ خطأ فادح:', error);
  process.exit(1);
});
