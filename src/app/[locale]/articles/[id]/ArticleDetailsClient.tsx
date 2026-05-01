'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import ProtectedMedia from '@/components/ProtectedMedia';
import { generateCategoryBasedAlt, generateImageObjectSchema } from '@/lib/image-seo-utils';
import RelatedProjects from '@/components/RelatedProjects';
import { autoLinkHTMLString } from '@/components/AutoLinker';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  titleEn?: string | null;
  contentEn?: string | null;
  excerptEn?: string | null;
  author: string;
  category: string;
  featured: boolean;
  views: number;
  likes: number;
  rating: number;
  commentsCount: number;
  readTime: number;
  slug: string;
  publishedAt: string;
  mediaItems: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    src: string;
    thumbnail?: string;
    title?: string;
    alt?: string;
    caption?: string;
  }>;
  tags: Array<{ name: string }>;
}

interface Props {
  article: Article;
  locale?: string;
}

export default function ArticleDetailsClient({ article, locale = 'ar' }: Props) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes || 0);

  const isEn = locale === 'en';
  const isRTL = !isEn;
  const currentMedia = article.mediaItems?.[selectedMediaIndex] || article.mediaItems?.[0];

  const t = {
    backToArchive: isEn ? 'Back to Articles' : 'العودة إلى الأرشيف',
    featured: isEn ? 'Featured' : 'مميز',
    share: isEn ? 'Share' : 'مشاركة',
    linkCopied: isEn ? 'Link copied!' : 'تم نسخ الرابط!',
    minutesRead: isEn ? 'min read' : 'دقائق قراءة',
    views: isEn ? 'views' : 'مشاهدة',
    tags: isEn ? 'Tags' : 'الوسوم',
    likedArticle: isEn ? 'Did you enjoy this article?' : 'هل أعجبك المقال؟',
    discoverMore: isEn ? 'Discover more useful articles in our archive' : 'اكتشف المزيد من المقالات المفيدة في أرشيفنا',
    browseAll: isEn ? 'Browse All Articles' : 'تصفح جميع المقالات',
    imageOf: isEn ? 'Image' : 'صورة',
    of: isEn ? 'of' : 'من',
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/articles/${article.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like', action: 'toggle' })
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        if (typeof data.newCount === 'number') {
          setLikesCount(data.newCount);
        }
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isEn ? (article.titleEn || article.title) : article.title,
          text: isEn ? (article.excerptEn || article.excerpt) : article.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t.linkCopied);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const articlesPath = isEn ? '/en/articles' : '/articles';
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href={articlesPath} className="inline-flex items-center text-gray-600 hover:text-accent transition-colors">
            <BackArrow className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.backToArchive}
          </Link>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default" className="bg-accent text-white">
              {article.category}
            </Badge>
            {article.featured && (
              <Badge variant="secondary">
                {t.featured}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {isEn ? (article.titleEn || article.title) : article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{article.readTime} {t.minutesRead}</span>
            </div>
            <div className="flex items-center">
              <Eye className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{article.views} {t.views}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant={isLiked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.share}</span>
            </Button>
            <Button
              variant={isBookmarked ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex items-center gap-2"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </header>

        {/* Featured Image/Media */}
        {article.mediaItems && article.mediaItems.length > 0 && (
          <div className="mb-12">
            <ProtectedMedia className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px] md:h-[600px]">
                {currentMedia.type === 'IMAGE' ? (
                  <>
                    {(() => {
                      const optimizedAlt = currentMedia.alt ||
                        generateCategoryBasedAlt(
                          article.category,
                          article.title,
                          undefined,
                          selectedMediaIndex
                        );

                      const imageSchema = generateImageObjectSchema(
                        currentMedia.src,
                        {
                          alt: optimizedAlt,
                          title: currentMedia.title || article.title,
                          description: currentMedia.caption || article.excerpt,
                          keywords: [article.category, isEn ? 'Aldeyar Global Professionals' : 'ديار جدة العالمية', isEn ? 'Jeddah' : 'جدة', ...(article.tags?.map(tag => tag.name) || [])],
                          context: 'article'
                        },
                        `/articles/${article.slug || article.id}`
                      );

                      return (
                        <>
                          <Image
                            src={currentMedia.src}
                            alt={optimizedAlt}
                            title={currentMedia.title || article.title}
                            fill
                            className="object-cover"
                            priority
                          />
                          <WatermarkOverlay position="bottom-right" size="medium" opacity={0.7} />
                          <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                              __html: JSON.stringify(imageSchema)
                            }}
                          />
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <video
                    src={currentMedia.src}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {currentMedia.caption && (
                <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
                  {currentMedia.caption}
                </div>
              )}
            </ProtectedMedia>

            {/* Media Navigation */}
            {article.mediaItems.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMediaIndex(Math.max(0, selectedMediaIndex - 1))}
                  disabled={selectedMediaIndex === 0}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedMediaIndex + 1} {t.of} {article.mediaItems.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMediaIndex(Math.min(article.mediaItems.length - 1, selectedMediaIndex + 1))}
                  disabled={selectedMediaIndex === article.mediaItems.length - 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Thumbnails */}
            {article.mediaItems.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {article.mediaItems.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedMediaIndex === index ? 'border-accent scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={media.thumbnail || media.src}
                      alt={`${t.imageOf} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12 border-t-4 border-accent">
          <div
            className={`prose prose-lg md:prose-xl max-w-none 
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4 prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-primary
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-accent
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            ${isRTL 
              ? 'prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-accent prose-ul:list-disc prose-ul:pl-0 prose-ul:pr-6' 
              : 'prose-blockquote:border-l-4 prose-blockquote:border-r-0 prose-blockquote:border-accent prose-ul:list-disc prose-ul:pl-6 prose-ul:pr-0'
            }
            prose-blockquote:bg-gray-50 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-blockquote:italic
            prose-li:marker:text-accent prose-li:text-gray-700
            prose-img:rounded-xl prose-img:shadow-md
            transition-all duration-300`}
            dangerouslySetInnerHTML={{ 
              __html: autoLinkHTMLString(
                isEn ? (article.contentEn || article.content) : article.content,
                locale
              ) 
            }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Tag className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-accent`} />
              {t.tags}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Smart Internal Linking: Related Projects */}
        <RelatedProjects
          category={article.category}
          tags={article.tags}
          currentId={article.id}
        />

        {/* Related Articles CTA */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t.likedArticle}
          </h3>
          <p className="mb-6 text-lg opacity-90">
            {t.discoverMore}
          </p>
          <Link href={articlesPath}>
            <Button variant="secondary" size="lg">
              {t.browseAll}
              <BackArrow className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
