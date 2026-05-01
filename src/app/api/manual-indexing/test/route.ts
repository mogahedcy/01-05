
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, engine, testUrl, mode } = await request.json();

    if (!url || !engine || !testUrl) {
      return Response.json({ 
        error: 'البيانات المطلوبة مفقودة',
        indexed: false,
        status: 'خطأ في البيانات'
      }, { status: 400 });
    }

    // إعداد headers محسنة لتجنب الحظر
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ar,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache'
    };

    let testResult = {
      indexed: false,
      status: 'غير مفهرس',
      details: '',
      response_time: 0
    };

    const startTime = Date.now();

    try {
      // محاولة فحص الأرشفة حسب المحرك
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 ثانية timeout

      const response = await fetch(testUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
        redirect: 'follow'
      });

      clearTimeout(timeoutId);
      testResult.response_time = Date.now() - startTime;

      if (!response.ok) {
        testResult.status = `خطأ HTTP: ${response.status}`;
        testResult.details = `فشل في الوصول لمحرك البحث - كود: ${response.status}`;
        return Response.json(testResult);
      }

      const responseText = await response.text();
      
      // تحليل النتائج حسب محرك البحث
      testResult = analyzeSearchResults(engine, responseText, url, mode);
      testResult.response_time = Date.now() - startTime;

    } catch (error) {
      testResult.status = 'خطأ في الشبكة';
      testResult.details = error instanceof Error ? 
        `خطأ في الاتصال: ${error.message}` : 
        'خطأ غير معروف في الشبكة';
      testResult.response_time = Date.now() - startTime;
    }

    // إضافة توصيات محسنة
    const recommendations = generateRecommendations(testResult, engine, url);

    return Response.json({
      ...testResult,
      recommendations,
      tested_at: new Date().toISOString(),
      test_url: testUrl
    });

  } catch (error) {
    console.error('خطأ في API اختبار الأرشفة:', error);
    return Response.json({
      error: 'خطأ في الخادم',
      indexed: false,
      status: 'خطأ في الخادم',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  }
}

function analyzeSearchResults(engine: string, responseText: string, originalUrl: string, mode: string) {
  const result = {
    indexed: false,
    status: 'غير مفهرس',
    details: ''
  };

  const domain = originalUrl.replace(/https?:\/\//, '').split('/')[0];
  
  try {
    switch (engine) {
      case 'google':
        // فحص Google - البحث عن علامات مختلفة
        if (responseText.includes('لم يتم العثور على نتائج') || 
            responseText.includes('did not match any documents') ||
            responseText.includes('No results found')) {
          result.status = 'غير مفهرس في Google';
          result.details = 'لم يتم العثور على الصفحة في فهرس Google';
        } else if (responseText.includes(domain) || 
                   responseText.includes('site:') ||
                   responseText.includes('search-results')) {
          result.indexed = true;
          result.status = 'مفهرس في Google';
          result.details = 'تم العثور على الصفحة في فهرس Google';
        } else {
          result.status = 'غير مؤكد';
          result.details = 'لا يمكن تأكيد حالة الأرشفة في Google';
        }
        break;

      case 'bing':
        // فحص Bing
        if (responseText.includes('لم نعثر على نتائج') || 
            responseText.includes('no results') ||
            responseText.includes('No results found')) {
          result.status = 'غير مفهرس في Bing';
          result.details = 'لم يتم العثور على الصفحة في فهرس Bing';
        } else if (responseText.includes(domain) || 
                   responseText.includes('b_algo') ||
                   responseText.includes('search results')) {
          result.indexed = true;
          result.status = 'مفهرس في Bing';
          result.details = 'تم العثور على الصفحة في فهرس Bing';
        }
        break;

      case 'yandex':
        // فحص Yandex
        if (responseText.includes('ничего не найдено') || 
            responseText.includes('لم يتم العثور') ||
            responseText.includes('Nothing found')) {
          result.status = 'غير مفهرس في Yandex';
          result.details = 'لم يتم العثور على الصفحة في فهرس Yandex';
        } else if (responseText.includes(domain) || 
                   responseText.includes('search-result') ||
                   responseText.includes('serp-item')) {
          result.indexed = true;
          result.status = 'مفهرس في Yandex';
          result.details = 'تم العثور على الصفحة في فهرس Yandex';
        }
        break;

      case 'duckduckgo':
        // فحص DuckDuckGo
        if (responseText.includes('No results') || 
            responseText.includes('لم يتم العثور') ||
            responseText.includes('no-results')) {
          result.status = 'غير مفهرس في DuckDuckGo';
          result.details = 'لم يتم العثور على الصفحة في فهرس DuckDuckGo';
        } else if (responseText.includes(domain) || 
                   responseText.includes('result') ||
                   responseText.includes('web-result')) {
          result.indexed = true;
          result.status = 'مفهرس في DuckDuckGo';
          result.details = 'تم العثور على الصفحة في فهرس DuckDuckGo';
        }
        break;

      default:
        result.status = 'محرك بحث غير مدعوم';
        result.details = `المحرك ${engine} غير مدعوم حالياً`;
    }

  } catch (error) {
    result.status = 'خطأ في تحليل النتائج';
    result.details = `خطأ في تحليل استجابة ${engine}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`;
  }

  return result;
}

function generateRecommendations(result: any, engine: string, url: string) {
  const recommendations = [];

  if (!result.indexed) {
    recommendations.push(`إرسال ${url} يدوياً لـ ${engine} Webmaster Tools`);
    recommendations.push('فحص robots.txt للتأكد من عدم حجب الصفحة');
    recommendations.push('إضافة روابط داخلية للصفحة من صفحات أخرى');
    recommendations.push('تحسين محتوى الصفحة وجعله أكثر تميزاً');
    recommendations.push('التأكد من سرعة تحميل الصفحة');
  } else {
    recommendations.push('الصفحة مفهرسة بنجاح - استمر في تحديث المحتوى');
    recommendations.push('راقب ترتيب الصفحة في نتائج البحث');
    recommendations.push('أضف المزيد من المحتوى ذي الصلة');
  }

  if (result.response_time > 5000) {
    recommendations.push('تحسين سرعة استجابة الخادم - الاستجابة بطيئة');
  }

  return recommendations;
}
