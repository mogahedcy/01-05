
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Globe,
  Zap,
  Shield,
  Database,
  FileText,
  Settings,
  Eye
} from 'lucide-react';

interface AuditResult {
  timestamp: string;
  site_health: string;
  overall_score: number;
  categories: {
    [key: string]: {
      score: number;
      status: string;
      details: any;
      issues: string[];
      warnings: string[];
    }
  };
}

export default function AuditPage() {
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/site-audit');
      if (!response.ok) throw new Error('فشل في تشغيل الفحص');
      
      const data = await response.json();
      setAuditData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons = {
      seo: <Globe className="w-5 h-5" />,
      performance: <Zap className="w-5 h-5" />,
      accessibility: <Eye className="w-5 h-5" />,
      content: <FileText className="w-5 h-5" />,
      technical: <Settings className="w-5 h-5" />,
      security: <Shield className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />
    };
    return icons[category] || <Settings className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ممتاز': return 'bg-green-500';
      case 'جيد': return 'bg-blue-500';
      case 'يحتاج تحسين': return 'bg-yellow-500';
      case 'خطأ': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-2">خطأ في الفحص</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={runAudit} disabled={loading}>
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* رأس الصفحة */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">تقرير فحص الموقع الشامل</h1>
          <p className="text-gray-600">تحليل شامل لحالة موقع ديار جدة العالمية</p>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={runAudit} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-2" />
              )}
              {loading ? 'جاري الفحص...' : 'إعادة الفحص'}
            </Button>
          </div>
        </div>

        {loading && (
          <Card className="p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </Card>
        )}

        {auditData && (
          <>
            {/* النتيجة الإجمالية */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl font-bold">النتيجة الإجمالية</h2>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-6xl font-bold ${getScoreColor(auditData.overall_score)}`}>
                    {auditData.overall_score}
                  </div>
                  <Progress value={auditData.overall_score} className="w-64 mx-auto" />
                  <p className="text-gray-600">
                    آخر فحص: {new Date(auditData.timestamp).toLocaleString('ar-SA')}
                  </p>
                </div>

                <Badge 
                  className={`${getStatusColor(auditData.site_health)} text-white px-4 py-2 text-lg`}
                >
                  حالة الموقع: {auditData.site_health}
                </Badge>
              </div>
            </Card>

            {/* تفاصيل كل فئة */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(auditData.categories).map(([category, data]) => (
                <Card key={category} className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category)}
                    <h3 className="font-bold text-lg capitalize">
                      {category === 'seo' ? 'تحسين محركات البحث' :
                       category === 'performance' ? 'الأداء' :
                       category === 'accessibility' ? 'إمكانية الوصول' :
                       category === 'content' ? 'المحتوى' :
                       category === 'technical' ? 'تقني' :
                       category === 'security' ? 'الأمان' :
                       category === 'database' ? 'قاعدة البيانات' : category}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className={`text-3xl font-bold ${getScoreColor(data.score)}`}>
                      {data.score}/100
                    </div>
                    <Progress value={data.score} />
                    <Badge className={`${getStatusColor(data.status)} text-white`}>
                      {data.status}
                    </Badge>
                  </div>

                  {/* التفاصيل */}
                  {data.details && (
                    <div className="space-y-2 text-sm">
                      <h4 className="font-medium">التفاصيل:</h4>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(data.details).map(([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span>{key.replace(/_/g, ' ')}:</span>
                            <span className={typeof value === 'boolean' ? 
                              (value ? 'text-green-600' : 'text-red-600') : ''}>
                              {typeof value === 'boolean' ? 
                                (value ? '✓' : '✗') : 
                                String(value)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* المشاكل */}
                  {data.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        مشاكل ({data.issues.length})
                      </h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {data.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* التحذيرات */}
                  {data.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        تحذيرات ({data.warnings.length})
                      </h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        {data.warnings.map((warning, index) => (
                          <li key={`warning-${index}-${warning.substring(0, 10)}`}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* التوصيات */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-500" />
                التوصيات للتحسين
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-red-600">أولوية عالية:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• إصلاح أخطاء array index keys في جميع الصفحات</li>
                    <li>• تحديث صور الـ slider لاستخدام Next.js Image</li>
                    <li>• إضافة المزيد من المشاريع لقاعدة البيانات</li>
                    <li>• تحسين تحذيرات الأمان في dangerouslySetInnerHTML</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-yellow-600">أولوية متوسطة:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• تحسين سرعة تحميل الصفحات</li>
                    <li>• إضافة المزيد من البيانات المنظمة</li>
                    <li>• تحسين إعدادات الـ cache</li>
                    <li>• إضافة المزيد من اختبارات الأداء</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
