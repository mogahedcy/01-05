import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { faqId, helpful } = body;

    if (!faqId || typeof helpful !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    const faq = await prisma.faqs.findUnique({
      where: { id: faqId },
      select: { helpfulness: true, clickCount: true }
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    const totalClicks = faq.clickCount + 1;
    const currentHelpful = Math.round((faq.helpfulness * faq.clickCount) / 100);
    const newHelpful = helpful ? currentHelpful + 1 : currentHelpful;
    const newHelpfulness = Math.round((newHelpful / totalClicks) * 100);

    await prisma.faqs.update({
      where: { id: faqId },
      data: {
        helpfulness: newHelpfulness,
        clickCount: totalClicks
      }
    });

    return NextResponse.json({
      success: true,
      helpfulness: newHelpfulness
    });
  } catch (error: any) {
    console.error('Error tracking FAQ helpfulness:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
