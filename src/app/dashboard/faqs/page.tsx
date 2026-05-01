'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  HelpCircle,
  Check,
  X,
  Star,
  ArrowUpDown
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function FAQsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'مظلات سيارات',
    order: 0,
    featured: false,
    status: 'PUBLISHED'
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
    fetchFAQs();
  }, [selectedCategory, selectedStatus]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/faqs?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs';
      const method = editingFaq ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowAddModal(false);
        setEditingFaq(null);
        setFormData({
          question: '',
          answer: '',
          category: 'مظلات',
          order: 0,
          featured: false,
          status: 'PUBLISHED'
        });
        fetchFAQs();
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    
    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFAQs();
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      featured: faq.featured,
      status: faq.status
    });
    setShowAddModal(true);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'order') return a.order - b.order;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'views') return b.views - a.views;
    return 0;
  });

  const stats = {
    total: faqs.length,
    published: faqs.filter(f => f.status === 'PUBLISHED').length,
    featured: faqs.filter(f => f.featured).length,
    totalViews: faqs.reduce((sum, f) => sum + f.views, 0)
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 lg:static">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 truncate">
                  إدارة الأسئلة الشائعة
                </h1>
                <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                  إدارة الأسئلة والأجوبة الشائعة لجميع الخدمات
                </p>
              </div>
              <Button 
                onClick={() => {
                  setEditingFaq(null);
                  setFormData({
                    question: '',
                    answer: '',
                    category: 'مظلات',
                    order: 0,
                    featured: false,
                    status: 'PUBLISHED'
                  });
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shrink-0"
                size="sm"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                <span className="hidden sm:inline">إضافة سؤال</span>
                <span className="sm:hidden">جديد</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-blue-200">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-1 md:gap-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-blue-600 font-medium truncate">إجمالي الأسئلة</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 opacity-50 self-end md:self-auto" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-green-200">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-1 md:gap-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-green-600 font-medium truncate">منشورة</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-900">{stats.published}</p>
                </div>
                <Check className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-600 opacity-50 self-end md:self-auto" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-purple-200">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-1 md:gap-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-purple-600 font-medium truncate">مميزة</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-900">{stats.featured}</p>
                </div>
                <Star className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-600 opacity-50 self-end md:self-auto" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-orange-200">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-1 md:gap-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-orange-600 font-medium truncate">المشاهدات</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-900">{stats.totalViews}</p>
                </div>
                <Eye className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-600 opacity-50 self-end md:self-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6 mb-3 md:mb-4 lg:mb-6">
          <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  type="text"
                  placeholder="بحث في الأسئلة والأجوبة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8 md:pr-10 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="PUBLISHED">منشور</option>
                <option value="DRAFT">مسودة</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="order">الترتيب</option>
                <option value="newest">الأحدث</option>
                <option value="views">الأكثر مشاهدة</option>
              </select>

              <Button
                onClick={fetchFAQs}
                variant="outline"
                className="flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                size="sm"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">تحديث</span>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 lg:p-12 text-center">
            <HelpCircle className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto text-gray-400 mb-3 md:mb-4" />
            <p className="text-gray-600 text-base md:text-lg mb-3 md:mb-4">لا توجد أسئلة شائعة</p>
            <Button onClick={() => setShowAddModal(true)} size="sm" className="md:text-base">
              <Plus className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
              إضافة أول سؤال
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4">
            <AnimatePresence>
              {filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] md:text-xs">
                          {faq.category}
                        </Badge>
                        <Badge 
                          variant={faq.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className="text-[10px] md:text-xs"
                        >
                          {faq.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                        </Badge>
                        {faq.featured && (
                          <Badge variant="default" className="text-[10px] md:text-xs bg-purple-600">
                            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 ml-0.5 md:ml-1" />
                            مميز
                          </Badge>
                        )}
                        <span className="text-[10px] md:text-xs text-gray-500">
                          الترتيب: {faq.order}
                        </span>
                      </div>
                      
                      <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 md:mb-2 line-clamp-2">
                        {faq.question}
                      </h3>
                      <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">
                        {faq.answer}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4 text-[10px] md:text-xs lg:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                          {faq.views} مشاهدة
                        </span>
                        <span className="hidden sm:inline">
                          {new Date(faq.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 self-end md:self-start">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(faq)}
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="mr-1 md:hidden">تعديل</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 md:flex-none"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="mr-1 md:hidden">حذف</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg md:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 md:p-5 lg:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                {editingFaq ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  السؤال *
                </label>
                <Input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="أدخل السؤال"
                  required
                  className="text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  الإجابة *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="أدخل الإجابة"
                  required
                  rows={4}
                  className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    الفئة *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    الترتيب
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PUBLISHED">منشور</option>
                    <option value="DRAFT">مسودة</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5 md:pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600"
                  />
                  <label htmlFor="featured" className="text-xs md:text-sm font-medium text-gray-700">
                    سؤال مميز
                  </label>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4 sticky bottom-0 bg-white pb-0">
                <Button type="submit" className="flex-1 text-sm md:text-base" size="sm">
                  {editingFaq ? 'حفظ التعديلات' : 'إضافة السؤال'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFaq(null);
                  }}
                  className="flex-1 text-sm md:text-base"
                  size="sm"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
