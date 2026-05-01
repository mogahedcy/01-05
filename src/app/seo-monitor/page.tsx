
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  BarChart3,
  Eye,
  Settings,
  Download,
  Bell,
  Activity,
  Zap,
  Shield,
  Database,
  Target,
  Gauge
} from 'lucide-react';

interface IndexingResult {
  url: string;
  google_indexed: boolean | string;
  bing_indexed: boolean | string;
  status: string;
  recommendation: string;
  last_checked: string;
  response_time?: number;
  error_count?: number;
  seo_score?: number;
}

interface IndexingSummary {
  total_urls: number;
  google_indexed: number;
  bing_indexed: number;
  fully_indexed: number;
  needs_attention: number;
  indexing_rate: number;
  last_update: string;
  performance_score?: number;
  seo_issues?: number;
  critical_errors?: number;
}

interface SEOMetrics {
  overall_health: number;
  performance: number;
  accessibility: number;
  seo: number;
  best_practices: number;
  pwa: number;
}

export default function SEOMonitorPage() {
  const [mounted, setMounted] = useState(false);
  const [indexingData, setIndexingData] = useState<{
    summary: IndexingSummary | null;
    results: IndexingResult[];
  }>({
    summary: null,
    results: []
  });
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkIndexingStatus();
      loadSEOMetrics();
    }
  }, [mounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && mounted) {
      interval = setInterval(() => {
        checkIndexingStatus();
        loadSEOMetrics();
      }, 300000); // كل 5 دقائق
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, mounted]);

  const checkIndexingStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo/indexing-status');
      const data = await response.json();
      setIndexingData({
        summary: data.summary,
        results: data.results
      });
      setLastRefresh(new Date());
    } catch (error) {
      console.error('خطأ في فحص حالة الأرشفة:', error);
    }
    setLoading(false);
  };

  const loadSEOMetrics = async () => {
    try {
      const response = await fetch('/api/site-audit');
      const data = await response.json();
      
      if (data.categories) {
        setSeoMetrics({
          overall_health: data.overall_score || 85,
          performance: data.categories.performance?.score || 88,
          accessibility: data.categories.accessibility?.score || 92,
          seo: data.categories.seo?.score || 90,
          best_practices: data.categories.technical?.score || 85,
          pwa: 75
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل مقاييس SEO:', error);
    }
  };

  const refreshSitemap = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/sitemap/refresh', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nتفاصيل الإشعارات:\n${data.notifications.map((n: any) => `${n.engine}: ${n.message}`).join('\n')}`);
        checkIndexingStatus();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      alert('❌ خطأ في إشعار محركات البحث');
    }
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!indexingData.summary) return;
    
    const report = {
      generated: new Date().toISOString(),
      summary: indexingData.summary,
      results: indexingData.results,
      seo_metrics: seoMetrics
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'needs_attention': return 'bg-amber-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'ممتاز';
      case 'good': return 'جيد';
      case 'needs_attention': return 'يحتاج انتباه';
      case 'error': return 'خطأ';
      default: return 'غير معروف';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 space-x-reverse">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <div className="text-lg text-gray-600">جاري التحميل...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* الهيدر المتقدم */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
                  <Activity className="w-10 h-10 text-blue-600 ml-3" />
                  مراقب SEO المتقدم
                </h1>
                <p className="text-gray-600 text-lg">
                  مراقبة شاملة ومتطورة لأداء SEO وحالة الأرشفة
                </p>
                {lastRefresh && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 ml-1" />
                    آخر تحديث: {lastRefresh.toLocaleString('ar-SA')}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={checkIndexingStatus} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      جاري الفحص...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 ml-2" />
                      فحص الحالة
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={refreshSitemap} 
                  disabled={refreshing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      جاري الإشعار...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 ml-2" />
                      إشعار محركات البحث
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  variant={autoRefresh ? "default" : "outline"}
                  className={autoRefresh ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                >
                  <Zap className="w-4 h-4 ml-2" />
                  {autoRefresh ? 'إيقاف التحديث التلقائي' : 'تفعيل التحديث التلقائي'}
                </Button>
                
                <Button 
                  onClick={exportReport}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>
          </div>

          {/* مقاييس الأداء السريعة */}
          {seoMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: 'الصحة العامة', value: seoMetrics.overall_health, icon: Gauge },
                { label: 'الأداء', value: seoMetrics.performance, icon: Zap },
                { label: 'إمكانية الوصول', value: seoMetrics.accessibility, icon: Eye },
                { label: 'SEO', value: seoMetrics.seo, icon: TrendingUp },
                { label: 'أفضل الممارسات', value: seoMetrics.best_practices, icon: Shield },
                { label: 'PWA', value: seoMetrics.pwa, icon: Settings }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${getHealthColor(metric.value)}`} />
                      <span className={`text-2xl font-bold ${getHealthColor(metric.value)}`}>
                        {metric.value}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                    <Progress 
                      value={metric.value} 
                      className="h-2" 
                    />
                  </Card>
                );
              })}
            </div>
          )}

          {/* التبويبات */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse px-6">
                {[
                  { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                  { id: 'indexing', label: 'حالة الأرشفة', icon: Globe },
                  { id: 'performance', label: 'الأداء', icon: Zap },
                  { id: 'issues', label: 'المشاكل', icon: AlertTriangle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        selectedTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 ml-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* تبويب نظرة عامة */}
              {selectedTab === 'overview' && indexingData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">إجمالي الصفحات</p>
                        <p className="text-3xl font-bold">{indexingData.summary.total_urls}</p>
                      </div>
                      <Globe className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm">مفهرسة في Google</p>
                        <p className="text-3xl font-bold">{indexingData.summary.google_indexed}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-emerald-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">مفهرسة في Bing</p>
                        <p className="text-3xl font-bold">{indexingData.summary.bing_indexed}</p>
                      </div>
                      <Target className="w-8 h-8 text-amber-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">معدل الأرشفة</p>
                        <p className="text-3xl font-bold">{indexingData.summary.indexing_rate}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>
              )}

              {/* تبويب حالة الأرشفة */}
              {selectedTab === 'indexing' && indexingData.results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">تفاصيل حالة كل صفحة</h3>
                    <div className="text-sm text-gray-500">
                      {indexingData.results.length} صفحة تم فحصها
                    </div>
                  </div>
                  
                  {indexingData.results.map((result, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{result.url}</h4>
                            <Badge className={`mr-3 ${getStatusColor(result.status)}`}>
                              {getStatusText(result.status)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{result.recommendation}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium ml-2">Google:</span>
                              <Badge 
                                variant={result.google_indexed === true ? 'default' : 'destructive'}
                                className={result.google_indexed === true ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}
                              >
                                {result.google_indexed === true ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 ml-1" />
                                    مفهرس
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 ml-1" />
                                    غير مفهرس
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-medium ml-2">Bing:</span>
                              <Badge 
                                variant={result.bing_indexed === true ? 'default' : 'destructive'}
                                className={result.bing_indexed === true ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}
                              >
                                {result.bing_indexed === true ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 ml-1" />
                                    مفهرس
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 ml-1" />
                                    غير مفهرس
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            {result.response_time && (
                              <div className="flex items-center text-gray-500">
                                <Clock className="w-3 h-3 ml-1" />
                                {result.response_time}ms
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 lg:text-left">
                          آخر فحص: {mounted ? new Date(result.last_checked).toLocaleString('ar-SA') : result.last_checked}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* تبويب الأداء */}
              {selectedTab === 'performance' && seoMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(seoMetrics).map(([key, value]) => (
                    <Card key={key} className="p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {key === 'overall_health' && 'الصحة العامة'}
                          {key === 'performance' && 'الأداء'}
                          {key === 'accessibility' && 'إمكانية الوصول'}
                          {key === 'seo' && 'تحسين محركات البحث'}
                          {key === 'best_practices' && 'أفضل الممارسات'}
                          {key === 'pwa' && 'تطبيق الويب التقدمي'}
                        </h4>
                        <span className={`text-2xl font-bold ${getHealthColor(value)}`}>
                          {value}
                        </span>
                      </div>
                      <Progress value={value} className="h-3" />
                      <div className="mt-3 text-sm text-gray-600">
                        {value >= 90 && 'أداء ممتاز - استمر في العمل الرائع!'}
                        {value >= 75 && value < 90 && 'أداء جيد - هناك مجال للتحسين'}
                        {value >= 50 && value < 75 && 'أداء متوسط - يحتاج إلى اهتمام'}
                        {value < 50 && 'أداء ضعيف - يحتاج إلى تحسين فوري'}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* تبويب المشاكل */}
              {selectedTab === 'issues' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 border-l-4 border-red-500 bg-red-50">
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-600 ml-2" />
                        <div>
                          <p className="font-semibold text-red-800">مشاكل حرجة</p>
                          <p className="text-2xl font-bold text-red-600">
                            {indexingData.summary?.critical_errors || 0}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-amber-500 bg-amber-50">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600 ml-2" />
                        <div>
                          <p className="font-semibold text-amber-800">تحذيرات</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {indexingData.summary?.seo_issues || 0}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-600 ml-2" />
                        <div>
                          <p className="font-semibold text-blue-800">اقتراحات</p>
                          <p className="text-2xl font-bold text-blue-600">5</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">الصفحات التي تحتاج انتباه</h4>
                    <div className="space-y-3">
                      {indexingData.results
                        .filter(result => result.status === 'needs_attention' || result.status === 'error')
                        .map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <AlertTriangle className="w-4 h-4 text-amber-500 ml-2" />
                              <span className="text-sm font-medium">{result.url}</span>
                            </div>
                            <Badge className={getStatusColor(result.status)}>
                              {getStatusText(result.status)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* نصائح وتوجيهات محدثة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <Target className="w-6 h-6 ml-2" />
                استراتيجيات تحسين الأرشفة
              </h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>تحديث المحتوى بانتظام وإضافة محتوى جديد أسبوعياً</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>بناء شبكة روابط داخلية قوية بين الصفحات</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>تحسين سرعة تحميل الموقع إلى أقل من 3 ثوانٍ</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>استخدام البيانات المنظمة (Schema Markup)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>تحسين تجربة المستخدم على الأجهزة المحمولة</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                <Activity className="w-6 h-6 ml-2" />
                أدوات المراقبة المتقدمة
              </h3>
              <ul className="space-y-3 text-emerald-800">
                <li className="flex items-start">
                  <Database className="w-4 h-4 text-emerald-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>Google Search Console للمراقبة الشاملة</span>
                </li>
                <li className="flex items-start">
                  <Database className="w-4 h-4 text-emerald-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>Bing Webmaster Tools لمحرك Bing</span>
                </li>
                <li className="flex items-start">
                  <Database className="w-4 h-4 text-emerald-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>مراقبة الكلمات المفتاحية وتتبع الترتيب</span>
                </li>
                <li className="flex items-start">
                  <Database className="w-4 h-4 text-emerald-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>تحليل المنافسين وفجوات المحتوى</span>
                </li>
                <li className="flex items-start">
                  <Database className="w-4 h-4 text-emerald-600 ml-2 mt-0.5 flex-shrink-0" />
                  <span>تقارير الأداء الدورية والتنبيهات</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* معلومات APIs المحدثة */}
          <Card className="p-6 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="w-6 h-6 ml-2" />
              APIs والخدمات المتقدمة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-emerald-600 mb-2 flex items-center">
                  <RefreshCw className="w-4 h-4 ml-1" />
                  إشعار يدوي
                </h4>
                <code className="bg-gray-100 p-2 rounded text-xs block mb-2">
                  POST /api/sitemap/refresh
                </code>
                <p className="text-sm text-gray-600">لإشعار محركات البحث فوراً بالتحديثات</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-blue-600 mb-2 flex items-center">
                  <Zap className="w-4 h-4 ml-1" />
                  إشعار تلقائي
                </h4>
                <code className="bg-gray-100 p-2 rounded text-xs block mb-2">
                  POST /api/sitemap/auto-refresh
                </code>
                <p className="text-sm text-gray-600">للاستخدام مع المهام المجدولة والأتمتة</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-purple-600 mb-2 flex items-center">
                  <Bell className="w-4 h-4 ml-1" />
                  Webhook التحديث
                </h4>
                <code className="bg-gray-100 p-2 rounded text-xs block mb-2">
                  POST /api/webhook/content-updated
                </code>
                <p className="text-sm text-gray-600">للإشعار التلقائي عند تحديث المحتوى</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
