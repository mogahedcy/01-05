import { type NextRequest, NextResponse } from 'next/server';
import { imageSelector } from '@/lib/image-selector';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { topic, content, keywords, imageCount } = await request.json();

    const topicError = validateStringInput(topic, 'الموضوع', 3, 500);
    if (topicError) {
      return NextResponse.json({ error: topicError }, { status: 400 });
    }

    const contentError = validateStringInput(content, 'المحتوى', 20, 10000);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const validImageCount = imageCount && typeof imageCount === 'number' 
      ? Math.max(1, Math.min(10, imageCount)) 
      : 3;

    const images = await imageSelector.selectImagesForArticle(
      topic,
      content,
      keywords,
      validImageCount
    );

    return NextResponse.json({
      success: true,
      images
    });
  } catch (error: any) {
    console.error('Error in suggest-images API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء اقتراح الصور' },
      { status: 500 }
    );
  }
}
