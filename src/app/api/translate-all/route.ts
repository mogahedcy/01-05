import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب إحصائيات الترجمة (كم مشروع محتاج ترجمة)
export async function GET() {
  try {
    const [projectsWithoutEn, projectsBadFallback, projectsTotal, articlesWithoutEn, articlesBadFallback, articlesTotal] = await Promise.all([
      (prisma as any).projects.count({
        where: { OR: [{ titleEn: null }, { titleEn: '' }] }
      }),
      // عناصر مترجمة بالـ fallback السيئ (تبدأ بـ "Project:" وتحتوي على أحرف عربية)
      (prisma as any).projects.count({
        where: { titleEn: { startsWith: 'Project:' } }
      }),
      (prisma as any).projects.count(),
      (prisma as any).articles.count({
        where: { OR: [{ titleEn: null }, { titleEn: '' }] }
      }),
      (prisma as any).articles.count({
        where: { titleEn: { startsWith: 'Article:' } }
      }),
      (prisma as any).articles.count()
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        projects: {
          total: projectsTotal,
          untranslated: projectsWithoutEn,
          badFallback: projectsBadFallback,
          needsTranslation: projectsWithoutEn + projectsBadFallback,
          translated: projectsTotal - projectsWithoutEn - projectsBadFallback
        },
        articles: {
          total: articlesTotal,
          untranslated: articlesWithoutEn,
          badFallback: articlesBadFallback,
          needsTranslation: articlesWithoutEn + articlesBadFallback,
          translated: articlesTotal - articlesWithoutEn - articlesBadFallback
        }
      }
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
    return NextResponse.json({ error: 'فشل في جلب الإحصائيات' }, { status: 500 });
  }
}

// POST - تشغيل الترجمة التلقائية لجميع المشاريع والمقالات
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type || 'projects'; // 'projects' or 'articles'
    const limit = Math.min(body.limit || 5, 10); // ترجمة 5 كحد أقصى في المرة الواحدة

    if (type === 'projects') {
      return await translateProjects(limit);
    } else if (type === 'articles') {
      return await translateArticles(limit);
    } else {
      return NextResponse.json({ error: 'نوع غير صالح، استخدم projects أو articles' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ خطأ في الترجمة:', error);
    return NextResponse.json({ error: 'فشل في عملية الترجمة' }, { status: 500 });
  }
}

async function translateProjects(limit: number) {
  // جلب المشاريع التي لا تحتوي على ترجمة إنجليزية
  // جلب المشاريع التي إما بدون ترجمة أو وقع عليها fallback سيئ (يبدأ بـ "Project:")
  const untranslatedProjects = await (prisma as any).projects.findMany({
    where: {
      OR: [
        { titleEn: null },
        { titleEn: '' },
        { titleEn: { startsWith: 'Project:' } }
      ]
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      location: true,
      project_tags: { select: { name: true } },
      project_materials: { select: { name: true } }
    },
    take: limit
  });

  if (untranslatedProjects.length === 0) {
    return NextResponse.json({
      success: true,
      message: '✅ جميع المشاريع مترجمة بالفعل!',
      translated: 0,
      failed: 0
    });
  }

  const { translateProjectToEnglish } = await import('@/lib/ai-translator');

  let translated = 0;
  let failed = 0;
  const results: any[] = [];

  for (const project of untranslatedProjects) {
    try {
      console.log(`🔄 ترجمة مشروع: ${project.title}`);

      const translation = await translateProjectToEnglish({
        title: project.title,
        description: project.description || '',
        category: project.category,
        location: project.location || 'جدة',
        tags: project.project_tags?.map((t: any) => t.name) || [],
        materials: project.project_materials?.map((m: any) => m.name) || []
      });

      // رفض الترجمات الفاشلة (fallback يبدأ بـ "Project:" ويحتوي على عربي)
      const isBadFallback = translation?.title?.startsWith('Project:') && /[\u0600-\u06FF]/.test(translation.title);

      if (translation && !isBadFallback) {
        await (prisma as any).projects.update({
          where: { id: project.id },
          data: {
            titleEn: translation.title,
            descriptionEn: translation.description,
            locationEn: translation.location || 'Jeddah, Saudi Arabia',
            metaTitleEn: translation.metaTitle,
            metaDescriptionEn: translation.metaDescription,
            keywordsEn: translation.keywords?.join(', ') || ''
          }
        });

        translated++;
        results.push({ id: project.id, title: project.title, titleEn: translation.title, status: 'success' });
        console.log(`✅ تمت ترجمة: ${project.title} → ${translation.title}`);
      } else if (isBadFallback) {
        // لا نحفظ الـ fallback السيئ - نتركه فارغاً لإعادة المحاولة لاحقاً
        console.warn(`⚠️ تجاهل fallback سيئ للمشروع: ${project.title}`);
        // مسح الـ fallback السيئ إن كان موجوداً
        await (prisma as any).projects.update({
          where: { id: project.id },
          data: { titleEn: null, descriptionEn: null }
        });
        failed++;
        results.push({ id: project.id, title: project.title, status: 'rate_limited_cleared' });
      } else {
        failed++;
        results.push({ id: project.id, title: project.title, status: 'failed' });
      }

      // انتظار 1 ثانية بين كل ترجمة لتجنب تجاوز حدود API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ فشل في ترجمة المشروع ${project.title}:`, err);
      failed++;
      results.push({ id: project.id, title: project.title, status: 'error' });
    }
  }

  return NextResponse.json({
    success: true,
    message: `تمت الترجمة: ${translated} مشروع، فشل: ${failed}`,
    translated,
    failed,
    results,
    remaining: await (prisma as any).projects.count({
      where: { OR: [{ titleEn: null }, { titleEn: '' }, { titleEn: { startsWith: 'Project:' } }] }
    })
  });
}

async function translateArticles(limit: number) {
  const untranslatedArticles = await (prisma as any).articles.findMany({
    where: {
      OR: [
        { titleEn: null },
        { titleEn: '' },
        { titleEn: { startsWith: 'Article:' } }
      ]
    },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      category: true,
      article_tags: { select: { name: true } }
    },
    take: limit
  });

  if (untranslatedArticles.length === 0) {
    return NextResponse.json({
      success: true,
      message: '✅ جميع المقالات مترجمة بالفعل!',
      translated: 0,
      failed: 0
    });
  }

  const { translateArticleToEnglish } = await import('@/lib/ai-translator');

  let translated = 0;
  let failed = 0;
  const results: any[] = [];

  for (const article of untranslatedArticles) {
    try {
      console.log(`🔄 ترجمة مقالة: ${article.title}`);

      const translation = await translateArticleToEnglish({
        title: article.title,
        content: article.content || '',
        excerpt: article.excerpt || '',
        category: article.category,
        tags: article.article_tags?.map((t: any) => t.name) || []
      });

      if (translation) {
        await (prisma as any).articles.update({
          where: { id: article.id },
          data: {
            titleEn: translation.title,
            contentEn: translation.content,
            excerptEn: translation.excerpt,
            metaDescriptionEn: translation.metaDescription,
            keywordsEn: translation.keywords?.join(', ') || ''
          }
        });

        translated++;
        results.push({ id: article.id, title: article.title, titleEn: translation.title, status: 'success' });
        console.log(`✅ تمت ترجمة: ${article.title} → ${translation.title}`);
      } else {
        failed++;
        results.push({ id: article.id, title: article.title, status: 'failed' });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ فشل في ترجمة المقالة ${article.title}:`, err);
      failed++;
      results.push({ id: article.id, title: article.title, status: 'error' });
    }
  }

  return NextResponse.json({
    success: true,
    message: `تمت الترجمة: ${translated} مقالة، فشل: ${failed}`,
    translated,
    failed,
    results,
    remaining: await (prisma as any).articles.count({
      where: { OR: [{ titleEn: null }, { titleEn: '' }] }
    })
  });
}
