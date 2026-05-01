import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { keywords } = await request.json();

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    if (keywords.length < 3) {
      return NextResponse.json(
        { error: 'يجب توفير 3 كلمات مفتاحية على الأقل للتجميع' },
        { status: 400 }
      );
    }

    const result = await seoAgent.clusterKeywords(keywords);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in cluster-keywords API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تجميع الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}
