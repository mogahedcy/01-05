'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ThumbsUp, ExternalLink, Sparkles, Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCategoryBasedAlt, generateImageObjectSchema } from '@/lib/image-seo-utils';
import WatermarkOverlay from '@/components/WatermarkOverlay';

interface MediaItem {
  src: string;
  alt: string | null;
  title?: string | null;
  type?: string | null;
  thumbnail?: string | null;
}

interface Project {
  id: string | number;
  title: string;
  description: string | null;
  slug: string | null;
  featured: boolean;
  category?: string;
  location?: string;
  views?: number;
  likes?: number;
  media_items: MediaItem[];
  _count?: {
    project_views?: number;
    project_likes?: number;
  };
}

interface ProjectsGalleryProps {
  projects: Project[];
  categoryName: string;
}

/** استخراج thumbnail من رابط الفيديو */
function getVideoThumbnail(src: string): string | null {
  if (!src) return null;
  
  if (src.includes('cloudinary.com') && (src.includes('/video/upload/') || src.includes('/video/'))) {
    return src
      .replace('/video/upload/', '/video/upload/so_2,w_600,h_400,c_fill,f_jpg,q_auto/')
      .replace(/\.(mp4|webm|mov|avi)(\?.*)?$/i, '.jpg');
  }
  const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}

/** التحقق هل الرابط صورة صالحة */
function isValidImage(src: string | null | undefined): boolean {
  if (!src) return false;
  // إذا كان الرابط ينتهي بامتداد فيديو، فهو ليس صورة صالحة
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(src)) return false;
  return true;
}

/** تحديد هل هو فيديو أم صورة */
function isVideoItem(item: MediaItem): boolean {
  if (item.type === 'VIDEO') return true;
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(item.src)) return true;
  if (item.src.includes('/video/upload/')) return true;
  return false;
}

export default function ProjectsGallery({ projects, categoryName }: ProjectsGalleryProps) {
  if (projects.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">لا توجد مشاريع حالياً</h3>
            <p className="text-gray-500">سنقوم بإضافة مشاريع {categoryName} قريباً</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">مربوط ديناميكياً</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            معرض أعمالنا في {categoryName}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            اطلع على مشاريعنا المنجزة في مجال {categoryName} بمختلف أنواعها
          </p>
          <div className="inline-flex items-center gap-2 mt-4 text-sm text-accent">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">{projects.length} مشروع متاح من قاعدة البيانات</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            // تحضير مصفوفة الوسائط للعرض (حتى 3 عناصر)
            const galleryMedia = (project.media_items || []).slice(0, 3).map(item => {
              const isVideo = isVideoItem(item);
              const dbThumb = item.thumbnail;
              const hasValidThumb = isValidImage(dbThumb);
              
              return {
                ...item,
                isVideo,
                displaySrc: isVideo ? (hasValidThumb ? dbThumb : getVideoThumbnail(item.src)) : item.src
              };
            });

            const mainMedia = galleryMedia[0];
            const otherMedia = galleryMedia.slice(1);
            const remainingCount = Math.max(0, (project.media_items?.length || 0) - 3);

            // للتوافق مع الـ Schema و الـ Alt القديم
            const displaySrc = mainMedia?.displaySrc || null;
            const mediaIsVideo = mainMedia?.isVideo || false;

            const optimizedAlt = mainMedia?.alt ||
              generateCategoryBasedAlt(
                project.category || categoryName,
                project.title,
                project.location,
                0
              );

            const imageSchema = displaySrc && !mediaIsVideo
              ? generateImageObjectSchema(
                  displaySrc,
                  {
                    alt: optimizedAlt,
                    title: project.title,
                    description: project.description || project.title,
                    keywords: [project.category || categoryName, project.location || 'جدة', 'ديار جدة العالمية'],
                    context: 'project'
                  },
                  `/portfolio/${project.slug || project.id}`
                )
              : null;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/portfolio/${project.slug || project.id}`} className="group block">
                  <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-accent hover:shadow-2xl transition-all duration-500">

                    {/* منطقة الوسائط - شبكة ديناميكية */}
                    <div className="relative h-64 overflow-hidden bg-gray-50 flex">

                      {mainMedia ? (
                        <>
                          {/* الصورة الرئيسية - تشغل 70% إذا وجد صور أخرى، أو 100% إذا كانت وحيدة */}
                          <div className={`relative h-full transition-all duration-500 ${otherMedia.length > 0 ? 'w-[70%]' : 'w-full'}`}>
                            {mainMedia.displaySrc ? (
                              <>
                                <Image
                                  src={mainMedia.displaySrc}
                                  alt={optimizedAlt}
                                  title={project.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                  unoptimized={mainMedia.isVideo}
                                />
                                {mainMedia.isVideo && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="bg-white/90 rounded-full p-3 shadow-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                      <Play className="w-6 h-6 text-accent fill-accent" />
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Video className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* الصور الجانبية */}
                          {otherMedia.length > 0 && (
                            <div className="w-[30%] h-full flex flex-col border-l-2 border-white bg-white">
                              {otherMedia.map((media, mIdx) => (
                                <div 
                                  key={media.id} 
                                  className={`relative flex-1 border-white ${mIdx === 0 && otherMedia.length > 1 ? 'border-b-2' : ''} bg-gray-100 overflow-hidden group/thumb`}
                                >
                                  {media.displaySrc ? (
                                    <>
                                      <Image
                                        src={media.displaySrc}
                                        alt={`${project.title} - ${mIdx + 2}`}
                                        fill
                                        sizes="20vw"
                                        className="object-cover group-hover/thumb:scale-125 transition-transform duration-700"
                                        unoptimized={media.isVideo}
                                      />
                                      {media.isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                          <Play className="w-4 h-4 text-white fill-white" />
                                        </div>
                                      )}
                                      {/* مؤشر "المزيد" */}
                                      {mIdx === 1 && remainingCount > 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover/thumb:bg-black/40 transition-colors">
                                          <span className="text-white font-bold text-sm">+{remainingCount}</span>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Sparkles className="w-4 h-4 text-gray-300" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        /* لا توجد وسائط */
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-gray-200" />
                        </div>
                      )}

                      {/* مؤشر إجمالي عدد الوسائط */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
                        <Sparkles className="w-3 h-3 text-accent" />
                        {project.media_items?.length || 0} وسائط
                      </div>
                    </div>

                    <WatermarkOverlay position="bottom-right" size="small" opacity={0.25} />

                      {/* Badge مميز */}
                      {project.featured && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="absolute top-4 right-4 bg-gradient-to-r from-accent to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          مميز
                        </motion.div>
                      )}

                      {/* Badge فيديو */}
                      {mediaIsVideo && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          فيديو
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {imageSchema && (
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
                      )}
                    </div>

                    {/* محتوى الكارت */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          {(project._count?.project_views || project.views || 0) > 0 && (
                            <motion.span className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                              <Eye className="w-4 h-4" />
                              {project._count?.project_views || project.views || 0}
                            </motion.span>
                          )}
                          {(project._count?.project_likes || project.likes || 0) > 0 && (
                            <motion.span className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                              <ThumbsUp className="w-4 h-4" />
                              {project._count?.project_likes || project.likes || 0}
                            </motion.span>
                          )}
                        </div>
                        <span className="text-accent font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          عرض
                          <ExternalLink className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href={`/portfolio?search=${categoryName}`}>
            <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              عرض جميع مشاريع {categoryName}
              <ExternalLink className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
