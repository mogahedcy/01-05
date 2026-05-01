import { NextResponse } from 'next/server';
import { safeEncodeUrl, createImageTags, createVideoTags } from '@/lib/sitemap-utils';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

  let articles: any[] = [];

  // جلب المقالات من قاعدة البيانات
  try {
    const { prisma } = await import('@/lib/prisma');
    articles = await prisma.articles.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        excerpt: true,
        author: true,
        category: true,
        featured: true,
        views: true,
        likes: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
        keywords: true,
        article_media_items: {
          select: { 
            type: true,
            src: true, 
            alt: true, 
            title: true,
            description: true,
            thumbnail: true
          },
          take: 10,
          orderBy: { order: 'asc' }
        },
        article_tags: {
          select: { name: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  } catch (error) {
    console.error('خطأ في جلب المقالات للخريطة:', error);
    articles = [];
  }

  // إنشاء sitemap للمقالات مع الوسائط المحسنة
  const articlesSitemap = articles
    .map((article) => {
      const encodedSlug = encodeURIComponent(article.slug || article.id);
      const articleUrl = `${baseUrl}/articles/${encodedSlug}`;
      
      const mediaContent = article.article_media_items?.map((media: any) => {
        if (media.type === 'IMAGE') {
          const imageUrl = media.src.startsWith('http') ? media.src : `${baseUrl}${media.src}`;
          return createImageTags({
            imageUrl,
            caption: `${media.alt || media.title || article.title} - ${article.category} من ديار جدة العالمية`,
            title: `${article.title} - ديار جدة العالمية جدة`,
            geoLocation: 'جدة، المملكة العربية السعودية',
            license: `${baseUrl}/terms`
          });
        } else if (media.type === 'VIDEO') {
          const videoUrl = media.src.startsWith('http') ? media.src : `${baseUrl}${media.src}`;
          const thumbnailUrl = media.thumbnail ? (media.thumbnail.startsWith('http') ? media.thumbnail : `${baseUrl}${media.thumbnail}`) : `${baseUrl}/images/video-placeholder.jpg`;
          return createVideoTags({
            thumbnailUrl,
            title: `${article.title} - فيديو ${article.category}`,
            description: `${media.description || article.excerpt || article.content.substring(0, 200)} - ديار جدة العالمية جدة`,
            contentUrl: videoUrl,
            playerUrl: articleUrl,
            baseUrl
          });
        }
        return '';
      }).join('') || '';

      const priority = article.featured ? '0.9' : '0.8';
      const changefreq = article.featured ? 'weekly' : 'monthly';
      const readTime = Math.ceil((article.content || '').length / 1000);
      
      const keywords = article.keywords ? article.keywords : 
        `${article.category}, ديار جدة العالمية, مقالات جدة`;
      
      const seoTitle = article.metaTitle || `${article.title} | ديار جدة العالمية`;
      const seoDescription = article.metaDescription || article.excerpt || 
        `${article.content.substring(0, 160)}... مقالة متخصصة في ${article.category} من ديار جدة العالمية`;

      const newsMarkup = `<news:news><news:publication><news:name>ديار جدة العالمية</news:name><news:language>ar</news:language></news:publication><news:publication_date>${article.publishedAt?.toISOString() || article.createdAt.toISOString()}</news:publication_date><news:title><![CDATA[${seoTitle}]]></news:title><news:keywords><![CDATA[${keywords}]]></news:keywords></news:news>`;

      return `<url><loc>${safeEncodeUrl(articleUrl)}</loc><lastmod>${article.updatedAt.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(articleUrl)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(articleUrl)}" />${mediaContent}${newsMarkup}</url>`;
    })
    .join('');

  // إضافة صفحة المقالات الرئيسية
  const articlesIndexPage = `<url><loc>${safeEncodeUrl(`${baseUrl}/articles`)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(`${baseUrl}/articles`)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(`${baseUrl}/articles`)}" />${createImageTags({
    imageUrl: `${baseUrl}/uploads/mazallat-1.webp`,
    caption: 'أرشيف مقالات ديار جدة العالمية - مقالات متخصصة في المظلات والبرجولات',
    title: 'أرشيف مقالات ديار جدة العالمية',
    geoLocation: 'جدة، المملكة العربية السعودية'
  })}</url>`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${articlesIndexPage}
  ${articlesSitemap}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      'CDN-Cache-Control': 'max-age=1800',
      'Vercel-CDN-Cache-Control': 'max-age=1800',
      'X-Robots-Tag': 'index, follow, all',
      'X-Articles-Count': articles.length.toString(),
      'X-Last-Updated': new Date().toISOString(),
      'Vary': 'Accept-Encoding',
      'ETag': `"articles-sitemap-${Date.now()}"`,
    },
  });
}
