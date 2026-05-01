import { type NextRequest, NextResponse } from 'next/server';
import { seoAgent } from '@/lib/seo-agent';
import { requireAdminAuth, validateStringInput } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { competitorUrl, industry } = await request.json();

    const urlError = validateStringInput(competitorUrl, 'رابط المنافس', 10, 500);
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 });
    }

    const industryError = validateStringInput(industry, 'المجال', 3, 200);
    if (industryError) {
      return NextResponse.json({ error: industryError }, { status: 400 });
    }

    const analysis = await seoAgent.analyzeCompetitor(competitorUrl, industry);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error in analyze-competitor API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحليل المنافس' },
      { status: 500 }
    );
  }
}
