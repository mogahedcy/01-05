/**
 * API للأرشفة التلقائية الموحدة
 * 
 * يُستخدم للإشعار الفوري بالتحديثات الجديدة
 */

import { type NextRequest, NextResponse } from 'next/server';
import { indexURL, indexMultipleURLs, notifyURLDeleted } from '@/lib/indexing/unified-indexing-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, urls, action = 'index' } = body;

    // التحقق من البيانات
    if (!url && (!urls || !Array.isArray(urls) || urls.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'يجب توفير url أو urls'
      }, { status: 400 });
    }

    let result;

    // حذف URL
    if (action === 'delete' && url) {
      result = await notifyURLDeleted(url);
    }
    // أرشفة URL واحد
    else if (url) {
      result = await indexURL(url);
    }
    // أرشفة عدة URLs
    else if (urls) {
      result = await indexMultipleURLs(urls);
    } else {
      return NextResponse.json({
        success: false,
        error: 'إجراء غير صالح'
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ خطأ في API الأرشفة التلقائية:', error);
    
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'API الأرشفة التلقائية الموحدة',
    version: '2.0',
    supported_engines: [
      'IndexNow (Bing, Yandex, Seznam, Naver, Yep)',
      'Bing Webmaster API (اختياري)',
      'Sitemap Ping (Google, Bing, Yandex)'
    ],
    usage: {
      index_single: {
        method: 'POST',
        body: { url: '/portfolio/my-project' }
      },
      index_multiple: {
        method: 'POST',
        body: { urls: ['/articles/article-1', '/articles/article-2'] }
      },
      notify_delete: {
        method: 'POST',
        body: { url: '/portfolio/deleted-project', action: 'delete' }
      }
    }
  });
}
