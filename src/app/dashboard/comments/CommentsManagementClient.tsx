'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  BarChart,
  Eye,
  Clock,
  Mail,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  FileText,
  Award,
  Hash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  projectId: string;
  name: string;
  email: string | null;
  message: string;
  rating: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  likes: number;
  dislikes: number;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  project: {
    id: string;
    title: string;
    category: string;
  };
}

interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
  totalLikes: number;
  totalDislikes: number;
  commentsToday: number;
  commentsThisWeek: number;
}

export default function CommentsManagementClient() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0,
    totalLikes: 0,
    totalDislikes: 0,
    commentsToday: 0,
    commentsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'popular'>('newest');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        calculateStats(data.comments || []);
      }
    } catch (error) {
      console.error('خطأ في جلب التعليقات:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allComments: Comment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: CommentStats = {
      total: allComments.length,
      approved: allComments.filter(c => c.status === 'APPROVED').length,
      pending: allComments.filter(c => c.status === 'PENDING').length,
      rejected: allComments.filter(c => c.status === 'REJECTED').length,
      averageRating: allComments.length > 0
        ? allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length
        : 0,
      totalLikes: allComments.reduce((sum, c) => sum + c.likes, 0),
      totalDislikes: allComments.reduce((sum, c) => sum + c.dislikes, 0),
      commentsToday: allComments.filter(c => new Date(c.createdAt) >= today).length,
      commentsThisWeek: allComments.filter(c => new Date(c.createdAt) >= weekAgo).length
    };

    setStats(stats);
  };

  const handleUpdateStatus = async (commentId: string, projectId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, status })
      });

      if (response.ok) {
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId ? { ...comment, status } : comment
          )
        );
        calculateStats(comments.map(c => c.id === commentId ? { ...c, status } : c));
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة التعليق:', error);
    }
  };

  const handleDelete = async (commentId: string, projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/comments?commentId=${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedComments = comments.filter(c => c.id !== commentId);
        setComments(updatedComments);
        calculateStats(updatedComments);
      }
    } catch (error) {
      console.error('خطأ في حذف التعليق:', error);
    }
  };

  const getFilteredComments = () => {
    let filtered = comments;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (ratingFilter !== null) {
      filtered = filtered.filter(c => c.rating === ratingFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query) ||
        c.project.title.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredComments = getFilteredComments();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500 text-white">موافق عليه</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500 text-white">قيد المراجعة</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500 text-white">مرفوض</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-600 ml-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة التعليقات</h1>
                <p className="text-gray-600 mt-1">إدارة التقييمات والتعليقات على المشاريع</p>
              </div>
            </div>
            <Button onClick={fetchComments} variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 opacity-80" />
              <Hash className="w-6 h-6 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm opacity-90">إجمالي التعليقات</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
            <div className="text-sm opacity-90">موافق عليها</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 opacity-80" />
              <AlertCircle className="w-6 h-6 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
            <div className="text-sm opacity-90">قيد المراجعة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <Star className="w-6 h-6 opacity-60 fill-current" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm opacity-90">متوسط التقييم</div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.totalLikes}</div>
                <div className="text-sm text-gray-600">إجمالي الإعجابات</div>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.totalDislikes}</div>
                <div className="text-sm text-gray-600">إجمالي عدم الإعجاب</div>
              </div>
              <ThumbsDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.commentsToday}</div>
                <div className="text-sm text-gray-600">تعليقات اليوم</div>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.commentsThisWeek}</div>
                <div className="text-sm text-gray-600">تعليقات الأسبوع</div>
              </div>
              <BarChart className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="بحث في التعليقات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12 border-2"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-12 border-2 border-gray-300 rounded-lg px-4 font-medium focus:ring-4 focus:ring-blue-200"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="APPROVED">موافق عليها</option>
              <option value="PENDING">قيد المراجعة</option>
              <option value="REJECTED">مرفوضة</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter || ''}
              onChange={(e) => setRatingFilter(e.target.value ? Number.parseInt(e.target.value) : null)}
              className="h-12 border-2 border-gray-300 rounded-lg px-4 font-medium focus:ring-4 focus:ring-blue-200"
            >
              <option value="">جميع التقييمات</option>
              <option value="5">⭐ 5 نجوم</option>
              <option value="4">⭐ 4 نجوم</option>
              <option value="3">⭐ 3 نجوم</option>
              <option value="2">⭐ 2 نجمة</option>
              <option value="1">⭐ نجمة واحدة</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-12 border-2 border-gray-300 rounded-lg px-4 font-medium focus:ring-4 focus:ring-blue-200"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="popular">الأكثر شعبية</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">جاري تحميل التعليقات...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد تعليقات</h3>
            <p className="text-gray-500">لم يتم العثور على تعليقات تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg ml-4">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{comment.name}</h3>
                        {getStatusBadge(comment.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {comment.email && (
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 ml-1" />
                            {comment.email}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {new Date(comment.createdAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        {renderStars(comment.rating)}
                        <span className="text-sm font-semibold text-gray-700">
                          ({comment.rating} من 5)
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4 bg-gray-50 p-4 rounded-xl">
                        {comment.message}
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">{comment.project.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center text-green-600">
                            <ThumbsUp className="w-4 h-4 ml-1" />
                            {comment.likes}
                          </span>
                          <span className="flex items-center text-red-600">
                            <ThumbsDown className="w-4 h-4 ml-1" />
                            {comment.dislikes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mr-4">
                    {comment.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(comment.id, comment.projectId, 'APPROVED')}
                        >
                          <CheckCircle className="w-4 h-4 ml-1" />
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(comment.id, comment.projectId, 'REJECTED')}
                        >
                          <XCircle className="w-4 h-4 ml-1" />
                          رفض
                        </Button>
                      </>
                    )}
                    {comment.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(comment.id, comment.projectId, 'REJECTED')}
                      >
                        <XCircle className="w-4 h-4 ml-1" />
                        إلغاء الموافقة
                      </Button>
                    )}
                    {comment.status === 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateStatus(comment.id, comment.projectId, 'APPROVED')}
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        موافقة
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(comment.id, comment.projectId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
