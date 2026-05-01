import { type NextRequest, NextResponse } from 'next/server';

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
      signal: AbortSignal.timeout(10000), // 10 second timeout
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
  const sitemapUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com'}/sitemap.xml`;
  
  try {
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

    const successCount = notifications.filter(n => n.success).length;
    const totalCount = notifications.length;

    return NextResponse.json({
      success: true,
      message: `تم إشعار ${successCount} من أصل ${totalCount} محرك بحث`,
      timestamp: new Date().toISOString(),
      sitemap_url: sitemapUrl,
      notifications,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    });

  } catch (error) {
    console.error('خطأ في إشعار محركات البحث:', error);
    
    return NextResponse.json({
      success: false,
      message: 'فشل في إشعار محركات البحث',
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API إشعار محركات البحث - استخدم POST لإرسال الإشعارات',
    endpoints: {
      refresh: 'POST /api/sitemap/refresh',
      sitemap: 'GET /sitemap.xml'
    },
    supported_engines: SEARCH_ENGINES.map(engine => engine.name)
  });
}
