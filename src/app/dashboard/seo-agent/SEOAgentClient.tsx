'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  FileText,
  Search,
  TrendingUp,
  Link2,
  Tag,
  Sparkles,
  BarChart3,
  Target,
  Lightbulb,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AvailablePages {
  projects: { title: string; url: string; keywords: string[] }[];
  articles: { title: string; url: string; keywords: string[] }[];
}

export default function SEOAgentClient({ availablePages }: { availablePages: AvailablePages }) {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate' | 'competitor' | 'links' | 'cluster'>('analyze');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    content: '',
    keywords: '',
    topic: '',
    contentType: 'article',
    wordCount: 800,
    competitorUrl: '',
    industry: 'البناء والإنشاءات',
    pageType: 'article'
  });

  const handleAnalyzeContent = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seo-agent/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          targetKeywords: formData.keywords.split(',').map(k => k.trim())
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء تحليل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seo-agent/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          contentType: formData.contentType,
          wordCount: formData.wordCount
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء توليد المحتوى');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCompetitor = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seo-agent/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorUrl: formData.competitorUrl,
          industry: formData.industry
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء تحليل المنافس');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestLinks = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const allPages = [...availablePages.projects, ...availablePages.articles];
      const response = await fetch('/api/seo-agent/suggest-internal-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          availablePages: allPages
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء اقتراح الروابط');
    } finally {
      setLoading(false);
    }
  };

  const handleClusterKeywords = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seo-agent/cluster-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: formData.keywords.split(',').map(k => k.trim())
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء تجميع الكلمات المفتاحية');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'analyze', label: 'تحليل المحتوى', icon: Search },
    { id: 'generate', label: 'توليد محتوى', icon: Sparkles },
    { id: 'competitor', label: 'تحليل منافس', icon: Target },
    { id: 'links', label: 'روابط داخلية', icon: Link2 },
    { id: 'cluster', label: 'تجميع الكلمات', icon: Tag }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                وكيل الذكاء الاصطناعي لتحسين SEO
              </h1>
              <p className="text-xl text-gray-600">
                أدوات متقدمة مدعومة بالذكاء الاصطناعي لتحليل وتحسين موقعك
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
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setResult(null);
                  setError(null);
                }}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              {activeTab === 'analyze' && 'تحليل المحتوى'}
              {activeTab === 'generate' && 'توليد محتوى محسّن'}
              {activeTab === 'competitor' && 'تحليل المنافسين'}
              {activeTab === 'links' && 'اقتراح روابط داخلية'}
              {activeTab === 'cluster' && 'تجميع الكلمات المفتاحية'}
            </h2>

            {activeTab === 'analyze' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">المحتوى للتحليل</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="الصق المحتوى الذي تريد تحليله هنا..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="برجولات، مظلات، حدائق..."
                  />
                </div>
                <Button
                  onClick={handleAnalyzeContent}
                  disabled={loading || !formData.content || !formData.keywords}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 ml-2" />
                      تحليل المحتوى
                    </>
                  )}
                </Button>
              </div>
            )}

            {activeTab === 'generate' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">موضوع المحتوى</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="مثال: أفضل أنواع البرجولات الخشبية في جدة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الكلمات المفتاحية</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="برجولات خشبية، برجولات جدة..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع المحتوى</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="article">مقال</option>
                    <option value="project_description">وصف مشروع</option>
                    <option value="service_page">صفحة خدمة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">عدد الكلمات: {formData.wordCount}</label>
                  <input
                    type="range"
                    min="400"
                    max="2000"
                    step="100"
                    value={formData.wordCount}
                    onChange={(e) => setFormData({ ...formData, wordCount: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleGenerateContent}
                  disabled={loading || !formData.topic || !formData.keywords}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 ml-2" />
                      توليد محتوى محسّن
                    </>
                  )}
                </Button>
              </div>
            )}

            {activeTab === 'competitor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">رابط المنافس</label>
                  <input
                    type="url"
                    value={formData.competitorUrl}
                    onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المجال</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="البناء والإنشاءات"
                  />
                </div>
                <Button
                  onClick={handleAnalyzeCompetitor}
                  disabled={loading || !formData.competitorUrl}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 ml-2" />
                      تحليل المنافس
                    </>
                  )}
                </Button>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">المحتوى</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="الصق المحتوى الذي تريد اقتراح روابط داخلية له..."
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>الصفحات المتاحة:</strong> {availablePages.projects.length} مشروع، {availablePages.articles.length} مقال
                  </p>
                </div>
                <Button
                  onClick={handleSuggestLinks}
                  disabled={loading || !formData.content}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 ml-2" />
                      اقتراح روابط داخلية
                    </>
                  )}
                </Button>
              </div>
            )}

            {activeTab === 'cluster' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (مفصولة بفواصل)</label>
                  <textarea
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="برجولات خشبية، برجولات حديدية، مظلات سيارات، مظلات حدائق، تنسيق حدائق..."
                  />
                </div>
                <Button
                  onClick={handleClusterKeywords}
                  disabled={loading || !formData.keywords}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التجميع...
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 ml-2" />
                      تجميع الكلمات المفتاحية
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              النتائج
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-red-800">{error}</div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>اختر أداة من الأعلى وابدأ التحليل</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
                <p className="text-gray-600">جاري معالجة طلبك...</p>
              </div>
            )}

            {result && activeTab === 'analyze' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">درجة SEO</div>
                    <div className="text-3xl font-bold text-blue-900">{result.seo_score}/100</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">سهولة القراءة</div>
                    <div className="text-3xl font-bold text-green-900">{result.readability_score}/100</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    العنوان المقترح
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">{result.meta_title_suggestion}</div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">الوصف المقترح</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">{result.meta_description_suggestion}</div>
                </div>

                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      اقتراحات التحسين
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {result && activeTab === 'generate' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">العنوان</h3>
                  <div className="bg-blue-50 p-3 rounded-lg font-medium">{result.title}</div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Meta Description</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">{result.meta_description}</div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">المحتوى</h3>
                  <div 
                    className="bg-white border border-gray-200 p-4 rounded-lg text-sm max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: result.content }}
                  />
                </div>
                {result.tags && (
                  <div>
                    <h3 className="font-bold mb-2">الوسوم</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result && activeTab === 'competitor' && (
              <div className="space-y-4">
                {result.top_keywords && (
                  <div>
                    <h3 className="font-bold mb-2">الكلمات المفتاحية الأساسية</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.top_keywords.map((keyword: string, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.content_strategy && (
                  <div>
                    <h3 className="font-bold mb-2">استراتيجية المحتوى</h3>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">{result.content_strategy}</div>
                  </div>
                )}
                {result.content_gaps && result.content_gaps.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2 text-green-700">فرص المحتوى</h3>
                    <ul className="space-y-2">
                      {result.content_gaps.map((gap: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5" />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {result && activeTab === 'links' && result.suggestions && (
              <div className="space-y-3">
                <h3 className="font-bold mb-3">الروابط الداخلية المقترحة</h3>
                {result.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-blue-900">{suggestion.anchor_text}</div>
                      <Badge className="bg-purple-600">{suggestion.relevance_score}%</Badge>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <strong>الرابط:</strong> {suggestion.target_url}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>الموقع المقترح:</strong> {suggestion.position}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result && activeTab === 'cluster' && result.clusters && (
              <div className="space-y-4">
                {result.clusters.map((cluster: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-purple-900">{cluster.cluster_name}</h4>
                      <Badge className="bg-purple-600">أولوية: {cluster.priority_score}</Badge>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">الكلمات المفتاحية:</div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.keywords.map((keyword: string, kidx: number) => (
                          <Badge key={kidx} variant="outline" className="text-xs">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700">نية البحث:</div>
                      <div className="text-sm text-gray-600">{cluster.search_intent}</div>
                    </div>
                    {cluster.content_ideas && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">أفكار المحتوى:</div>
                        <ul className="space-y-1">
                          {cluster.content_ideas.map((idea: string, iidx: number) => (
                            <li key={iidx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 text-purple-600 mt-1" />
                              {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
