import { type NextRequest, NextResponse } from 'next/server';
import { aiFAQAgent } from '@/lib/ai-faq-agent';
import { requireAdminAuth } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { niche, count, shouldPublish } = await request.json();

    if (!niche || typeof niche !== 'string' || niche.trim().length < 3) {
      return NextResponse.json(
        { error: 'يرجى إدخال موضوع صحيح (3 أحرف على الأقل)' },
        { status: 400 }
      );
    }

    const faqCount = Math.min(Math.max(count || 5, 1), 20);

    console.log(`🧠 بدء التوليد الذكي للأسئلة عن: ${niche}`);

    const result = await aiFAQAgent.generateSmartFAQs(
      niche.trim(),
      faqCount,
      shouldPublish || false
    );

    return NextResponse.json({
      success: true,
      faqs: result.faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer.substring(0, 200) + '...',
        category: faq.category,
        status: faq.status
      })),
      stats: result.stats
    });
  } catch (error: any) {
    console.error('Error in generate-multiple-faqs API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد الأسئلة' },
      { status: 500 }
    );
  }
}
