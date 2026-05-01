import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, published, draft, featured, faqs, categories] = await Promise.all([
      prisma.faqs.count(),
      prisma.faqs.count({ where: { status: 'PUBLISHED' } }),
      prisma.faqs.count({ where: { status: 'DRAFT' } }),
      prisma.faqs.count({ where: { featured: true } }),
      prisma.faqs.findMany({ select: { views: true, helpfulness: true } }),
      prisma.faqs.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } }
      })
    ]);

    const totalViews = faqs.reduce((sum, f) => sum + f.views, 0);
    const avgHelpfulness = faqs.length > 0
      ? faqs.reduce((sum, f) => sum + f.helpfulness, 0) / faqs.length
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        published,
        draft,
        featured,
        totalViews,
        avgHelpfulness,
        categories
      }
    });
  } catch (error: any) {
    console.error('Error fetching FAQ stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
