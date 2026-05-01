'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Star,
  User,
  Calendar,
  Send,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreVertical,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  name: string;
  message: string;
  rating: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  avatar?: string;
  userLiked?: boolean;
  userDisliked?: boolean;
  isVerified?: boolean;
  replies?: Array<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
  }>;
}

interface ProjectCommentsSectionProps {
  projectId: string;
  projectTitle: string;
  initialComments?: Comment[];
}

export default function ProjectCommentsSection({ 
  projectId, 
  projectTitle,
  initialComments = []
}: ProjectCommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'popular'>('newest');
  const [filterByRating, setFilterByRating] = useState<number | null>(null);

  // حالة حركات التفاعل (Micro-Animations)
  const [animatedCommentId, setAnimatedCommentId] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<'like' | 'dislike' | null>(null);

  // جلب التعليقات عند تحميل المكون
  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('خطأ في جلب التعليقات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.name.trim() || !newComment.message.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newComment.name,
          email: newComment.email,
          message: newComment.message,
          rating: newComment.rating
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // إضافة التعليق الجديد للقائمة
        const commentWithAvatar = {
          ...data.comment,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newComment.name)}&background=059669&color=fff`,
          likes: 0,
          dislikes: 0
        };

        setComments(prev => [commentWithAvatar, ...prev]);

        // إعادة تعيين النموذج
        setNewComment({
          name: '',
          email: '',
          message: '',
          rating: 5
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'حدث خطأ أثناء إضافة التعليق');
      }
    } catch (error) {
      console.error('خطأ في إرسال التعليق:', error);
      setError('حدث خطأ في الاتصال. يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewComment(prev => ({ ...prev, rating }));
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return (sum / comments.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach(comment => {
      distribution[comment.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleLikeComment = async (commentId: string, type: 'like' | 'dislike') => {
    // تشغيل الحركة التفاعلية فوراً للمسة احترافية
    setAnimatedCommentId(commentId);
    setAnimationType(type);
    setTimeout(() => setAnimatedCommentId(null), 1000);

    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  likes: data.likes, 
                  dislikes: data.dislikes,
                  userLiked: type === 'like' && data.userAction !== 'removed',
                  userDisliked: type === 'dislike' && data.userAction !== 'removed'
                } 
              : comment
          )
        );
      }
    } catch (error) {
      console.error('خطأ في الإعجاب بالتعليق:', error);
    }
  };

  const handleSortComments = (sortBy: 'newest' | 'oldest' | 'rating' | 'popular') => {
    const sortedComments = [...comments].sort((a, b) => {
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
    setComments(sortedComments);
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && handleRatingChange(star)}
            className={`${size} ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200`}
          >
            <Star
              className={`w-full h-full ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const distribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <section
      className="mt-16 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-12 relative overflow-hidden"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": projectTitle,
            "aggregateRating": comments.length > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": averageRating,
              "reviewCount": comments.length,
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "review": comments.length > 0 ? comments.map(comment => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": comment.name
              },
              "datePublished": new Date(comment.createdAt).toISOString().split('T')[0],
              "reviewBody": comment.message,
              "reviewRating": {
                "@type": "Rating",
                "bestRating": "5",
                "ratingValue": comment.rating,
                "worstRating": "1"
              }
            })) : undefined
          })
        }}
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl" />

      {/* اسم المشروع للـ Schema */}
      <meta itemProp="name" content={projectTitle} />
      {/* عنوان القسم المطور */}
      <div className="flex items-center justify-between mb-12 flex-wrap gap-6 relative z-10">
        <div className="flex items-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30"
            />
            <MessageCircle className="w-10 h-10 text-blue-600 ml-4 relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
              آراء وتجارب العملاء
              <Sparkles className="w-6 h-6 text-indigo-500" />
            </h2>
            <p className="text-gray-600 text-base mt-2 font-medium">
              نعتز بآراء عملائنا التي تعكس التزامنا بالجودة والإتقان
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex -space-x-3 rtl:space-x-reverse mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-lg overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
              +{comments.length > 5 ? comments.length - 4 : 1}
            </div>
          </div>
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {comments.length} تعليق موثق
          </div>
        </div>
      </div>

      {/* إحصائيات التقييم المطورة */}
      {comments.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-50/50 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-slate-200/60 shadow-inner relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* التقييم العام - Luxury Style */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-l border-slate-200/80 last:border-0 pb-8 lg:pb-0">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150 animate-pulse" />
                <div className="text-8xl font-black tracking-tighter text-slate-900 flex items-baseline gap-1">
                  {averageRating}
                  <span className="text-2xl text-slate-400 font-bold">/5</span>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                {renderStars(Math.round(Number.parseFloat(averageRating.toString())), false, 'w-8 h-8')}
              </div>
              <div className="bg-white/80 px-6 py-2 rounded-full border border-slate-200 shadow-sm">
                <span className="text-slate-600 font-bold text-sm">
                  بناءً على {comments.length} تقييم حقيقي
                </span>
              </div>
            </div>


            {/* توزيع التقييمات - Shimmer Effect */}
            <div className="lg:col-span-8 space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution];
                const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                return (
                  <motion.div 
                    key={rating} 
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2 w-14">
                      <span className="text-sm font-black text-slate-700">{rating}</span>
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                    </div>
                    <div className="flex-1 h-3 bg-slate-200/50 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                    <div className="w-12 text-left">
                      <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* رسائل النجاح والخطأ */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-center shadow-lg"
          >
            <CheckCircle className="w-6 h-6 text-green-600 ml-4 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-green-800 mb-1">تم بنجاح!</h4>
              <span className="text-green-700">تم إضافة تعليقك وسيظهر بعد المراجعة</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl flex items-center shadow-lg"
          >
            <AlertCircle className="w-6 h-6 text-red-600 ml-4 flex-shrink-0" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نموذج إضافة تعليق */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-8 mb-10 border-2 border-gray-200/50 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          أضف تقييمك وتعليقك
        </h3>

        <form onSubmit={handleSubmitComment} className="space-y-6">
          {/* التقييم */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              تقييمك للمشروع *
            </label>
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 border-2 border-gray-200">
              {renderStars(newComment.rating, true, 'w-10 h-10')}
              <span className="text-xl font-bold text-gray-700 bg-blue-100 px-4 py-2 rounded-lg">
                ({newComment.rating} من 5)
              </span>
            </div>
          </div>

          {/* معلومات المستخدم */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                الاسم الكريم *
              </label>
              <Input
                type="text"
                required
                value={newComment.name}
                onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اكتب اسمك"
                className="transition-all duration-300 focus:ring-4 focus:ring-blue-200 border-2 h-12 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البريد الإلكتروني (اختياري)
              </label>
              <Input
                type="email"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="transition-all duration-300 focus:ring-4 focus:ring-blue-200 border-2 h-12 text-base"
              />
            </div>
          </div>

          {/* التعليق */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              تعليقك *
            </label>
            <Textarea
              rows={5}
              required
              value={newComment.message}
              onChange={(e) => setNewComment(prev => ({ ...prev, message: e.target.value }))}
              placeholder="شاركنا رأيك في هذا المشروع..."
              className="transition-all duration-300 focus:ring-4 focus:ring-blue-200 border-2 text-base"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-3 px-8 py-4 h-auto text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إرسال التعليق
                  </>
                )}
              </Button>
            </motion.div>

            <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 ml-2" />
              سيتم مراجعة التعليق قبل النشر
            </div>
          </div>
        </form>
      </motion.div>

      {/* قائمة التعليقات */}
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            التعليقات ({comments.length})
          </h3>

          {/* أدوات التصفية والترتيب */}
          {comments.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* ترتيب التعليقات */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newSortBy = e.target.value as 'newest' | 'oldest' | 'rating' | 'popular';
                    setSortBy(newSortBy);
                    handleSortComments(newSortBy);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-5 py-2.5 pr-10 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="popular">الأكثر تفاعلاً</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* تصفية حسب التقييم */}
              <div className="relative">
                <select
                  value={filterByRating || ''}
                  onChange={(e) => setFilterByRating(e.target.value ? Number.parseInt(e.target.value) : null)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-5 py-2.5 pr-10 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                >
                  <option value="">جميع النجوم</option>
                  <option value="5">5 نجوم</option>
                  <option value="4">4 نجوم</option>
                  <option value="3">3 نجوم</option>
                  <option value="2">نجمتين</option>
                  <option value="1">نجمة</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">جاري تحميل التعليقات...</p>
          </div>
        ) : comments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300"
          >
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-600 mb-2">
              لا توجد تعليقات بعد
            </h4>
            <p className="text-gray-500 text-lg">
              كن أول من يقيم هذا المشروع ويترك تعليقاً
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {comments
              .filter(comment => filterByRating ? comment.rating === filterByRating : true)
              .map((comment, index) => {
                const netScore = (comment.likes || 0) - (comment.dislikes || 0);
                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group"
                    itemScope
                    itemType="https://schema.org/Review"
                    itemProp="review"
                  >
                    {/* رأس التعليق */}
                    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden ml-4 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-500 shadow-lg">
                            <img
                              src={comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=059669&color=fff`}
                              alt={comment.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          {comment.isVerified && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-lg">
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-lg" itemProp="author" itemScope itemType="https://schema.org/Person">
                              <span itemProp="name">{comment.name}</span>
                            </h4>
                            {comment.isVerified && (
                              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] px-2.5 py-1 rounded-full border border-green-100 font-black uppercase tracking-wider">
                                موثق
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                              <meta itemProp="ratingValue" content={String(comment.rating)} />
                              <meta itemProp="bestRating" content="5" />
                              <meta itemProp="worstRating" content="1" />
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    className={`w-4 h-4 ${s <= comment.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                                  />
                                ))}
                              </div>
                            </span>
                            <span className="text-xs text-slate-400 font-bold flex items-center">
                              <Calendar className="w-3.5 h-3.5 ml-1.5" />
                              <time itemProp="datePublished" dateTime={new Date(comment.createdAt).toISOString()}>
                                {new Date(comment.createdAt).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </time>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* محتوى التعليق */}
                    <div className="relative mb-8 px-2">
                      <div className="absolute -right-4 -top-4 text-7xl text-blue-100/30 font-serif leading-none select-none pointer-events-none">"</div>
                      <p className="text-slate-700 leading-relaxed text-lg relative z-10 font-medium" itemProp="reviewBody">
                        {comment.message}
                      </p>
                    </div>

                    {/* رد الإدارة إذا وجد */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mb-8 bg-slate-50 rounded-3xl p-6 border-r-4 border-blue-600 shadow-sm relative overflow-hidden group/reply">
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-100/20 rounded-full blur-3xl group-hover/reply:bg-blue-200/30 transition-colors" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-black text-sm text-blue-900 block">إدارة ديار جدة العالمية</span>
                            <span className="text-[10px] text-blue-400 font-bold uppercase">
                              {new Date(comment.replies[0].createdAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                        <p className="text-blue-800 leading-relaxed italic text-base relative z-10 pr-2">
                          {comment.replies[0].message}
                        </p>
                      </div>
                    )}

                    {/* أزرار التفاعل */}
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLikeComment(comment.id, 'like')}
                        className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
                          comment.userLiked 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-900/5'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${comment.userLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes || 0}</span>

                        {/* أنيميشن الطيران لللايك */}
                        <AnimatePresence>
                          {animatedCommentId === comment.id && animationType === 'like' && (
                            <>
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                  animate={{ 
                                    opacity: 0, 
                                    scale: [0.5, 1.5, 1], 
                                    x: (Math.random() - 0.5) * 60, 
                                    y: -40 - Math.random() * 50 
                                  }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
                                  className="absolute left-1/2 top-1/2 text-blue-500 pointer-events-none"
                                >
                                  <ThumbsUp className="w-5 h-5 fill-current opacity-70" />
                                </motion.div>
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLikeComment(comment.id, 'dislike')}
                        className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
                          comment.userDisliked 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-white hover:border-rose-200 hover:text-rose-600 hover:shadow-xl hover:shadow-rose-900/5'
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${comment.userDisliked ? 'fill-current' : ''}`} />
                        <span>{comment.dislikes || 0}</span>

                        {/* أنيميشن الطيران للديسلايك */}
                        <AnimatePresence>
                          {animatedCommentId === comment.id && animationType === 'dislike' && (
                            <>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                  animate={{ 
                                    opacity: 0, 
                                    scale: [0.5, 1.2, 0.8], 
                                    x: (Math.random() - 0.5) * 40, 
                                    y: 40 + Math.random() * 30 
                                  }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.5 + Math.random() * 0.3, ease: "easeOut" }}
                                  className="absolute left-1/2 bottom-1/2 text-rose-500 pointer-events-none"
                                >
                                  <ThumbsDown className="w-4 h-4 fill-current opacity-70" />
                                </motion.div>
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {netScore > 0 && (
                        <div className="mr-auto hidden sm:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 shadow-sm">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                            مفيد جداً (+{netScore})
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
}
