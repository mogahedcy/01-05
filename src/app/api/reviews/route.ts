import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // إعداد شروط التصفية
    const whereCondition = rating ? { rating: Number.parseInt(rating) } : {};

    // إعداد الترتيب
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    }

    // جلب المراجعات مع بيانات المشروع
    const reviews = await prisma.comment.findMany({
      where: whereCondition,
      orderBy,
      include: {
        project: {
          select: {
            title: true,
            id: true
          }
        }
      }
    });

    // تنسيق البيانات
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      name: review.name,
      message: review.message,
      rating: review.rating,
      createdAt: review.createdAt.toISOString(),
      projectTitle: review.project?.title || 'مشروع غير محدد',
      projectId: review.project?.id || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=059669&color=fff`
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      total: formattedReviews.length
    });

  } catch (error) {
    console.error('خطأ في جلب المراجعات:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المراجعات' },
      { status: 500 }
    );
  }
}