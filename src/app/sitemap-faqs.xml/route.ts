import { NextResponse } from 'next/server';
import { safeEncodeUrl } from '@/lib/sitemap-utils';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

  let faqs: any[] = [];

  try {
    const { prisma } = await import('@/lib/prisma');
    faqs = await prisma.faqs.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        slug: true,
        keywords: true,
        featured: true,
        views: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { views: 'desc' }
      ]
    });
  } catch (error) {
    console.error('خطأ في جلب الأسئلة الشائعة للخريطة:', error);
    faqs = [];
  }

  const faqsSitemap = faqs
    .map((faq) => {
      const faqSlug = faq.slug || faq.id;
      const faqUrl = safeEncodeUrl(`${baseUrl}/faq/${faqSlug}`);
      
      const lastMod = faq.updatedAt 
        ? new Date(faq.updatedAt).toISOString().split('T')[0]
        : new Date(faq.createdAt).toISOString().split('T')[0];

      const priority = faq.featured ? '0.9' : '0.8';
      const changefreq = 'weekly';

      const keywords = faq.keywords || '';

      return `  <url>
    <loc>${faqUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${faqUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${faqUrl}" />
    <news:news>
      <news:publication>
        <news:name>ديار جدة العالمية</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${lastMod}</news:publication_date>
      <news:title><![CDATA[${faq.question}]]></news:title>
      <news:keywords><![CDATA[${keywords || faq.category}]]></news:keywords>
    </news:news>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${faqsSitemap}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'index, follow, all',
      'X-FAQs-Count': faqs.length.toString(),
      'X-Last-Updated': new Date().toISOString(),
      'Vary': 'Accept-Encoding',
      'ETag': `"faqs-sitemap-${Date.now()}"`,
    },
  });
}
