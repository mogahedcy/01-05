import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { topic, keywords, contentType, wordCount } = await request.json();

    const topicError = validateStringInput(topic, 'الموضوع', 5, 500);
    if (topicError) {
      return NextResponse.json({ error: topicError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const validContentTypes = ['article', 'project_description', 'service_page'];
    if (!contentType || !validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'نوع المحتوى غير صالح' },
        { status: 400 }
      );
    }

    const validatedWordCount = wordCount && typeof wordCount === 'number' ? 
      Math.max(200, Math.min(5000, wordCount)) : 800;

    const result = await seoAgent.generateOptimizedContent(
      topic,
      keywords,
      contentType,
      validatedWordCount
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in generate-content API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد المحتوى' },
      { status: 500 }
    );
  }
}
