import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // جلب الإحصائيات الأساسية
    const [
      totalProjects,
      publishedProjects,
      featuredProjects,
      totalViews,
      totalLikes,
      totalComments,
      recentViews,
      pendingComments
    ] = await Promise.all([
      prisma.projects.count(),
      prisma.projects.count({ where: { status: 'PUBLISHED' } }),
      prisma.projects.count({ where: { featured: true } }),
      prisma.projects.aggregate({ _sum: { views: true } }),
      prisma.project_likes.count(),
      prisma.comments.count({ where: { status: 'APPROVED' } }),
      prisma.project_views.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.comments.count({ where: { status: 'PENDING' } })
    ]);

    // اتجاهات 7 أيام
    const last7Days = Array.from({ length: 7 }).map((_, idx) => {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - idx));
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - idx) + 1);
      return { dayStart, dayEnd };
    });

    // تحسين جلب اتجاهات 7 أيام (استعلامات مجمعة بدلاً من استعلام لكل يوم)
    const [allViews7Days, allLikes7Days, allComments7Days] = await Promise.all([
      prisma.project_views.findMany({
        where: { createdAt: { gte: last7Days[0].dayStart } },
        select: { createdAt: true }
      }),
      prisma.project_likes.findMany({
        where: { createdAt: { gte: last7Days[0].dayStart } },
        select: { createdAt: true }
      }),
      prisma.comments.findMany({
        where: { createdAt: { gte: last7Days[0].dayStart }, status: 'APPROVED' },
        select: { createdAt: true }
      })
    ]);

    const trends = last7Days.map(({ dayStart, dayEnd }, i) => {
      const dateStr = dayStart.toISOString().slice(0, 10);
      return {
        date: dateStr,
        views: allViews7Days.filter(v => v.createdAt >= dayStart && v.createdAt < dayEnd).length,
        likes: allLikes7Days.filter(l => l.createdAt >= dayStart && l.createdAt < dayEnd).length,
        comments: allComments7Days.filter(c => c.createdAt >= dayStart && c.createdAt < dayEnd).length
      };
    });

    // مصادر الزيارات آخر 30 يوم
    const sourcesGroup = await prisma.project_views.groupBy({
      by: ['source'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { source: true }
    });
    const sources = Object.fromEntries(sourcesGroup.map(s => [s.source || 'other', s._count.source]));

    // أفضل المشاريع آخر 30 يوم (حسب المشاهدات)
    const topViews = await prisma.project_views.groupBy({
      by: ['projectId'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { projectId: true },
      orderBy: { _count: { projectId: 'desc' } },
      take: 5
    });
    const topProjectIds = topViews.map(v => v.projectId);
    const topProjectsRaw = topProjectIds.length
      ? await prisma.projects.findMany({
          where: { id: { in: topProjectIds } },
          include: { media_items: { take: 1, orderBy: { order: 'asc' } } }
        })
      : [];
    const topProjects = topViews.map(v => {
      const p = topProjectsRaw.find(pr => pr.id === v.projectId);
      return p
        ? {
            id: p.id,
            title: p.title,
            slug: p.slug,
            cover: p.media_items?.[0]?.src || null,
            views: v._count.projectId
          }
        : { id: v.projectId, title: 'مشروع', slug: v.projectId, cover: null, views: v._count.projectId };
    });

    // أحدث التعليقات
    const recentComments = await prisma.comments.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { projects: { select: { id: true, title: true, slug: true } } }
    });

    // حساب معدل التفاعل
    const totalInteractions = (totalLikes || 0) + (totalComments || 0);
    const engagement = totalProjects > 0
      ? Math.round((totalInteractions / totalProjects) * 100) / 100
      : 0;

    // إحصائيات متقدمة للتقييمات
    const allComments = await prisma.comments.findMany({
      select: {
        rating: true,
        likes: true,
        dislikes: true,
        createdAt: true,
        projectId: true
      }
    });

    // متوسط التقييم الإجمالي
    const averageRating = allComments.length > 0
      ? allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length
      : 0;

    // توزيع التقييمات
    const ratingDistribution = {
      5: allComments.filter(c => c.rating === 5).length,
      4: allComments.filter(c => c.rating === 4).length,
      3: allComments.filter(c => c.rating === 3).length,
      2: allComments.filter(c => c.rating === 2).length,
      1: allComments.filter(c => c.rating === 1).length
    };

    // إجمالي الإعجابات وعدم الإعجاب على التعليقات
    const totalCommentLikes = allComments.reduce((sum, c) => sum + c.likes, 0);
    const totalCommentDislikes = allComments.reduce((sum, c) => sum + c.dislikes, 0);

    // معدل رضا العملاء (نسبة التقييمات 4-5 نجوم)
    const positiveRatings = ratingDistribution[5] + ratingDistribution[4];
    const satisfactionRate = allComments.length > 0
      ? (positiveRatings / allComments.length) * 100
      : 0;

    // المشاريع الأكثر تعليقاً
    const commentsByProject = await prisma.comments.groupBy({
      by: ['projectId'],
      _count: { id: true },
      where: { status: 'APPROVED' },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    const mostCommentedProjectIds = commentsByProject.map(p => p.projectId);
    const mostCommentedProjects = mostCommentedProjectIds.length
      ? await prisma.projects.findMany({
          where: { id: { in: mostCommentedProjectIds } },
          select: {
            id: true,
            title: true,
            slug: true,
            rating: true,
            media_items: { take: 1, orderBy: { order: 'asc' }, select: { src: true } }
          }
        })
      : [];

    const topCommentedProjects = commentsByProject.map(cp => {
      const project = mostCommentedProjects.find(p => p.id === cp.projectId);
      return project ? {
        id: project.id,
        title: project.title,
        slug: project.slug,
        rating: project.rating,
        commentCount: cp._count.id,
        cover: project.media_items[0]?.src || null
      } : null;
    }).filter(Boolean);

    // تحسين اتجاهات التقييمات خلال 30 يوم (استعلام واحد بدلاً من 30)
    const commentsLast30Days = allComments.filter(c => c.createdAt >= thirtyDaysAgo);
    
    const ratingTrends = Array.from({ length: 30 }).map((_, idx) => {
      const dayStart = new Date(now.getTime() - (29 - idx) * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayComments = commentsLast30Days.filter(c => 
        c.createdAt >= dayStart && c.createdAt < dayEnd
      );

      const avgRating = dayComments.length > 0
        ? dayComments.reduce((sum, c) => sum + c.rating, 0) / dayComments.length
        : 0;

      return {
        date: dayStart.toISOString().slice(0, 10),
        count: dayComments.length,
        averageRating: Math.round(avgRating * 10) / 10
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        publishedProjects,
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes || 0,
        totalComments,
        featuredProjects,
        recentViews,
        pendingComments,
        engagement
      },
      trends,
      sources,
      topProjects,
      recentComments: recentComments.map(c => ({
        id: c.id,
        name: c.name,
        message: c.message,
        rating: c.rating,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        project: c.projects
      })),
      reviewStats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: allComments.length,
        ratingDistribution,
        totalCommentLikes,
        totalCommentDislikes,
        satisfactionRate: Math.round(satisfactionRate * 10) / 10,
        topCommentedProjects,
        ratingTrends
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في جلب الإحصائيات',
        stats: {
          totalProjects: 0,
          publishedProjects: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          featuredProjects: 0,
          recentViews: 0,
          pendingComments: 0,
          engagement: 0
        },
        trends: [],
        sources: {},
        topProjects: [],
        recentComments: []
      },
      { status: 500 }
    );
  }
}
