export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkUrls = searchParams.get('urls')?.split(',') || [];

  const defaultUrls = [
    'https://www.deyarsu.com/',
    'https://www.deyarsu.com/services/mazallat/',
    'https://www.deyarsu.com/services/pergolas/',
    'https://www.deyarsu.com/services/sawater/',
    'https://www.deyarsu.com/services/sandwich-panel/',
    'https://www.deyarsu.com/services/landscaping/',
    'https://www.deyarsu.com/services/renovation/',
    'https://www.deyarsu.com/services/byoot-shaar/',
    'https://www.deyarsu.com/services/khayyam/',
    'https://www.deyarsu.com/portfolio/',
    'https://www.deyarsu.com/articles/',
    'https://www.deyarsu.com/about/',
    'https://www.deyarsu.com/contact/',
    'https://www.deyarsu.com/quote/'
  ];

  const urlsToCheck = checkUrls.length > 0 ? checkUrls : defaultUrls;
  const results = [];

  for (const url of urlsToCheck) {
    try {
      // فحص فهرسة Google مع User-Agent محسن
      const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url.replace('https://', '').replace('http://', ''))}`;

      const googleCheck = await fetch(googleSearchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }).catch(() => ({ ok: false, url: googleSearchUrl }));

      // فحص فهرسة Bing
      const bingSearchUrl = `https://www.bing.com/search?q=site:${encodeURIComponent(url.replace('https://', '').replace('http://', ''))}`;

      const bingCheck = await fetch(bingSearchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }).catch(() => ({ ok: false, url: bingSearchUrl }));

      // تحليل النتائج
      const googleIndexed = googleCheck.ok && !googleCheck.url.includes('no-results') && !googleCheck.url.includes('did+not+match');
      const bingIndexed = bingCheck.ok && !bingCheck.url.includes('no-results') && !bingCheck.url.includes('did+not+match');

      results.push({
        url,
        google_indexed: googleIndexed,
        bing_indexed: bingIndexed,
        last_checked: new Date().toISOString(),
        status: googleIndexed && bingIndexed ? 'excellent' : 
                googleIndexed || bingIndexed ? 'good' : 'needs_attention',
        recommendation: !googleIndexed && !bingIndexed ? 
          'يحتاج إلى إعادة إرسال للأرشفة' : 
          googleIndexed && bingIndexed ? 
          'مفهرس بشكل ممتاز' : 
          'مفهرس جزئياً - راقب النتائج'
      });

    } catch (error) {
      results.push({
        url,
        google_indexed: 'unknown',
        bing_indexed: 'unknown',
        error: error instanceof Error ? error.message : 'خطأ في الفحص',
        last_checked: new Date().toISOString(),
        status: 'error',
        recommendation: 'أعد المحاولة لاحقاً'
      });
    }
  }

  const summary = {
    total_urls: results.length,
    google_indexed: results.filter(r => r.google_indexed === true).length,
    bing_indexed: results.filter(r => r.bing_indexed === true).length,
    fully_indexed: results.filter(r => r.google_indexed === true && r.bing_indexed === true).length,
    needs_attention: results.filter(r => r.status === 'needs_attention').length,
    last_update: new Date().toISOString(),
    indexing_rate: Math.round((results.filter(r => r.google_indexed === true || r.bing_indexed === true).length / results.length) * 100)
  };

  return Response.json({
    success: true,
    summary,
    results,
    recommendations: [
      summary.indexing_rate < 70 ? 'ينصح بإعادة إرسال الـ sitemap لمحركات البحث' : 'معدل الأرشفة جيد',
      'استخدم /api/sitemap/refresh لإشعار محركات البحث بالتحديثات',
      'راجع Google Search Console للحصول على تفاصيل أكثر',
      'تأكد من تحديث المحتوى بانتظام لتحسين الأرشفة',
      summary.needs_attention > 3 ? 'يوجد عدد كبير من الصفحات تحتاج إلى انتباه' : 'حالة الأرشفة مقبولة'
    ]
  }, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1800', // 30 دقيقة
      'Access-Control-Allow-Origin': '*',
      'X-SEO-Check': 'aldeyarksa-indexing-monitor'
    }
  });
}