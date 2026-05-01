
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
  Download,
  Share2,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectFilters } from '@/components/ui/project-filters';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  featured: boolean;
  status: string;
  views: number;
  likes: number;
  commentsCount: number;
  mediaCount: number;
  slug: string;
  createdAt: string;
  publishedAt?: string;
  mediaItems: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    src: string;
    thumbnail?: string;
  }>;
  _count: {
    comments: number;
    likes_users: number;
    views_users: number;
    mediaItems: number;
  };
}

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  featuredProjects: number;
  recentViews: number;
  engagement: number;
}

export default function ProjectsPage() {
  const router = useRouter();

  // الحالات الأساسية
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    featuredProjects: 0,
    recentViews: 0,
    engagement: 0
  });

  // حالات الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // حالات التحديث
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [indexing, setIndexing] = useState<string | null>(null);
  const [indexingAll, setIndexingAll] = useState(false);

  // جلب المشاريع والإحصائيات
  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [selectedStatus, selectedCategory, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        sort: sortBy,
        limit: '50'
      });

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError('فشل في جلب المشاريع');
      }
    } catch (error) {
      console.error('خطأ في جلب المشاريع:', error);
      setError('حدث خطأ في جلب المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.warn('فشل في جلب الإحصائيات:', error);
    }
  };

  // تحديث حالة المشروع
  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      setUpdating(projectId);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, status: newStatus } : p
        ));
        setSuccess('تم تحديث حالة المشروع');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل في تحديث حالة المشروع');
      }
    } catch (error) {
      setError('حدث خطأ في التحديث');
    } finally {
      setUpdating(null);
    }
  };

  // تحديث خاصية المميز
  const toggleFeatured = async (projectId: string, featured: boolean) => {
    try {
      setUpdating(projectId);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured })
      });

      if (response.ok) {
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, featured: !featured } : p
        ));
        setSuccess(`تم ${!featured ? 'إضافة' : 'إزالة'} المشروع ${!featured ? 'إلى' : 'من'} المميزة`);
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

  // حذف المشروع
  const deleteProject = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      setUpdating(projectId);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setSuccess('تم حذف المشروع بنجاح');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل في حذف المشروع');
      }
    } catch (error) {
      setError('حدث خطأ في الحذف');
    } finally {
      setUpdating(null);
    }
  };

  // نسخ رابط المشروع
  const copyProjectLink = async (slug: string) => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('تم نسخ الرابط');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('فشل في نسخ الرابط');
    }
  };

  // طلب أرشفة مشروع واحد
  const requestIndexing = async (projectId: string, slug: string) => {
    try {
      setIndexing(projectId);
      const url = `/portfolio/${slug}`;
      
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls: [url],
          type: 'project' 
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

  // طلب أرشفة جميع المشاريع المنشورة
  const requestIndexingAll = async () => {
    try {
      setIndexingAll(true);
      
      const publishedProjects = projects.filter(p => p.status === 'PUBLISHED');
      const urls = publishedProjects.map(p => `/portfolio/${p.slug}`);

      if (urls.length === 0) {
        setError('لا توجد مشاريع منشورة للأرشفة');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls,
          type: 'project' 
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`تم إرسال طلب أرشفة ${urls.length} مشروع إلى محركات البحث`);
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

  // فلترة المشاريع
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">جاري تحميل المشاريع...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">إدارة المشاريع</h1>
              <p className="text-gray-600 mt-2">قم بإدارة وتتبع جميع مشاريعك</p>
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
                <Link href="/dashboard/projects/add">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة مشروع جديد
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
                  <p className="text-sm text-gray-600">إجمالي المشاريع</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalProjects)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
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
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Projects Grid */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشروع
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
                  {filteredProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ml-4">
                            {project.mediaItems?.[0] ? (
                              <Image
                                src={project.mediaItems[0].src}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {project.title}
                              </h3>
                              {project.featured && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {project.category}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {project.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(project.status)}
                          {project.mediaCount > 0 && (
                            <div className="text-xs text-gray-500">
                              {project.mediaCount} ملف وسائط
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatNumber(project._count.views_users || project.views)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {formatNumber(project._count.likes_users || project.likes)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {formatNumber(project._count.comments || project.commentsCount)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                          {project.publishedAt && (
                            <div className="text-xs text-green-600">
                              نُشر: {new Date(project.publishedAt).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {updating === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <Link href={`/dashboard/projects/${project.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyProjectLink(project.slug)}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => toggleFeatured(project.id, project.featured)}
                                  >
                                    <Star className="w-4 h-4 ml-2" />
                                    {project.featured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
                                  </DropdownMenuItem>
                                  
                                  {project.status === 'PUBLISHED' ? (
                                    <DropdownMenuItem
                                      onClick={() => updateProjectStatus(project.id, 'DRAFT')}
                                    >
                                      <Clock className="w-4 h-4 ml-2" />
                                      تحويل لمسودة
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => updateProjectStatus(project.id, 'PUBLISHED')}
                                    >
                                      <CheckCircle className="w-4 h-4 ml-2" />
                                      نشر المشروع
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onClick={() => updateProjectStatus(project.id, 'ARCHIVED')}
                                  >
                                    <Download className="w-4 h-4 ml-2" />
                                    أرشفة المشروع
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => copyProjectLink(project.slug)}
                                  >
                                    <Copy className="w-4 h-4 ml-2" />
                                    نسخ الرابط
                                  </DropdownMenuItem>

                                  {project.status === 'PUBLISHED' && (
                                    <DropdownMenuItem
                                      onClick={() => requestIndexing(project.id, project.slug)}
                                      disabled={indexing === project.id}
                                    >
                                      {indexing === project.id ? (
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                      ) : (
                                        <RefreshCw className="w-4 h-4 ml-2" />
                                      )}
                                      طلب أرشفة من محركات البحث
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onClick={() => deleteProject(project.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 ml-2" />
                                    حذف المشروع
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'لم يتم العثور على مشاريع' : 'لا توجد مشاريع'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `لم يتم العثور على مشاريع تحتوي على "${searchTerm}"`
                  : 'ابدأ بإضافة مشروعك الأول'
                }
              </p>
              <Button asChild>
                <Link href="/dashboard/projects/add">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة مشروع جديد
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
