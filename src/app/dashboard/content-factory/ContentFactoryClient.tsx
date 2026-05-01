'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, CheckCircle, FileText, MessageCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ContentFactoryClient() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setError('الرجاء إدخال الكلمة المفتاحية أولاً');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch('/api/admin/content-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التوليد');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'فشل الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 mb-2">
          <Sparkles className="w-10 h-10 text-blue-600" />
          مصنع المحتوى الذكي (GROQ API)
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          أدخل كلمة مفتاحية وسيقوم الذكاء الاصطناعي بكتابة مقال متوافق مع الـ SEO وتوليد 3 أسئلة شائعة ونشرها فوراً.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الكلمة المفتاحية المستهدفة</label>
            <Input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="مثال: تركيب سواتر حديد بجدة..."
              className="h-14 text-lg bg-slate-50 rounded-2xl border-slate-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">القسم المرتبط</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full h-14 text-lg bg-slate-50 rounded-2xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 px-4 pr-10 cursor-pointer transition-all"
              >
                <option value="" disabled>اختر القسم المناسب...</option>
                <option value="مظلات">مظلات</option>
                <option value="سواتر">سواتر</option>
                <option value="ساندوتش بانل">ساندوتش بانل</option>
                <option value="هناجر ومستودعات">هناجر ومستودعات</option>
                <option value="برجولات">برجولات</option>
                <option value="بيوت شعر">بيوت شعر</option>
                <option value="قرميد">قرميد</option>
                <option value="مقاولات عامة">مقاولات عامة</option>
                <option value="أخرى">أخرى</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-3 font-medium">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !keyword}
          className="w-full h-16 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 ml-3 animate-spin" />
              جاري توليد المقال والأسئلة الشائعة... (يستغرق حوالي 15 ثانية)
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 ml-3" />
              بدء التصنيع والنشر التلقائي
            </>
          )}
        </Button>
      </div>

      {result && result.success && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-green-900 font-bold text-xl">تم النشر بنجاح!</h3>
                <p className="text-green-700 font-medium">تمت إضافة المقال والأسئلة الشائعة لقاعدة البيانات.</p>
              </div>
            </div>
            
            <Button asChild variant="outline" className="bg-white hover:bg-green-100 border-green-200 text-green-800 rounded-xl h-12 px-6">
              <Link href={`/ar/articles/${result.article.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 ml-2" />
                معاينة المقال في الموقع
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                تفاصيل المقال المُولد
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-slate-500 text-sm font-bold block mb-1">العنوان</span>
                  <p className="font-bold text-slate-900">{result.article.title}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-bold block mb-1">المقتطف</span>
                  <p className="text-slate-700 leading-relaxed">{result.article.excerpt}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-bold block mb-1">الوسوم (SEO Tags)</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.article.article_tags?.map((tag: any, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                الأسئلة الشائعة المرتبطة ({result.faqs?.length})
              </h3>
              <div className="space-y-4">
                {result.faqs?.map((faq: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-2">س: {faq.question}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">ج: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
