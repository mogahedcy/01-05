import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { content, keywords, pageType } = await request.json();

    const contentError = validateStringInput(content, 'المحتوى', 20, 5000);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const pageTypeError = validateStringInput(pageType, 'نوع الصفحة', 3, 100);
    if (pageTypeError) {
      return NextResponse.json({ error: pageTypeError }, { status: 400 });
    }

    const result = await seoAgent.generateMetaTags(content, keywords, pageType);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in generate-meta-tags API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد meta tags' },
      { status: 500 }
    );
  }
}
