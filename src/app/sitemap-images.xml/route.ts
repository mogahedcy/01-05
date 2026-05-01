import { prisma } from '@/lib/prisma';

interface ImageData {
  url: string;
  caption: string;
  title: string;
  alt: string;
  location: string;
}

interface PageWithImages {
  pageUrl: string;
  images: ImageData[];
  lastmod: string;
  priority: string;
  changefreq: string;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
  
  const pagesWithImages: PageWithImages[] = [];

  const staticPages: PageWithImages[] = [
    {
      pageUrl: `${baseUrl}`,
      images: [
        {
          url: `${baseUrl}/images/logo.png`,
          caption: 'شعار ديار جدة العالمية - أفضل شركة مظلات وسواتر في جدة',
          title: 'ديار جدة العالمية',
          alt: 'شعار ديار جدة العالمية',
          location: 'جدة، السعودية'
        },
        {
          url: `${baseUrl}/images/hero-bg.webp`,
          caption: 'الصفحة الرئيسية - مظلات وسواتر وبرجولات عالية الجودة في جدة',
          title: 'خدمات المظلات والسواتر في جدة',
          alt: 'مظلات وسواتر جدة - ديار جدة العالمية',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '1.0',
      changefreq: 'daily'
    },
    {
      pageUrl: `${baseUrl}/services/mazallat`,
      images: [
        {
          url: `${baseUrl}/uploads/mazallat-1.webp`,
          caption: 'مظلات سيارات عالية الجودة - تركيب احترافي في جدة مع ضمان 10 سنوات',
          title: 'مظلات سيارات جدة - ديار جدة العالمية',
          alt: 'تركيب مظلات سيارات في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/pergolas`,
      images: [
        {
          url: `${baseUrl}/uploads/pergola-1.jpg`,
          caption: 'برجولات خشبية وحديدية للحدائق - تصميم وتنفيذ احترافي في جدة',
          title: 'برجولات حدائق جدة - ديار جدة العالمية',
          alt: 'برجولات خشبية للحدائق في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/sawater`,
      images: [
        {
          url: `${baseUrl}/uploads/sawater-1.webp`,
          caption: 'سواتر خصوصية وحماية - أحدث التصاميم والخامات في جدة',
          title: 'سواتر جدة - ديار جدة العالمية',
          alt: 'سواتر خصوصية في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/sandwich-panel`,
      images: [
        {
          url: `${baseUrl}/uploads/sandwich-panel-1.jpg`,
          caption: 'ساندوتش بانل للعزل الحراري - حلول متقدمة وعالية الجودة في جدة',
          title: 'ساندوتش بانل جدة - ديار جدة العالمية',
          alt: 'ألواح ساندوتش بانل للعزل الحراري',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/landscaping`,
      images: [
        {
          url: `${baseUrl}/uploads/landscaping-1.webp`,
          caption: 'تنسيق وتصميم الحدائق - خدمات شاملة واحترافية في جدة',
          title: 'تنسيق حدائق جدة - ديار جدة العالمية',
          alt: 'تنسيق حدائق منزلية في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/byoot-shaar`,
      images: [
        {
          url: `${baseUrl}/uploads/byoot-shaar-1.webp`,
          caption: 'بيوت شعر تراثية - أصالة وجودة عالية في جدة',
          title: 'بيوت شعر جدة - ديار جدة العالمية',
          alt: 'بيوت شعر تراثية في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      pageUrl: `${baseUrl}/services/khayyam`,
      images: [
        {
          url: `${baseUrl}/uploads/khayyam-1.webp`,
          caption: 'خيام ملكية فاخرة - للمناسبات الخاصة والاستراحات في جدة',
          title: 'خيام ملكية جدة - ديار جدة العالمية',
          alt: 'خيام ملكية للمناسبات في جدة',
          location: 'جدة، السعودية'
        }
      ],
      lastmod: new Date().toISOString(),
      priority: '0.9',
      changefreq: 'weekly'
    }
  ];

  pagesWithImages.push(...staticPages);

  try {
    const projects = await prisma.projects.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        media_items: {
          where: {
            type: 'IMAGE'
          },
          orderBy: {
            order: 'asc'
          },
          select: {
            src: true,
            title: true,
            description: true,
            alt: true
          }
        }
      }
    });

    for (const project of projects) {
      if (project.media_items.length === 0) continue;

      const projectImages: ImageData[] = project.media_items.map((media, index) => {
        const imageUrl = media.src.startsWith('http') 
          ? media.src 
          : `${baseUrl}${media.src.startsWith('/') ? '' : '/'}${media.src}`;
        
        const optimizedAlt = media.alt || 
          `${project.title} - ${project.category} في ${project.location} - صورة ${index + 1} | ديار جدة العالمية`;
        
        const caption = media.description || 
          `صورة توضيحية لمشروع ${project.title} من نوع ${project.category} في ${project.location}. تنفيذ ديار جدة العالمية بجودة عالية وضمان 10 سنوات`;
        
        const imageTitle = media.title || 
          `${project.category} - ${project.title} - صورة ${index + 1} | ديار جدة العالمية`;

        return {
          url: imageUrl.replace(/\s+/g, '%20'),
          caption,
          title: imageTitle,
          alt: optimizedAlt,
          location: `${project.location || 'جدة'}، السعودية`
        };
      });

      const projectSlug = project.slug || project.id;
      const lastmod = (project.updatedAt || project.publishedAt || project.createdAt);

      pagesWithImages.push({
        pageUrl: `${baseUrl}/portfolio/${projectSlug}`,
        images: projectImages,
        lastmod: lastmod ? new Date(lastmod).toISOString() : new Date().toISOString(),
        priority: '0.8',
        changefreq: 'weekly'
      });
    }
  } catch (error) {
    console.error('خطأ في جلب صور المشاريع:', error);
  }

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function generateImagesXml(images: ImageData[]): string {
    return images.map(img => {
      const cleanUrl = img.url.replace(/\s+/g, '%20');
      return `    <image:image>
      <image:loc>${escapeXml(cleanUrl)}</image:loc>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      <image:geo_location>${escapeXml(img.location)}</image:geo_location>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`;
    }).join('\n');
  }

  const urlEntries = pagesWithImages.map(page => {
    const cleanPageUrl = page.pageUrl.replace(/\s+/g, '%20');
    const imagesXml = generateImagesXml(page.images);
    
    return `  <url>
    <loc>${escapeXml(cleanPageUrl)}</loc>
${imagesXml}
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const totalImages = pagesWithImages.reduce((sum, page) => sum + page.images.length, 0);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      'CDN-Cache-Control': 'max-age=1800',
      'Vercel-CDN-Cache-Control': 'max-age=1800',
      'X-Robots-Tag': 'index, follow, all',
      'X-Total-Pages': pagesWithImages.length.toString(),
      'X-Total-Images': totalImages.toString(),
      'X-Last-Updated': new Date().toISOString(),
      'Vary': 'Accept-Encoding',
      'ETag': `"images-sitemap-${Date.now()}"`,
    },
  });
}
