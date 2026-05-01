
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface PageTestResult {
  url: string;
  google: {
    indexed: boolean;
    status: string;
    details: string;
  };
  bing: {
    indexed: boolean;
    status: string;
    details: string;
  };
  yandex: {
    indexed: boolean;
    status: string;
    details: string;
  };
  duckduckgo: {
    indexed: boolean;
    status: string;
    details: string;
  };
  overall_status: 'excellent' | 'good' | 'partial' | 'poor' | 'not_indexed';
  last_checked: string;
}

interface TestSummary {
  total_pages: number;
  fully_indexed: number;
  partially_indexed: number;
  not_indexed: number;
  google_coverage: number;
  bing_coverage: number;
  yandex_coverage: number;
  duckduckgo_coverage: number;
  overall_score: number;
}

export default function ManualIndexingTestPage() {
  const [testResults, setTestResults] = useState<PageTestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customUrls, setCustomUrls] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<string>('all');
  const [testMode, setTestMode] = useState<'quick' | 'detailed'>('detailed');

  const defaultPages = [
    { url: 'https://www.deyarsu.com/', priority: 'high', category: 'الرئيسية' },
    { url: 'https://www.deyarsu.com/services/mazallat/', priority: 'high', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/pergolas/', priority: 'high', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/sawater/', priority: 'high', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/sandwich-panel/', priority: 'medium', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/landscaping/', priority: 'high', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/renovation/', priority: 'medium', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/byoot-shaar/', priority: 'medium', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/services/khayyam/', priority: 'low', category: 'خدمات' },
    { url: 'https://www.deyarsu.com/portfolio/', priority: 'high', category: 'أعمال' },
    { url: 'https://www.deyarsu.com/articles/', priority: 'high', category: 'محتوى' },
    { url: 'https://www.deyarsu.com/about/', priority: 'medium', category: 'معلومات' },
    { url: 'https://www.deyarsu.com/contact/', priority: 'medium', category: 'اتصال' },
    { url: 'https://www.deyarsu.com/quote/', priority: 'high', category: 'طلبات' },
    { url: 'https://www.deyarsu.com/faq/', priority: 'low', category: 'مساعدة' },
    { url: 'https://www.deyarsu.com/privacy/', priority: 'low', category: 'قانونية' },
    { url: 'https://www.deyarsu.com/terms/', priority: 'low', category: 'قانونية' }
  ];

  const searchEngines = {
    google: {
      name: 'Google',
      color: 'bg-blue-500',
      testUrl: (url: string) => `https://www.google.com/search?q=site:${encodeURIComponent(url.replace(/https?:\/\//, ''))}`
    },
    bing: {
      name: 'Bing',
      color: 'bg-orange-500',
      testUrl: (url: string) => `https://www.bing.com/search?q=site:${encodeURIComponent(url.replace(/https?:\/\//, ''))}`
    },
    yandex: {
      name: 'Yandex',
      color: 'bg-red-500',
      testUrl: (url: string) => `https://yandex.com/search/?text=site:${encodeURIComponent(url.replace(/https?:\/\//, ''))}`
    },
    duckduckgo: {
      name: 'DuckDuckGo',
      color: 'bg-green-500',
      testUrl: (url: string) => `https://duckduckgo.com/?q=site:${encodeURIComponent(url.replace(/https?:\/\//, ''))}`
    }
  };

  const runManualIndexingTest = async () => {
    setTesting(true);
    setProgress(0);
    setTestResults([]);

    const urlsToTest = customUrls.trim() 
      ? customUrls.split('\n').map(url => ({ url: url.trim(), priority: 'custom', category: 'مخصص' }))
      : defaultPages;

    const results: PageTestResult[] = [];
    const totalTests = urlsToTest.length * (selectedEngine === 'all' ? 4 : 1);
    let completedTests = 0;

    for (const page of urlsToTest) {
      try {
        const pageResult: PageTestResult = {
          url: page.url,
          google: { indexed: false, status: 'غير مختبر', details: '' },
          bing: { indexed: false, status: 'غير مختبر', details: '' },
          yandex: { indexed: false, status: 'غير مختبر', details: '' },
          duckduckgo: { indexed: false, status: 'غير مختبر', details: '' },
          overall_status: 'not_indexed',
          last_checked: new Date().toISOString()
        };

        // اختبار محركات البحث حسب الاختيار
        const enginesToTest = selectedEngine === 'all' 
          ? Object.keys(searchEngines)
          : [selectedEngine];

        for (const engineKey of enginesToTest) {
          const engine = searchEngines[engineKey as keyof typeof searchEngines];
          
          try {
            const response = await fetch('/api/manual-indexing/test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: page.url,
                engine: engineKey,
                testUrl: engine.testUrl(page.url),
                mode: testMode
              })
            });

            const testResult = await response.json();
            
            pageResult[engineKey as keyof typeof searchEngines] = {
              indexed: testResult.indexed,
              status: testResult.status,
              details: testResult.details || ''
            };

            completedTests++;
            setProgress((completedTests / totalTests) * 100);

            // تأخير بسيط لتجنب الحظر
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error) {
            pageResult[engineKey as keyof typeof searchEngines] = {
              indexed: false,
              status: 'خطأ في الاختبار',
              details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
            };
          }
        }

        // تحديد الحالة العامة
        const indexedCount = Object.values(pageResult).filter(
          (result) => typeof result === 'object' && result.indexed
        ).length;

        if (indexedCount === 4) pageResult.overall_status = 'excellent';
        else if (indexedCount >= 2) pageResult.overall_status = 'good';
        else if (indexedCount === 1) pageResult.overall_status = 'partial';
        else pageResult.overall_status = 'not_indexed';

        results.push(pageResult);
        setTestResults([...results]);

      } catch (error) {
        console.error(`خطأ في اختبار ${page.url}:`, error);
      }
    }

    // حساب الملخص
    const newSummary: TestSummary = {
      total_pages: results.length,
      fully_indexed: results.filter(r => r.overall_status === 'excellent').length,
      partially_indexed: results.filter(r => r.overall_status === 'good' || r.overall_status === 'partial').length,
      not_indexed: results.filter(r => r.overall_status === 'not_indexed').length,
      google_coverage: Math.round((results.filter(r => r.google.indexed).length / results.length) * 100),
      bing_coverage: Math.round((results.filter(r => r.bing.indexed).length / results.length) * 100),
      yandex_coverage: Math.round((results.filter(r => r.yandex.indexed).length / results.length) * 100),
      duckduckgo_coverage: Math.round((results.filter(r => r.duckduckgo.indexed).length / results.length) * 100),
      overall_score: 0
    };

    newSummary.overall_score = Math.round(
      (newSummary.google_coverage + newSummary.bing_coverage + 
       newSummary.yandex_coverage + newSummary.duckduckgo_coverage) / 4
    );

    setSummary(newSummary);
    setTesting(false);
    setProgress(100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'partial': return 'bg-yellow-500 text-white';
      case 'not_indexed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'ممتاز';
      case 'good': return 'جيد';
      case 'partial': return 'جزئي';
      case 'not_indexed': return 'غير مفهرس';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            اختبار الأرشفة اليدوي الشامل
          </h1>
          <p className="text-gray-600 text-lg">
            اختبار متقدم لحالة أرشفة جميع صفحات الموقع في محركات البحث المتعددة
          </p>
        </div>

        {/* خيارات الاختبار */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">إعدادات الاختبار</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">محرك البحث:</label>
              <select 
                value={selectedEngine} 
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">جميع المحركات</option>
                <option value="google">Google فقط</option>
                <option value="bing">Bing فقط</option>
                <option value="yandex">Yandex فقط</option>
                <option value="duckduckgo">DuckDuckGo فقط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">نوع الاختبار:</label>
              <select 
                value={testMode} 
                onChange={(e) => setTestMode(e.target.value as 'quick' | 'detailed')}
                className="w-full p-2 border rounded-lg"
              >
                <option value="detailed">مفصل (دقيق أكثر)</option>
                <option value="quick">سريع (أساسي)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              روابط مخصصة (اختياري - رابط واحد في كل سطر):
            </label>
            <Textarea
              value={customUrls}
              onChange={(e) => setCustomUrls(e.target.value)}
              placeholder="https://www.deyarsu.com/custom-page/&#10;https://www.deyarsu.com/another-page/"
              className="min-h-[100px]"
            />
            <p className="text-sm text-gray-500 mt-1">
              اتركه فارغاً لاستخدام الصفحات الافتراضية ({defaultPages.length} صفحة)
            </p>
          </div>
        </Card>

        {/* أزرار التحكم */}
        <div className="flex gap-4 justify-center mb-6">
          <Button 
            onClick={runManualIndexingTest} 
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg"
          >
            {testing ? 'جاري الاختبار...' : 'بدء الاختبار الشامل'}
          </Button>
        </div>

        {/* شريط التقدم */}
        {testing && (
          <Card className="p-4 mb-6">
            <div className="text-center mb-2">
              <span className="text-lg font-semibold">جاري الاختبار... {Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </Card>
        )}

        {/* الملخص */}
        {summary && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">ملخص نتائج الاختبار</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{summary.total_pages}</div>
                <div className="text-gray-600">إجمالي الصفحات</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{summary.fully_indexed}</div>
                <div className="text-gray-600">مفهرسة بالكامل</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{summary.partially_indexed}</div>
                <div className="text-gray-600">مفهرسة جزئياً</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{summary.not_indexed}</div>
                <div className="text-gray-600">غير مفهرسة</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{summary.overall_score}%</div>
                <div className="text-gray-600">النتيجة العامة</div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.google_coverage}%</div>
                <div className="text-sm text-gray-600">تغطية Google</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.bing_coverage}%</div>
                <div className="text-sm text-gray-600">تغطية Bing</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.yandex_coverage}%</div>
                <div className="text-sm text-gray-600">تغطية Yandex</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.duckduckgo_coverage}%</div>
                <div className="text-sm text-gray-600">تغطية DuckDuckGo</div>
              </div>
            </div>
          </Card>
        )}

        {/* النتائج المفصلة */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">النتائج المفصلة</h2>
            
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {result.url}
                      </h3>
                      <p className="text-sm text-gray-500">
                        آخر فحص: {new Date(result.last_checked).toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(result.overall_status)}>
                      {getStatusText(result.overall_status)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-3">
                    {Object.entries(searchEngines).map(([key, engine]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{engine.name}:</span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={result[key as keyof typeof result].indexed ? 
                              'bg-green-500 text-white' : 'bg-red-500 text-white'}
                          >
                            {result[key as keyof typeof result].indexed ? 'مفهرس' : 'غير مفهرس'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="mt-3 text-sm text-gray-600">
                    <details className="cursor-pointer">
                      <summary className="font-medium">تفاصيل الاختبار</summary>
                      <div className="mt-2 space-y-1">
                        {Object.entries(searchEngines).map(([key, engine]) => (
                          <div key={key}>
                            <strong>{engine.name}:</strong> {result[key as keyof typeof result].details || result[key as keyof typeof result].status}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* نصائح وتوجيهات */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">خطوات تحسين الأرشفة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🚀 للصفحات غير المفهرسة:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• إرسال الرابط يدوياً لـ Google Search Console</li>
                <li>• التحقق من robots.txt أنه لا يحجب الصفحة</li>
                <li>• إضافة روابط داخلية للصفحة من صفحات أخرى</li>
                <li>• التأكد من جودة وأصالة المحتوى</li>
                <li>• فحص سرعة تحميل الصفحة</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📊 للمتابعة المستمرة:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• إجراء هذا الاختبار أسبوعياً</li>
                <li>• مراقبة Google Search Console يومياً</li>
                <li>• تحديث المحتوى بانتظام</li>
                <li>• إنشاء محتوى جديد مرتبط بالصفحات</li>
                <li>• بناء backlinks عالية الجودة</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
