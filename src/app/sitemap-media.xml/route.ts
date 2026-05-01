import { prisma } from '@/lib/prisma';

interface MediaEntry {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  title: string;
  caption: string;
  projectTitle: string;
  projectUrl: string;
  location: string;
  lastmod: string;
  thumbnail?: string;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
  
  const mediaEntries: MediaEntry[] = [];

  try {
    // جلب جميع الوسائط من المشاريع المنشورة
    const projects = await prisma.projects.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        location: true,
        updatedAt: true,
        media_items: {
          orderBy: {
            order: 'asc'
          },
          select: {
            id: true,
            type: true,
            src: true,
            title: true,
            description: true,
            alt: true,
            thumbnail: true
          }
        }
      }
    });

    // إنشاء إدخال لكل صورة/فيديو بشكل فردي
    for (const project of projects) {
      const projectSlug = project.slug || project.id;
      const projectUrl = `${baseUrl}/portfolio/${encodeURIComponent(projectSlug)}`;
      
      for (let i = 0; i < project.media_items.length; i++) {
        const media = project.media_items[i];
        const mediaUrl = media.src.startsWith('http') 
          ? media.src 
          : `${baseUrl}${media.src.startsWith('/') ? '' : '/'}${media.src}`;

        const title = media.title || `${project.title} - ${project.category} - ${media.type === 'VIDEO' ? 'فيديو' : 'صورة'} ${i + 1}`;
        const caption = media.description || media.alt || 
          `${media.type === 'VIDEO' ? 'فيديو' : 'صورة'} ${project.title} - ${project.category} في ${project.location} | ديار جدة العالمية`;

        mediaEntries.push({
          url: mediaUrl.replace(/\s+/g, '%20'),
          type: media.type as 'IMAGE' | 'VIDEO',
          title,
          caption,
          projectTitle: project.title,
          projectUrl,
          location: `${project.location || 'جدة'}، السعودية`,
          lastmod: project.updatedAt.toISOString(),
          thumbnail: media.thumbnail || undefined
        });
      }
    }
  } catch (error) {
    console.error('خطأ في جلب الوسائط للخريطة:', error);
  }

  // فصل الصور والفيديوهات
  const images = mediaEntries.filter(m => m.type === 'IMAGE');
  const videos = mediaEntries.filter(m => m.type === 'VIDEO');

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // إنشاء إدخالات الصور - استخدام التنسيق المدعوم من Google
  const imageEntries = images.map(img => `  <url>
    <loc>${escapeXml(img.projectUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
    </image:image>
    <lastmod>${img.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  // إنشاء إدخالات الفيديوهات
  const videoEntries = videos.map(vid => {
    const thumbnail = vid.thumbnail || `${baseUrl}/images/video-placeholder.jpg`;
    return `  <url>
    <loc>${escapeXml(vid.projectUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnail)}</video:thumbnail_loc>
      <video:title><![CDATA[${vid.title}]]></video:title>
      <video:description><![CDATA[${vid.caption}]]></video:description>
      <video:content_loc>${escapeXml(vid.url)}</video:content_loc>
      <video:publication_date>${vid.lastmod}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
      <video:uploader info="${baseUrl}"><![CDATA[ديار جدة العالمية]]></video:uploader>
    </video:video>
    <lastmod>${vid.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${imageEntries}
${videoEntries}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      'CDN-Cache-Control': 'max-age=1800',
      'Vercel-CDN-Cache-Control': 'max-age=1800',
      'X-Robots-Tag': 'index, follow, all',
      'X-Total-Images': images.length.toString(),
      'X-Total-Videos': videos.length.toString(),
      'X-Total-Media': mediaEntries.length.toString(),
      'X-Last-Updated': new Date().toISOString(),
      'Vary': 'Accept-Encoding',
      'ETag': `"media-sitemap-${Date.now()}"`,
    },
  });
}
