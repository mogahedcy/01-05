import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { content, availablePages } = await request.json();

    const contentError = validateStringInput(content, 'المحتوى', 50, 50000);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    if (!availablePages || !Array.isArray(availablePages) || availablePages.length === 0) {
      return NextResponse.json(
        { error: 'يجب توفير صفحات متاحة للربط' },
        { status: 400 }
      );
    }

    if (availablePages.length > 500) {
      return NextResponse.json(
        { error: 'عدد الصفحات كبير جداً (الحد الأقصى 500)' },
        { status: 400 }
      );
    }

    const result = await seoAgent.suggestInternalLinks(content, availablePages);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in suggest-internal-links API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء اقتراح الروابط الداخلية' },
      { status: 500 }
    );
  }
}
