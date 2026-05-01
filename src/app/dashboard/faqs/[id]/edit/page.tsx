'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Save,
  Loader2,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function EditFAQPage() {
  const router = useRouter();
  const params = useParams();
  const faqId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'مظلات سيارات',
    order: 0,
    featured: false,
    status: 'PUBLISHED',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    relatedQuestions: ''
  });

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

  useEffect(() => {
    fetchFAQ();
  }, [faqId]);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/faqs/${faqId}`);
      const data = await response.json();

      if (data.success) {
        const faq = data.faq;
        setFormData({
          question: faq.question || '',
          answer: faq.answer || '',
          category: faq.category || 'عامة',
          order: faq.order || 0,
          featured: faq.featured || false,
          status: faq.status || 'PUBLISHED',
          slug: faq.slug || '',
          metaTitle: faq.metaTitle || '',
          metaDescription: faq.metaDescription || '',
          keywords: faq.keywords || '',
          relatedQuestions: faq.relatedQuestions || ''
        });
      } else {
        setError('فشل في تحميل البيانات');
      }
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      setError('حدث خطأ أثناء التحميل');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
      .substring(0, 100);
  };

  const handleQuestionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      question: value,
      slug: prev.slug || generateSlug(value),
      metaTitle: prev.metaTitle || value.substring(0, 60)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('الرجاء إدخال السؤال والإجابة');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const response = await fetch(`/api/faqs/${faqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('تم تحديث السؤال بنجاح!');
        setTimeout(() => {
          router.push('/dashboard/faqs');
        }, 1500);
      } else {
        setError(data.error || 'فشل في تحديث السؤال');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      setError('حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/faqs/${faqId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('تم حذف السؤال بنجاح!');
        setTimeout(() => {
          router.push('/dashboard/faqs');
        }, 1000);
      } else {
        setError(data.error || 'فشل في حذف السؤال');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setError('حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/faqs">
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  تعديل السؤال
                </h1>
                <p className="text-sm text-gray-500">
                  تحديث معلومات السؤال الشائع
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <HelpCircle className="w-3 h-3" />
                تعديل
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              المعلومات الأساسية
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السؤال <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  placeholder="مثال: ما هي أفضل أنواع مظلات السيارات؟"
                  required
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإجابة <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="اكتب إجابة شاملة ومفيدة..."
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  عدد الأحرف: {formData.answer.length}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PUBLISHED">منشور</option>
                    <option value="DRAFT">مسودة</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  سؤال مميز (يظهر في الصفحة الرئيسية)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                تحسين محركات البحث (SEO)
              </h2>
              <Badge variant="secondary" className="text-xs">
                اختياري
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرابط (Slug)
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="best-car-shades-types"
                  dir="ltr"
                  className="text-left"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يُستخدم في رابط الصفحة
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان Meta
                </label>
                <Input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="عنوان محسّن لمحركات البحث"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 حرف
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف Meta
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="وصف مختصر يظهر في نتائج البحث"
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 حرف
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية
                </label>
                <Input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="مظلات، سيارات، جدة، أسعار (افصل بفاصلة)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  أسئلة ذات صلة (IDs مفصولة بفاصلة)
                </label>
                <Input
                  type="text"
                  value={formData.relatedQuestions}
                  onChange={(e) => setFormData({ ...formData, relatedQuestions: e.target.value })}
                  placeholder="id1, id2, id3"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 sticky bottom-0 bg-gray-50 py-4 border-t">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التعديلات
                </>
              )}
            </Button>
            <Link href="/dashboard/faqs" className="flex-1">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                className="w-full"
              >
                إلغاء
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
