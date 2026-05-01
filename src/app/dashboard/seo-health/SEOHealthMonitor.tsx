'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Image,
  Link2,
  FileText,
  Zap,
  Download,
  Play,
  Loader2,
  Eye,
  BarChart3,
  Settings
} from 'lucide-react';

interface SEOIssue {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedUrl: string;
  suggestion: string;
  autoFixable: boolean;
  targetId?: string;
  targetType?: 'project' | 'article';
}

interface SEOAuditResult {
  score: number;
  totalIssues: number;
  criticalIssues: number;
  issues: SEOIssue[];
  strengths: string[];
  recommendations: string[];
  lastAudit: Date;
}

export default function SEOHealthMonitor() {
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo-diagnostics/audit');
      const data = await response.json();
      if (data.success) {
        setAuditResult(data.data);
      }
    } catch (error) {
      console.error('خطأ في تشغيل الفحص:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoFix = async (issue: SEOIssue) => {
    if (!issue.autoFixable || !issue.targetId || !issue.targetType) {
      console.error('المشكلة غير قابلة للإصلاح التلقائي أو معلومات الهدف مفقودة');
      return;
    }
    
    setFixing(issue.id);
    try {
      const response = await fetch('/api/seo-diagnostics/auto-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType: issue.type,
          targetId: issue.targetId,
          targetType: issue.targetType
        })
      });

      const result = await response.json();
      if (result.success) {
        // إعادة تشغيل الفحص بعد الإصلاح
        await runAudit();
      } else {
        console.error('فشل الإصلاح التلقائي:', result.error || result.message);
      }
    } catch (error) {
      console.error('خطأ في الإصلاح التلقائي:', error);
    } finally {
      setFixing(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'ممتاز';
    if (score >= 70) return 'جيد';
    if (score >= 50) return 'مقبول';
    return 'ضعيف';
  };

  const filteredIssues = auditResult?.issues.filter(issue => 
    filter === 'all' || issue.severity === filter
  ) || [];

  const issueCounts = {
    critical: auditResult?.issues.filter(i => i.severity === 'critical').length || 0,
    high: auditResult?.issues.filter(i => i.severity === 'high').length || 0,
    medium: auditResult?.issues.filter(i => i.severity === 'medium').length || 0,
    low: auditResult?.issues.filter(i => i.severity === 'low').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  مراقبة صحة SEO
                </h1>
                <p className="text-xl text-gray-600">
                  نظام متقدم لاكتشاف وإصلاح مشاكل SEO تلقائياً
                </p>
              </div>
            </div>
            <Button
              onClick={runAudit}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الفحص...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة الفحص
                </>
              )}
            </Button>
          </div>
        </div>

        {loading && !auditResult && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
            <p className="text-xl text-gray-600">جاري فحص صحة SEO...</p>
            <p className="text-sm text-gray-500 mt-2">قد يستغرق هذا بضع ثوانٍ</p>
          </div>
        )}

        {auditResult && (
          <>
            {/* Score Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">النتيجة الإجمالية</h3>
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(auditResult.score)} mb-2`}>
                  {auditResult.score}
                  <span className="text-2xl">/100</span>
                </div>
                <p className="text-sm text-gray-600">{getScoreGrade(auditResult.score)}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">المشاكل الكلية</h3>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-5xl font-bold text-orange-600 mb-2">
                  {auditResult.totalIssues}
                </div>
                <p className="text-sm text-gray-600">مشكلة تحتاج إلى حل</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">حرجة</h3>
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-5xl font-bold text-red-600 mb-2">
                  {auditResult.criticalIssues}
                </div>
                <p className="text-sm text-gray-600">تحتاج إصلاح فوري</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">نقاط القوة</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {auditResult.strengths.length}
                </div>
                <p className="text-sm text-gray-600">جوانب ممتازة</p>
              </Card>
            </div>

            {/* Issue Type Filters */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                تصفية حسب الأولوية
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-gray-900' : ''}
                >
                  الكل ({auditResult.totalIssues})
                </Button>
                <Button
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  onClick={() => setFilter('critical')}
                  className={filter === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  حرجة ({issueCounts.critical})
                </Button>
                <Button
                  variant={filter === 'high' ? 'default' : 'outline'}
                  onClick={() => setFilter('high')}
                  className={filter === 'high' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  عالية ({issueCounts.high})
                </Button>
                <Button
                  variant={filter === 'medium' ? 'default' : 'outline'}
                  onClick={() => setFilter('medium')}
                  className={filter === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  متوسطة ({issueCounts.medium})
                </Button>
                <Button
                  variant={filter === 'low' ? 'default' : 'outline'}
                  onClick={() => setFilter('low')}
                  className={filter === 'low' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  منخفضة ({issueCounts.low})
                </Button>
              </div>
            </Card>

            {/* Issues List */}
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                المشاكل المكتشفة ({filteredIssues.length})
              </h3>
              
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-900">لا توجد مشاكل!</p>
                  <p className="text-gray-600 mt-2">
                    {filter === 'all' ? 'موقعك في حالة ممتازة' : `لا توجد مشاكل بمستوى ${filter}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => {
                    const typeIcon = {
                      broken_link: Link2,
                      missing_alt: Image,
                      meta_issue: FileText,
                      duplicate_content: FileText
                    }[issue.type] || AlertTriangle;
                    const Icon = typeIcon;

                    return (
                      <div
                        key={issue.id}
                        className={`p-5 rounded-lg border-2 ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-5 h-5" />
                              <h4 className="font-bold text-lg">{issue.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {issue.severity === 'critical' && 'حرجة'}
                                {issue.severity === 'high' && 'عالية'}
                                {issue.severity === 'medium' && 'متوسطة'}
                                {issue.severity === 'low' && 'منخفضة'}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{issue.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                              <Eye className="w-4 h-4" />
                              <span>{issue.affectedUrl}</span>
                            </div>
                            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>الحل المقترح:</strong> {issue.suggestion}
                              </p>
                            </div>
                          </div>
                          {issue.autoFixable && (
                            <Button
                              size="sm"
                              onClick={() => autoFix(issue)}
                              disabled={fixing === issue.id}
                              className="mr-4 bg-emerald-600 hover:bg-emerald-700"
                            >
                              {fixing === issue.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                                  جاري الإصلاح...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 ml-1" />
                                  إصلاح تلقائي
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Strengths & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  نقاط القوة
                </h3>
                {auditResult.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {auditResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">لا توجد نقاط قوة محددة حالياً</p>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                  التوصيات
                </h3>
                {auditResult.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {auditResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">لا توجد توصيات حالياً</p>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
