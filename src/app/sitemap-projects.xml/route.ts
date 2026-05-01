import { NextResponse } from 'next/server';
import { safeEncodeUrl, createImageTags, createVideoTags } from '@/lib/sitemap-utils';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

  let projects: any[] = [];

  // جلب المشاريع مع معالجة الأخطاء
  try {
    // استيراد مؤجل لتجنب مشاكل البناء
    const { prisma } = await import('@/lib/prisma');
    projects = await prisma.projects.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        location: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        views: true,
        likes: true,
        rating: true,
        metaTitle: true,
        metaDescription: true,
        keywords: true,
        media_items: {
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
        project_tags: {
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
    console.error('خطأ في جلب المشاريع للخريطة:', error);
    projects = [];
  }

  // إنشاء sitemap للمشاريع مع الوسائط المحسنة ودعم اللغتين
  const projectsSitemap = projects
    .map((project) => {
      const encodedSlug = encodeURIComponent(project.slug || project.id);
      // روابط العربية (الافتراضية)
      const projectUrlAr = `${baseUrl}/portfolio/${encodedSlug}`;
      // روابط الإنجليزية
      const projectUrlEn = `${baseUrl}/en/portfolio/${encodedSlug}`;
      
      const mediaContent = project.media_items?.map((media: any) => {
        if (media.type === 'IMAGE') {
          const imageUrl = media.src.startsWith('http') ? media.src : `${baseUrl}${media.src}`;
          return createImageTags({
            imageUrl,
            caption: `${media.alt || media.title || project.title} - ${project.category} في ${project.location} من ديار جدة العالمية`,
            title: `${project.title} - ديار جدة العالمية جدة`,
            geoLocation: `${project.location}, المملكة العربية السعودية`,
            license: `${baseUrl}/terms`
          });
        } else if (media.type === 'VIDEO') {
          const videoUrl = media.src.startsWith('http') ? media.src : `${baseUrl}${media.src}`;
          const thumbnailUrl = media.thumbnail ? (media.thumbnail.startsWith('http') ? media.thumbnail : `${baseUrl}${media.thumbnail}`) : `${baseUrl}/images/video-placeholder.jpg`;
          return createVideoTags({
            thumbnailUrl,
            title: `${project.title} - فيديو ${project.category} في ${project.location}`,
            description: `${media.description || project.description} - ديار جدة العالمية جدة`,
            contentUrl: videoUrl,
            playerUrl: projectUrlAr,
            baseUrl
          });
        }
        return '';
      }).join('') || '';

      const priority = project.featured ? '0.9' : '0.8';
      const changefreq = project.featured ? 'weekly' : 'monthly';
      
      // تحسين الكلمات المفتاحية
      const keywords = project.keywords ? project.keywords : 
        `${project.category} ${project.location}, مظلات جدة, سواتر جدة, برجولات جدة, ديار جدة العالمية`;
      
      // تحسين العنوان والوصف
      const seoTitle = project.metaTitle || `${project.title} في ${project.location} | ديار جدة العالمية`;
      const seoDescription = project.metaDescription || 
        `${project.description.substring(0, 150)}... مشروع ${project.category} في ${project.location} من ديار جدة العالمية - أفضل شركة مظلات وسواتر في جدة`;

      // إنشاء إدخالين في sitemap: واحد للعربية وواحد للإنجليزية
      return `<url><loc>${safeEncodeUrl(projectUrlAr)}</loc><lastmod>${project.updatedAt.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(projectUrlAr)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(projectUrlAr)}" /><xhtml:link rel="alternate" hreflang="en" href="${safeEncodeUrl(projectUrlEn)}" /><xhtml:link rel="alternate" hreflang="x-default" href="${safeEncodeUrl(projectUrlAr)}" />${mediaContent}</url><url><loc>${safeEncodeUrl(projectUrlEn)}</loc><lastmod>${project.updatedAt.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(projectUrlEn)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(projectUrlAr)}" /><xhtml:link rel="alternate" hreflang="en" href="${safeEncodeUrl(projectUrlEn)}" /><xhtml:link rel="alternate" hreflang="x-default" href="${safeEncodeUrl(projectUrlAr)}" /></url>`;
    })
    .join('');

  // إضافة صفحات المعرض الرئيسية (العربية والإنجليزية)
  const portfolioIndexPageAr = `<url><loc>${safeEncodeUrl(`${baseUrl}/portfolio`)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(`${baseUrl}/portfolio`)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(`${baseUrl}/portfolio`)}" /><xhtml:link rel="alternate" hreflang="en" href="${safeEncodeUrl(`${baseUrl}/en/portfolio`)}" /><xhtml:link rel="alternate" hreflang="x-default" href="${safeEncodeUrl(`${baseUrl}/portfolio`)}" />${createImageTags({
    imageUrl: `${baseUrl}/images/portfolio-hero.webp`,
    caption: 'معرض أعمال ديار جدة العالمية - مشاريع مظلات وسواتر متميزة في جدة',
    title: 'معرض أعمال ديار جدة العالمية',
    geoLocation: 'جدة، المملكة العربية السعودية'
  })}</url>`;
  
  const portfolioIndexPageEn = `<url><loc>${safeEncodeUrl(`${baseUrl}/en/portfolio`)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority><xhtml:link rel="canonical" href="${safeEncodeUrl(`${baseUrl}/en/portfolio`)}" /><xhtml:link rel="alternate" hreflang="ar" href="${safeEncodeUrl(`${baseUrl}/portfolio`)}" /><xhtml:link rel="alternate" hreflang="en" href="${safeEncodeUrl(`${baseUrl}/en/portfolio`)}" /><xhtml:link rel="alternate" hreflang="x-default" href="${safeEncodeUrl(`${baseUrl}/portfolio`)}" /></url>`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${portfolioIndexPageAr}
  ${portfolioIndexPageEn}
  ${projectsSitemap}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      'CDN-Cache-Control': 'max-age=1800',
      'Vercel-CDN-Cache-Control': 'max-age=1800',
      'X-Robots-Tag': 'index, follow, all',
      'X-Projects-Count': projects.length.toString(),
      'X-Last-Updated': new Date().toISOString(),
      'Vary': 'Accept-Encoding',
      'ETag': `"projects-sitemap-${Date.now()}"`,
    },
  });
}