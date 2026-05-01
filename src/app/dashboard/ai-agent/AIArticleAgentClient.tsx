'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Sparkles,
  FileText,
  Image as ImageIcon,
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
  Settings2
} from 'lucide-react';

interface RecentArticle {
  id: string;
  title: string;
  status: string;
  category: string;
  createdAt: Date;
  article_media_items: { id: string; src: string }[];
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

export default function AIArticleAgentClient({ recentArticles }: { recentArticles: RecentArticle[] }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    category: 'برجولات',
    wordCount: 2000,
    imageCount: 3,
    shouldPublish: false
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('يرجى إدخال موضوع المقال');
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
      setProgress('🤖 Groq AI يكتب المحتوى...');
      
      const response = await fetch('/api/ai-agent/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
          category: formData.category,
          wordCount: formData.wordCount,
          includeImages: true,
          imageCount: formData.imageCount,
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
      console.error('Error generating article:', err);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = () => {
    if (result?.articleId) {
      router.push(`/dashboard/articles/${result.articleId}/edit`);
    }
  };

  const handleGenerateAnother = () => {
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
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  توليد المقالات بالذكاء الاصطناعي
                </h1>
                <p className="text-xl text-gray-600">
                  مقالات كاملة مع صور تلقائية باستخدام Groq AI
                </p>
              </div>
            </div>
            <Link href="/dashboard/articles">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للمقالات
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Wand2 className="w-6 h-6 text-emerald-600" />
                  توليد مقال جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!result ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        موضوع المقال *
                      </label>
                      <Input
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="مثال: أفضل أنواع البرجولات الخشبية في جدة 2024"
                        className="text-lg"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اكتب موضوعاً واضحاً ومحدداً للحصول على أفضل نتيجة
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
                        placeholder="برجولات خشبية، برجولات جدة، تركيب برجولات"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={loading}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          عدد الصور
                        </label>
                        <select
                          value={formData.imageCount}
                          onChange={(e) => setFormData({ ...formData, imageCount: Number.parseInt(e.target.value) })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={loading}
                        >
                          <option value={1}>1 صورة</option>
                          <option value={2}>2 صور</option>
                          <option value={3}>3 صور</option>
                          <option value={4}>4 صور</option>
                          <option value={5}>5 صور</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        عدد الكلمات: {formData.wordCount}
                      </label>
                      <input
                        type="range"
                        min="500"
                        max="2000"
                        step="100"
                        value={formData.wordCount}
                        onChange={(e) => setFormData({ ...formData, wordCount: Number.parseInt(e.target.value) })}
                        className="w-full accent-emerald-600"
                        disabled={loading}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>500 كلمة</span>
                        <span>2000 كلمة</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="shouldPublish"
                        checked={formData.shouldPublish}
                        onChange={(e) => setFormData({ ...formData, shouldPublish: e.target.checked })}
                        className="w-5 h-5 accent-emerald-600"
                        disabled={loading}
                      />
                      <label htmlFor="shouldPublish" className="text-sm">
                        <span className="font-medium">نشر المقال تلقائياً</span>
                        <span className="text-gray-500 block">إذا لم تختر، سيُحفظ كمسودة</span>
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-red-800">{error}</div>
                      </div>
                    )}

                    {loading && progress && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
                        <div className="text-emerald-800 font-medium">{progress}</div>
                      </div>
                    )}

                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !formData.topic.trim() || !formData.keywords.trim()}
                      className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 ml-2" />
                          توليد المقال الآن
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        تم توليد المقال بنجاح!
                      </h2>
                      <p className="text-gray-600">
                        المقال جاهز ويمكنك تعديله أو نشره الآن
                      </p>
                    </div>

                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{result.article?.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{result.article?.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{result.article?.category}</Badge>
                          <Badge className={result.article?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {result.article?.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            <ImageIcon className="w-3 h-3 ml-1" />
                            {result.article?.mediaCount} صور
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleViewArticle}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      >
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل المقال والصور
                      </Button>
                      <Button
                        onClick={handleGenerateAnother}
                        variant="outline"
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        توليد مقال آخر
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
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-xs">1</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Groq AI</strong> يكتب محتوى مُحسَّن للـ SEO
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-xs">2</span>
                  </div>
                  <p className="text-gray-600">
                    يختار صوراً مناسبة تلقائياً من معرض أعمالك أو Unsplash
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-xs">3</span>
                  </div>
                  <p className="text-gray-600">
                    يحفظ المقال مع الصور في قاعدة البيانات
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-xs">4</span>
                  </div>
                  <p className="text-gray-600">
                    يمكنك تعديل الصور غير المناسبة بعد التوليد
                  </p>
                </div>
              </CardContent>
            </Card>

            {recentArticles.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-gray-500" />
                    آخر المقالات المُولَّدة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/dashboard/articles/${article.id}/edit`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {article.article_media_items[0] ? (
                          <Image
                            src={article.article_media_items[0].src}
                            alt={article.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{article.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              article.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {article.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">نصيحة</span>
                </div>
                <p className="text-sm text-emerald-700">
                  بعد توليد المقال، يمكنك الذهاب لصفحة التعديل لتغيير الصور غير المناسبة بصور من جهازك.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
