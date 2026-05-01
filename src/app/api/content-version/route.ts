import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [projectsCount, articlesCount, faqsCount] = await Promise.all([
      (prisma as any).projects.count({
        where: { status: 'PUBLISHED' }
      }),
      (prisma as any).articles.count({
        where: { status: 'PUBLISHED' }
      }),
      (prisma as any).faqs.count({
        where: { status: 'PUBLISHED' }
      })
    ]);

    const response = NextResponse.json({
      projectsCount,
      articlesCount,
      faqsCount,
      timestamp: Date.now()
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching content version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content version' },
      { status: 500 }
    );
  }
}
