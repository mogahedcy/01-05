'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ThumbsUp, BookOpen, Sparkles, Play, Video } from 'lucide-react';

interface Article {
  id: string | number;
  title: string;
  excerpt: string | null;
  slug: string | null;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  article_media_items: Array<{
    src: string;
    alt: string | null;
    type?: string | null;
    thumbnail?: string | null;
  }>;
  _count: {
    article_views: number;
    article_likes: number;
  };
}

interface ArticlesSectionProps {
  articles: Article[];
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
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(src)) return false;
  return true;
}

/** تحديد هل هو فيديو أم صورة */
function isVideoItem(item: any): boolean {
  if (item.type === 'VIDEO') return true;
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(item.src)) return true;
  if (item.src.includes('/video/upload/')) return true;
  return false;
}

export default function ArticlesSection({ articles, categoryName }: ArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              لا توجد مقالات حالياً
            </h3>
            <p className="text-gray-500">
              سنقوم بإضافة مقالات عن {categoryName} قريباً
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-bold">محتوى ديناميكي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            مقالات متعلقة بـ{categoryName}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            اقرأ مقالاتنا المتخصصة في مجال {categoryName} والنصائح المفيدة
          </p>
          <div className="inline-flex items-center gap-2 mt-4 text-sm text-primary">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium">{articles.length} مقالة من قاعدة البيانات</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const firstMedia = article.article_media_items?.[0];
            const mediaIsVideo = firstMedia ? isVideoItem(firstMedia) : false;

            let displaySrc: string | null = null;
            if (firstMedia) {
              const dbThumbnail = firstMedia.thumbnail;
              const hasValidDbThumbnail = isValidImage(dbThumbnail);

              displaySrc = mediaIsVideo
                ? (hasValidDbThumbnail ? dbThumbnail : getVideoThumbnail(firstMedia.src))
                : firstMedia.src;
            }

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link 
                  href={`/articles/${article.slug || article.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-primary hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                      {displaySrc ? (
                        <>
                          <Image
                            src={displaySrc}
                            alt={firstMedia?.alt || article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized={mediaIsVideo}
                          />
                          {mediaIsVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <div className="bg-white/90 rounded-full p-4 shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-accent fill-accent" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : mediaIsVideo ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="bg-white/20 rounded-full p-5 mb-3 backdrop-blur-sm">
                            <Video className="w-10 h-10 text-white" />
                          </div>
                          <span className="text-white text-sm font-medium opacity-80">مقال فيديو</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      
                      {article.featured && (
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="absolute top-4 right-4 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          مميز
                        </motion.div>
                      )}

                      {mediaIsVideo && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          فيديو
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2 flex-shrink-0">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm border-t pt-4">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article._count?.article_views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {article._count?.article_likes || 0}
                          </span>
                        </div>
                        <span className="text-accent font-bold group-hover:underline">
                          اقرأ المزيد ←
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
          <Link href={`/articles?search=${categoryName}`}>
            <button className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3">
              عرض جميع مقالات {categoryName}
              <BookOpen className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
