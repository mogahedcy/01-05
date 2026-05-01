'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Clock,
  DollarSign,
  Star,
  Heart,
  Eye,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  MessageCircle,
  Quote,
  Award,
  CheckCircle,
  Tag
} from 'lucide-react';
import ProjectCommentsSection from '@/components/ProjectCommentsSection';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import ProtectedMedia from '@/components/ProtectedMedia';

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  src: string;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  duration?: string | null;
  order: number;
  alt?: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location: string | null;
  completionDate: string | Date | null;
  client?: string | null;
  featured: boolean;
  views: number;
  likes: number;
  rating: number;
  projectDuration: string | null;
  projectCost: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
  status?: string | null;
  slug?: string | null;
  titleEn?: string | null;
  descriptionEn?: string | null;
  locationEn?: string | null;
  clientEn?: string | null;
  metaTitle?: string | null;
  metaTitleEn?: string | null;
  metaDescription?: string | null;
  metaDescriptionEn?: string | null;
  keywords?: string | null;
  keywordsEn?: string | null;
  suggestedKeywords?: string | null;
  mediaItems: MediaItem[];
  tags: { id: string; name: string; }[];
  materials: { id: string; name: string; }[];
  _count: {
    comments: number;
    likes?: number;
  };
}

const categories = [
  { id: 'مظلات سيارات', name: 'مظلات سيارات', icon: '🚗', color: 'bg-blue-500' },
  { id: 'سواتر', name: 'سواتر', icon: '🧱', color: 'bg-red-500' },
  { id: 'خيم ملكية', name: 'خيم ملكية', icon: '🏕️', color: 'bg-emerald-500' },
  { id: 'بيوت شعر ملكي', name: 'بيوت شعر ملكي', icon: '⛺', color: 'bg-purple-500' },
  { id: 'برجولات', name: 'برجولات', icon: '🏛️', color: 'bg-amber-500' },
  { id: 'تنسيق حدائق', name: 'تنسيق حدائق', icon: '🌿', color: 'bg-green-500' },
  { id: 'هناجر', name: 'هناجر', icon: '🏢', color: 'bg-slate-500' },
  { id: 'شبوك', name: 'شبوك', icon: '🔲', color: 'bg-gray-500' },
  { id: 'قراميد', name: 'قراميد', icon: '🏛️', color: 'bg-orange-500' },
  { id: 'ساندوتش بانل', name: 'ساندوتش بانل', icon: '📦', color: 'bg-cyan-500' }
];

interface Props {
  project: Project;
  projectId: string;
  locale?: string;
}

export default function ProjectDetailsClient({ project, projectId, locale = 'ar' }: Props) {
  const isEn = locale === 'en';
  const localePath = isEn ? '/en' : '';

  const t = {
    backToPortfolio: isEn ? 'Back to Portfolio' : 'العودة للمعرض',
    like: isEn ? 'Like' : 'إعجاب',
    unlike: isEn ? 'Unlike' : 'إلغاء الإعجاب',
    share: isEn ? 'Share' : 'مشاركة',
    downloadCatalog: isEn ? 'Download Catalog' : 'تحميل الكتالوج',
    featured: isEn ? 'Featured' : 'مميز',
    views: isEn ? 'Views' : 'مشاهدة',
    likes: isEn ? 'Likes' : 'إعجاب',
    comments: isEn ? 'Comments' : 'تعليق',
    projectDetails: isEn ? 'Project Details' : 'تفاصيل المشروع',
    location: isEn ? 'Location' : 'الموقع',
    completionDate: isEn ? 'Completion Date' : 'تاريخ الإكمال',
    executionDuration: isEn ? 'Execution Duration' : 'مدة التنفيذ',
    client: isEn ? 'Client' : 'العميل',
    cost: isEn ? 'Cost' : 'التكلفة',
    status: isEn ? 'Status' : 'الحالة',
    completed: isEn ? 'Completed' : 'مكتمل',
    keywords: isEn ? 'Keywords' : 'الكلمات المفتاحية',
    materialsUsed: isEn ? 'Materials Used' : 'المواد المستخدمة',
    contactUs: isEn ? 'Contact Us' : 'تواصل معنا',
    getQuote: isEn ? 'Get a Quote' : 'احصل على عرض سعر',
    relatedProjects: isEn ? 'Related Projects' : 'مشاريع ذات صلة',
    projectRating: isEn ? 'Project Rating' : 'تقييم المشروع',
    qualityAndGuarantee: isEn ? 'Quality & Guarantee' : 'جودة وضمان',
    guaranteeYears: isEn ? '10 Years Guarantee' : 'ضمان 10 سنوات',
    experienceYears: isEn ? '+15 Years Experience' : 'خبرة +15 سنة',
    highQualityMaterials: isEn ? 'High Quality Materials' : 'مواد عالية الجودة',
    onTimeDelivery: isEn ? 'On-time Delivery' : 'تسليم في الوقت',
    viewDetails: isEn ? 'View Details' : 'مشاهدة التفاصيل',
    loadingVideo: isEn ? 'Loading video...' : 'جاري تحميل الفيديو...',
    retry: isEn ? 'Retry' : 'إعادة المحاولة',
    openInNewTab: isEn ? 'Open video in new tab' : 'فتح الفيديو في صفحة جديدة',
    videoError: isEn ? 'Cannot play this video.' : 'لا يمكن تشغيل هذا الفيديو.',
    videoUnsupported: isEn ? 'Your browser does not support the video tag.' : 'متصفحك لا يدعم عرض الفيديو.',
    clickToDownload: isEn ? 'Click here to download' : 'اضغط هنا لتحميله',
    sharedSuccessfully: isEn ? 'Link copied to clipboard' : 'تم نسخ الرابط للحافظة',
    callUs: isEn ? 'Call Us' : 'اتصل بنا',
    similarProjectMsg: isEn ? 'Do you want to implement a similar project? Our team is ready to serve you in Jeddah.' : 'هل تريد تنفيذ مشروع مماثل؟ فريقنا جاهز لخدمتك في جدة.'
  };

  const categories = [
    { id: 'مظلات سيارات', name: isEn ? 'Car Shades' : 'مظلات سيارات', icon: '🚗', color: 'bg-blue-500' },
    { id: 'سواتر', name: isEn ? 'Screens' : 'سواتر', icon: '🧱', color: 'bg-red-500' },
    { id: 'خيم ملكية', name: isEn ? 'Royal Tents' : 'خيم ملكية', icon: '🏕️', color: 'bg-emerald-500' },
    { id: 'بيوت شعر ملكي', name: isEn ? 'Royal Hair Houses' : 'بيوت شعر ملكي', icon: '⛺', color: 'bg-purple-500' },
    { id: 'برجولات', name: isEn ? 'Pergolas' : 'برجولات', icon: '🏛️', color: 'bg-amber-500' },
    { id: 'تنسيق حدائق', name: isEn ? 'Landscaping' : 'تنسيق حدائق', icon: '🌿', color: 'bg-green-500' },
    { id: 'هناجر', name: isEn ? 'Hangars' : 'هناجر', icon: '🏢', color: 'bg-slate-500' },
    { id: 'شبوك', name: isEn ? 'Fences' : 'شبوك', icon: '🔲', color: 'bg-gray-500' },
    { id: 'قراميد', name: isEn ? 'Tiling' : 'قراميد', icon: '🏛️', color: 'bg-orange-500' },
    { id: 'ساندوتش بانل', name: isEn ? 'Sandwich Panels' : 'ساندوتش بانل', icon: '📦', color: 'bg-cyan-500' }
  ];

  const breadcrumbItems = [
    { label: isEn ? 'Projects' : 'المشاريع', href: `${localePath}/portfolio` },
    { label: project.title, href: `${localePath}/portfolio/${projectId}`, current: true }
  ];
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // تفاعلات المشروع
  const [likesCount, setLikesCount] = useState<number>(project.likes || 0);
  const [viewsCount, setViewsCount] = useState<number>(project.views || 0);
  const [commentsCount, setCommentsCount] = useState<number>(project._count?.comments || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/interactions`);
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.interactions) {
            setLikesCount(data.interactions.likes ?? likesCount);
            setViewsCount(data.interactions.views ?? viewsCount);
            setCommentsCount(data.interactions.comments ?? commentsCount);
            setIsLiked(!!data.interactions.isLiked);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchInteractions();
  }, [project.id]);

  const handleToggleLike = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like', action: 'toggle' })
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(!!data.isLiked);
        if (typeof data.newCount === 'number') setLikesCount(data.newCount);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleVideoPlay = () => setIsVideoPlaying(true);
  const handleVideoPause = () => setIsVideoPlaying(false);
  const toggleVideoMute = () => setIsVideoMuted(!isVideoMuted);

  const category = categories.find(c => c.id === project.category);
  const mediaItems = project.mediaItems && project.mediaItems.length > 0 ? project.mediaItems : [];
  const currentMedia = mediaItems.length > 0 ? (mediaItems[selectedMediaIndex] || mediaItems[0]) : null;

  /** التحقق هل الرابط صورة صالحة */
  const isValidImage = (src: string | null | undefined): boolean => {
    if (!src) return false;
    if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(src)) return false;
    return true;
  };

  /** استخراج thumbnail من رابط الفيديو */
  const getVideoThumbnail = (src: string): string | null => {
    if (src.includes('cloudinary.com') && src.includes('/video/upload/')) {
      return src
        .replace('/video/upload/', '/video/upload/so_2,w_800,h_600,c_fill,f_jpg,q_auto/')
        .replace(/\.(mp4|webm|mov|avi)(\?.*)?$/i, '.jpg');
    }
    const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return null;
  };

  const currentThumbnail = currentMedia?.type === 'VIDEO' 
    ? (isValidImage(currentMedia.thumbnail) ? currentMedia.thumbnail : getVideoThumbnail(currentMedia.src)) 
    : null;

  // دالة للتحقق من نوع الفيديو - تدعم Cloudinary URLs
  const getVideoType = (src: string): string => {
    if (!src) return 'video/mp4';
    if (src.includes('/video/upload/') || src.includes('/upload/') && src.includes('cloudinary')) {
      return 'video/mp4';
    }

    const extension = src.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg': return 'video/ogg';
      case 'mov': return 'video/quicktime';
      default: return 'video/mp4';
    }
  };

  // ✅ تجهيز بيانات Schema.org للصور والفيديوهات
  const gallerySchema = mediaItems.map((media, idx) => {
    if (media.type === 'VIDEO') {
      return {
        "@type": "VideoObject",
        "name": media.title || `${project.title} - فيديو ${idx + 1}`,
        "description": media.description || project.description,
        "thumbnailUrl": media.thumbnail || getVideoThumbnail(media.src),
        "contentUrl": media.src,
        "uploadDate": project.createdAt,
      };
    }
    return {
      "@type": "ImageObject",
      "author": "ديار جدة العالمية",
      "contentUrl": media.src,
      "datePublished": project.createdAt,
      "description": media.description || project.description,
      "name": media.title || `${project.title} - صورة ${idx + 1}`,
      "representativeOfPage": idx === 0 ? "true" : "false"
    };
  });

  // دالة لتوليد رابط صديق لمحركات البحث (SEO Friendly)
  const getMediaSlug = (media: any, index: number) => {
    const baseName = media.alt || media.title || `${project.title}-${isEn ? 'image' : 'صورة'}-${index + 1}`;
    const safeName = baseName
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-\u0600-\u06FF]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${safeName}-${media.id}`;
  };


  // دالة لمعالجة أخطاء الفيديو
  const handleVideoError = (err: any) => {
    try {
      const error = err?.target as HTMLVideoElement | null;
      if (!error) {
        console.error('❌ خطأ في تشغيل الفيديو: لا يمكن الوصول إلى عنصر الفيديو');
        setVideoError('لا يمكن تشغيل هذا الفيديو.');
        setVideoLoading(false);
        return;
      }

      const errorCode = error.error?.code;
      const errorMessage = error.error?.message;

      console.error('❌ خطأ في تشغيل الفيديو:', {
        code: errorCode,
        message: errorMessage,
        src: error.currentSrc,
        type: error.querySelector('source')?.type
      });

      // رسائل خطأ مفصلة بناءً على نوع الخطأ
      let userFriendlyMessage = 'لا يمكن تشغيل هذا الفيديو.';

      switch (errorCode) {
        case 1: // MEDIA_ERR_ABORTED
          userFriendlyMessage = 'تم إيقاف تحميل الفيديو.';
          break;
        case 2: // MEDIA_ERR_NETWORK
          userFriendlyMessage = 'حدث خطأ في الشبكة أثناء تحميل الفيديو.';
          break;
        case 3: // MEDIA_ERR_DECODE
          userFriendlyMessage = 'الفيديو تالف أو بتنسيق غير مدعوم.';
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          userFriendlyMessage = 'تنسيق الفيديو غير مدعوم. يرجى استخدام MP4 أو WebM.';
          break;
        default:
          userFriendlyMessage = 'حدث خطأ غير متوقع في تشغيل الفيديو.';
      }

      setVideoError(userFriendlyMessage);
      setVideoLoading(false);
    } catch (e) {
      console.error('❌ خطأ في معالجة خطأ الفيديو:', e);
      setVideoError('لا يمكن تشغيل هذا الفيديو.');
      setVideoLoading(false);
    }
  };

  const handlePrevMedia = () => {
    const mediaArray = project.mediaItems || [];
    if (mediaArray.length === 0) return;
    const newIndex = selectedMediaIndex === 0 ? mediaArray.length - 1 : selectedMediaIndex - 1;
    setSelectedMediaIndex(newIndex);
  };

  const handleNextMedia = () => {
    const mediaArray = project.mediaItems || [];
    if (mediaArray.length === 0) return;
    const newIndex = selectedMediaIndex === mediaArray.length - 1 ? 0 : selectedMediaIndex + 1;
    setSelectedMediaIndex(newIndex);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || undefined,
          url: window.location.href,
        });
      } catch (error) {
        console.log('خطأ في المشاركة:', error);
      }
    } else {
      // نسخ الرابط للحافظة
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط للحافظة');
    }
  };

  return (
    <main id="main-content" className="bg-gray-50 min-h-screen" itemScope itemType="https://schema.org/CreativeWork">
      {/* ✅ JSON-LD Rich Snippet for Project & Gallery */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.description,
            "image": mediaItems.map(m => m.src),
            "photo": gallerySchema,
            "datePublished": project.createdAt,
            "locationCreated": {
              "@type": "Place",
              "name": project.location
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": project.rating || 5,
              "reviewCount": project._count?.comments || 1
            }
          })
        }}
      />

      {/* شريط التنقل العلوي */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="mb-2 sm:mb-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
            <Button variant="ghost" size="sm" asChild className="justify-start sm:justify-center">
              <Link href={`${localePath}/portfolio`}>
                <ArrowLeft className={`h-4 w-4 sm:h-5 sm:w-5 ${isEn ? '' : 'ml-2'} ${isEn ? 'mr-2 rotate-180' : ''}`} />
                <span className="text-sm sm:text-base">{t.backToPortfolio}</span>
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant={isLiked ? 'default' : 'outline'} onClick={handleToggleLike} className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm">
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 ${isLiked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isLiked ? t.unlike : t.like}</span>
                <span className="sm:hidden text-base">❤️</span>
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                <span className="hidden sm:inline">{t.share}</span>
                <span className="sm:hidden text-base">↗</span>
              </Button>
              <Button variant="outline" className="hidden md:flex px-4 py-2.5 text-sm">
                <Download className="h-4 w-4 ml-2" />
                {t.downloadCatalog}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* قسم العرض الرئيسي */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">

            {/* معرض الوسائط - 5 أعمدة */}
            <div className="lg:col-span-5 space-y-6">
              {/* العرض الرئيسي */}
              <ProtectedMedia>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg relative">
                    {currentMedia && (
                      <>
                        {currentMedia.type === 'IMAGE' ? (
                          <>
                            <Link 
                              href={`${localePath}/portfolio/${project.slug || projectId}/media/${getMediaSlug(currentMedia, selectedMediaIndex)}`}
                              className="block relative w-full h-full"
                            >
                              <Image
                                key={`image-${selectedMediaIndex}`}
                                src={currentMedia.src}
                                alt={currentMedia.alt || currentMedia.title || `${project.title} - ${category?.name || project.category} ${isEn ? 'in' : 'في'} ${project.location}`}
                                title={currentMedia.title || project.title}
                                fill
                                className="object-cover cursor-pointer transition-all duration-500 hover:scale-105"
                                priority={selectedMediaIndex === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAgIBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amk2la/HbvRayrjrSSFpJJJHkd3Y82ZJJJ5kk+SSSf//Z"
                              />
                            </Link>
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm text-slate-900 shadow-xl border-0 hover:bg-white"
                                onClick={() => setIsLightboxOpen(true)}
                              >
                                <Maximize className="h-4 w-4" />
                              </Button>
                              <Link 
                                href={`${localePath}/portfolio/${project.slug || projectId}/media/${getMediaSlug(currentMedia, selectedMediaIndex)}`}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 shadow-xl"
                              >
                                {isEn ? 'Dedicated Page' : 'صفحة مستقلة'}
                                <ArrowLeft className={`h-4 w-4 ${isEn ? 'rotate-180 ml-2' : 'mr-2'}`} />
                              </Link>
                            </div>
                            <WatermarkOverlay position="bottom-right" opacity={0.5} size="medium" />
                          </>
                        ) : (
                          <div className="relative w-full h-full">
                            <WatermarkOverlay position="bottom-right" opacity={0.5} size="medium" />
                            {videoError ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="text-center p-4">
                                  <div className="text-red-500 mb-2">
                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-4">{videoError}</p>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => {
                                        setVideoError(null);
                                        setVideoLoading(true);
                                      }}
                                      className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                                    >
                                      إعادة المحاولة
                                    </button>
                                    <a
                                      href={currentMedia.src}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                                    >
                                      فتح الفيديو في صفحة جديدة
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <video
                                  key={`video-${selectedMediaIndex}-${currentMedia.src}`}
                                  controls
                                  preload="auto"
                                  playsInline
                                  muted={isVideoMuted}
                                  className="w-full h-full object-contain bg-black"
                                  poster={currentThumbnail || undefined}
                                  title={currentMedia.title || `${project.title} - فيديو المشروع`}
                                  aria-label={currentMedia.description || `${project.title} - فيديو توضيحي`}
                                  crossOrigin="anonymous"
                                  itemProp="video"
                                  itemScope
                                  itemType="https://schema.org/VideoObject"
                                  onPlay={handleVideoPlay}
                                  onPause={handleVideoPause}
                                  onLoadStart={() => {
                                    setVideoLoading(true);
                                    setVideoError(null);
                                  }}
                                  onCanPlay={() => setVideoLoading(false)}
                                  onError={(e) => {
                                    console.error('Video Error:', e);
                                    handleVideoError(e);
                                  }}
                                >
                                  <source src={currentMedia.src} type="video/mp4" />
                                  <source src={currentMedia.src.replace('.mp4', '.webm')} type="video/webm" />
                                  <source src={currentMedia.src} type={getVideoType(currentMedia.src)} />
                                  متصفحك لا يدعم عرض الفيديو. <a href={currentMedia.src} className="underline">اضغط هنا لتحميله</a>
                                </video>

                                {/* مؤشر التحميل */}
                                {videoLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="text-center text-white">
                                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                      <p className="text-sm">جاري تحميل الفيديو...</p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* أزرار تحكم مخصصة */}
                            <div className="absolute bottom-4 left-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                                onClick={toggleVideoMute}
                              >
                                {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                                asChild
                              >
                                <Link href={`${localePath}/portfolio/${project.slug || projectId}/media/${currentMedia.id}`}>
                                  <Maximize className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                            {!isVideoPlaying && (
                              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
                                <div className="bg-white bg-opacity-90 text-gray-900 rounded-full p-4">
                                  <Play className="h-8 w-8" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* أزرار التنقل */}
                  {mediaItems.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90"
                        onClick={handlePrevMedia}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90"
                        onClick={handleNextMedia}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* مؤشر العدد */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedMediaIndex + 1} / {mediaItems.length}
                  </div>
                </div>
              </ProtectedMedia>

              {/* معاينات مصغرة */}
              {mediaItems.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 gap-2">
                  {mediaItems.map((media, index) => (
                    <Link
                      key={media.id}
                      href={`${localePath}/portfolio/${project.slug || projectId}/media/${getMediaSlug(media, index)}`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group ${index === selectedMediaIndex
                          ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-lg'
                          : 'border-slate-100 hover:border-blue-300 hover:shadow-md'
                        }`}
                      onMouseEnter={() => setSelectedMediaIndex(index)}
                    >
                      {media.type === 'IMAGE' ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={media.src}
                            alt={media.alt || `${project.title} - ${isEn ? 'Image' : 'صورة'} ${index + 1} - ${project.location || ''}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                        </div>
                      ) : (
                        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                          {(() => {
                            const thumb = media.thumbnail || (media.type === 'VIDEO' ? getVideoThumbnail(media.src) : null);
                            return thumb ? (
                              <Image
                                src={thumb}
                                alt={media.title || project.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : null;
                          })()}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <Play className="h-6 w-6 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* معلومات المشروع - 4 أعمدة */}
            <article className="lg:col-span-4 space-y-6" itemScope itemType="https://schema.org/CreativeWork">
              {/* العنوان والتقييم */}
              <header>
                <div className="flex items-center gap-3 mb-4">
                  {category && (
                    <Badge className={`${category.color} text-white`}>
                      {category.icon} {category.name}
                    </Badge>
                  )}
                  {project.featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {t.featured}
                    </Badge>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {isEn ? (project.titleEn || project.title) : project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(project.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className={`mr-2 text-lg font-semibold ${isEn ? 'ml-2 mr-0' : ''}`}>{project.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                    <span className="flex items-center">
                      <Eye className={`h-3 w-3 sm:h-4 sm:w-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                      <span className="text-xs sm:text-sm">{viewsCount}</span>
                    </span>
                    <button onClick={handleToggleLike} className="flex items-center hover:text-red-600 transition-colors">
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isEn ? 'mr-1' : 'ml-1'} ${isLiked ? 'text-red-600 fill-current' : ''}`} />
                      <span className="text-xs sm:text-sm">{likesCount}</span>
                    </button>
                    <span className="flex items-center">
                      <MessageCircle className={`h-3 w-3 sm:h-4 sm:w-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                      <span className="text-xs sm:text-sm">{commentsCount}</span>
                    </span>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-gray-700 leading-relaxed" itemProp="description">
                  {isEn ? (project.descriptionEn || project.description) : project.description}
                </p>
              </header>

              {/* تفاصيل المشروع */}
              <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">{t.projectDetails}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-blue-500`} />
                      <div>
                        <div className="text-sm text-gray-500">{t.location}</div>
                        <div className="font-semibold">{isEn ? (project.locationEn || project.location) : project.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-green-500`} />
                      <div>
                        <div className="text-sm text-gray-500">{t.completionDate}</div>
                        <div className="font-semibold">
                          {project.completionDate
                            ? new Date(project.completionDate).toLocaleDateString(isEn ? 'en-US' : 'ar-SA')
                            : (isEn ? 'Not specified' : 'غير محدد')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-orange-500`} />
                      <div>
                        <div className="text-sm text-gray-500">{t.executionDuration}</div>
                        <div className="font-semibold">{project.projectDuration}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(project.client || project.clientEn) && (
                      <div className="flex items-center">
                        <User className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-purple-500`} />
                        <div>
                          <div className="text-sm text-gray-500">{t.client}</div>
                          <div className="font-semibold">{isEn ? (project.clientEn || project.client) : project.client}</div>
                        </div>
                      </div>
                    )}

                    {project.projectCost && (
                      <div className="flex items-center">
                        <DollarSign className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-emerald-500`} />
                        <div>
                          <div className="text-sm text-gray-500">{t.cost}</div>
                          <div className="font-semibold">{project.projectCost}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Award className={`h-5 w-5 ${isEn ? 'mr-3' : 'ml-3'} text-yellow-500`} />
                      <div>
                        <div className="text-sm text-gray-500">{t.status}</div>
                        <div className="font-semibold flex items-center text-green-600">
                          <CheckCircle className={`h-4 w-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                          {t.completed}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* الكلمات المفتاحية والمواد */}
              {(project.tags.length > 0 || project.materials.length > 0) && (
                <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100" aria-labelledby="project-keywords-heading">
                  {project.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 id="project-keywords-heading" className="font-semibold mb-3 flex items-center">
                        <Tag className={`h-4 w-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
                        {t.keywords}
                      </h3>
                      <div className="flex flex-wrap gap-2" itemProp="keywords">
                        {project.tags.map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.materials.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Award className={`h-4 w-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
                        {t.materialsUsed}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.materials.map((material) => (
                          <Badge key={material.id} variant="outline">
                            {material.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* أزرار الإجراء */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="lg" className="flex-1 text-sm sm:text-base py-3" asChild>
                  <Link href="/contact">
                    <Phone className={`h-4 w-4 sm:h-5 sm:w-5 ${isEn ? 'mr-2' : 'ml-2'}`} />
                    {t.contactUs}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1 text-sm sm:text-base py-3" asChild>
                  <Link href="/quote">
                    <Quote className={`h-4 w-4 sm:h-5 sm:w-5 ${isEn ? 'mr-2' : 'ml-2'}`} />
                    {t.getQuote}
                  </Link>
                </Button>
              </div>
            </article>

            {/* Sticky Sidebar - 3 أعمدة */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* بطاقة اتصال سريع */}
                <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-2">📞 {t.contactUs}</h3>
                  <p className="text-white/80 text-sm mb-4">{t.similarProjectMsg}</p>
                  <a
                    href="/contact"
                    className="block w-full text-center bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-white/90 transition-colors mb-3"
                  >
                    📞 {t.callUs}
                  </a>
                  <a
                    href="/quote"
                    className="block w-full text-center border border-white/50 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    💰 {t.getQuote}
                  </a>
                </div>

                {/* تقييم المشروع */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">⭐ {t.projectRating}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="font-bold text-gray-800 mr-1">{project.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {viewsCount}</span>
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {likesCount}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {commentsCount}</span>
                  </div>
                </div>

                {/* جودة وضمان */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">🏆 {t.qualityAndGuarantee}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t.guaranteeYears}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t.experienceYears}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t.highQualityMaterials}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t.onTimeDelivery}</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* قسم التعليقات وا��تقييمات */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectCommentsSection
            projectId={project.id}
            projectTitle={project.title}
          />
        </div>
      </section>

      {/* Lightbox للوسائط */}
      <AnimatePresence>
        {isLightboxOpen && currentMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-full max-h-full">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="relative inline-block">
                {currentMedia.type === 'IMAGE' ? (
                  <>
                    <Image
                      key={`lightbox-image-${selectedMediaIndex}`}
                      src={currentMedia.src}
                      alt={`${currentMedia.title || project.title} - مشروع ${project.category} في ${project.location} من ديار جدة العالمية جدة`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[90vh] object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <WatermarkOverlay position="bottom-right" opacity={0.6} size="large" />
                  </>
                ) : (
                  <>
                    <video
                      key={`lightbox-video-${selectedMediaIndex}`}
                      src={currentMedia.src}
                      className="max-w-full max-h-[90vh] object-contain"
                      controls
                      autoPlay
                      muted={false}
                      playsInline
                      onClick={(e) => e.stopPropagation()}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    />
                    <WatermarkOverlay position="bottom-right" opacity={0.6} size="large" />
                  </>
                )}
              </div>

              {/* أزرار التنقل في Lightbox */}
              {mediaItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevMedia();
                    }}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMedia();
                    }}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
