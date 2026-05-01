'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
  Eye,
  Heart,
  Star,
  Calendar,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  featured: boolean;
  views: number;
  likes: number;
  rating: number;
  commentsCount: number;
  mediaCount: number;
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
  }>;
  tags: Array<{ name: string }>;
}

interface Stats {
  total: number;
  featured: number;
  categories: Array<{ category: string; _count: { category: number } }>;
}

const getCategories = (isEn: boolean) => [
  { value: 'all', label: isEn ? 'All Articles' : 'جميع المقالات' },
  { value: 'مظلات', label: isEn ? 'Car Shades' : 'مظلات السيارات' },
  { value: 'برجولات', label: isEn ? 'Garden Pergolas' : 'برجولات الحدائق' },
  { value: 'تنسيق حدائق', label: isEn ? 'Landscaping' : 'تنسيق الحدائق' },
  { value: 'سواتر', label: isEn ? 'Fences & Walls' : 'سواتر وأسوار' },
  { value: 'ساندوتش بانل', label: isEn ? 'Sandwich Panel' : 'ساندوتش بانل' },
  { value: 'خيام ملكية', label: isEn ? 'Royal Tents' : 'خيام ملكية' },
  { value: 'بيوت شعر', label: isEn ? 'Hair Houses' : 'بيوت شعر' }
];

const getSortOptions = (isEn: boolean) => [
  { value: 'newest', label: isEn ? 'Newest First' : 'الأحدث أولاً' },
  { value: 'oldest', label: isEn ? 'Oldest First' : 'الأقدم أولاً' },
  { value: 'featured', label: isEn ? 'Featured First' : 'المميزة أولاً' },
  { value: 'popular', label: isEn ? 'Most Viewed' : 'الأكثر مشاهدة' },
  { value: 'most-liked', label: isEn ? 'Most Liked' : 'الأكثر إعجاباً' },
  { value: 'alphabetical', label: isEn ? 'Alphabetical' : 'أبجدياً' }
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}م`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}ك`;
  return num.toString();
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ArticlesPageClient({ locale = 'ar' }: { locale?: string }) {
  const isEn = locale === 'en';
  const categories = getCategories(isEn);
  const sortOptions = getSortOptions(isEn);
  
  const t = {
    title: isEn ? 'Articles Archive' : 'أرشيف المقالات',
    desc: isEn ? 'Discover the latest articles and specialized tips from Aldeyar Global experts' : 'اكتشف أحدث المقالات والنصائح المتخصصة من خبراء ديار جدة العالمية',
    totalArticles: isEn ? 'Total Articles' : 'إجمالي المقالات',
    featuredArticles: isEn ? 'Featured Articles' : 'مقالات مميزة',
    categories: isEn ? 'Categories' : 'تصنيفات',
    qualityContent: isEn ? 'Quality Content' : 'جودة المحتوى',
    searchPlaceholder: isEn ? 'Search articles...' : 'ابحث في المقالات...',
    filter: isEn ? 'Filter' : 'فلترة',
    categoryLabel: isEn ? 'Category' : 'التصنيف',
    sortByLabel: isEn ? 'Sort By' : 'ترتيب حسب',
    featuredTitle: isEn ? 'Featured Articles' : 'المقالات المميزة',
    allArticlesTitle: isEn ? 'All Articles' : 'جميع المقالات',
    noArticlesFound: isEn ? 'No articles found' : 'لا توجد مقالات',
    tryChangingFilters: isEn ? 'Try changing filters or search terms' : 'جرب تغيير الفلاتر أو البحث',
    readMore: isEn ? 'Read More' : 'اقرأ المزيد',
    featuredBadge: isEn ? 'Featured' : 'مميز',
    minute: isEn ? 'min' : 'دقيقة',
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, featured: 0, categories: [] });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '50',
        sort: sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles || []);
        setStats({
          total: data.stats?.total || data.articles?.length || 0,
          featured: data.stats?.featured || 0,
          categories: data.stats?.categories || []
        });
      }
    } catch (error) {
      console.error('خطأ في جلب المقالات:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
            {t.desc}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.total}</div>
            <div className="text-sm text-muted-foreground">{t.totalArticles}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.featured}</div>
            <div className="text-sm text-muted-foreground">{t.featuredArticles}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.categories.length}</div>
            <div className="text-sm text-muted-foreground">{t.categories}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-muted-foreground">{t.qualityContent}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 ${isEn ? 'pl-10' : 'pr-10'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                <Search className={`absolute ${isEn ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className={`w-4 h-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
                {t.filter}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.categoryLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.sortByLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
                  <TrendingUp className={`w-8 h-8 text-accent ${isEn ? 'mr-3' : 'ml-3'}`} />
                  {t.featuredTitle}
                </h2>

                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} featured locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Articles */}
            {regularArticles.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
                  <BookOpen className={`w-8 h-8 text-accent ${isEn ? 'mr-3' : 'ml-3'}`} />
                  {t.allArticlesTitle}
                </h2>

                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {regularArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {articles.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">{t.noArticlesFound}</h3>
                <p className="text-gray-500">{t.tryChangingFilters}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, featured = false, locale = 'ar' }: { article: Article; featured?: boolean; locale?: string }) {
  const isEn = locale === 'en';
  const mainImage = article.mediaItems?.[0]?.src || '/uploads/mazallat-1.webp';

  return (
    <Link href={`/articles/${article.slug || article.id}`} className="group">
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={mainImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAgIBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amk2la/HbvRayrjrSSFpJJJHkd3Y82ZJJJ5kk+SSSf//Z"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {isEn ? 'Featured' : 'مميز'}
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-primary shadow-lg">
            {article.category}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <User className={`w-4 h-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className={`w-4 h-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                {article.readTime} {isEn ? 'min' : 'دقيقة'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <Eye className={`w-4 h-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                {formatNumber(article.views)}
              </div>
              <div className="flex items-center">
                <Heart className={`w-4 h-4 ${isEn ? 'mr-1' : 'ml-1'}`} />
                {formatNumber(article.likes)}
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(article.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}

          <Button className="w-full group-hover:bg-accent group-hover:text-white transition-all duration-300 font-medium">
            <span>{isEn ? 'Read More' : 'اقرأ المزيد'}</span>
            {isEn ? (
              <ArrowLeft className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 rotate-180" />
            ) : (
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </article>
    </Link>
  );
}
