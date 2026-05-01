import ai, { GROQ_MODEL } from './groq-client';
import { prisma } from './prisma';

export interface ProjectImageMatch {
  src: string;
  alt: string;
  description: string;
  type: 'IMAGE' | 'VIDEO';
  relevanceScore: number;
  projectTitle: string;
}

export class ProjectImageSelector {
  /**
   * يختار صور مناسبة من معرض الأعمال الموجود بناءً على موضوع المقال
   */
  async selectImagesFromProjects(
    articleTitle: string,
    articleContent: string,
    keywords: string[],
    imageCount = 3
  ): Promise<Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }>> {
    try {
      console.log('🖼️ اختيار صور من معرض الأعمال...');

      // 1. جلب جميع الصور من قاعدة البيانات
      const projects = await prisma.projects.findMany({
        where: {
          status: 'PUBLISHED'
        },
        include: {
          media_items: {
            where: {
              type: 'IMAGE'
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      });

      if (!projects || projects.length === 0) {
        console.warn('⚠️ لا توجد مشاريع منشورة');
        return this.getFallbackImages(imageCount);
      }

      // 2. جمع جميع الصور
      const allImages: Array<{
        src: string;
        title: string;
        description: string;
        projectTitle: string;
        projectCategory: string;
      }> = [];

      for (const project of projects) {
        for (const media of project.media_items) {
          allImages.push({
            src: media.src,
            title: media.title || '',
            description: media.description || '',
            projectTitle: project.title,
            projectCategory: project.category
          });
        }
      }

      if (allImages.length === 0) {
        console.warn('⚠️ لا توجد صور في المشاريع');
        return this.getFallbackImages(imageCount);
      }

      console.log(`✅ تم العثور على ${allImages.length} صورة في معرض الأعمال`);

      // 3. استخدام Groq AI لاختيار أفضل الصور المناسبة
      const selectedImages = await this.selectBestMatchingImages(
        articleTitle,
        articleContent,
        keywords,
        allImages,
        imageCount
      );

      if (selectedImages.length === 0) {
        console.warn('⚠️ لم يتمكن AI من اختيار صور مناسبة، استخدام صور عشوائية');
        return this.selectRandomImages(allImages, imageCount);
      }

      console.log(`✅ تم اختيار ${selectedImages.length} صورة مناسبة من معرض الأعمال`);
      return selectedImages;

    } catch (error) {
      console.error('❌ خطأ في اختيار الصور من المشاريع:', error);
      return this.getFallbackImages(imageCount);
    }
  }

  /**
   * يستخدم Groq AI لتحليل واختيار أفضل الصور المناسبة
   */
  private async selectBestMatchingImages(
    articleTitle: string,
    articleContent: string,
    keywords: string[],
    availableImages: Array<{
      src: string;
      title: string;
      description: string;
      projectTitle: string;
      projectCategory: string;
    }>,
    count: number
  ): Promise<Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }>> {
    try {
      // إنشاء قائمة بالصور المتاحة للـ AI
      const imagesList = availableImages.slice(0, 50).map((img, index) => ({
        index,
        title: img.title,
        description: img.description,
        projectTitle: img.projectTitle,
        category: img.projectCategory
      }));

      const prompt = `أنت خبير في اختيار الصور المناسبة للمقالات.

**المقال:**
العنوان: ${articleTitle}
المحتوى: ${articleContent.substring(0, 500)}...
الكلمات المفتاحية: ${keywords.join(', ')}

**الصور المتاحة من معرض الأعمال:**
${JSON.stringify(imagesList, null, 2)}

**المهمة:**
اختر أفضل ${count} صور من القائمة أعلاه تكون مناسبة ومرتبطة بموضوع المقال.

**معايير الاختيار:**
1. تطابق الفئة (Category) مع موضوع المقال
2. تطابق الكلمات المفتاحية
3. جودة الوصف والعنوان
4. التنوع في الصور المختارة

**أرجع النتيجة بصيغة JSON:**
{
  "selectedImages": [
    {
      "index": 5,
      "altText": "نص بديل محسّن SEO بالعربية",
      "description": "وصف الصورة بالعربية",
      "relevanceScore": 95
    }
  ]
}`;

      const response = await ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في اختيار الصور المناسبة للمحتوى التسويقي والتعليمي.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const responseContent = response.choices[0]?.message?.content || '{"selectedImages": []}';
      const result = JSON.parse(responseContent);

      if (!result.selectedImages || result.selectedImages.length === 0) {
        console.warn('⚠️ لم يتمكن AI من اختيار صور');
        return [];
      }

      // تحويل النتائج إلى الصيغة المطلوبة
      const selectedImages: Array<{
        src: string;
        alt: string;
        description: string;
        type: 'IMAGE' | 'VIDEO';
      }> = [];

      for (const selection of result.selectedImages) {
        const imageIndex = selection.index;
        if (imageIndex >= 0 && imageIndex < availableImages.length) {
          const image = availableImages[imageIndex];
          selectedImages.push({
            src: image.src,
            alt: selection.altText || image.title || 'صورة من معرض الأعمال',
            description:
              selection.description || image.description || 'صورة من مشاريع ديار جدة العالمية',
            type: 'IMAGE' as const
          });
        }
      }

      return selectedImages.slice(0, count);
    } catch (error) {
      console.error('❌ خطأ في استخدام AI لاختيار الصور:', error);
      return [];
    }
  }

  /**
   * يختار صور عشوائية من القائمة المتاحة
   */
  private selectRandomImages(
    availableImages: Array<{
      src: string;
      title: string;
      description: string;
      projectTitle: string;
    }>,
    count: number
  ): Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }> {
    const shuffled = [...availableImages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((img) => ({
      src: img.src,
      alt: img.title || `صورة من ${img.projectTitle}`,
      description: img.description || `صورة من مشروع ${img.projectTitle}`,
      type: 'IMAGE' as const
    }));
  }

  /**
   * صور احتياطية في حالة عدم وجود صور في المشاريع
   */
  private getFallbackImages(
    count: number
  ): Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }> {
    const fallbackImages = [
      {
        src: '/uploads/pergola-1.jpg',
        alt: 'برجولات خشبية فاخرة',
        description: 'تصميم برجولة خشبية عصرية'
      },
      {
        src: '/uploads/mazallat-1.webp',
        alt: 'مظلات سيارات حديثة',
        description: 'مظلة سيارات بتصميم عصري'
      },
      {
        src: '/uploads/garden-1.jpg',
        alt: 'تنسيق حدائق احترافي',
        description: 'تنسيق حديقة منزلية راقية'
      }
    ];

    return fallbackImages.slice(0, count).map((img) => ({
      ...img,
      type: 'IMAGE' as const
    }));
  }
}

export const projectImageSelector = new ProjectImageSelector();
