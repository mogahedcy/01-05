/**
 * خدمة الأرشفة الموحدة - تدير جميع محركات البحث
 * 
 * يدعم:
 * - IndexNow (Bing, Yandex, Seznam, Naver, Yep)
 * - Bing Webmaster API (إضافي - حصة أعلى)
 * - Google Indexing API (قريباً)
 * - Sitemap Ping (Google, Bing, Yandex)
 */

import { submitToIndexNow, submitMultipleToIndexNow } from './index-now-service';
import { submitToBing, submitMultipleToBing, isBingAPIAvailable } from './bing-webmaster-service';

export interface UnifiedIndexingResult {
  success: boolean;
  message: string;
  urls_count: number;
  engines: {
    indexnow: { success: boolean; message: string };
    bing_api: { success: boolean; message: string; used: boolean };
    sitemap_ping: { success: boolean; message: string };
  };
  timestamp: string;
}

/**
 * إرسال عنوان URL واحد لجميع محركات البحث المتاحة
 */
export async function indexURL(url: string): Promise<UnifiedIndexingResult> {
  return indexMultipleURLs([url]);
}

/**
 * إرسال عدة عناوين URL لجميع محركات البحث المتاحة
 */
export async function indexMultipleURLs(urls: string[]): Promise<UnifiedIndexingResult> {
  console.log(`🚀 بدء الأرشفة التلقائية لـ ${urls.length} رابط...`);

  const result: UnifiedIndexingResult = {
    success: false,
    message: '',
    urls_count: urls.length,
    engines: {
      indexnow: { success: false, message: '' },
      bing_api: { success: false, message: '', used: false },
      sitemap_ping: { success: false, message: '' }
    },
    timestamp: new Date().toISOString()
  };

  // 1. إرسال إلى IndexNow (Bing, Yandex, Naver, إلخ)
  try {
    const indexNowResult = await submitMultipleToIndexNow(urls);
    result.engines.indexnow.success = indexNowResult.success;
    result.engines.indexnow.message = indexNowResult.message;
  } catch (error) {
    result.engines.indexnow.message = 'فشل الاتصال بـ IndexNow';
  }

  // 2. إرسال إلى Bing API مباشرة (إذا كان متوفراً)
  if (isBingAPIAvailable()) {
    try {
      result.engines.bing_api.used = true;
      const bingResult = await submitMultipleToBing(urls);
      result.engines.bing_api.success = bingResult.success;
      result.engines.bing_api.message = bingResult.message;
    } catch (error) {
      result.engines.bing_api.message = 'فشل الاتصال بـ Bing API';
    }
  } else {
    result.engines.bing_api.message = 'Bing API غير مفعل';
  }

  // 3. Ping Sitemap لمحركات البحث التقليدية
  try {
    const sitemapResult = await pingSitemap();
    result.engines.sitemap_ping.success = sitemapResult.success;
    result.engines.sitemap_ping.message = sitemapResult.message;
  } catch (error) {
    result.engines.sitemap_ping.message = 'فشل ping sitemap';
  }

  // حساب النجاح الإجمالي
  const successCount = [
    result.engines.indexnow.success,
    result.engines.bing_api.success,
    result.engines.sitemap_ping.success
  ].filter(Boolean).length;

  result.success = successCount > 0;
  result.message = result.success
    ? `تم إرسال ${urls.length} رابط إلى ${successCount} محرك بحث بنجاح`
    : 'فشل الإرسال إلى جميع محركات البحث';

  console.log(`✅ ${result.message}`);
  return result;
}

/**
 * إشعار محركات البحث عند حذف URL
 */
export async function notifyURLDeleted(url: string): Promise<UnifiedIndexingResult> {
  console.log(`🗑️ إشعار محركات البحث بحذف: ${url}`);
  // IndexNow يتعامل مع الحذف عن طريق إرسال URL المحذوف (سيكتشف 404)
  return indexURL(url);
}

/**
 * Ping sitemap لمحركات البحث التقليدية
 */
async function pingSitemap(): Promise<{ success: boolean; message: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const searchEngines = [
    { name: 'Google', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}` },
    { name: 'Bing', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}` },
    { name: 'Yandex', url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}` }
  ];

  const results = await Promise.allSettled(
    searchEngines.map(engine =>
      fetch(engine.url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      }).then(res => ({ engine: engine.name, success: res.ok }))
    )
  );

  const successCount = results.filter(
    r => r.status === 'fulfilled' && r.value.success
  ).length;

  return {
    success: successCount > 0,
    message: `تم ping sitemap إلى ${successCount}/${searchEngines.length} محرك بحث`
  };
}

/**
 * أرشفة تلقائية عند نشر مشروع جديد
 */
export async function autoIndexNewProject(projectSlug: string, projectId: string) {
  const url = `/portfolio/${projectSlug}`;
  console.log(`📁 أرشفة تلقائية لمشروع جديد: ${url}`);
  
  const result = await indexURL(url);
  
  // حفظ السجل في قاعدة البيانات
  await logIndexingActivity('project', projectId, url, result);
  
  return result;
}

/**
 * أرشفة تلقائية عند نشر مقال جديد
 */
export async function autoIndexNewArticle(articleSlug: string, articleId: string) {
  const url = `/articles/${articleSlug}`;
  console.log(`📝 أرشفة تلقائية لمقال جديد: ${url}`);
  
  const result = await indexURL(url);
  
  // حفظ السجل في قاعدة البيانات
  await logIndexingActivity('article', articleId, url, result);
  
  return result;
}

/**
 * حفظ سجل نشاط الأرشفة
 */
async function logIndexingActivity(
  type: 'project' | 'article',
  id: string,
  url: string,
  result: UnifiedIndexingResult
) {
  try {
    // يمكن حفظ السجل في قاعدة البيانات أو ملف log
    console.log({
      type,
      id,
      url,
      success: result.success,
      engines: result.engines,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('فشل حفظ سجل الأرشفة:', error);
  }
}
