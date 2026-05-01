import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServiceMapping } from '@/lib/services-categories-mapping';

/**
 * بناء شرط WHERE صارم يعتمد على حقل category فقط
 * يمنع ظهور مشاريع فئات أخرى بسبب تطابق الكلمات في الوصف أو العنوان
 */
function buildStrictCategoryWhere(serviceSlug: string) {
  const mapping = getServiceMapping(serviceSlug);
  if (!mapping || mapping.categories.length === 0) return {};
  return {
    category: {
      in: mapping.categories
    }
  };
}

export async function getLocalizedServiceContent(serviceSlug: string, locale: string) {
  noStore();
  const isArabic = locale === 'ar';

  try {
    // خريطة الخدمة -> اسم فئة الأسئلة الشائعة
    const faqCategoryMap: Record<string, string> = {
      'sawater':        'سواتر',
      'mazallat':       'مظلات',
      'pergolas':       'برجولات',
      'landscaping':    'تنسيق حدائق',
      'sandwich-panel': 'ساندوتش بانل',
      'byoot-shaar':    'بيوت شعر',
      'khayyam':        'خيام ملكية',
      'renovation':     'ترميم',
    };
    const faqCategory = faqCategoryMap[serviceSlug] ?? 'مظلات';

    // شرط WHERE صارم يعتمد على حقل category فقط (IN clause)
    const strictWhere = buildStrictCategoryWhere(serviceSlug);

    // Fetch FAQs
    const faqs = await prisma.faqs.findMany({
      where: { status: 'PUBLISHED', category: faqCategory },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });

    // Fetch Projects — فقط الفئات المطابقة تماماً لـ category
    let projects = await prisma.projects.findMany({
      where: { status: 'PUBLISHED', ...strictWhere },
      select: {
        id: true, title: true, titleEn: true, description: true, descriptionEn: true,
        slug: true, featured: true, category: true, location: true, locationEn: true,
        suggestedKeywords: true, createdAt: true, publishedAt: true,
        media_items: {
          orderBy: { order: 'asc' },
          select: { src: true, alt: true, title: true, type: true, thumbnail: true }
        },
        _count: { select: { project_views: true, project_likes: true } }
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }]
    });

    // Fetch Articles — فقط الفئات المطابقة تماماً
    let articles = await prisma.articles.findMany({
      where: { status: 'PUBLISHED', ...strictWhere },
      select: {
        id: true, title: true, titleEn: true, excerpt: true, excerptEn: true,
        content: true, contentEn: true,
        slug: true, featured: true, publishedAt: true, createdAt: true,
        category: true, aiAnalysis: true,
        article_media_items: {
          orderBy: { order: 'asc' },
          select: { src: true, alt: true, title: true, type: true, thumbnail: true }
        },
        _count: { select: { article_views: true, article_likes: true } }
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }]
    });

    // Fetch Reviews المرتبطة بمشاريع هذه الفئة فقط
    const reviews = await prisma.comments.findMany({
      where: {
        status: 'APPROVED',
        projects: { status: 'PUBLISHED', ...strictWhere }
      },
      select: { id: true, name: true, rating: true, message: true, createdAt: true, likes: true },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      take: 50
    });

    // تطبيق الترجمة الإنجليزية إذا كانت اللغة إنجليزية
    if (!isArabic) {
      projects = projects.map((project: any) => {
        let title       = project.titleEn       || project.title;
        let description = project.descriptionEn || project.description;
        let location    = project.locationEn    || project.location;

        // Fallback من suggestedKeywords للمشاريع القديمة
        if (!project.titleEn && project.suggestedKeywords) {
          try {
            const parsed = JSON.parse(project.suggestedKeywords);
            const isBad  = parsed.title?.startsWith('Project:') && /[\u0600-\u06FF]/.test(parsed.title);
            if (!isBad) {
              if (parsed.title)       title       = parsed.title;
              if (parsed.description) description = parsed.description;
              if (parsed.location)    location    = parsed.location;
            }
          } catch (_) {}
        }
        
        return { ...project, title, description, location };
      });

      articles = articles.map((article: any) => {
        let title   = article.titleEn   || article.title;
        let excerpt = article.excerptEn || article.excerpt;

        if (!article.titleEn && article.aiAnalysis) {
          try {
            const parsed = JSON.parse(article.aiAnalysis);
            if (parsed.englishVersion) {
              if (parsed.englishVersion.title)   title   = parsed.englishVersion.title;
              if (parsed.englishVersion.excerpt) excerpt = parsed.englishVersion.excerpt;
            }
          } catch (_) {}
        }
        return { ...article, title, excerpt };
      });
    }

    return { projects, articles, faqs, reviews };
  } catch (error) {
    console.error('Error fetching localized content:', error);
    return { projects: [], articles: [], faqs: [], reviews: [] };
  }
}
