import { type NextRequest, NextResponse } from 'next/server';
import { aiArticleAgent } from '@/lib/ai-article-agent';
import { requireAdminAuth } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { topics, shouldPublish } = await request.json();

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'قائمة المواضيع مطلوبة' },
        { status: 400 }
      );
    }

    if (topics.length > 10) {
      return NextResponse.json(
        { error: 'الحد الأقصى 10 مقالات في المرة الواحدة' },
        { status: 400 }
      );
    }

    for (const topicData of topics) {
      if (!topicData.topic || !topicData.keywords || !topicData.category) {
        return NextResponse.json(
          { error: 'كل موضوع يجب أن يحتوي على topic, keywords, category' },
          { status: 400 }
        );
      }
    }

    console.log(`🚀 بدء توليد ${topics.length} مقالات...`);

    const results = await aiArticleAgent.generateMultipleArticles(
      topics,
      shouldPublish || false
    );

    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      total: topics.length,
      successCount,
      failedCount,
      results
    });
  } catch (error: any) {
    console.error('Error in generate-multiple-articles API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد المقالات' },
      { status: 500 }
    );
  }
}
