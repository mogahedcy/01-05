'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Wrench,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Zap,
  Settings,
  Play,
  Info
} from 'lucide-react';

interface TopicInput {
  id: string;
  topic: string;
  keywords: string;
  category: string;
}

interface GenerationResult {
  topic: string;
  status: 'success' | 'failed';
  articleId?: string;
  error?: string;
}

interface FixResult {
  type: string;
  status: 'success' | 'failed';
  itemId: string;
  itemTitle: string;
  changes?: string[];
  error?: string;
}

export default function AutomationClient() {
  const [activeTab, setActiveTab] = useState<'smart' | 'generate' | 'fix' | 'schedule'>('smart');
  
  const [topics, setTopics] = useState<TopicInput[]>([
    { id: '1', topic: '', keywords: '', category: 'برجولات' }
  ]);
  const [shouldPublish, setShouldPublish] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [fixLoading, setFixLoading] = useState(false);
  const [fixResults, setFixResults] = useState<FixResult[]>([]);
  const [fixProgress, setFixProgress] = useState(0);

  const [scheduleSettings, setScheduleSettings] = useState({
    generateEnabled: false,
    generateFrequency: 'daily',
    generateCount: 3,
    generateNiche: '',
    generateAutoPublish: false,
    fixEnabled: false,
    fixFrequency: 'weekly',
    faqEnabled: false,
    faqFrequency: 'weekly',
    faqCount: 5,
    faqNiche: '',
    faqAutoPublish: false,
  });

  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleLogs, setScheduleLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const [smartNiche, setSmartNiche] = useState('');
  const [smartCount, setSmartCount] = useState(5);
  const [smartAutoPublish, setSmartAutoPublish] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartResults, setSmartResults] = useState<any>(null);
  const [smartProgress, setSmartProgress] = useState(0);

  const addTopic = () => {
    setTopics([
      ...topics,
      { id: Date.now().toString(), topic: '', keywords: '', category: 'برجولات' }
    ]);
  };

  const removeTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const updateTopic = (id: string, field: keyof TopicInput, value: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleGenerate = async () => {
    const validTopics = topics.filter(t => t.topic && t.keywords && t.category);
    
    if (validTopics.length === 0) {
      alert('يرجى إضافة موضوع واحد على الأقل مع جميع الحقول');
      return;
    }

    if (validTopics.length > 10) {
      alert('الحد الأقصى 10 مقالات في المرة الواحدة');
      return;
    }

    setGenerationLoading(true);
    setGenerationResults([]);
    setGenerationProgress(0);

    try {
      const response = await fetch('/api/ai-agent/generate-multiple-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: validTopics,
          shouldPublish
        })
      });

      const data = await response.json();

      if (data.success) {
        setGenerationResults(data.results || []);
        setGenerationProgress(100);
      } else {
        alert(data.error || 'حدث خطأ أثناء التوليد');
      }
    } catch (error: any) {
      alert('حدث خطأ في الاتصال');
      console.error(error);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleAutoFix = async () => {
    setFixLoading(true);
    setFixResults([]);
    setFixProgress(0);

    try {
      const response = await fetch('/api/ai-agent/auto-fix-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setFixResults(data.results || []);
        setFixProgress(100);
      } else {
        alert(data.error || 'حدث خطأ أثناء الإصلاح');
      }
    } catch (error: any) {
      alert('حدث خطأ في الاتصال');
      console.error(error);
    } finally {
      setFixLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'schedule') {
      loadScheduleSettings();
      loadScheduleLogs();
    }
  }, [activeTab]);

  const loadScheduleSettings = async () => {
    try {
      const response = await fetch('/api/automation/schedule');
      const data = await response.json();
      
      if (data.success && data.schedule) {
        setScheduleSettings({
          generateEnabled: data.schedule.generateEnabled || false,
          generateFrequency: data.schedule.generateFrequency || 'daily',
          generateCount: data.schedule.generateCount || 3,
          generateNiche: data.schedule.generateNiche || '',
          generateAutoPublish: data.schedule.generateAutoPublish || false,
          fixEnabled: data.schedule.fixEnabled || false,
          fixFrequency: data.schedule.fixFrequency || 'weekly',
          faqEnabled: data.schedule.faqEnabled || false,
          faqFrequency: data.schedule.faqFrequency || 'weekly',
          faqCount: data.schedule.faqCount || 5,
          faqNiche: data.schedule.faqNiche || '',
          faqAutoPublish: data.schedule.faqAutoPublish || false,
        });
      }
    } catch (error) {
      console.error('Error loading schedule settings:', error);
    }
  };

  const loadScheduleLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await fetch('/api/automation/logs?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setScheduleLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const saveScheduleSettings = async () => {
    if (scheduleSettings.generateEnabled && !scheduleSettings.generateNiche) {
      alert('يرجى إدخال مجال للتوليد الذكي للمقالات');
      return;
    }

    if (scheduleSettings.faqEnabled && !scheduleSettings.faqNiche) {
      alert('يرجى إدخال مجال للتوليد الذكي للأسئلة الشائعة');
      return;
    }

    setScheduleLoading(true);
    try {
      const response = await fetch('/api/automation/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleSettings)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ تم حفظ الإعدادات بنجاح!');
        await loadScheduleLogs();
      } else {
        alert(data.error || 'حدث خطأ في الحفظ');
      }
    } catch (error: any) {
      alert('حدث خطأ في الاتصال');
      console.error(error);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSmartGenerate = async () => {
    if (!smartNiche.trim()) {
      alert('يرجى إدخال مجال البحث أو الموضوع');
      return;
    }

    if (smartCount < 1 || smartCount > 10) {
      alert('عدد المقالات يجب أن يكون بين 1 و 10');
      return;
    }

    setSmartLoading(true);
    setSmartResults(null);
    setSmartProgress(0);

    try {
      const response = await fetch('/api/ai-agent/smart-auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: smartNiche,
          count: smartCount,
          autoPublish: smartAutoPublish
        })
      });

      const data = await response.json();

      if (data.success) {
        setSmartResults(data);
        setSmartProgress(100);
      } else {
        alert(data.error || 'حدث خطأ أثناء التوليد الذكي');
      }
    } catch (error: any) {
      alert('حدث خطأ في الاتصال');
      console.error(error);
    } finally {
      setSmartLoading(false);
    }
  };

  const tabs = [
    { id: 'smart', label: 'التوليد الذكي', icon: Sparkles },
    { id: 'generate', label: 'توليد عادي', icon: FileText },
    { id: 'fix', label: 'إصلاح SEO', icon: Wrench },
    { id: 'schedule', label: 'الجدولة', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                الأتمتة الذكية
              </h1>
              <p className="text-xl text-gray-600">
                وفّر وقتك مع التوليد والإصلاح التلقائي المدعوم بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                    : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {activeTab === 'smart' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  التوليد الذكي بالذكاء الاصطناعي
                </h2>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  مدعوم بـ Gemini AI
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">كيف يعمل التوليد الذكي؟</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>يحلل المنافسين في نتائج البحث الأولى</li>
                      <li>يختار العناوين والكلمات المفتاحية الأكثر نجاحاً</li>
                      <li>يكتب محتوى بأسلوب بشري طبيعي ومتطور</li>
                      <li>يختار الصور المناسبة تلقائياً</li>
                      <li>يحسّن المقالات لمحركات البحث</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المجال أو الموضوع العام
                  </label>
                  <input
                    type="text"
                    value={smartNiche}
                    onChange={(e) => setSmartNiche(e.target.value)}
                    placeholder="مثال: برجولات خشبية، مظلات حدائق، تنسيق حدائق منزلية"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={smartLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سيقوم الذكاء الاصطناعي بتحليل المنافسين واقتراح مقالات ذكية
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد المقالات (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={smartCount}
                    onChange={(e) => setSmartCount(Number.parseInt(e.target.value) || 1)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={smartLoading}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="smart-auto-publish"
                    checked={smartAutoPublish}
                    onChange={(e) => setSmartAutoPublish(e.target.checked)}
                    disabled={smartLoading}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="smart-auto-publish" className="text-sm font-medium">
                    نشر المقالات تلقائياً (بدون مراجعة)
                  </label>
                </div>

                <Button
                  onClick={handleSmartGenerate}
                  disabled={smartLoading || !smartNiche.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {smartLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التحليل والتوليد الذكي...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-2" />
                      بدء التوليد الذكي
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                النتائج والإحصائيات
              </h3>

              {smartLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">جاري تحليل المنافسين...</p>
                  <p className="text-sm text-gray-500 mt-2">قد يستغرق هذا عدة دقائق</p>
                  <Progress value={smartProgress} className="mt-4" />
                </div>
              )}

              {!smartLoading && !smartResults && (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>ابدأ التوليد الذكي لرؤية النتائج هنا</p>
                </div>
              )}

              {smartResults && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-3">📊 ملخص التوليد</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600">نجح</p>
                        <p className="text-2xl font-bold text-green-600">
                          {smartResults.analysis?.stats?.successCount || 0}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600">متوسط SEO</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {smartResults.analysis?.stats?.averageSeoScore || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {smartResults.analysis?.competitorInsights && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-2">🔍 رؤى المنافسين</h4>
                      <div className="text-sm text-blue-800 space-y-2">
                        <div>
                          <p className="font-semibold">الجمهور المستهدف:</p>
                          <p className="text-blue-700">{smartResults.analysis.competitorInsights.targetAudience}</p>
                        </div>
                        <div>
                          <p className="font-semibold">الأسلوب:</p>
                          <p className="text-blue-700">{smartResults.analysis.competitorInsights.toneAndStyle}</p>
                        </div>
                        <div>
                          <p className="font-semibold">أهم الكلمات المفتاحية:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {smartResults.analysis.competitorInsights.topKeywords?.slice(0, 5).map((kw: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800">المقالات المولّدة:</h4>
                    {smartResults.results?.map((result: any, index: number) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 ${
                          result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{result.title}</p>
                            {result.seoScore && (
                              <p className="text-sm text-gray-600 mt-1">
                                SEO: {result.seoScore}/100
                              </p>
                            )}
                            {result.error && (
                              <p className="text-sm text-red-600 mt-1">{result.error}</p>
                            )}
                          </div>
                          {result.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  توليد مقالات متعددة
                </h2>
                <Badge variant="outline" className="text-sm">
                  {topics.length}/10 مقالات
                </Badge>
              </div>

              <div className="space-y-4 mb-4">
                {topics.map((topic, index) => (
                  <div key={topic.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-700">مقال #{index + 1}</span>
                      {topics.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTopic(topic.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">موضوع المقال</label>
                        <input
                          type="text"
                          value={topic.topic}
                          onChange={(e) => updateTopic(topic.id, 'topic', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="مثال: أفضل أنواع البرجولات الخشبية في جدة"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">الكلمات المفتاحية (مفصولة بفواصل)</label>
                        <input
                          type="text"
                          value={topic.keywords}
                          onChange={(e) => updateTopic(topic.id, 'keywords', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="برجولات خشبية، برجولات جدة، تركيب برجولات"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">التصنيف</label>
                        <select
                          value={topic.category}
                          onChange={(e) => updateTopic(topic.id, 'category', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="برجولات">برجولات</option>
                          <option value="مظلات">مظلات</option>
                          <option value="حدائق">حدائق</option>
                          <option value="ديكورات">ديكورات</option>
                          <option value="عام">عام</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={addTopic}
                variant="outline"
                className="w-full mb-4"
                disabled={topics.length >= 10}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مقال آخر
              </Button>

              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="shouldPublish"
                  checked={shouldPublish}
                  onChange={(e) => setShouldPublish(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="shouldPublish" className="text-sm font-medium text-blue-900">
                  نشر المقالات تلقائياً بعد التوليد
                </label>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generationLoading || topics.every(t => !t.topic || !t.keywords)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {generationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التوليد... ({Math.round(generationProgress)}%)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 ml-2" />
                    بدء التوليد التلقائي
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                النتائج
              </h2>

              {!generationResults.length && !generationLoading && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>النتائج ستظهر هنا بعد بدء التوليد</p>
                </div>
              )}

              {generationLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
                  <p className="text-gray-600 mb-4">جاري توليد المقالات...</p>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}

              {generationResults.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">نجح</div>
                      <div className="text-3xl font-bold text-green-900">
                        {generationResults.filter(r => r.status === 'success').length}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-red-600 mb-1">فشل</div>
                      <div className="text-3xl font-bold text-red-900">
                        {generationResults.filter(r => r.status === 'failed').length}
                      </div>
                    </div>
                  </div>

                  {generationResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.status === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{result.topic}</div>
                          {result.status === 'success' && result.articleId && (
                            <div className="text-sm text-gray-600 mt-1">
                              تم إنشاء المقال بنجاح! رقم المقال: {result.articleId}
                            </div>
                          )}
                          {result.status === 'failed' && result.error && (
                            <div className="text-sm text-red-600 mt-1">{result.error}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'fix' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-blue-600" />
                إصلاح SEO التلقائي
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">ماذا يفعل الإصلاح التلقائي؟</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>إصلاح النصوص البديلة المفقودة للصور</li>
                      <li>تحسين العناوين والأوصاف</li>
                      <li>إصلاح المحتوى المكرر</li>
                      <li>تحسين الكلمات المفتاحية</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAutoFix}
                disabled={fixLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {fixLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإصلاح... ({Math.round(fixProgress)}%)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 ml-2" />
                    بدء الإصلاح التلقائي
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                نتائج الإصلاح
              </h2>

              {!fixResults.length && !fixLoading && (
                <div className="text-center py-12 text-gray-500">
                  <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>النتائج ستظهر هنا بعد بدء الإصلاح</p>
                </div>
              )}

              {fixLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
                  <p className="text-gray-600 mb-4">جاري فحص وإصلاح المشاكل...</p>
                  <Progress value={fixProgress} className="w-full" />
                </div>
              )}

              {fixResults.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">تم الإصلاح</div>
                      <div className="text-3xl font-bold text-green-900">
                        {fixResults.filter(r => r.status === 'success').length}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-red-600 mb-1">فشل</div>
                      <div className="text-3xl font-bold text-red-900">
                        {fixResults.filter(r => r.status === 'failed').length}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {fixResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.status === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {result.status === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{result.itemTitle}</div>
                            <div className="text-sm text-gray-600 mt-1">النوع: {result.type}</div>
                            {result.status === 'success' && result.changes && (
                              <div className="text-sm text-gray-600 mt-2">
                                <div className="font-medium">التغييرات:</div>
                                <ul className="list-disc list-inside mt-1">
                                  {result.changes.map((change, i) => (
                                    <li key={i}>{change}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {result.status === 'failed' && result.error && (
                              <div className="text-sm text-red-600 mt-1">{result.error}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" />
                  إعدادات الجدولة
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">نظام الجدولة جاهز!</p>
                      <p>
                        احفظ إعداداتك هنا، وسيتم تنفيذها تلقائياً حسب الجدول المحدد.
                        للتفعيل الكامل، قم بإعداد Cron job يستدعي: <code className="bg-blue-100 px-1 rounded">/api/cron/scheduled-tasks</code>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        التوليد الذكي التلقائي
                      </h3>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={scheduleSettings.generateEnabled}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            generateEnabled: e.target.checked
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">مفعّل</span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          المجال أو الموضوع العام *
                        </label>
                        <input
                          type="text"
                          value={scheduleSettings.generateNiche}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            generateNiche: e.target.value
                          })}
                          placeholder="مثال: برجولات خشبية، مظلات حدائق"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          disabled={!scheduleSettings.generateEnabled}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">التكرار</label>
                        <select
                          value={scheduleSettings.generateFrequency}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            generateFrequency: e.target.value
                          })}
                          className="w-full p-2 border rounded-lg"
                          disabled={!scheduleSettings.generateEnabled}
                        >
                          <option value="daily">يومياً</option>
                          <option value="weekly">أسبوعياً</option>
                          <option value="monthly">شهرياً</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عدد المقالات لكل دفعة: {scheduleSettings.generateCount}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={scheduleSettings.generateCount}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            generateCount: Number.parseInt(e.target.value)
                          })}
                          className="w-full"
                          disabled={!scheduleSettings.generateEnabled}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="schedule-auto-publish"
                          checked={scheduleSettings.generateAutoPublish}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            generateAutoPublish: e.target.checked
                          })}
                          disabled={!scheduleSettings.generateEnabled}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="schedule-auto-publish" className="text-sm font-medium">
                          نشر المقالات تلقائياً
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        إصلاح SEO التلقائي
                      </h3>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={scheduleSettings.fixEnabled}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            fixEnabled: e.target.checked
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">مفعّل</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">التكرار</label>
                      <select
                        value={scheduleSettings.fixFrequency}
                        onChange={(e) => setScheduleSettings({
                          ...scheduleSettings,
                          fixFrequency: e.target.value
                        })}
                        className="w-full p-2 border rounded-lg"
                        disabled={!scheduleSettings.fixEnabled}
                      >
                        <option value="daily">يومياً</option>
                        <option value="weekly">أسبوعياً</option>
                        <option value="monthly">شهرياً</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-violet-200 rounded-lg p-6 bg-violet-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                        توليد الأسئلة الشائعة التلقائي
                      </h3>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={scheduleSettings.faqEnabled}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            faqEnabled: e.target.checked
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">مفعّل</span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          المجال أو الموضوع العام *
                        </label>
                        <input
                          type="text"
                          value={scheduleSettings.faqNiche}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            faqNiche: e.target.value
                          })}
                          placeholder="مثال: مظلات سيارات، برجولات خشبية"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                          disabled={!scheduleSettings.faqEnabled}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">التكرار</label>
                        <select
                          value={scheduleSettings.faqFrequency}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            faqFrequency: e.target.value
                          })}
                          className="w-full p-2 border rounded-lg"
                          disabled={!scheduleSettings.faqEnabled}
                        >
                          <option value="daily">يومياً</option>
                          <option value="weekly">أسبوعياً</option>
                          <option value="monthly">شهرياً</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عدد الأسئلة لكل دفعة: {scheduleSettings.faqCount}
                        </label>
                        <input
                          type="range"
                          min="3"
                          max="15"
                          value={scheduleSettings.faqCount}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            faqCount: Number.parseInt(e.target.value)
                          })}
                          className="w-full"
                          disabled={!scheduleSettings.faqEnabled}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="schedule-faq-auto-publish"
                          checked={scheduleSettings.faqAutoPublish}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            faqAutoPublish: e.target.checked
                          })}
                          disabled={!scheduleSettings.faqEnabled}
                          className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                        />
                        <label htmlFor="schedule-faq-auto-publish" className="text-sm font-medium">
                          نشر الأسئلة تلقائياً
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={saveScheduleSettings}
                    disabled={scheduleLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  >
                    {scheduleLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                        حفظ الإعدادات
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                سجل المهام المنفذة
              </h3>

              {logsLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">جاري تحميل السجل...</p>
                </div>
              )}

              {!logsLoading && scheduleLogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد مهام منفذة بعد</p>
                  <p className="text-sm mt-2">سيظهر السجل هنا بعد تنفيذ المهام المجدولة</p>
                </div>
              )}

              {!logsLoading && scheduleLogs.length > 0 && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {scheduleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`border rounded-lg p-4 ${
                        log.status === 'SUCCESS'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {log.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900">
                              {log.taskType === 'GENERATE_ARTICLES' ? '📝 توليد مقالات' : '🔧 إصلاح SEO'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.executedAt).toLocaleString('ar-SA')}
                            </span>
                          </div>
                          
                          {log.message && (
                            <p className="text-sm text-gray-700 mb-2">{log.message}</p>
                          )}
                          
                          {(log.successCount !== null || log.failureCount !== null) && (
                            <div className="flex gap-4 text-sm">
                              {log.successCount !== null && (
                                <span className="text-green-700">✅ نجح: {log.successCount}</span>
                              )}
                              {log.failureCount !== null && log.failureCount > 0 && (
                                <span className="text-red-700">❌ فشل: {log.failureCount}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
