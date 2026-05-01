
import { type NextRequest, NextResponse } from 'next/server';

const AUTO_REFRESH_SECRET = process.env.AUTO_REFRESH_SECRET || 'default-secret-change-me';

const SEARCH_ENGINES = [
  {
    name: 'Google',
    url: 'https://www.google.com/ping?sitemap=',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/ping?sitemap=',
  },
  {
    name: 'Yandex',
    url: 'https://webmaster.yandex.com/ping?sitemap=',
  }
];

async function notifySearchEngine(engineUrl: string, sitemapUrl: string, engineName: string) {
  try {
    const response = await fetch(`${engineUrl}${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'AlDeyar-SEO-Bot/1.0 (+https://www.deyarsu.com)',
      },
      signal: AbortSignal.timeout(10000),
    });
    
    return {
      engine: engineName,
      success: response.ok,
      status: response.status,
      message: response.ok ? 'تم الإشعار بنجاح' : `خطأ: ${response.status}`
    };
  } catch (error) {
    return {
      engine: engineName,
      success: false,
      status: 0,
      message: `خطأ في الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, sitemaps = [] } = body;

    // التحقق من الأمان
    if (secret !== AUTO_REFRESH_SECRET) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح - مفتاح أمان خاطئ'
      }, { status: 401 });
    }

    const defaultSitemaps = [
      'https://www.deyarsu.com/sitemap.xml',
      'https://www.deyarsu.com/sitemap-images.xml'
    ];

    const sitemapsToRefresh = sitemaps.length > 0 ? sitemaps : defaultSitemaps;
    const allResults = [];

    for (const sitemapUrl of sitemapsToRefresh) {
      const results = await Promise.allSettled(
        SEARCH_ENGINES.map(engine => 
          notifySearchEngine(engine.url, sitemapUrl, engine.name)
        )
      );

      const notifications = results.map(result => 
        result.status === 'fulfilled' ? result.value : { 
          engine: 'Unknown', 
          success: false, 
          message: 'فشل في معالجة الطلب' 
        }
      );

      allResults.push({
        sitemap: sitemapUrl,
        notifications,
        summary: {
          total: notifications.length,
          successful: notifications.filter(n => n.success).length,
          failed: notifications.filter(n => !n.success).length
        }
      });

      // تأخير بين الـ sitemaps
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const totalSuccessful = allResults.reduce((sum, result) => sum + result.summary.successful, 0);
    const totalNotifications = allResults.reduce((sum, result) => sum + result.summary.total, 0);

    return NextResponse.json({
      success: true,
      message: `تم إشعار ${totalSuccessful} من أصل ${totalNotifications} محرك بحث تلقائياً`,
      timestamp: new Date().toISOString(),
      results: allResults,
      auto_refresh: true
    });

  } catch (error) {
    console.error('خطأ في الإشعار التلقائي:', error);
    
    return NextResponse.json({
      success: false,
      message: 'فشل في الإشعار التلقائي',
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API الإشعار التلقائي لمحركات البحث',
    usage: {
      endpoint: 'POST /api/sitemap/auto-refresh',
      required_fields: ['secret'],
      optional_fields: ['sitemaps (array)'],
      example: {
        secret: 'your-secret-key',
        sitemaps: ['https://www.deyarsu.com/sitemap.xml']
      }
    },
    supported_engines: SEARCH_ENGINES.map(engine => engine.name),
    security: 'يتطلب مفتاح أمان صحيح'
  });
}
