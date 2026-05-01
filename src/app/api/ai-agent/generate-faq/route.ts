import { type NextRequest, NextResponse } from 'next/server';
import { aiFAQAgent } from '@/lib/ai-faq-agent';
import { requireAdminAuth, validateStringInput, validateKeywordsArray } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const {
      topic,
      keywords,
      category,
      count,
      shouldPublish
    } = await request.json();

    const topicError = validateStringInput(topic, 'الموضوع', 5, 500);
    if (topicError) {
      return NextResponse.json({ error: topicError }, { status: 400 });
    }

    const keywordsError = validateKeywordsArray(keywords);
    if (keywordsError) {
      return NextResponse.json({ error: keywordsError }, { status: 400 });
    }

    const categoryError = validateStringInput(category, 'التصنيف', 3, 100);
    if (categoryError) {
      return NextResponse.json({ error: categoryError }, { status: 400 });
    }

    console.log(`🤖 بدء توليد أسئلة شائعة عن: ${topic}`);

    const result = await aiFAQAgent.generateAndSaveFAQs({
      topic,
      keywords,
      category,
      count: count || 5,
      shouldPublish: shouldPublish || false
    });

    return NextResponse.json({
      success: true,
      faqs: result.faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        category: faq.category,
        status: faq.status
      })),
      stats: result.stats
    });
  } catch (error: any) {
    console.error('Error in generate-faq API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء توليد الأسئلة' },
      { status: 500 }
    );
  }
}
