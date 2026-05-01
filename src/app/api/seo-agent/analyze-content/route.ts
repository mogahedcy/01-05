import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { content, targetKeywords, url } = await request.json();

    const contentError = validateStringInput(content, 'المحتوى', 50, 50000);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(targetKeywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const analysis = await seoAgent.analyzeContent(
      content,
      targetKeywords,
      url
    );

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error in analyze-content API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحليل المحتوى' },
      { status: 500 }
    );
  }
}
