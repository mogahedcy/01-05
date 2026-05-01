import { type NextRequest, NextResponse } from 'next/server';
import { aiArticleAgent } from '@/lib/ai-article-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const {
      topic,
      keywords,
      category,
      wordCount,
      includeImages,
      imageCount,
      author,
      featured,
      shouldPublish
    } = await request.json();

    const topicError = validateStringInput(topic, 'الموضوع', 5, 500);
    if (topicError) {
      return NextResponse.json({ error: topicError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const categoryError = validateStringInput(category, 'التصنيف', 3, 100);
    if (categoryError) {
      return NextResponse.json({ error: categoryError }, { status: 400 });
    }

    console.log(`🤖 بدء توليد مقال عن: ${topic}`);

    const result = await aiArticleAgent.generateAndPublishArticle(
      {
        topic,
        keywords,
        category,
        wordCount: wordCount || 1000,
        includeImages: includeImages !== false,
        imageCount: imageCount || 3,
        author: author || 'ديار جدة العالمية',
        featured: featured || false
      },
      shouldPublish || false
    );

    return NextResponse.json({
      success: true,
      articleId: result.articleId,
      article: {
        title: result.article.title,
        excerpt: result.article.excerpt,
        status: result.article.status,
        category: result.article.category,
        mediaCount: result.article.mediaItems.length
      }
    });
  } catch (error: any) {
    console.error('Error in generate-article API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد المقال' },
      { status: 500 }
    );
  }
}
