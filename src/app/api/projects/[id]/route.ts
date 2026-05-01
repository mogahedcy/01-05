import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeCategoryName } from '@/lib/categoryNormalizer';
import { checkAdminAuth } from '@/lib/auth';

// GET - جلب مشروع واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const param = resolvedParams.id;

    // السماح باستخدام المعرف أو الslug - استعلام واحد محسّن
    const project = await prisma.projects.findFirst({
      where: {
        OR: [
          { id: param },
          { slug: param }
        ]
      },
      include: {
        media_items: { orderBy: { order: 'asc' } },
        project_tags: true,
        project_materials: true,
        _count: { select: { comments: true, project_likes: true } }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 });
    }

    // زيادة عدد المشاهدات باستخدام معرف المشروع الحقيقي
    await prisma.projects.update({
      where: { id: project.id },
      data: { views: { increment: 1 } }
    });

    console.log('📖 تم جلب المشروع:', project.title);

    return NextResponse.json({
      ...project,
      mediaItems: (project as any).media_items,
      tags: (project as any).project_tags || [],
      materials: (project as any).project_materials || [],
      views: (project.views || 0) + 1,
      likes: (project._count as any)?.project_likes || 0,
      rating: project.rating || 0
    });

  } catch (error) {
    console.error('❌ خطأ في جلب المشروع:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المشروع' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مشروع
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
    const projectId = resolvedParams.id;
    const data = await request.json();
    console.log('🔧 تعديل المشروع:', projectId, data);

    const {
      title,
      titleEn,
      description,
      descriptionEn,
      category,
      location,
      locationEn,
      completionDate,
      client,
      clientEn,
      featured,
      projectDuration,
      projectCost,
      mediaItems,
      tags,
      materials
    } = data;

    // التحقق من صحة البيانات
    if (!title || !description || !category || !location) {
      return NextResponse.json(
        { error: 'البيانات الأساسية مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة الفئة وتحويلها تلقائياً
    const categoryValidation = normalizeCategoryName(category);
    if (!categoryValidation.isValid || !categoryValidation.normalizedCategory) {
      return NextResponse.json(
        { error: `الفئة "${category}" غير صالحة. الرجاء اختيار فئة من القائمة المتاحة.` },
        { status: 400 }
      );
    }

    const normalizedCategory = categoryValidation.normalizedCategory;
    
    if (categoryValidation.wasTransformed) {
      console.log(`✅ تم تحويل الفئة: "${category}" → "${normalizedCategory}"`);
    }

    // التحقق من وجود المشروع
    const existingProject = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        media_items: true,
        project_tags: true,
        project_materials: true
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // حذف الوسائط والعلامات والمواد القديمة
    await prisma.media_items.deleteMany({
      where: { projectId }
    });

    await prisma.project_tags.deleteMany({
      where: { projectId }
    });

    await prisma.project_materials.deleteMany({
      where: { projectId }
    });

    // ترجمة المشروع إلى الإنجليزية باستخدام GROQ عند التحديث لضمان المزامنة
    let englishTranslation = null;
    try {
      const { translateProjectToEnglish } = await import('@/lib/ai-translator');
      englishTranslation = await translateProjectToEnglish({
        title,
        description,
        category: normalizedCategory,
        location,
        tags: tags || [],
        materials: materials || []
      }, mediaItems?.filter((m: any) => m.type === 'IMAGE').length || 0,
         mediaItems?.filter((m: any) => m.type === 'VIDEO').length || 0);
      
      if (englishTranslation) {
        console.log('✅ تم تحديث ترجمة المشروع بنجاح');
      }
    } catch (e) {
      console.error('⚠️ فشل في تحديث ترجمة المشروع:', e);
    }

    // تحديث المشروع مع البيانات الجديدة
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: {
        title,
        titleEn: englishTranslation?.title || titleEn || null,
        description,
        descriptionEn: englishTranslation?.description || descriptionEn || null,
        category: normalizedCategory,
        location,
        locationEn: englishTranslation?.location || locationEn || null,
        completionDate: new Date(completionDate),
        client: client || null,
        clientEn: clientEn || null,
        featured: featured || false,
        projectDuration: projectDuration || '',
        projectCost: projectCost || '',
        metaTitleEn: englishTranslation?.metaTitle || undefined,
        metaDescriptionEn: englishTranslation?.metaDescription || undefined,
        keywordsEn: englishTranslation?.keywords?.join(', ') || undefined,
        updatedAt: new Date(),
        suggestedKeywords: englishTranslation ? JSON.stringify(englishTranslation) : undefined,
        media_items: {
          create: mediaItems?.map((item: { type: string; src: string; thumbnail?: string; title?: string; description?: string; duration?: number }, index: number) => ({
            type: item.type,
            src: item.src,
            thumbnail: item.thumbnail || item.src,
            title: item.title || `ملف ${index + 1}`,
            description: item.description || '',
            duration: item.duration || null,
            order: index
          })) || []
        },
        project_tags: {
          create: tags?.map((tag: string | { name: string }) => ({
            name: typeof tag === 'string' ? tag : tag.name
          })) || []
        },
        project_materials: {
          create: materials?.map((material: string | { name: string }) => ({
            name: typeof material === 'string' ? material : material.name
          })) || []
        }
      },
      include: {
        media_items: true,
        project_tags: true,
        project_materials: true,
        _count: {
          select: {
            comments: true,
            project_likes: true,
            project_views: true
          }
        }
      }
    });

    console.log('✅ تم تحديث المشروع بنجاح:', updatedProject.title);

    // إشعار محركات البحث تلقائياً بالتحديث (إذا كان منشوراً)
    if (updatedProject.status === 'PUBLISHED') {
      try {
        const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
        const projectUrl = `/portfolio/${updatedProject.slug || updatedProject.id}`;
        
        // استخدام API الأرشفة الموحدة الجديدة
        await fetch(`${origin}/api/indexing/auto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: projectUrl })
        });
        
        console.log('🔔 تم إشعار محركات البحث بتحديث المشروع');
      } catch (error) {
        console.warn('⚠️ تعذر إشعار محركات البحث بالتحديث:', error);
      }
    }

    return NextResponse.json({
      success: true,
      project: { ...updatedProject, mediaItems: (updatedProject as any).media_items },
      message: 'تم تحديث المشروع بنجاح'
    });

  } catch (error: unknown) {
    console.error('❌ خطأ في تحديث المشروع:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المشروع' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مشروع
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
    const projectId = resolvedParams.id;

    // التحقق من وجود المشروع
    const existingProject = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        media_items: true,
        project_tags: true,
        project_materials: true,
        comments: true
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    console.log('🗑️ حذف المشروع:', existingProject.title);

    // حذف البيانات المرتبطة أولاً
    await prisma.comments.deleteMany({
      where: { projectId }
    });

    await prisma.media_items.deleteMany({
      where: { projectId }
    });

    await prisma.project_tags.deleteMany({
      where: { projectId }
    });

    await prisma.project_materials.deleteMany({
      where: { projectId }
    });

    // حذف المشروع
    await prisma.projects.delete({
      where: { id: projectId }
    });

    console.log('✅ تم حذف المشروع بنجاح');

    // إشعار محركات البحث بحذف الصفحة
    if (existingProject.status === 'PUBLISHED') {
      try {
        const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
        const projectUrl = `/portfolio/${existingProject.slug || existingProject.id}`;
        
        // استخدام API الأرشفة الموحدة للحذف
        await fetch(`${origin}/api/indexing/auto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: projectUrl, action: 'delete' })
        });
        
        console.log('🔔 تم إشعار محركات البحث بحذف المشروع');
      } catch (error) {
        console.warn('⚠️ تعذر إشعار محركات البحث بالحذف:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    });

  } catch (error: unknown) {
    console.error('❌ خطأ في حذف المشروع:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الم��روع' },
      { status: 500 }
    );
  }
}
