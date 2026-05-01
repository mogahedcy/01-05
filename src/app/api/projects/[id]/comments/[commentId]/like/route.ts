import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// POST - إضافة/إزالة إعجاب لتعليق
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { type } = await request.json(); // 'like' or 'dislike'
    
    // الحصول على IP المستخدم
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // التحقق من وجود التعليق
    const comment = await prisma.comments.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'التعليق غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من وجود إعجاب سابق من نفس IP
    const existingLike = await prisma.comment_likes.findUnique({
      where: { 
        commentId_ip: {
          commentId,
          ip
        }
      }
    });

    let newLikesCount = comment.likes;
    let newDislikesCount = comment.dislikes;

    if (existingLike) {
      // إذا كان نفس النوع، نحذف الإعجاب
      if (existingLike.type === type) {
        await prisma.comment_likes.delete({
          where: { id: existingLike.id }
        });

        if (type === 'like') {
          newLikesCount = Math.max(0, comment.likes - 1);
        } else {
          newDislikesCount = Math.max(0, comment.dislikes - 1);
        }
      } else {
        // إذا كان نوع مختلف، نغير النوع
        await prisma.comment_likes.update({
          where: { id: existingLike.id },
          data: { type }
        });

        if (type === 'like') {
          newLikesCount = comment.likes + 1;
          newDislikesCount = Math.max(0, comment.dislikes - 1);
        } else {
          newLikesCount = Math.max(0, comment.likes - 1);
          newDislikesCount = comment.dislikes + 1;
        }
      }
    } else {
      // إضافة إعجاب جديد
      await prisma.comment_likes.create({
        data: {
          id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          commentId,
          ip,
          type,
          userAgent
        }
      });

      if (type === 'like') {
        newLikesCount = comment.likes + 1;
      } else {
        newDislikesCount = comment.dislikes + 1;
      }
    }

    // تحديث عدد الإعجابات في التعليق
    const updatedComment = await prisma.comments.update({
      where: { id: commentId },
      data: {
        likes: newLikesCount,
        dislikes: newDislikesCount
      }
    });

    return NextResponse.json({
      success: true,
      likes: updatedComment.likes,
      dislikes: updatedComment.dislikes,
      userAction: existingLike ? (existingLike.type === type ? 'removed' : 'changed') : 'added'
    });

  } catch (error) {
    console.error('خطأ في الإعجاب بالتعليق:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الإعجاب' },
      { status: 500 }
    );
  }
}
