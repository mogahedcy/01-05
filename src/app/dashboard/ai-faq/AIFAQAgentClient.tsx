'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Sparkles,
  HelpCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowLeft,
  Wand2,
  Clock,
  Eye,
  Edit,
  Tag,
  Settings2,
  MessageCircleQuestion,
  BarChart3
} from 'lucide-react';

interface RecentFAQ {
  id: string;
  question: string;
  status: string;
  category: string;
  createdAt: Date;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
}

const categories = [
  'مظلات سيارات',
  'سواتر',
  'خيم ملكية',
  'بيوت شعر ملكي',
  'برجولات',
  'تنسيق حدائق',
  'هناجر',
  'شبوك',
  'قراميد',
  'ساندوتش بانل'
];

export default function AIFAQAgentClient({ 
  recentFAQs, 
  stats 
}: { 
  recentFAQs: RecentFAQ[];
  stats: Stats;
}) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    category: 'برجولات',
    count: 5,
    shouldPublish: false
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('يرجى إدخال موضوع الأسئلة');
      return;
    }

    if (!formData.keywords.trim()) {
      setError('يرجى إدخال الكلمات المفتاحية');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress('جاري بدء عملية التوليد...');

    try {
      setProgress('🤖 Groq AI يولد الأسئلة والإجابات...');
      
      const response = await fetch('/api/ai-agent/generate-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
          category: formData.category,
          count: formData.count,
          shouldPublish: formData.shouldPublish
        })
      });

      const data = await response.json();

      if (data.success) {
        setProgress('✅ تم التوليد بنجاح!');
        setResult(data);
      } else {
        setError(data.error || 'حدث خطأ أثناء التوليد');
      }
    } catch (err: any) {
      console.error('Error generating FAQs:', err);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFAQs = () => {
    router.push('/dashboard/faqs');
  };

  const handleGenerateMore = () => {
    setResult(null);
    setProgress('');
    setFormData({
      ...formData,
      topic: '',
      keywords: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircleQuestion className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  توليد الأسئلة الشائعة بالذكاء الاصطناعي
                </h1>
                <p className="text-xl text-gray-600">
                  أسئلة وإجابات احترافية تلقائياً باستخدام Groq AI
                </p>
              </div>
            </div>
            <Link href="/dashboard/faqs">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للأسئلة
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-sm text-blue-700">إجمالي الأسئلة</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.published}</div>
              <div className="text-sm text-green-700">منشورة</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{stats.draft}</div>
              <div className="text-sm text-yellow-700">مسودات</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">AI</div>
              <div className="text-sm text-purple-700">Groq Llama 3.3</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-violet-50 to-purple-50">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Wand2 className="w-6 h-6 text-violet-600" />
                  توليد أسئلة جديدة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!result ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        موضوع الأسئلة *
                      </label>
                      <Input
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="مثال: أسعار وأنواع مظلات السيارات في جدة"
                        className="text-lg"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اكتب موضوعاً واضحاً للحصول على أسئلة مفيدة
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        الكلمات المفتاحية *
                      </label>
                      <Input
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        placeholder="مظلات سيارات، أسعار مظلات، تركيب مظلات جدة"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        افصل بين الكلمات بفواصل (,)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                          disabled={loading}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عدد الأسئلة
                        </label>
                        <select
                          value={formData.count}
                          onChange={(e) => setFormData({ ...formData, count: Number.parseInt(e.target.value) })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                          disabled={loading}
                        >
                          {[3, 5, 7, 10].map(num => (
                            <option key={num} value={num}>{num} أسئلة</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="shouldPublish"
                        checked={formData.shouldPublish}
                        onChange={(e) => setFormData({ ...formData, shouldPublish: e.target.checked })}
                        className="w-5 h-5 accent-violet-600"
                        disabled={loading}
                      />
                      <label htmlFor="shouldPublish" className="text-sm">
                        <span className="font-medium">نشر الأسئلة تلقائياً</span>
                        <span className="text-gray-500 block">إذا لم تختر، ستُحفظ كمسودة</span>
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-red-800">{error}</div>
                      </div>
                    )}

                    {loading && progress && (
                      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-violet-600 animate-spin flex-shrink-0" />
                        <div className="text-violet-800 font-medium">{progress}</div>
                      </div>
                    )}

                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !formData.topic.trim() || !formData.keywords.trim()}
                      className="w-full h-14 text-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 ml-2" />
                          توليد الأسئلة الآن
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        تم توليد الأسئلة بنجاح!
                      </h2>
                      <p className="text-gray-600">
                        تم حفظ {result.stats?.saved || 0} سؤال من أصل {result.stats?.total || 0}
                      </p>
                    </div>

                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-3">الأسئلة المولّدة:</h3>
                        <div className="space-y-2">
                          {result.faqs?.map((faq: any, index: number) => (
                            <div key={faq.id} className="bg-white p-3 rounded-lg border">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-violet-600 font-bold text-xs">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{faq.question}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">{faq.category}</Badge>
                                    <Badge className={faq.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                      {faq.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleViewFAQs}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        عرض جميع الأسئلة
                      </Button>
                      <Button
                        onClick={handleGenerateMore}
                        variant="outline"
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        توليد أسئلة أخرى
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings2 className="w-5 h-5 text-gray-500" />
                  كيف يعمل النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-600 font-bold text-xs">1</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Groq AI</strong> يحلل الموضوع والكلمات المفتاحية
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-600 font-bold text-xs">2</span>
                  </div>
                  <p className="text-gray-600">
                    يولد أسئلة طبيعية كما يسألها العملاء
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-600 font-bold text-xs">3</span>
                  </div>
                  <p className="text-gray-600">
                    يكتب إجابات شاملة مع معلومات عملية
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-600 font-bold text-xs">4</span>
                  </div>
                  <p className="text-gray-600">
                    يحسّن SEO تلقائياً (العنوان، الوصف، الكلمات)
                  </p>
                </div>
              </CardContent>
            </Card>

            {recentFAQs.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-gray-500" />
                    آخر الأسئلة المضافة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentFAQs.map((faq) => (
                    <Link
                      key={faq.id}
                      href={`/dashboard/faqs/${faq.id}/edit`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{faq.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              faq.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {faq.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <span className="font-bold text-violet-800">نصيحة</span>
                </div>
                <p className="text-sm text-violet-700">
                  الأسئلة الشائعة تحسّن SEO وتجربة المستخدم. أضف أسئلة متنوعة عن الأسعار، الأنواع، الضمان، والصيانة.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
