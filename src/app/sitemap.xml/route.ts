import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

  const staticPages = [
    {
      url: '',
      priority: '1.0',
      changefreq: 'daily',
      keywords: {
        ar: 'مظلات جدة، سواتر، برجولات، تنسيق حدائق، ديار جدة العالمية',
        en: 'Jeddah shades, fences, pergolas, landscaping, Deyar Jeddah'
      },
      hasEnglish: true
    },
    {
      url: '/about',
      priority: '0.8',
      changefreq: 'monthly',
      keywords: {
        ar: 'ديار جدة العالمية، شركة مظلات جدة، عن الشركة',
        en: 'Deyar Jeddah, Jeddah shades company, about us'
      },
      hasEnglish: true
    },
    {
      url: '/articles',
      priority: '0.7',
      changefreq: 'daily',
      keywords: {
        ar: 'مقالات مظلات، نصائح تركيب، دليل شامل',
        en: 'Shades articles, installation tips, comprehensive guide'
      },
      hasEnglish: true
    },
    {
      url: '/contact',
      priority: '0.8',
      changefreq: 'monthly',
      keywords: {
        ar: 'اتصل بنا، رقم تليفون، عنوان الشركة جدة',
        en: 'Contact us, phone number, Jeddah company address'
      },
      hasEnglish: true
    },
    {
      url: '/services/mazallat',
      priority: '0.9',
      changefreq: 'daily',
      keywords: {
        ar: 'مظلات سيارات جدة، تركيب مظلات، مظلات حديد، مظلات قماش، أسعار مظلات السيارات، شركة مظلات جدة',
        en: 'Car shades Jeddah, shade installation, metal shades, fabric shades'
      },
      hasEnglish: true
    },
    {
      url: '/services/pergolas',
      priority: '0.9',
      changefreq: 'daily',
      keywords: {
        ar: 'برجولات جدة، تصميم برجولات، برجولات خشبية، برجولات حديد، برجولات حدائق، تركيب برجولات جدة',
        en: 'Pergolas Jeddah, pergola design, wooden pergolas, metal pergolas'
      },
      hasEnglish: true
    },
    {
      url: '/services/sawater',
      priority: '0.9',
      changefreq: 'daily',
      keywords: {
        ar: 'سواتر جدة، سواتر خصوصية، سواتر حديد، سواتر قماش، تركيب سواتر جدة، أسعار السواتر',
        en: 'Privacy fences Jeddah, metal fences, fabric fences'
      },
      hasEnglish: true
    },
    {
      url: '/services/sandwich-panel',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: {
        ar: 'ساندوتش بانل جدة، عزل حراري، ألواح ساندوتش بانل',
        en: 'Sandwich panel Jeddah, thermal insulation'
      },
      hasEnglish: true
    },
    {
      url: '/services/renovation',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: {
        ar: 'ترميم ملحقات جدة، تجديد ملحقات، شركة ترميم',
        en: 'Jeddah renovation, annex renovation'
      },
      hasEnglish: true
    },
    {
      url: '/services/landscaping',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: {
        ar: 'تنسيق حدائق جدة، تصميم حدائق، شركة تنسيق حدائق',
        en: 'Landscaping Jeddah, garden design'
      },
      hasEnglish: true
    },
    {
      url: '/services/byoot-shaar',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: {
        ar: 'بيوت شعر جدة، خيام تراثية، بيوت شعر تراثية',
        en: 'Traditional tents Jeddah, heritage tents'
      },
      hasEnglish: true
    },
    {
      url: '/services/khayyam',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: {
        ar: 'خيام جدة، خيام ملكية، خيام فاخرة، تأجير خيام',
        en: 'Royal tents Jeddah, luxury tents'
      },
      hasEnglish: true
    },
    {
      url: '/portfolio',
      priority: '0.8',
      changefreq: 'daily',
      keywords: {
        ar: 'أعمال مظلات جدة، مشاريع سواتر، معرض أعمال الديار',
        en: 'Jeddah shades projects, fence projects, Aldeyar portfolio'
      },
      hasEnglish: true
    },
    {
      url: '/portfolio/reviews',
      priority: '0.8',
      changefreq: 'weekly',
      keywords: {
        ar: 'تقييمات العملاء، آراء العملاء، تجارب العملاء جدة',
        en: 'Customer reviews, testimonials'
      },
      hasEnglish: true
    },
    {
      url: '/quote',
      priority: '0.9',
      changefreq: 'monthly',
      keywords: {
        ar: 'طلب عرض سعر، احسب التكلفة، أسعار مظلات جدة',
        en: 'Request quote, calculate cost, Jeddah shades prices'
      },
      hasEnglish: true
    },
    {
      url: '/search',
      priority: '0.7',
      changefreq: 'monthly',
      keywords: {
        ar: 'بحث في الموقع، البحث عن خدمات',
        en: 'Site search, search services'
      },
      hasEnglish: true
    },
    {
      url: '/faq',
      priority: '0.75',
      changefreq: 'monthly',
      keywords: {
        ar: 'أسئلة شائعة، الأسئلة المتكررة، استفسارات',
        en: 'FAQ, frequently asked questions'
      },
      hasEnglish: true
    },
    {
      url: '/privacy',
      priority: '0.5',
      changefreq: 'yearly',
      keywords: {
        ar: 'سياسة الخصوصية، حماية البيانات',
        en: 'Privacy policy, data protection'
      },
      hasEnglish: true
    },
    {
      url: '/terms',
      priority: '0.5',
      changefreq: 'yearly',
      keywords: {
        ar: 'شروط الخدمة، الشروط والأحكام',
        en: 'Terms of service, terms and conditions'
      },
      hasEnglish: true
    }
  ];

  let dbArticles: any[] = [];
  let dbProjects: any[] = [];
  let dbFaqs: any[] = [];

  try {
    const [articles, projects, faqs] = await Promise.all([
      (prisma as any).articles.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          updatedAt: true,
          keywords: true,
          keywordsEn: true
        },
        orderBy: { publishedAt: 'desc' }
      }),
      (prisma as any).projects.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          updatedAt: true,
          category: true,
          location: true,
          media_items: {
            select: { src: true, alt: true, description: true },
            where: { type: 'IMAGE' },
            orderBy: { order: 'asc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      (prisma as any).faqs.findMany({
        where: { status: 'PUBLISHED' },
        select: { 
          id: true, 
          slug: true, 
          question: true, 
          questionEn: true,
          updatedAt: true 
        },
        orderBy: { order: 'asc' }
      })
    ]);
    dbArticles = articles;
    dbProjects = projects;
    dbFaqs = faqs;
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  const generateUrlEntry = (page: typeof staticPages[0], locale: 'ar' | 'en' = 'ar') => {
    const isArabic = locale === 'ar';
    const urlPath = isArabic ? page.url : `/en${page.url}`;
    const arUrl = `${baseUrl}${page.url || '/'}`;
    const enUrl = `${baseUrl}/en${page.url || ''}`;

    let hreflangTags = '';
    if (page.hasEnglish) {
      hreflangTags = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;
    }

    return `<url>
    <loc>${baseUrl}${urlPath}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${hreflangTags}
  </url>`;
  };

  const arabicPages = staticPages.map(page => generateUrlEntry(page, 'ar')).join('\n  ');
  const englishPages = staticPages
    .filter(page => page.hasEnglish)
    .map(page => generateUrlEntry(page, 'en'))
    .join('\n  ');

  const articlesSitemap = dbArticles.length > 0
    ? dbArticles.map((article) => {
      const articleSlug = article.slug || article.id;
      const encodedSlug = encodeURIComponent(articleSlug);
      const lastModified = article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date().toISOString();
      const keywords = article.keywords || article.title;
      const arUrl = `${baseUrl}/articles/${encodedSlug}`;
      const enUrl = `${baseUrl}/en/articles/${encodedSlug}`;
      const enTitle = article.titleEn || article.title;
      const enKeywords = article.keywordsEn || keywords;

      const hreflangTags = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;

      // Arabic article entry
      const arEntry = `<url>
    <loc>${arUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${hreflangTags}
    <news:news>
      <news:publication>
        <news:name>ديار جدة العالمية</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${lastModified}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
      <news:keywords><![CDATA[${keywords}]]></news:keywords>
    </news:news>
  </url>`;

      // English article entry
      const enEntry = `<url>
    <loc>${enUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${hreflangTags}
    <news:news>
      <news:publication>
        <news:name>Aldeyar Global Professionals</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${lastModified}</news:publication_date>
      <news:title><![CDATA[${enTitle}]]></news:title>
      <news:keywords><![CDATA[${enKeywords}]]></news:keywords>
    </news:news>
  </url>`;

      return `${arEntry}\n  ${enEntry}`;
    }).join('\n  ')
    : '';

  const projectsSitemap = dbProjects.length > 0
    ? dbProjects.flatMap((project) => {
      const slug = project.slug || project.id;
      const lastMod = project.updatedAt ? new Date(project.updatedAt).toISOString() : new Date().toISOString();
      const arUrl = `${baseUrl}/portfolio/${encodeURIComponent(slug)}`;
      const enUrl = `${baseUrl}/en/portfolio/${encodeURIComponent(slug)}`;

      const hreflang = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;

      // بناء عناصر الصور
      const images = project.media_items && project.media_items.length > 0
        ? project.media_items.map((media: { src: string; alt?: string; description?: string }) => {
            const imgUrl = media.src.startsWith('http') ? media.src : `${baseUrl}${media.src}`;
            return `<image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:caption><![CDATA[${media.description || media.alt || project.title} | ديار جدة العالمية]]></image:caption>
      <image:title><![CDATA[${project.title} - ${project.category}]]></image:title>
      <image:geo_location>جدة، السعودية</image:geo_location>
    </image:image>`;
          }).join('\n    ')
        : `<image:image>
      <image:loc>${baseUrl}/uploads/${slug}.webp</image:loc>
      <image:caption><![CDATA[تنفيذ ${project.category} في ${project.location || 'جدة'} - ${project.title} | ديار جدة العالمية]]></image:caption>
      <image:title><![CDATA[${project.title} - ${project.category}]]></image:title>
      <image:geo_location>جدة، السعودية</image:geo_location>
    </image:image>`;

      const arEntry = `<url>
    <loc>${arUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>${hreflang}
    ${images}
  </url>`;

      const enEntry = `<url>
    <loc>${enUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>${hreflang}
    ${images}
  </url>`;

      return [arEntry, enEntry];
    }).join('\n  ')
    : '';

  const faqsSitemap = dbFaqs.length > 0
    ? dbFaqs.flatMap((faq) => {
      const slug = faq.slug || faq.id;
      const lastMod = faq.updatedAt ? new Date(faq.updatedAt).toISOString() : new Date().toISOString();
      const arUrl = `${baseUrl}/faq/${encodeURIComponent(slug)}`;
      const enUrl = `${baseUrl}/en/faq/${encodeURIComponent(slug)}`;

      const hreflang = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;

      const arEntry = `<url>
    <loc>${arUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hreflang}
  </url>`;

      const enEntry = `<url>
    <loc>${enUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hreflang}
  </url>`;

      return [arEntry, enEntry];
    }).join('\n  ')
    : '';


  const mediaSitemap = dbProjects.length > 0
    ? dbProjects.flatMap((project) => {
        const projectSlug = project.slug || project.id;
        const lastMod = project.updatedAt ? new Date(project.updatedAt).toISOString() : new Date().toISOString();
        
        return (project.media_items || []).flatMap((media: any) => {
          const arUrl = `${baseUrl}/portfolio/${projectSlug}/media/${media.id}`;
          const enUrl = `${baseUrl}/en/portfolio/${projectSlug}/media/${media.id}`;
          
          const hreflang = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;

          // إضافة النسخة العربية
          const arEntry = `<url>
    <loc>${arUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hreflang}
  </url>`;

          // إضافة النسخة الإنجليزية
          const enEntry = `<url>
    <loc>${enUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hreflang}
  </url>`;

          return [arEntry, enEntry];
        });
      }).join('\n  ')
    : '';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${arabicPages}
  ${englishPages}
  ${articlesSitemap}
  ${projectsSitemap}
  ${mediaSitemap}
  ${faqsSitemap}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      'CDN-Cache-Control': 'max-age=1800',
      'Vercel-CDN-Cache-Control': 'max-age=1800',
      'X-Robots-Tag': 'index, follow, all',
    },
  });
}
