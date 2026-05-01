import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

interface InteractionParams {
  params: { id: string };
}

// POST - تسجيل تفاعل (مشاهدة أو إعجاب)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: projectId } = resolvedParams;
    const { type, action } = await request.json();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referrer = headersList.get('referer') || 'direct';

    // التحقق من وجود المشر��ع
    const project = await prisma.projects.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    let result: any = {};

    if (type === 'view') {
      // تسجيل المشاهدة
      const existingView = await prisma.project_views.findFirst({
        where: {
          projectId,
          ip,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
          }
        }
      });

      if (!existingView) {
        // تسجيل مشاهدة جديدة
        await prisma.project_views.create({
          data: {
            projectId,
            ip,
            userAgent,
            source: getSource(referrer),
            referrer
          }
        });

        // تحديث عداد المشاهدات
        const updatedProject = await prisma.projects.update({
          where: { id: projectId },
          data: {
            views: {
              increment: 1
            }
          },
          select: { views: true }
        });

        result = {
          type: 'view',
          success: true,
          newCount: updatedProject.views,
          isNew: true
        };
      } else {
        result = {
          type: 'view',
          success: true,
          newCount: project.views,
          isNew: false
        };
      }

    } else if (type === 'like') {
      // إدارة الإعجاب
      const existingLike = await prisma.project_likes.findUnique({
        where: {
          projectId_ip: {
            projectId,
            ip
          }
        }
      });

      if (action === 'toggle' || action === 'add') {
        if (!existingLike) {
          // إضافة إعجاب جديد
          await prisma.project_likes.create({
            data: {
              projectId,
              ip,
              userAgent
            }
          });

          // إعادة حساب عدد الإعجابات عبر علاقة project_likes
          const likesCount = await prisma.project_likes.count({
            where: { projectId }
          });

          result = {
            type: 'like',
            action: 'added',
            success: true,
            newCount: likesCount,
            isLiked: true
          };
        } else if (action === 'toggle') {
          // إزالة الإعجاب
          await prisma.project_likes.delete({
            where: {
              projectId_ip: {
                projectId,
                ip
              }
            }
          });

          // إعادة حساب عدد الإعجابات عبر علاقة project_likes
          const likesCount = await prisma.project_likes.count({
            where: { projectId }
          });

          result = {
            type: 'like',
            action: 'removed',
            success: true,
            newCount: Math.max(0, likesCount),
            isLiked: false
          };
        } else {
          const likesCount = await prisma.project_likes.count({ where: { projectId } });
          result = {
            type: 'like',
            success: true,
            newCount: likesCount,
            isLiked: true,
            message: 'لقد أعجبت بهذا المشروع مسبقاً'
          };
        }
      }
    }

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('❌ خطأ في تسجيل التفاعل:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل التفاعل' },
      { status: 500 }
    );
  }
}

// GET - جلب إحصائيات التفاعل للمستخدم الحالي
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: projectId } = resolvedParams;
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    // التحقق من وجود المشروع
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        views: true,
        _count: {
          select: {
            comments: {
              where: { status: 'APPROVED' }
            },
            project_likes: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من حالة الإعجاب للمستخدم الحالي
    const userLike = await prisma.project_likes.findUnique({
      where: {
        projectId_ip: {
          projectId,
          ip
        }
      }
    });

    return NextResponse.json({
      success: true,
      interactions: {
        views: project.views,
        likes: project._count.project_likes || 0,
        comments: project._count.comments,
        isLiked: !!userLike
      }
    });

  } catch (error: unknown) {
    console.error('❌ خطأ في جلب إحصائيات التفاعل:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

// Helper function
function getSource(referrer: string): string {
  if (referrer.includes('google.com')) return 'google';
  if (referrer.includes('facebook.com')) return 'facebook';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter';
  if (referrer.includes('linkedin.com')) return 'linkedin';
  if (referrer.includes('youtube.com')) return 'youtube';
  if (referrer.includes('tiktok.com')) return 'tiktok';
  if (referrer === 'direct') return 'direct';
  return 'other';
}
