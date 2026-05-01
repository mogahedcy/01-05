import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// إرسال صور/فيديوهات مشروع معين إلى IndexNow
export async function POST(request: NextRequest) {
  try {
    const { projectId, mediaType } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: 'projectId مطلوب' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
    const key = process.env.INDEXNOW_KEY || 'aldeyarksa-indexnow-key-2024';
    const keyLocation = `${baseUrl}/${key}.txt`;

    // جلب المشروع مع الوسائط
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        slug: true,
        media_items: {
          where: mediaType ? { type: mediaType } : undefined,
          select: {
            type: true,
            src: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 });
    }

    // إنشاء قائمة URLs للصفحة والوسائط
    const projectSlug = project.slug || project.id;
    const projectUrl = `${baseUrl}/portfolio/${encodeURIComponent(projectSlug)}`;
    
    // إضافة صفحة المشروع
    const urls: string[] = [projectUrl];
    
    // إضافة روابط الوسائط المباشرة (Cloudinary أو المحلية)
    for (const media of project.media_items) {
      const mediaUrl = media.src.startsWith('http') 
        ? media.src 
        : `${baseUrl}${media.src.startsWith('/') ? '' : '/'}${media.src}`;
      
      // لا نضيف روابط Cloudinary الخارجية لأنها تُفهرس تلقائياً
      if (!mediaUrl.includes('cloudinary.com')) {
        urls.push(mediaUrl);
      }
    }

    // إرسال إلى IndexNow
    const payload = {
      host: baseUrl.replace(/^https?:\/\//, ''),
      key,
      keyLocation,
      urlList: urls
    };

    const indexNowEndpoint = 'https://api.indexnow.org/indexnow';

    const res = await fetch(indexNowEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'User-Agent': 'AlDeyar-SEO-Bot/1.0' 
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    const ok = res.ok;

    return NextResponse.json({
      success: ok,
      submitted: urls,
      projectId,
      mediaCount: project.media_items.length,
      endpoint: indexNowEndpoint,
      status: res.status,
      timestamp: new Date().toISOString()
    }, { status: ok ? 200 : 502 });

  } catch (error) {
    console.error('خطأ في إرسال الوسائط إلى IndexNow:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'unknown' 
    }, { status: 500 });
  }
}

// إرسال جميع وسائط المشاريع المنشورة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
    const key = process.env.INDEXNOW_KEY || 'aldeyarksa-indexnow-key-2024';
    const keyLocation = `${baseUrl}/${key}.txt`;

    // جلب أحدث المشاريع مع الوسائط
    const projects = await prisma.projects.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        media_items: {
          select: { src: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });

    // إنشاء قائمة URLs
    const urls: string[] = [];
    
    for (const project of projects) {
      const projectSlug = project.slug || project.id;
      const projectUrl = `${baseUrl}/portfolio/${encodeURIComponent(projectSlug)}`;
      urls.push(projectUrl);
    }

    if (urls.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'لا توجد مشاريع للإرسال',
        submitted: []
      });
    }

    // إرسال إلى IndexNow
    const payload = {
      host: baseUrl.replace(/^https?:\/\//, ''),
      key,
      keyLocation,
      urlList: urls
    };

    const indexNowEndpoint = 'https://api.indexnow.org/indexnow';

    const res = await fetch(indexNowEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'User-Agent': 'AlDeyar-SEO-Bot/1.0' 
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    return NextResponse.json({
      success: res.ok,
      submitted: urls,
      projectsCount: projects.length,
      status: res.status,
      timestamp: new Date().toISOString()
    }, { status: res.ok ? 200 : 502 });

  } catch (error) {
    console.error('خطأ في إرسال المشاريع إلى IndexNow:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'unknown' 
    }, { status: 500 });
  }
}
