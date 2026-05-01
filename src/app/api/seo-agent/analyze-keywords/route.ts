import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { content, targetKeywords, language } = await request.json();

    const contentError = validateStringInput(content, 'المحتوى', 50, 50000);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(targetKeywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const analysis = await seoAgent.analyzeKeywords(
      content,
      targetKeywords,
      language || 'ar'
    );

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error in analyze-keywords API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحليل الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}
