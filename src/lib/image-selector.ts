import ai, { GROQ_MODEL } from './groq-client';
import { unsplashSearch } from './unsplash-search';
import { projectImageSelector } from './project-image-selector';

export interface ImageSuggestion {
  query: string;
  relevance_score: number;
  alt_text: string;
  description: string;
}

export class ImageSelector {
  async suggestImages(
    topic: string,
    content: string,
    keywords: string[],
    imageCount = 3
  ): Promise<ImageSuggestion[]> {
    try {
      const prompt = `أنت خبير في اختيار الصور المناسبة للمقالات والمحتوى.

الموضوع: ${topic}
المحتوى: ${content.substring(0, 500)}
الكلمات المفتاحية: ${keywords.join(', ')}
عدد الصور المطلوبة: ${imageCount}

اقترح ${imageCount} صور مناسبة لهذا المحتوى. لكل صورة، قدم:
- query: استعلام بحث الصورة بالإنجليزية (3-5 كلمات رئيسية)
- relevance_score: درجة الملاءمة (1-100)
- alt_text: نص بديل محسّن بالعربية
- description: وصف الصورة بالعربية

قدم النتيجة بصيغة JSON:
{
  "images": [
    {
      "query": "modern pergola construction",
      "relevance_score": 95,
      "alt_text": "مظلات حديثة في جدة",
      "description": "صورة توضح تصميم مظلات عصرية"
    }
  ]
}`;

      const response = await ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: "أنت خبير في اختيار الصور المناسبة للمحتوى التسويقي والتعليمي." },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const responseContent = response.choices[0]?.message?.content || '{"images": []}';
      const result = JSON.parse(responseContent);
      return result.images || [];
    } catch (error) {
      console.error('Error suggesting images:', error);
      return [];
    }
  }

  async selectImagesForArticle(
    title: string,
    content: string,
    keywords: string[],
    imageCount = 3,
    useProjectImages = true
  ): Promise<Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }>> {
    
    // أولاً: محاولة استخدام الصور من معرض الأعمال (الخيار المفضل)
    if (useProjectImages) {
      try {
        console.log('🖼️ المحاولة 1: اختيار الصور من معرض الأعمال...');
        const projectImages = await projectImageSelector.selectImagesFromProjects(
          title,
          content,
          keywords,
          imageCount
        );

        if (projectImages && projectImages.length > 0) {
          console.log(`✅ تم اختيار ${projectImages.length} صورة من معرض الأعمال`);
          return projectImages;
        }
        console.log('⚠️ لم يتم العثور على صور مناسبة في معرض الأعمال، المحاولة من Unsplash...');
      } catch (error) {
        console.error('❌ خطأ في اختيار الصور من معرض الأعمال:', error);
        console.log('⚠️ المحاولة من Unsplash...');
      }
    }

    // ثانياً: استخدام Unsplash كبديل
    const suggestions = await this.suggestImages(title, content, keywords, imageCount);
    
    if (suggestions.length === 0) {
      console.warn('⚠️ فشل في اقتراح الصور من AI');
      return [];
    }

    const images: Array<{ src: string; alt: string; description: string; type: 'IMAGE' | 'VIDEO' }> = [];
    
    for (const suggestion of suggestions) {
      try {
        console.log(`🔍 البحث عن صورة في Unsplash: ${suggestion.query}`);

        const searchResults = await unsplashSearch.searchImages(suggestion.query, {
          count: 1,
          orientation: 'landscape'
        });

        if (searchResults.length > 0) {
          const result = searchResults[0];
          try {
            const uploadedUrl = await unsplashSearch.downloadAndUploadImage(
              result.url,
              suggestion.alt_text
            );

            if (uploadedUrl) {
              images.push({
                src: uploadedUrl,
                alt: suggestion.alt_text,
                description: suggestion.description,
                type: 'IMAGE' as const
              });
              console.log(`  ✅ تمت إضافة الصورة من Unsplash: ${suggestion.alt_text}`);
            } else {
              console.warn(`  ⚠️ فشل رفع صورة من Unsplash`);
            }
          } catch (uploadError) {
            console.warn(`  ⚠️ خطأ في رفع الصورة:`, uploadError);
          }
        } else {
          console.log(`  ⚠️ لم يتم العثور على نتائج في Unsplash للاستعلام: ${suggestion.query}`);
        }
      } catch (error) {
        console.error(`  ❌ خطأ في البحث عن الصورة:`, error);
      }
    }

    if (images.length === 0) {
      console.warn('⚠️ لم يتم العثور على أي صور، استخدام الصور الافتراضية');
      return suggestions.slice(0, imageCount).map(() => ({
        src: '/uploads/pergola-1.jpg',
        alt: 'صورة افتراضية',
        description: 'صورة افتراضية',
        type: 'IMAGE' as const
      }));
    }

    console.log(`✅ تم اختيار ${images.length} صورة بنجاح`);
    return images;
  }
}

export const imageSelector = new ImageSelector();
