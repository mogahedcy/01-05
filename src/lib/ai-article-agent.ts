import { seoAgent } from './seo-agent';
import { imageSelector } from './image-selector';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';

export interface ArticleGenerationOptions {
  topic: string;
  keywords: string[];
  category: string;
  wordCount?: number;
  includeImages?: boolean;
  imageCount?: number;
  author?: string;
  featured?: boolean;
}

export interface GeneratedArticle {
  id: string;
  // Arabic fields (primary)
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  // English fields (separate)
  titleEn: string;
  contentEn: string;
  excerptEn: string;
  metaTitleEn: string;
  metaDescriptionEn: string;
  keywordsEn: string[];
  // Common fields
  category: string;
  author: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  mediaItems: Array<{
    type: 'IMAGE' | 'VIDEO';
    src: string;
    alt: string;
    description: string;
  }>;
  tags: string[];
  aiAnalysis?: { score: number; recommendations: string[] };
}

export class AIArticleAgent {
  async generateArticle(options: ArticleGenerationOptions): Promise<GeneratedArticle> {
    const {
      topic,
      keywords,
      category,
      wordCount = 1500,
      includeImages = true,
      imageCount = 3,
      author = 'ديار جدة العالمية',
      featured = false
    } = options;

    console.log('🤖 بدء توليد المقال بواسطة الذكاء الاصطناعي (ثنائي اللغة)...');

    // توليد محتوى ثنائي اللغة بشكل منفصل
    const bilingualContent = await seoAgent.generateBilingualArticle(topic, keywords);

    const arContent = bilingualContent.ar;
    const enContent = bilingualContent.en;
    const aiAnalysis = bilingualContent.aiAnalysis;

    console.log('✅ تم توليد المحتوى (عربي + إنجليزي) بشكل منفصل');

    let mediaItems: Array<{ type: 'IMAGE' | 'VIDEO'; src: string; alt: string; description: string }> = [];

    if (includeImages) {
      console.log('🖼️ جاري اختيار الصور المناسبة...');
      mediaItems = await imageSelector.selectImagesForArticle(
        arContent.title,
        arContent.content,
        keywords,
        imageCount
      );
      console.log(`✅ تم اختيار ${mediaItems.length} صور`);
    }

    const articleId = randomUUID();

    // دمج الكلمات المفتاحية العربية والإنجليزية
    const allArKeywords = [...new Set([...keywords, ...(arContent.keywords || [])])];
    const allEnKeywords = [...new Set([...(enContent.keywords || [])])];
    const allTags = [...new Set([...allArKeywords, ...allEnKeywords])];

    return {
      id: articleId,
      // Arabic
      title: arContent.title,
      content: arContent.content,
      excerpt: arContent.excerpt || arContent.metaDescription,
      metaTitle: arContent.metaTitle,
      metaDescription: arContent.metaDescription,
      keywords: allArKeywords,
      // English
      titleEn: enContent.title,
      contentEn: enContent.content,
      excerptEn: enContent.excerpt || enContent.metaDescription,
      metaTitleEn: enContent.metaTitle,
      metaDescriptionEn: enContent.metaDescription,
      keywordsEn: allEnKeywords,
      // Common
      category: category,
      author: author,
      featured: featured,
      status: 'DRAFT',
      mediaItems: mediaItems,
      tags: allTags,
      aiAnalysis: aiAnalysis
    };
  }

  async publishArticle(article: GeneratedArticle): Promise<string> {
    console.log('📝 جاري نشر المقال...');

    const slug = this.generateSlug(article.title);

    const createdArticle = await (prisma as any).articles.create({
      data: {
        id: article.id,
        // Arabic content
        title: article.title,
        slug: slug,
        content: article.content,
        excerpt: article.excerpt,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        keywords: article.keywords.join(', '),
        // English content (separate fields)
        titleEn: article.titleEn,
        contentEn: article.contentEn,
        excerptEn: article.excerptEn,
        metaTitleEn: article.metaTitleEn,
        metaDescriptionEn: article.metaDescriptionEn,
        keywordsEn: article.keywordsEn.join(', '),
        // Common
        author: article.author,
        category: article.category,
        featured: article.featured,
        status: article.status,
        aiAnalysis: article.aiAnalysis ? JSON.stringify(article.aiAnalysis) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        article_media_items: {
          create: article.mediaItems.map((item, index) => ({
            id: randomUUID(),
            type: item.type,
            src: item.src,
            alt: item.alt,
            description: item.description,
            order: index
          }))
        },
        article_tags: {
          create: article.tags.map(tag => ({
            name: tag
          }))
        }
      }
    });

    console.log('✅ تم نشر المقال بنجاح (عربي + إنجليزي)');
    return createdArticle.id;
  }

  async generateAndPublishArticle(
    options: ArticleGenerationOptions,
    shouldPublish = false
  ): Promise<{ articleId: string; article: GeneratedArticle }> {
    const article = await this.generateArticle(options);

    if (shouldPublish) {
      article.status = 'PUBLISHED';
    }

    const articleId = await this.publishArticle(article);

    return {
      articleId,
      article
    };
  }

  async generateMultipleArticles(
    topics: Array<{ topic: string; keywords: string[]; category: string }>,
    shouldPublish = false
  ): Promise<Array<{ articleId: string; title: string; status: string }>> {
    console.log(`🚀 بدء توليد ${topics.length} مقالات...`);

    const results = [];

    for (const topicData of topics) {
      try {
        const result = await this.generateAndPublishArticle(
          {
            topic: topicData.topic,
            keywords: topicData.keywords,
            category: topicData.category,
            wordCount: 1500,
            includeImages: true,
            imageCount: 3
          },
          shouldPublish
        );

        results.push({
          articleId: result.articleId,
          title: result.article.title,
          status: 'success'
        });

        console.log(`✅ تم توليد: ${result.article.title}`);
      } catch (error) {
        console.error(`❌ فشل توليد مقال عن: ${topicData.topic}`, error);
        results.push({
          articleId: '',
          title: topicData.topic,
          status: 'failed'
        });
      }
    }

    console.log(`✅ اكتملت العملية: ${results.filter(r => r.status === 'success').length}/${topics.length}`);

    return results;
  }

  private generateSlug(title: string): string {
    const slug = title
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[،؛؟!@#$%^&*()+=\[\]{};:"\\|<>\/]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug || `article-${Date.now()}`;
  }
}

export const aiArticleAgent = new AIArticleAgent();
