import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 });
    }

    const comments = await prisma.comments.findMany({
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      projectId: comment.projectId,
      name: comment.name,
      email: comment.email,
      message: comment.message,
      rating: comment.rating,
      status: comment.status,
      likes: comment.likes,
      dislikes: comment.dislikes,
      ip: comment.ip,
      userAgent: comment.userAgent,
      createdAt: comment.createdAt.toISOString(),
      project: comment.projects
    }));

    return NextResponse.json({
      success: true,
      comments: formattedComments
    });

  } catch (error) {
    console.error('خطأ في جلب التعليقات:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب التعليقات' },
      { status: 500 }
    );
  }
}
