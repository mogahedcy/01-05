'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Globe, Search, RefreshCw } from 'lucide-react';

interface IndexingStatus {
  engines: {
    indexnow: { success: boolean; message: string };
    bing_api: { success: boolean; message: string; used: boolean };
    sitemap_ping: { success: boolean; message: string };
  };
  timestamp: string;
}

export default function IndexingStatusPage() {
  const [status, setStatus] = useState<IndexingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testUrl, setTestUrl] = useState('/');
  const [message, setMessage] = useState('');

  const testIndexing = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/indexing/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      });

      const data = await response.json();
      setStatus(data);

      if (data.success) {
        setMessage('✅ ' + data.message);
      } else {
        setMessage('❌ فشل الإرسال إلى جميع محركات البحث');
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const refreshSitemap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sitemap/refresh', { method: 'POST' });
      const data = await response.json();
      setMessage(`✅ ${data.message}`);
    } catch (error) {
      setMessage('❌ فشل في تحديث Sitemap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حالة الأرشفة التلقائية</h1>
          <p className="text-gray-600 mt-1">اختبار ومراقبة حالة الأرشفة على محركات البحث</p>
        </div>
        <Button onClick={refreshSitemap} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث Sitemap
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Test URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            اختبار الأرشفة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="/portfolio/project-slug"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
            />
            <Button onClick={testIndexing} disabled={loading} className="px-6">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 ml-2" />
                  اختبار الأرشفة
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            أدخل عنوان URL نسبي (مثال: /articles/my-article) لاختبار إرساله إلى محركات البحث
          </p>
        </CardContent>
      </Card>

      {/* Status Cards */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IndexNow Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>IndexNow API</span>
                {status.engines.indexnow.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={status.engines.indexnow.success ? 'default' : 'destructive'}>
                  {status.engines.indexnow.success ? 'نشط' : 'فشل'}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">{status.engines.indexnow.message}</p>
                <div className="text-xs text-gray-500 mt-3">
                  <div>• Bing</div>
                  <div>• Yandex</div>
                  <div>• Seznam</div>
                  <div>• Naver</div>
                  <div>• Yep</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bing API Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Bing Webmaster API</span>
                {status.engines.bing_api.used ? (
                  status.engines.bing_api.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )
                ) : (
                  <Badge variant="secondary">غير مفعل</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status.engines.bing_api.used ? (
                  <>
                    <Badge variant={status.engines.bing_api.success ? 'default' : 'destructive'}>
                      {status.engines.bing_api.success ? 'نشط' : 'فشل'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">{status.engines.bing_api.message}</p>
                    <div className="text-xs text-gray-500 mt-3">
                      <div>• حصة يومية: 10,000 URL</div>
                      <div>• أرشفة مباشرة لـ Bing</div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">{status.engines.bing_api.message}</p>
                    <div className="text-xs text-gray-500 mt-3">
                      لتفعيل هذا API، أضف BING_WEBMASTER_API_KEY في المتغيرات البيئية
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sitemap Ping Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Sitemap Ping</span>
                {status.engines.sitemap_ping.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={status.engines.sitemap_ping.success ? 'default' : 'destructive'}>
                  {status.engines.sitemap_ping.success ? 'نشط' : 'فشل'}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">{status.engines.sitemap_ping.message}</p>
                <div className="text-xs text-gray-500 mt-3">
                  <div>• Google</div>
                  <div>• Bing (تقليدي)</div>
                  <div>• Yandex</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">✨ الأرشفة التلقائية</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <ul className="space-y-2">
              <li>• يتم إشعار محركات البحث تلقائياً عند نشر محتوى جديد</li>
              <li>• يتم إشعار محركات البحث عند تحديث محتوى منشور</li>
              <li>• يدعم IndexNow للأرشفة الفورية (Bing, Yandex)</li>
              <li>• يدعم Sitemap Ping التقليدي (Google, Bing, Yandex)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-base text-green-900">📋 تحسينات مستقبلية</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-800">
            <ul className="space-y-2">
              <li>• Google Indexing API (يتطلب service account)</li>
              <li>• تتبع حالة الأرشفة في قاعدة البيانات</li>
              <li>• جدولة الأرشفة الدورية</li>
              <li>• إحصائيات مفصلة عن الأرشفة</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Timestamp */}
      {status && (
        <div className="text-center text-sm text-gray-500">
          آخر تحديث: {new Date(status.timestamp).toLocaleString('ar-SA')}
        </div>
      )}
    </div>
  );
}
