'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, ThumbsUp, ThumbsDown, Reply, Calendar, AlertCircle,
  CheckCircle, Send, X, Edit, Trash2, MoreVertical, Star, StarOff,
  Flag, Share2, Bell, BellOff, Eye, EyeOff, Bold, Italic, Link2,
  Shield, UserCheck, Clock, Heart, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replies: Comment[];
  isOwner?: boolean;
  isApproved: boolean;
  isReported: boolean;
  reportCount: number;
  parentId?: number;
  level: number;
  isEdited?: boolean;
  editedAt?: string;
}

interface ArticleRating {
  averageRating: number;
  totalRatings: number;
  userRating: number;
}

interface Notification {
  id: number;
  type: 'reply' | 'like' | 'mention';
  message: string;
  commentId: number;
  isRead: boolean;
  date: string;
}

interface CommentsSystemProps {
  articleId: number;
  initialComments?: Comment[];
  currentUser?: {
    name: string;
    avatar: string;
    isAdmin: boolean;
  };
}

export default function CommentsSystem({ 
  articleId, 
  initialComments = [],
  currentUser 
}: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [articleRating, setArticleRating] = useState<ArticleRating>({
    averageRating: 4.2,
    totalRatings: 127,
    userRating: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'approved' | 'pending'>('approved');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [reportDialog, setReportDialog] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [isRichTextMode, setIsRichTextMode] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // تحميل البيانات من localStorage عند بدء التشغيل
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${articleId}`);
    const savedRating = localStorage.getItem(`rating_${articleId}`);
    const savedNotifications = localStorage.getItem(`notifications_${articleId}`);
    
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(initialComments.map(comment => ({
        ...comment,
        level: 0,
        isApproved: true,
        isReported: false,
        reportCount: 0
      })));
    }
    
    if (savedRating) {
      setArticleRating(JSON.parse(savedRating));
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, [articleId, initialComments]);

  // حفظ البيانات في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem(`comments_${articleId}`, JSON.stringify(comments));
  }, [comments, articleId]);

  useEffect(() => {
    localStorage.setItem(`rating_${articleId}`, JSON.stringify(articleRating));
  }, [articleRating, articleId]);

  useEffect(() => {
    localStorage.setItem(`notifications_${articleId}`, JSON.stringify(notifications));
  }, [notifications, articleId]);

  // ترتيب التعليقات
  const sortComments = (commentsToSort: Comment[]) => {
    const sorted = [...commentsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        default:
          return 0;
      }
    });
    
    return sorted.map(comment => ({
      ...comment,
      replies: sortComments(comment.replies)
    }));
  };

  // فلترة التعليقات
  const filterComments = (commentsToFilter: Comment[]) => {
    return commentsToFilter.filter(comment => {
      switch (filterBy) {
        case 'approved':
          return comment.isApproved && !comment.isReported;
        case 'pending':
          return !comment.isApproved || comment.isReported;
        default:
          return true;
      }
    }).map(comment => ({
      ...comment,
      replies: filterComments(comment.replies)
    }));
  };

  const displayedComments = sortComments(filterComments(comments));

  // دالة تقييم المقال
  const handleRateArticle = (rating: number) => {
    const newTotalRatings = articleRating.userRating === 0 ? articleRating.totalRatings + 1 : articleRating.totalRatings;
    const currentTotal = articleRating.averageRating * articleRating.totalRatings;
    const previousUserRating = articleRating.userRating;
    const newTotal = currentTotal - previousUserRating + rating;
    const newAverage = newTotal / newTotalRatings;

    setArticleRating({
      averageRating: Number(newAverage.toFixed(1)),
      totalRatings: newTotalRatings,
      userRating: rating
    });
  };

  // دالة إضافة إشعار
  const addNotification = (type: 'reply' | 'like' | 'mention', message: string, commentId: number) => {
    if (!enableNotifications) return;
    
    const notification: Notification = {
      id: Date.now(),
      type,
      message,
      commentId,
      isRead: false,
      date: new Date().toLocaleDateString('ar-SA')
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  // دالة إضافة تعليق جديد
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name || !newComment.content) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const comment: Comment = {
      id: Date.now(),
      author: newComment.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newComment.name)}&background=059669&color=fff`,
      date: new Date().toLocaleDateString('ar-SA'),
      content: newComment.content,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      replies: [],
      isOwner: true,
      isApproved: !!currentUser?.isAdmin,
      isReported: false,
      reportCount: 0,
      level: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment({ name: '', email: '', content: '' });
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // دالة الإعجاب والعدم إعجاب
  const handleLikeComment = (commentId: number, isLike = true) => {
    setComments(prev => prev.map(comment => 
      updateCommentInTree(comment, commentId, (c) => {
        if (isLike) {
          const newIsLiked = !c.isLiked;
          const newLikes = newIsLiked ? c.likes + 1 : c.likes - 1;
          const newIsDisliked = newIsLiked ? false : c.isDisliked;
          const newDislikes = newIsLiked && c.isDisliked ? c.dislikes - 1 : c.dislikes;
          
          if (newIsLiked && !c.isLiked) {
            addNotification('like', `أعجب ${currentUser?.name || 'شخص ما'} بتعليقك`, commentId);
          }
          
          return {
            ...c,
            likes: newLikes,
            dislikes: newDislikes,
            isLiked: newIsLiked,
            isDisliked: newIsDisliked
          };
        }
          const newIsDisliked = !c.isDisliked;
          const newDislikes = newIsDisliked ? c.dislikes + 1 : c.dislikes - 1;
          const newIsLiked = newIsDisliked ? false : c.isLiked;
          const newLikes = newIsDisliked && c.isLiked ? c.likes - 1 : c.likes;
          
          return {
            ...c,
            likes: newLikes,
            dislikes: newDislikes,
            isLiked: newIsLiked,
            isDisliked: newIsDisliked
          };
      })
    ));
  };

  // دالة مساعدة لتحديث التعليق في الشجرة
  const updateCommentInTree = (comment: Comment, targetId: number, updateFn: (c: Comment) => Comment): Comment => {
    if (comment.id === targetId) {
      return updateFn(comment);
    }
    
    return {
      ...comment,
      replies: comment.replies.map(reply => updateCommentInTree(reply, targetId, updateFn))
    };
  };

  // دالة إضافة رد
  const handleSubmitReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    const parentComment = findCommentById(comments, commentId);
    if (!parentComment) return;

    const reply: Comment = {
      id: Date.now(),
      author: currentUser?.name || 'فريق ديار جدة العالمية',
      avatar: currentUser?.avatar || 'https://ui-avatars.com/api/?name=محترفين+الديار&background=0f172a&color=fff',
      date: new Date().toLocaleDateString('ar-SA'),
      content: replyContent,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      replies: [],
      isOwner: !!currentUser,
      isApproved: !!currentUser?.isAdmin,
      isReported: false,
      reportCount: 0,
      parentId: commentId,
      level: parentComment.level + 1
    };

    setComments(prev => prev.map(comment =>
      updateCommentInTree(comment, commentId, (c) => ({
        ...c,
        replies: [...c.replies, reply]
      }))
    ));

    addNotification('reply', `رد ${reply.author} على تعليقك`, commentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  // دالة البحث عن تعليق بالمعرف
  const findCommentById = (commentsList: Comment[], id: number): Comment | null => {
    for (const comment of commentsList) {
      if (comment.id === id) return comment;
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
    return null;
  };

  // دالة الإبلاغ عن تعليق
  const handleReportComment = (commentId: number) => {
    if (!reportReason.trim()) return;

    setComments(prev => prev.map(comment =>
      updateCommentInTree(comment, commentId, (c) => ({
        ...c,
        isReported: true,
        reportCount: c.reportCount + 1
      }))
    ));

    setReportDialog(null);
    setReportReason('');
  };

  // دالة الموافقة على التعليق (للمشرفين)
  const handleApproveComment = (commentId: number) => {
    setComments(prev => prev.map(comment =>
      updateCommentInTree(comment, commentId, (c) => ({
        ...c,
        isApproved: true,
        isReported: false,
        reportCount: 0
      }))
    ));
  };

  // دالة مشاركة التعليق
  const handleShareComment = (commentId: number) => {
    const url = `${window.location.href}#comment-${commentId}`;
    if (navigator.share) {
      navigator.share({
        title: 'شارك التعليق',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // يمكن إضافة إشعار هنا
    }
  };

  // دالة تنسيق النص
  const formatText = (format: 'bold' | 'italic' | 'link') => {
    const textarea = isRichTextMode ? textareaRef.current : replyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'link': {
        const url = prompt('أدخل الرابط:');
        if (url) formattedText = `[${selectedText || 'نص الرابط'}](${url})`;
        break;
      }
    }

    if (formattedText) {
      const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
      if (isRichTextMode) {
        setNewComment(prev => ({ ...prev, content: newValue }));
      } else {
        setReplyContent(newValue);
      }
    }
  };

  // دالة عرض عدد التعليقات غير المقروءة
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <TooltipProvider>
      <section className="mb-12">
        {/* تقييم المقال */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-lg font-bold text-primary mb-4 text-center">قيم هذا المقال</h3>
          <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateArticle(star)}
                className="transition-all duration-200 hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= articleRating.userRating
                      ? 'text-yellow-400 fill-current'
                      : star <= articleRating.averageRating
                      ? 'text-yellow-300 fill-current opacity-70'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <span className="font-semibold">{articleRating.averageRating}</span> من 5
            ({articleRating.totalRatings} تقييم)
          </div>
        </div>

        {/* رأس القسم مع الأدوات */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <MessageCircle className="w-6 h-6 ml-3" />
              التعليقات ({comments.length})
            </h2>
            
            {/* إشعارات */}
            <div className="mr-4 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-semibold">الإشعارات</h4>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      لا توجد إشعارات
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg mb-2 ${
                            notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <span className="text-xs text-muted-foreground">{notification.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            {/* فلتر الترتيب */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 ml-2" />
                  {sortBy === 'newest' ? 'الأحدث' : sortBy === 'oldest' ? 'الأقدم' : 'الأكثر شعبية'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  الأحدث أولاً
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  الأقدم أولاً
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                  الأكثر شعبية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* فلتر الحالة للمشرفين */}
            {currentUser?.isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Shield className="w-4 h-4 ml-2" />
                    {filterBy === 'all' ? 'الكل' : filterBy === 'approved' ? 'معتمدة' : 'في الانتظار'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>
                    جميع التعليقات
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('approved')}>
                    التعليقات المعتمدة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('pending')}>
                    في انتظار الموافقة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* إعدادات الخصوصية */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* إعدادات الخصوصية */}
        {showPrivacySettings && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary mb-4">إعدادات الخصوصية والإشعارات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>تلقي إشعارات التعليقات الجديدة</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnableNotifications(!enableNotifications)}
                >
                  {enableNotifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </Button>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                يمكنك التحكم في الإشعارات التي تتلقاها عند وجود ردود أو إعجابات جديدة على تعليقاتك.
              </div>
            </div>
          </div>
        )}

        {/* رسالة النجاح */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
            <span className="text-green-800">تم إضافة تعليقك بنجاح!</span>
          </div>
        )}

        {/* نموذج إضافة تعليق */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-primary mb-4">شاركنا رأيك</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكريم *
                </label>
                <Input
                  type="text"
                  required
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اكتب اسمك"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  التعليق *
                </label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('bold')}
                      >
                        <Bold className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>نص عريض</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('italic')}
                      >
                        <Italic className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>نص مائل</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('link')}
                      >
                        <Link2 className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>إضافة رابط</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                rows={4}
                required
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                placeholder="اكتب تعليقك هنا... يمكنك استخدام **نص عريض** أو *نص مائل*"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isSubmitting} className="flex items-center">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                ) : (
                  <Send className="w-4 h-4 ml-2" />
                )}
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
              </Button>

              <div className="flex items-center text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 ml-2" />
                {currentUser?.isAdmin ? 'سيتم نشر تعليقك فوراً' : 'سيتم مراجعة تعليقك قبل النشر'}
              </div>
            </div>
          </form>
        </div>

        {/* إرشادات التعليق */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-blue-900 mb-2">إرشادات التعليق</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• كن محترماً ولطيفاً في تعليقاتك</li>
            <li>• تجنب اللغة المسيئة أو غير اللائقة</li>
            <li>• اكتب تعليقات مفيدة وذات قيمة للقراء الآخرين</li>
            <li>• لا تنشر معلومات شخصية أو روابط ضارة</li>
            <li>• يمكنك استخدام التنسيق: **عريض** أو *مائل* أو [رابط](url)</li>
          </ul>
        </div>

        {/* قائمة التعليقات */}
        <div className="space-y-6">
          {displayedComments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد تعليقات بعد</h3>
              <p className="text-muted-foreground">كن أول من يشارك رأيه حول هذا المقال</p>
            </div>
          ) : (
            displayedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onLike={(id, isLike) => handleLikeComment(id, isLike)}
                onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
                onEdit={(id) => {
                  const commentToEdit = findCommentById(comments, id);
                  if (commentToEdit) {
                    setEditingComment(id);
                    setEditContent(commentToEdit.content);
                  }
                }}
                onDelete={(id) => {
                  if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
                    setComments(prev => prev.filter(comment => comment.id !== id));
                  }
                }}
                onReport={(id) => setReportDialog(id)}
                onApprove={handleApproveComment}
                onShare={handleShareComment}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmitReply={handleSubmitReply}
                editingComment={editingComment}
                editContent={editContent}
                setEditContent={setEditContent}
                onSaveEdit={(id) => {
                  setComments(prev => prev.map(comment =>
                    updateCommentInTree(comment, id, (c) => ({
                      ...c,
                      content: editContent,
                      isEdited: true,
                      editedAt: new Date().toLocaleDateString('ar-SA')
                    }))
                  ));
                  setEditingComment(null);
                  setEditContent('');
                }}
                onCancelEdit={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
                expandedComments={expandedComments}
                onToggleExpand={(id) => {
                  setExpandedComments(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(id)) {
                      newSet.delete(id);
                    } else {
                      newSet.add(id);
                    }
                    return newSet;
                  });
                }}
                formatText={formatText}
                replyTextareaRef={replyTextareaRef}
              />
            ))
          )}
        </div>

        {/* نافذة الإبلاغ */}
        <Dialog open={reportDialog !== null} onOpenChange={() => setReportDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>الإبلاغ عن تعليق</DialogTitle>
              <DialogDescription>
                لماذا تريد الإبلاغ عن هذا التعليق؟
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="اكتب سبب الإبلاغ..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReportDialog(null)}>
                إلغاء
              </Button>
              <Button 
                onClick={() => reportDialog && handleReportComment(reportDialog)}
                disabled={!reportReason.trim()}
              >
                إرسال البلاغ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </TooltipProvider>
  );
}

// مكون التعليق المنفصل
interface CommentItemProps {
  comment: Comment;
  currentUser?: { name: string; avatar: string; isAdmin: boolean };
  onLike: (id: number, isLike: boolean) => void;
  onReply: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onReport: (id: number) => void;
  onApprove: (id: number) => void;
  onShare: (id: number) => void;
  replyingTo: number | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (id: number) => void;
  editingComment: number | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  expandedComments: Set<number>;
  onToggleExpand: (id: number) => void;
  formatText: (format: 'bold' | 'italic' | 'link') => void;
  replyTextareaRef: React.RefObject<HTMLTextAreaElement>;
}

function CommentItem({
  comment,
  currentUser,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onApprove,
  onShare,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  editingComment,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  expandedComments,
  onToggleExpand,
  formatText,
  replyTextareaRef
}: CommentItemProps) {
  const isExpanded = expandedComments.has(comment.id);
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  // تحويل النص المنسق إلى HTML
  const renderFormattedText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
  };

  return (
    <div 
      id={`comment-${comment.id}`}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${
        comment.level > 0 ? 'ml-8 border-r-4 border-r-accent/30' : ''
      } ${!comment.isApproved || comment.isReported ? 'opacity-70 border-orange-200' : ''}`}
    >
      {/* رأس التعليق */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-12 h-12 rounded-full ml-3"
          />
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-primary">{comment.author}</span>
              {comment.isOwner && (
                <Badge variant="secondary" className="mr-2">
                  {currentUser?.isAdmin ? 'المؤلف' : 'الفريق'}
                </Badge>
              )}
              {comment.isReported && (
                <Badge variant="destructive" className="mr-2">
                  <Flag className="w-3 h-3 ml-1" />
                  مُبلغ عنه
                </Badge>
              )}
              {!comment.isApproved && (
                <Badge variant="outline" className="mr-2">
                  <Clock className="w-3 h-3 ml-1" />
                  في الانتظار
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 ml-1" />
              {comment.date}
              {comment.isEdited && comment.editedAt && (
                <span className="mr-2 text-xs">(تم التعديل في {comment.editedAt})</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          {/* أزرار التفاعل */}
          <div className="flex items-center space-x-1 space-x-reverse">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLike(comment.id, true)}
                  className={comment.isLiked ? 'bg-green-50 border-green-200 text-green-600' : ''}
                >
                  <ThumbsUp className={`w-3 h-3 ml-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                  {comment.likes}
                </Button>
              </TooltipTrigger>
              <TooltipContent>إعجاب</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLike(comment.id, false)}
                  className={comment.isDisliked ? 'bg-red-50 border-red-200 text-red-600' : ''}
                >
                  <ThumbsDown className={`w-3 h-3 ml-1 ${comment.isDisliked ? 'fill-current' : ''}`} />
                  {comment.dislikes}
                </Button>
              </TooltipTrigger>
              <TooltipContent>عدم إعجاب</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                >
                  <Reply className="w-3 h-3 ml-1" />
                  رد
                </Button>
              </TooltipTrigger>
              <TooltipContent>رد على التعليق</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(comment.id)}
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>مشاركة التعليق</TooltipContent>
            </Tooltip>
          </div>

          {/* قائمة الخيارات */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {comment.isOwner && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(comment.id)}>
                    <Edit className="w-3 h-3 ml-2" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(comment.id)} className="text-red-600">
                    <Trash2 className="w-3 h-3 ml-2" />
                    حذف
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {currentUser?.isAdmin && (!comment.isApproved || comment.isReported) && (
                <>
                  <DropdownMenuItem onClick={() => onApprove(comment.id)}>
                    <UserCheck className="w-3 h-3 ml-2" />
                    الموافقة على التعليق
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {!comment.isOwner && (
                <DropdownMenuItem onClick={() => onReport(comment.id)} className="text-orange-600">
                  <Flag className="w-3 h-3 ml-2" />
                  الإبلاغ عن التعليق
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* محتوى التعليق */}
      {editingComment === comment.id ? (
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">تعديل التعليق</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('bold')}
              >
                <Bold className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('italic')}
              >
                <Italic className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('link')}
              >
                <Link2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
          />
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button size="sm" onClick={() => onSaveEdit(comment.id)}>
              حفظ التعديل
            </Button>
            <Button variant="outline" size="sm" onClick={onCancelEdit}>
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: renderFormattedText(comment.content) }}
        />
      )}

      {/* نموذج الرد */}
      {replyingTo === comment.id && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">رد على {comment.author}</span>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('bold')}
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('italic')}
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('link')}
                >
                  <Link2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Textarea
              ref={replyTextareaRef}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="اكتب ردك هنا... يمكنك استخدام **نص عريض** أو *نص مائل*"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  size="sm"
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  <Send className="w-3 h-3 ml-1" />
                  إرسال الرد
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                >
                  <X className="w-3 h-3 ml-1" />
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الردود */}
      {hasReplies && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              {comment.replies.length} {comment.replies.length === 1 ? 'رد' : 'ردود'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(comment.id)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 ml-1" />
                  إخفاء الردود
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 ml-1" />
                  عرض الردود
                </>
              )}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                  onApprove={onApprove}
                  onShare={onShare}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  onSubmitReply={onSubmitReply}
                  editingComment={editingComment}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  expandedComments={expandedComments}
                  onToggleExpand={onToggleExpand}
                  formatText={formatText}
                  replyTextareaRef={replyTextareaRef}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}