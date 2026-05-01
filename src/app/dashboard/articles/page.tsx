'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Calendar,
  Filter,
  MoreVertical,
  ExternalLink,
  Copy,
  Share2,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  featured: boolean;
  status: string;
  views: number;
  likes: number;
  commentsCount: number;
  mediaCount: number;
  slug: string;
  createdAt: string;
  publishedAt?: string;
  readTime: number;
  mediaItems: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    src: string;
    thumbnail?: string;
  }>;
  tags: Array<{ name: string }>;
}

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  featuredArticles: number;
}

export default function ArticlesPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    featuredArticles: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [indexing, setIndexing] = useState<string | null>(null);
  const [indexingAll, setIndexingAll] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [selectedStatus, selectedCategory, sortBy]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        sort: sortBy,
        limit: '50'
      });

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      if (selectedCategory !== 'all' && selectedCategory !== 'الكل') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
        
        const statsData = {
          totalArticles: data.total || 0,
          publishedArticles: data.articles.filter((a: Article) => a.status === 'PUBLISHED').length,
          totalViews: data.articles.reduce((sum: number, a: Article) => sum + (a.views || 0), 0),
          totalLikes: data.articles.reduce((sum: number, a: Article) => sum + (a.likes || 0), 0),
          totalComments: data.articles.reduce((sum: number, a: Article) => sum + (a.commentsCount || 0), 0),
          featuredArticles: data.articles.filter((a: Article) => a.featured).length
        };
        setStats(statsData);
      } else {
        setError('فشل في جلب المقالات');
      }
    } catch (error) {
      console.error('خطأ في جلب المقالات:', error);
      setError('حدث خطأ في جلب المقالات');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (articleId: string, featured: boolean) => {
    try {
      setUpdating(articleId);

      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...article,
          featured: !featured 
        })
      });

      if (response.ok) {
        setArticles(prev => prev.map(a => 
          a.id === articleId ? { ...a, featured: !featured } : a
        ));
        setSuccess(`تم ${!featured ? 'إضافة' : 'إزالة'} المقال ${!featured ? 'إلى' : 'من'} المميزة`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل في التحديث');
      }
    } catch (error) {
      setError('حدث خطأ في التحديث');
    } finally {
      setUpdating(null);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      setUpdating(articleId);

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        setSuccess('تم حذف المقال بنجاح');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل في حذف المقال');
      }
    } catch (error) {
      setError('حدث خطأ في الحذف');
    } finally {
      setUpdating(null);
    }
  };

  const copyArticleLink = async (slug: string) => {
    const url = `${window.location.origin}/articles/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('تم نسخ الرابط');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('فشل في نسخ الرابط');
    }
  };

  const requestIndexing = async (articleId: string, slug: string) => {
    try {
      setIndexing(articleId);
      const url = `/articles/${slug}`;
      
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls: [url],
          type: 'article' 
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('تم إرسال طلب الأرشفة إلى محركات البحث');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل في إرسال طلب الأرشفة');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('خطأ في طلب الأرشفة:', error);
      setError('حدث خطأ في طلب الأرشفة');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIndexing(null);
    }
  };

  const requestIndexingAll = async () => {
    try {
      setIndexingAll(true);
      
      const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');
      const urls = publishedArticles.map(a => `/articles/${a.slug}`);

      if (urls.length === 0) {
        setError('لا توجد مقالات منشورة للأرشفة');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls,
          type: 'article' 
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`تم إرسال طلب أرشفة ${urls.length} مقال إلى محركات البحث`);
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError('فشل في إرسال طلب الأرشفة');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('خطأ في طلب الأرشفة:', error);
      setError('حدث خطأ في طلب الأرشفة');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIndexingAll(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'ك';
    return num.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800">منشور</Badge>;
      case 'DRAFT':
        return <Badge className="bg-yellow-100 text-yellow-800">مسودة</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-gray-100 text-gray-800">أرشيف</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const categories = [
    'الكل',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">جاري تحميل المقالات...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المقالات</h1>
              <p className="text-gray-600 mt-2">قم بإدارة وتتبع جميع مقالاتك</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={requestIndexingAll}
                disabled={indexingAll}
                className="bg-green-600 hover:bg-green-700"
              >
                {indexingAll ? (
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 ml-2" />
                )}
                طلب أرشفة الكل
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/articles/add">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة مقال جديد
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المقالات</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalArticles)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الإعجابات</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي التعليقات</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
                <span className="text-green-800">{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-600 ml-3" />
                <span className="text-red-800">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ابحث في المقالات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="DRAFT">مسودة</option>
                  <option value="ARCHIVED">أرشيف</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="popular">الأكثر مشاهدة</option>
                  <option value="most-liked">الأكثر إعجاباً</option>
                  <option value="alphabetical">أبجدياً</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المقال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإحصائيات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article, index) => (
                    <motion.tr
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Article Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          {article.mediaItems && article.mediaItems[0] && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={article.mediaItems[0].thumbnail || article.mediaItems[0].src}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-2 items-center">
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                              {article.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  <Star className="w-3 h-3 ml-1" />
                                  مميز
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 ml-1" />
                                {article.readTime} دقائق قراءة
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Eye className="w-4 h-4 ml-1" />
                            {formatNumber(article.views || 0)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Heart className="w-4 h-4 ml-1" />
                            {formatNumber(article.likes || 0)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MessageCircle className="w-4 h-4 ml-1" />
                            {formatNumber(article.commentsCount || 0)}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}
                            size="sm"
                            variant="outline"
                            disabled={updating === article.id}
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            تعديل
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => window.open(`/articles/${article.slug}`, '_blank')}>
                                <ExternalLink className="w-4 h-4 ml-2" />
                                عرض المقال
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyArticleLink(article.slug)}>
                                <Copy className="w-4 h-4 ml-2" />
                                نسخ الرابط
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFeatured(article.id, article.featured)}>
                                <Star className="w-4 h-4 ml-2" />
                                {article.featured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => requestIndexing(article.id, article.slug)}>
                                <RefreshCw className="w-4 h-4 ml-2" />
                                طلب أرشفة
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteArticle(article.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف المقال
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مقالات</h3>
              <p className="text-gray-600 mb-6">ابدأ بإضافة مقال جديد</p>
              <Button asChild>
                <Link href="/dashboard/articles/add">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة مقال جديد
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
