'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Maximize, 
  Calendar, 
  MapPin, 
  Tag, 
  ChevronRight,
  Play,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import WatermarkOverlay from '@/components/WatermarkOverlay';

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  src: string;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  alt?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  location: string | null;
  description: string | null;
  completionDate: string | Date | null;
  media_items: MediaItem[];
}

interface Props {
  project: Project;
  mediaItem: MediaItem;
  locale: string;
}

export default function MediaDetailClient({ project, mediaItem, locale }: Props) {
  const isEn = locale === 'en';
  const isRTL = locale === 'ar';
  const localePath = isEn ? '/en' : '';
  
  const t = {
    backToProject: isEn ? 'Back to Project' : 'العودة للمشروع',
    share: isEn ? 'Share' : 'مشاركة',
    download: isEn ? 'Download' : 'تحميل',
    details: isEn ? 'Details' : 'التفاصيل',
    otherMedia: isEn ? 'Other Media in this Project' : 'وسائط أخرى في هذا المشروع',
    location: isEn ? 'Location' : 'الموقع',
    category: isEn ? 'Category' : 'التصنيف',
    date: isEn ? 'Date' : 'التاريخ'
  };

  // حالة المكبر السحري (Magic Lens)
  const [lensPosition, setLensPosition] = React.useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLensPosition({ x, y });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mediaItem.title || project.title,
          text: mediaItem.description || project.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isEn ? 'Link copied to clipboard' : 'تم نسخ الرابط للحافظة');
    }
  };

  // حساب الوسائط التالية والسابقة للتنقل
  const currentIndex = project.media_items.findIndex(item => item.id === mediaItem.id);
  const nextMedia = currentIndex < project.media_items.length - 1 ? project.media_items[currentIndex + 1] : project.media_items[0];
  const prevMedia = currentIndex > 0 ? project.media_items[currentIndex - 1] : project.media_items[project.media_items.length - 1];

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

  // تصفية الوسائط الأخرى (استعراض سريع)
  const otherMedia = project.media_items.filter(item => item.id !== mediaItem.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs - Premium Style */}
        <nav className="mb-10 flex items-center text-sm font-bold tracking-tight text-slate-400 overflow-x-auto whitespace-nowrap pb-4 border-b border-slate-200/60">
          <Link href={`${localePath}/portfolio`} className="hover:text-blue-600 transition-colors uppercase">
            {isEn ? 'Portfolio' : 'المشاريع'}
          </Link>
          <ChevronRight className={`h-4 w-4 mx-3 ${isRTL ? 'rotate-180' : ''}`} />
          <Link href={`${localePath}/portfolio/${project.slug || project.id}`} className="hover:text-blue-600 transition-colors">
            {project.title}
          </Link>
          <ChevronRight className={`h-4 w-4 mx-3 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-slate-900 truncate bg-slate-200/50 px-3 py-1 rounded-full">
            {mediaItem.title || (mediaItem.type === 'IMAGE' ? (isEn ? 'Image View' : 'عرض الصورة') : (isEn ? 'Video View' : 'عرض الفيديو'))}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Main Content Area - 8 columns */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 relative group border border-slate-100"
            >
              <div className="relative aspect-video sm:aspect-[16/10] bg-slate-950 flex items-center justify-center group/media overflow-hidden rounded-t-[2.5rem]">
                {mediaItem.type === 'IMAGE' ? (
                  <div 
                    className="relative w-full h-full cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* الصورة الأساسية */}
                    <Image
                      src={mediaItem.src}
                      alt={mediaItem.alt || mediaItem.title || project.title}
                      fill
                      className={`object-contain transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                      priority
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    
                    {/* طبقة المكبر السحري (Magic Lens) */}
                    <div 
                      className={`absolute inset-0 bg-no-repeat transition-opacity duration-300 ease-out pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        backgroundImage: `url(${mediaItem.src})`,
                        backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
                        backgroundSize: '250%', // قوة التكبير
                      }}
                    />
                    <WatermarkOverlay position="bottom-right" opacity={0.6} size="large" />
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <video 
                      src={mediaItem.src} 
                      controls 
                      autoPlay
                      className="w-full h-full"
                      poster={mediaItem.thumbnail || undefined}
                    />
                    <WatermarkOverlay position="bottom-right" opacity={0.4} size="medium" />
                  </div>
                )}

                {/* Navigation Overlay Buttons */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover/media:opacity-100 transition-opacity duration-300">
                  <Link 
                    href={`${localePath}/portfolio/${project.slug || project.id}/media/${getMediaSlug(prevMedia, currentIndex - 1)}`}
                    className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl"
                  >
                    <ChevronRight className={`h-6 w-6 ${isRTL ? '' : 'rotate-180'}`} />
                  </Link>
                  <Link 
                    href={`${localePath}/portfolio/${project.slug || project.id}/media/${getMediaSlug(nextMedia, currentIndex + 1)}`}
                    className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl"
                  >
                    <ChevronRight className={`h-6 w-6 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>

              {/* Action Bar - Glassmorphism */}
              <div className="p-6 sm:p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200" onClick={handleShare}>
                      <Share2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} />
                      {t.share}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200" asChild>
                      <a href={mediaItem.src} download target="_blank" rel="noopener noreferrer">
                        <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} text-indigo-600`} />
                        {t.download}
                      </a>
                    </Button>
                  </motion.div>
                </div>
                
                <Button variant="ghost" className="rounded-2xl h-12 px-6 font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all" asChild>
                  <Link href={`${localePath}/portfolio/${project.slug || project.id}`} className="flex items-center">
                    {t.backToProject}
                    {isRTL ? <ArrowLeft className="mr-3 h-4 w-4" /> : <ArrowRight className="ml-3 h-4 w-4" />}
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Content & Description - High Fidelity Typography */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight relative z-10">
                {mediaItem.title || project.title}
              </h1>
              
              <div className="prose prose-slate prose-lg max-w-none mb-10 relative z-10">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {mediaItem.description || project.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.location}</div>
                    <div className="font-bold text-slate-900 text-lg">{project.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Tag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.category}</div>
                    <div className="font-bold text-slate-900 text-lg">{project.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.date}</div>
                    <div className="font-bold text-slate-900 text-lg">
                      {project.completionDate ? new Date(project.completionDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long' }) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Area - 4 columns */}
          <div className="lg:col-span-4 space-y-10">
            {/* Gallery Sidebar */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                {t.otherMedia}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {otherMedia.map((item, idx) => (
                  <Link 
                    key={item.id}
                    href={`${localePath}/portfolio/${project.slug || project.id}/media/${getMediaSlug(item, idx)}`}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-blue-300 transition-all shadow-sm"
                  >
                    {item.type === 'IMAGE' ? (
                      <Image
                        src={item.src}
                        alt={item.title || project.title}
                        fill
                        className="object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                    ) : (
                      <>
                        <Image
                          src={item.thumbnail || ''}
                          alt={item.title || project.title}
                          fill
                          className="object-cover group-hover:scale-125 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-[10px] font-bold text-white uppercase truncate">
                        {item.type === 'IMAGE' ? (isEn ? 'View Photo' : 'عرض الصورة') : (isEn ? 'Play Video' : 'تشغيل الفيديو')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100">
                <Button className="w-full h-14 rounded-2xl font-bold bg-slate-900 hover:bg-blue-600 shadow-xl transition-all group" asChild>
                  <Link href={`${localePath}/portfolio/${project.slug || project.id}`}>
                    {t.backToProject}
                    <ArrowLeft className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2 rotate-180'} group-hover:translate-x-1 transition-transform`} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Premium Contextual CTA Sidebar */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 text-blue-200 mb-6" />
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  {isEn 
                    ? `Like this ${project.category} design?` 
                    : `هل أعجبك تصميم ${project.category} هذا؟`}
                </h3>
                <p className="text-blue-100/90 mb-8 text-lg font-medium leading-relaxed">
                  {isEn 
                    ? `Get a similar customized ${project.title} for your space ${project.location ? 'in ' + project.location : ''} with the highest quality standards.` 
                    : `احصل على تصميم مشابه لـ "${project.title}" مخصص لمساحتك ${project.location ? 'في ' + project.location : ''} بأفضل المعايير وأسرع وقت.`}
                </p>
                <Button variant="secondary" className="w-full h-14 rounded-2xl font-bold text-blue-900 bg-white hover:bg-blue-50 border-0 shadow-xl transition-transform hover:-translate-y-1" asChild>
                  <Link href={`${localePath}/quote`}>
                    {isEn ? 'Request This Design' : 'اطلب هذا التصميم الآن'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
