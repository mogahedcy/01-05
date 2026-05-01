"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SEONotificationSection() {
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const notifyProjects = async () => {
    setLoadingProjects(true);
    setMessage(null);
    try {
      const res = await fetch('/api/seo/notify-projects', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'حدث خطأ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'فشل الاتصال بالخادم' });
    } finally {
      setLoadingProjects(false);
    }
  };

  const notifyArticles = async () => {
    setLoadingArticles(true);
    setMessage(null);
    try {
      const res = await fetch('/api/seo/notify-articles', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'حدث خطأ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'فشل الاتصال بالخادم' });
    } finally {
      setLoadingArticles(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">إبلاغ محركات البحث</h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-gray-600 mb-6">
          قم بإبلاغ محركات البحث (Google, Bing, Yandex) عند إضافة محتوى جديد لتسريع عملية الأرشفة وظهور موقعك في نتائج البحث
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden rounded-xl border-2 border-indigo-200 p-6 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">إبلاغ عن المشاريع</h3>
                <p className="text-sm text-gray-600">
                  إرسال جميع مشاريع معرض الأعمال المنشورة إلى محركات البحث للأرشفة السريعة
                </p>
              </div>
            </div>
            <Button
              onClick={notifyProjects}
              disabled={loadingProjects || loadingArticles}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loadingProjects ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري الإبلاغ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  إبلاغ محركات البحث
                </>
              )}
            </Button>
          </div>

          <div className="group relative overflow-hidden rounded-xl border-2 border-rose-200 p-6 hover:border-rose-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-rose-100/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">إبلاغ عن المقالات</h3>
                <p className="text-sm text-gray-600">
                  إرسال جميع مقالات المدونة المنشورة إلى محركات البحث للأرشفة السريعة
                </p>
              </div>
            </div>
            <Button
              onClick={notifyArticles}
              disabled={loadingProjects || loadingArticles}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loadingArticles ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري الإبلاغ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  إبلاغ محركات البحث
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">ملاحظة هامة</h4>
              <p className="text-sm text-blue-800">
                يتم إرسال آخر 50 مشروع/مقال منشور إلى محركات البحث. قد تستغرق عملية الأرشفة من عدة ساعات إلى عدة أيام حسب كل محرك بحث.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
