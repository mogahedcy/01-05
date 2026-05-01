import { type NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'default-key-replace-in-production';

export async function POST(request: NextRequest) {
  try {
    const { urls, type } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'يجب إرسال قائمة بالروابط' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
      ? (process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') 
          ? process.env.NEXT_PUBLIC_BASE_URL 
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}`)
      : 'https://www.deyarsu.com';

    const fullUrls = urls.map((url: string) => 
      url.startsWith('http') ? url : `${baseUrl}${url}`
    );

    const indexNowPayload = {
      host: new URL(baseUrl).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${baseUrl}/indexnow-key.txt`,
      urlList: fullUrls
    };

    const results = {
      indexnow: { success: false, error: null as string | null },
      google: { success: false, error: null as string | null }
    };

    try {
      const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(indexNowPayload)
      });

      if (indexNowResponse.ok || indexNowResponse.status === 202) {
        results.indexnow.success = true;
        console.log('✅ تم إرسال الروابط إلى IndexNow بنجاح');
      } else {
        results.indexnow.error = `خطأ ${indexNowResponse.status}: ${indexNowResponse.statusText}`;
        console.error('❌ فشل إرسال الروابط إلى IndexNow:', results.indexnow.error);
      }
    } catch (error: any) {
      results.indexnow.error = error.message;
      console.error('❌ خطأ في الاتصال بـ IndexNow:', error);
    }

    const successCount = (results.indexnow.success ? 1 : 0) + (results.google.success ? 1 : 0);

    return NextResponse.json({
      success: successCount > 0,
      message: successCount > 0 
        ? `تم إرسال ${urls.length} رابط إلى ${successCount} محرك بحث بنجاح` 
        : 'فشل إرسال الطلبات لجميع محركات البحث',
      urls: fullUrls,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ خطأ في معالجة طلب الأرشفة:', error);
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
    message: 'API لطلب الأرشفة من محركات البحث',
    methods: ['POST'],
    usage: {
      endpoint: '/api/indexing',
      method: 'POST',
      body: {
        urls: ['array of URLs to index'],
        type: 'project | article | page'
      }
    },
    engines: ['IndexNow (Bing, Yandex, Seznam.cz, Naver)']
  });
}
