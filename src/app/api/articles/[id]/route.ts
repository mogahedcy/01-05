import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { normalizeArticleCategoryName } from '@/lib/categoryNormalizer';

// GET - جلب مقالة مفردة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const param = resolvedParams.id;

    const article = await (prisma as any).articles.findFirst({
      where: {
        OR: [
          { id: param },
          { slug: param }
        ]
      },
      include: {
        article_media_items: { orderBy: { order: 'asc' } },
        article_tags: true,
        _count: { select: { article_comments: true, article_likes: true } }
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'المقالة غير موجودة' }, { status: 404 });
    }

    // زيادة عدد المشاهدات
    await (prisma as any).articles.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({
      ...article,
      mediaItems: article.article_media_items || [],
      tags: article.article_tags || [],
      views: (article.views || 0) + 1,
      likes: article._count?.article_likes || 0,
      commentsCount: article._count?.article_comments || 0
    });
  } catch (error) {
    console.error('❌ خطأ في جلب المقالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المقالة' },
      { status: 500 }
    );
  }
}

// PUT - تعديل المقالة
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح - يرجى تسجيل الدخول' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const articleId = resolvedParams.id;
    const data = await request.json();

    const {
      title,
      titleEn,
      content,
      contentEn,
      excerpt,
      excerptEn,
      author,
      category,
      featured,
      mediaItems,
      tags,
      metaTitle,
      metaTitleEn,
      metaDescription,
      metaDescriptionEn,
      keywords,
      keywordsEn,
      status
    } = data;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'البيانات الأساسية مطلوبة' },
        { status: 400 }
      );
    }

    const categoryValidation = normalizeArticleCategoryName(category);
    const normalizedCategory = categoryValidation.isValid && categoryValidation.normalizedCategory 
      ? categoryValidation.normalizedCategory 
      : category;

    const existingArticle = await (prisma as any).articles.findUnique({
      where: { id: articleId },
      include: {
        article_media_items: true,
        article_tags: true
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'المقالة غير موجودة' }, { status: 404 });
    }

    // حذف الوسائط والعلامات القديمة
    await (prisma as any).article_media_items.deleteMany({
      where: { articleId }
    });

    await (prisma as any).article_tags.deleteMany({
      where: { articleId }
    });

    // الترجمة التلقائية إلى الإنجليزية إذا لم يتم تقديمها
    let englishMetadata = null;
    if (!titleEn || !contentEn) {
      try {
        const { translateArticleToEnglish } = await import('@/lib/ai-translator');
        englishMetadata = await translateArticleToEnglish({
          title,
          content,
          excerpt: excerpt || content.substring(0, 200),
          category: normalizedCategory,
          tags: tags?.map((t: any) => t.name || t) || []
        });
        
        console.log('✅ تمت ترجمة المقالة بنجاح:', englishMetadata?.title);
      } catch (translationError) {
        console.warn('⚠️ فشلت الترجمة التلقائية للمقالة:', translationError);
      }
    }

    // تحديث المقالة بالبيانات الجديدة مع التراجم
    const updatedArticle = await (prisma as any).articles.update({
      where: { id: articleId },
      data: {
        title,
        titleEn: titleEn || englishMetadata?.title || null,
        content,
        contentEn: contentEn || englishMetadata?.content || null,
        excerpt: excerpt || content.substring(0, 200),
        excerptEn: excerptEn || englishMetadata?.excerpt || null,
        author: author || 'ديار جدة العالمية',
        category: normalizedCategory,
        featured: featured || false,
        metaTitle: metaTitle || title,
        metaTitleEn: metaTitleEn || englishMetadata?.metaTitle || null,
        metaDescription: metaDescription || (excerpt || content).substring(0, 160),
        metaDescriptionEn: metaDescriptionEn || englishMetadata?.metaDescription || null,
        keywords: keywords || `${normalizedCategory}, ديار جدة العالمية, مقالات`,
        keywordsEn: keywordsEn || englishMetadata?.keywords?.join(', ') || null,
        status: status || existingArticle.status,
        updatedAt: new Date(),
        article_media_items: {
          create: mediaItems?.map((item: any, index: number) => ({
            type: item.type,
            src: item.src,
            thumbnail: item.thumbnail || item.src,
            title: item.title || `ملف ${index + 1}`,
            description: item.description || '',
            order: index
          })) || []
        },
        article_tags: {
          create: tags?.map((tag: string | { name: string }) => ({
            name: typeof tag === 'string' ? tag : tag.name
          })) || []
        }
      },
      include: {
        article_media_items: true,
        article_tags: true
      }
    });

    return NextResponse.json({
      success: true,
      article: {
        ...updatedArticle,
        mediaItems: updatedArticle.article_media_items,
        tags: updatedArticle.article_tags
      },
      message: 'تم تحديث المقالة بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في تحديث المقالة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المقالة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مقالة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح - يرجى تسجيل الدخول' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const articleId = resolvedParams.id;

    await (prisma as any).article_comments.deleteMany({ where: { articleId } });
    await (prisma as any).article_likes.deleteMany({ where: { articleId } });
    await (prisma as any).article_views.deleteMany({ where: { articleId } });
    await (prisma as any).article_media_items.deleteMany({ where: { articleId } });
    await (prisma as any).article_tags.deleteMany({ where: { articleId } });

    await (prisma as any).articles.delete({ where: { id: articleId } });

    return NextResponse.json({ success: true, message: 'تم حذف المقالة بنجاح' });
  } catch (error) {
    console.error('❌ خطأ في حذف المقالة:', error);
    return NextResponse.json({ error: 'حدث خطأ في حذف المقالة' }, { status: 500 });
  }
}
