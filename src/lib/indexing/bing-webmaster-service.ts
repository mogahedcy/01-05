/**
 * خدمة Bing Webmaster Tools API - أرشفة مباشرة لـ Bing
 * 
 * المميزات:
 * - حصة يومية: 10,000 URL/يوم
 * - أسرع من IndexNow لـ Bing
 * - إحصائيات مفصلة
 * 
 * المتطلبات:
 * - BING_WEBMASTER_API_KEY في environment variables
 */

const BING_API_KEY = process.env.BING_WEBMASTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

export interface BingSubmissionResult {
  success: boolean;
  message: string;
  urls_submitted: number;
  quota_remaining?: number;
}

/**
 * التحقق من توفر API Key
 */
export function isBingAPIAvailable(): boolean {
  return !!BING_API_KEY;
}

/**
 * إرسال عنوان URL واحد إلى Bing
 */
export async function submitToBing(url: string): Promise<BingSubmissionResult> {
  if (!BING_API_KEY) {
    return {
      success: false,
      message: 'مفتاح Bing Webmaster API غير متوفر',
      urls_submitted: 0
    };
  }

  try {
    const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
    
    const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${BING_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        siteUrl: SITE_URL,
        url: fullUrl
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      return {
        success: true,
        message: 'تم إرسال الرابط إلى Bing بنجاح',
        urls_submitted: 1
      };
    } else {
      return {
        success: false,
        message: `فشل الإرسال - HTTP ${response.status}`,
        urls_submitted: 0
      };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    return {
      success: false,
      message: `خطأ في الاتصال: ${errorMessage}`,
      urls_submitted: 0
    };
  }
}

/**
 * إرسال عدة عناوين URL إلى Bing دفعة واحدة
 */
export async function submitMultipleToBing(urls: string[]): Promise<BingSubmissionResult> {
  if (!BING_API_KEY) {
    return {
      success: false,
      message: 'مفتاح Bing Webmaster API غير متوفر',
      urls_submitted: 0
    };
  }

  try {
    const fullUrls = urls.map(url => 
      url.startsWith('http') ? url : `${SITE_URL}${url}`
    );

    const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        siteUrl: SITE_URL,
        urlList: fullUrls
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (response.ok) {
      return {
        success: true,
        message: `تم إرسال ${fullUrls.length} رابط إلى Bing بنجاح`,
        urls_submitted: fullUrls.length
      };
    } else {
      return {
        success: false,
        message: `فشل الإرسال - HTTP ${response.status}`,
        urls_submitted: 0
      };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    return {
      success: false,
      message: `خطأ في الاتصال: ${errorMessage}`,
      urls_submitted: 0
    };
  }
}

/**
 * التحقق من الحصة المتبقية
 */
export async function getBingQuota(): Promise<{ daily: number; monthly: number } | null> {
  if (!BING_API_KEY) {
    return null;
  }

  try {
    const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(SITE_URL)}&apikey=${BING_API_KEY}`;
    
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        daily: data.d?.DailyQuota || 0,
        monthly: data.d?.MonthlyQuota || 0
      };
    }

    return null;

  } catch (error) {
    console.error('خطأ في جلب حصة Bing:', error);
    return null;
  }
}
