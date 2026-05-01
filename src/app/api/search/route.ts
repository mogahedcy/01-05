import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const category = (searchParams.get('category') || '').trim();
    const location = (searchParams.get('location') || '').trim();
    const type = (searchParams.get('type') || 'all').toLowerCase();
    const sortBy = (searchParams.get('sortBy') || 'relevance').toLowerCase();
    const locale = (searchParams.get('locale') || 'ar').toLowerCase();
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;
    
    const isEn = locale === 'en';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    let projects: any[] = [];
    let projectsTotal = 0;
    let articles: any[] = [];
    let articlesTotal = 0;
    let faqs: any[] = [];
    let faqsTotal = 0;

    // --- Search Projects ---
    if (type === 'all' || type === 'projects') {
      const where: any = { status: 'PUBLISHED' };
      if (q) {
        // 🧠 Semantic Search Expansion
        const synonymsMap: Record<string, string[]> = {
          'شمس': ['مظلة', 'مظلات', 'ظل', 'تغطية', 'حرارة'],
          'حماية': ['سواتر', 'ساتر', 'تغطية', 'مظلة', 'عازل'],
          'جلسة': ['برجولة', 'برجولات', 'خيمة', 'خيام', 'تنسيق حدائق', 'عريش'],
          'مطر': ['عازل', 'تغطية', 'مظلات', 'قرميد', 'هناجر'],
          'سيارة': ['مظلات', 'موقف', 'مظلة'],
          'مسبح': ['تغطية', 'سواتر', 'مظلات', 'مسابح'],
          'قوي': ['حديد', 'ضمان', 'جودة', 'متين']
        };

        const queryWords = q.toLowerCase().split(' ');
        let searchTerms = [q];
        queryWords.forEach(word => {
          Object.keys(synonymsMap).forEach(key => {
            if (word.includes(key) || key.includes(word)) {
              searchTerms = [...searchTerms, ...synonymsMap[key]];
            }
          });
        });
        searchTerms = [...new Set(searchTerms)];

        where.OR = searchTerms.flatMap(term => [
          { [isEn ? 'titleEn' : 'title']: { contains: term, mode: 'insensitive' } },
          { [isEn ? 'descriptionEn' : 'description']: { contains: term, mode: 'insensitive' } },
          { category: { contains: term, mode: 'insensitive' } },
          { keywords: { contains: term, mode: 'insensitive' } }
        ]);
      }
      if (category) where.category = { contains: category, mode: 'insensitive' };
      if (location) where.location = { contains: location, mode: 'insensitive' };

      projectsTotal = await (prisma as any).projects.count({ where });
      projects = await (prisma as any).projects.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          category: true,
          location: true,
          createdAt: true,
          featured: true,
          rating: true,
          views: true,
          media_items: {
            where: { type: 'IMAGE' },
            take: 1,
            select: { src: true, thumbnail: true }
          }
        },
        orderBy: sortBy === 'date' ? { createdAt: 'desc' } : { featured: 'desc' },
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 50 : limit
      });
    }

    // --- Search Articles (Now from DB) ---
    if (type === 'all' || type === 'articles') {
      const where: any = { status: 'PUBLISHED' };
      if (q) {
        where.OR = [
          { [isEn ? 'titleEn' : 'title']: { contains: q, mode: 'insensitive' } },
          { [isEn ? 'contentEn' : 'content']: { contains: q, mode: 'insensitive' } },
          { [isEn ? 'excerptEn' : 'excerpt']: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ];
      }
      if (category) where.category = { contains: category, mode: 'insensitive' };

      articlesTotal = await (prisma as any).articles.count({ where });
      articles = await (prisma as any).articles.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          excerpt: true,
          excerptEn: true,
          category: true,
          article_media_items: {
            where: { type: 'IMAGE' },
            take: 1,
            select: { src: true }
          },
          createdAt: true,
          views: true,
          likes: true,
          rating: true
        },
        orderBy: { createdAt: 'desc' },
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 50 : limit
      });
    }

    // --- Search FAQs ---
    if (type === 'all' || type === 'faqs') {
      const where: any = { status: 'PUBLISHED' };
      if (q) {
        where.OR = [
          { question: { contains: q, mode: 'insensitive' } },
          { answer: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ];
      }
      faqsTotal = await (prisma as any).faqs.count({ where });
      faqs = await (prisma as any).faqs.findMany({
        where,
        skip: type === 'all' ? 0 : skip,
        take: type === 'all' ? 50 : limit
      });
    }

    // Map and Format Results
    const formattedProjects = projects.map(p => ({
      id: p.id,
      type: 'project',
      title: (isEn ? p.titleEn : p.title) || p.title,
      description: (isEn ? p.descriptionEn : p.description) || p.description,
      category: p.category,
      image: p.media_items[0]?.thumbnail || p.media_items[0]?.src || '',
      url: `${isEn ? '/en' : ''}/portfolio/${p.slug || p.id}`,
      createdAt: p.createdAt,
      views: p.views || 0,
      likes: 0, // Needs likes relation if available
      rating: p.rating || 0,
      featured: p.featured,
      author: isEn ? 'Deyar Jeddah' : 'ديار جدة',
      authorAvatar: '/logo.png',
      readTime: isEn ? 'Project' : 'مشروع',
      tags: [],
      source: 'project'
    }));

    const formattedArticles = articles.map(a => ({
      id: a.id,
      type: 'article',
      title: (isEn ? a.titleEn : a.title) || a.title,
      description: (isEn ? a.excerptEn : a.excerpt) || a.excerpt,
      category: a.category,
      image: a.article_media_items?.[0]?.src || '',
      url: `${isEn ? '/en' : ''}/articles/${a.slug || a.id}`,
      createdAt: a.createdAt,
      views: a.views || 0,
      likes: a.likes || 0,
      rating: a.rating || 0,
      featured: false,
      author: isEn ? 'Deyar Jeddah' : 'ديار جدة',
      authorAvatar: '/logo.png',
      readTime: isEn ? '5 min read' : 'قراءة 5 دقائق',
      tags: [],
      source: 'article'
    }));

    const formattedFaqs = faqs.map(f => ({
      id: f.id,
      type: 'faq',
      title: f.question,
      description: f.answer.substring(0, 150) + '...',
      category: f.category,
      image: '',
      url: `${isEn ? '/en' : ''}/faq#${f.id}`,
      createdAt: f.createdAt,
      views: f.views || 0,
      likes: 0,
      rating: 0,
      featured: false,
      author: isEn ? 'Common Question' : 'سؤال شائع',
      authorAvatar: '/logo.png',
      readTime: isEn ? 'FAQ' : 'سؤال وجواب',
      tags: [],
      source: 'faq'
    }));

    let allResults = [...formattedProjects, ...formattedArticles, ...formattedFaqs];
    
    // Final Combined Sorting
    if (sortBy === 'date') {
      allResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'views') {
      allResults.sort((a, b) => b.views - a.views);
    } else {
      // Relevance/Featured
      allResults.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Combined Pagination for 'all'
    if (type === 'all') {
      allResults = allResults.slice(skip, skip + limit);
    }

    const total = projectsTotal + articlesTotal + faqsTotal;

    return NextResponse.json({
      success: true,
      results: allResults,
      total,
      hasMore: (skip + limit) < total,
      facets: {
        projects: projectsTotal,
        articles: articlesTotal,
        faqs: faqsTotal
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

