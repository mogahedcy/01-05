import { type NextRequest, NextResponse } from 'next/server';
import { submitUrlForIndexing, submitMultipleUrlsForIndexing } from '@/lib/auto-indexing';
import { requireAdmin } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

/**
 * API endpoint للفهرسة التلقائية
 */
export async function POST(request: NextRequest) {
  // التحقق من صلاحيات Admin
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { url, urls } = await request.json();

    if (!url && (!urls || !Array.isArray(urls))) {
      return NextResponse.json({
        success: false,
        error: 'يجب تقديم url أو urls'
      }, { status: 400 });
    }

    let result;
    
    if (url) {
      result = await submitUrlForIndexing(url);
    } else {
      result = await submitMultipleUrlsForIndexing(urls);
    }

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `تم إرسال ${result.submitted_urls.length} رابط للفهرسة بنجاح`
        : 'فشل إرسال الروابط للفهرسة',
      data: result
    });

  } catch (error: any) {
    console.error('❌ خطأ في API الفهرسة التلقائية:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'حدث خطأ غير متوقع'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API للفهرسة التلقائية',
    usage: {
      endpoint: '/api/auto-index',
      method: 'POST',
      body: {
        url: 'string (optional) - رابط واحد للفهرسة',
        urls: 'string[] (optional) - عدة روابط للفهرسة'
      }
    },
    engines: ['IndexNow (Bing, Yandex, Seznam.cz, Naver)'],
    note: 'يتم استدعاء هذا API تلقائياً عند نشر أو تحديث المحتوى'
  });
}
