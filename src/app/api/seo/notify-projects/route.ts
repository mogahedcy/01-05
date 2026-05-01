import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      const replitDomain = process.env.REPLIT_DEV_DOMAIN;
      if (replitDomain) {
        baseUrl = `https://${replitDomain}`;
      } else {
        baseUrl = 'https://www.deyarsu.com';
      }
    }
    
    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    
    const projects = await prisma.projects.findMany({
      where: { 
        status: 'PUBLISHED',
        slug: { not: null }
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 50
    });

    if (projects.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'لا توجد مشاريع منشورة لإبلاغ محركات البحث'
      });
    }

    const urls = projects.map(p => `${baseUrl}/portfolio/${p.slug}`);

    const indexNowKey = process.env.INDEXNOW_KEY || 'aldeyarksa-indexnow-key-2024';
    const indexNowPayload = {
      host: new URL(baseUrl).hostname,
      key: indexNowKey,
      keyLocation: `${baseUrl}/${indexNowKey}.txt`,
      urlList: urls
    };

    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload)
    });

    const success = indexNowResponse.ok || indexNowResponse.status === 202;

    return NextResponse.json({
      success,
      message: success 
        ? `تم إبلاغ محركات البحث بـ ${urls.length} مشروع بنجاح` 
        : 'فشل في إبلاغ محركات البحث',
      projectsCount: urls.length,
      status: indexNowResponse.status,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('خطأ في إبلاغ محركات البحث بالمشاريع:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'حدث خطأ في معالجة الطلب',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST /api/seo/notify-projects - إبلاغ محركات البحث عن المشاريع المنشورة'
  });
}
