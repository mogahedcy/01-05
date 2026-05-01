
import { type NextRequest, NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default-webhook-secret';

interface ContentUpdatePayload {
  type: 'project' | 'service' | 'article' | 'page';
  action: 'created' | 'updated' | 'deleted';
  id?: string;
  url?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    
    if (!signature || signature !== `sha256=${WEBHOOK_SECRET}`) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح - توقيع webhook خاطئ'
      }, { status: 401 });
    }

    const payload: ContentUpdatePayload = await request.json();
    
    // تسجيل التحديث
    console.log('تحديث محتوى جديد:', payload);

    // إشعار محركات البحث تلقائياً عند التحديث
    if (payload.action === 'created' || payload.action === 'updated') {
      try {
        const refreshResponse = await fetch(`${request.nextUrl.origin}/api/sitemap/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AlDeyar-Webhook/1.0'
          }
        });

        const refreshResult = await refreshResponse.json();
        
        return NextResponse.json({
          success: true,
          message: 'تم استلام التحديث وإشعار محركات البحث',
          payload,
          sitemap_refresh: refreshResult,
          timestamp: new Date().toISOString()
        });

      } catch (refreshError) {
        console.error('خطأ في إشعار محركات البحث:', refreshError);
        
        return NextResponse.json({
          success: true,
          message: 'تم استلام التحديث ولكن فشل إشعار محركات البحث',
          payload,
          sitemap_refresh_error: refreshError instanceof Error ? refreshError.message : 'خطأ غير معروف',
          timestamp: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام التحديث',
      payload,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطأ في webhook تحديث المحتوى:', error);
    
    return NextResponse.json({
      success: false,
      message: 'فشل في معالجة webhook',
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook لتحديث المحتوى وإشعار محركات البحث',
    usage: {
      endpoint: 'POST /api/webhook/content-updated',
      headers: {
        'x-webhook-signature': 'sha256=your-webhook-secret',
        'Content-Type': 'application/json'
      },
      payload_example: {
        type: 'project',
        action: 'created',
        id: '123',
        url: 'https://www.deyarsu.com/portfolio/123',
        timestamp: new Date().toISOString()
      }
    },
    supported_types: ['project', 'service', 'article', 'page'],
    supported_actions: ['created', 'updated', 'deleted'],
    auto_refresh: 'يتم إشعار محركات البحث تلقائياً عند إنشاء أو تحديث المحتوى'
  });
}
