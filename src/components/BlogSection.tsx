'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, BookOpen, TrendingUp, Award, Tag, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOImage from '@/components/services/SEOImage';

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  src: string;
  alt?: string;
  title?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  mediaItems?: MediaItem[];
  tags?: { name: string }[];
  featured: boolean;
  views: number;
  likes: number;
}

const categories = [
  'الكل',
  'مظلات سيارات',
  'برجولات',
  'ساندوتش بانل',
  'تنسيق حدائق',
  'ترميم',
  'سواتر',
  'خيام ملكية',
  'بيوت شعر'
];

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // جلب المقالات من API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles?limit=9&sort=featured');
        const data = await response.json();
        
        if (data.success && data.articles) {
          setArticles(data.articles);
          // Articles fetched successfully
        }
      } catch (error) {
        console.error('❌ خطأ في جلب المقالات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'الكل' || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">جاري تحميل المقالات...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/10 text-accent rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            مدونة ديار جدة العالمية
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            اكتشف أحدث المقالات والنصائح المتخصصة في مجال المظلات والبرجولات والساندوتش بانل.
            خبراء ديار جدة العالمية يشاركونكم المعرفة والتجارب لمساعدتكم في اتخاذ القرارات الصحيحة
          </p>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">{articles.length}+</div>
            <div className="text-sm text-muted-foreground font-medium">مقال متخصص</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">15</div>
            <div className="text-sm text-muted-foreground font-medium">عام خبرة</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">9</div>
            <div className="text-sm text-muted-foreground font-medium">تخصصات مختلفة</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">جدة</div>
            <div className="text-sm text-muted-foreground font-medium">والمناطق المحيطة</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-8">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-2xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-right"
              />
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-white text-muted-foreground hover:bg-accent/10 hover:text-accent border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-primary flex items-center">
                <Award className="w-8 h-8 text-accent ml-3" />
                المقالات المميزة
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredArticles.slice(0, 3).map((article) => {
                const mainImage = article.mediaItems && article.mediaItems.length > 0 
                  ? article.mediaItems[0].src 
                  : '/uploads/mazallat-1.webp';

                return (
                  <article key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100">
                    {/* Article Image */}
                    <div className="relative h-56 overflow-hidden">
                      <SEOImage
                        src={mainImage}
                        alt={article.mediaItems?.[0]?.alt || article.title}
                        projectTitle={article.title}
                        projectCategory={article.category}
                        width={800}
                        height={560}
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        showWatermark={true}
                        watermarkPosition="bottom-right"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        مميز
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-primary shadow-lg">
                        {article.category}
                      </div>

                      {/* Article Stats Overlay */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-4 space-x-reverse text-white/90 text-sm">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full ml-2" />
                          {article.views} مشاهدة
                        </span>
                        <span>{article.likes} إعجاب</span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-primary mb-3 line-clamp-2 leading-tight hover:text-accent transition-colors duration-300">
                        {article.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{article.author || 'فريق ديار جدة العالمية'}</span>
                        </div>
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          <span className="bg-gray-100 px-2 py-1 rounded">{article.readTime} دقائق</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:from-accent/10 hover:to-accent/5 hover:text-accent transition-all duration-300 cursor-pointer">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More Button */}
                      <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 font-medium">
                        <Link href={`/articles/${article.id}`}>
                          <span>اقرأ المقال كاملاً</span>
                          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-primary mb-8 text-center">أحدث المقالات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const mainImage = article.mediaItems && article.mediaItems.length > 0 
                  ? article.mediaItems[0].src 
                  : '/uploads/mazallat-1.webp';

                return (
                  <article key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100">
                    {/* Article Image */}
                    <div className="relative h-44 overflow-hidden">
                      <SEOImage
                        src={mainImage}
                        alt={article.mediaItems?.[0]?.alt || article.title}
                        projectTitle={article.title}
                        projectCategory={article.category}
                        width={600}
                        height={440}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        showWatermark={true}
                        watermarkPosition="bottom-right"
                      />
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-primary shadow-md">
                        {article.category}
                      </div>
                      {article.featured && (
                        <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded-md text-xs font-bold">
                          مميز
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-primary mb-2 line-clamp-2 hover:text-accent transition-colors duration-300">
                        {article.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 border-t border-gray-100 pt-3">
                        <span className="font-medium">{article.author || 'فريق ديار جدة العالمية'}</span>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span>{article.readTime} دقائق</span>
                          <span className="text-green-600">• {article.views}</span>
                        </div>
                      </div>

                      <Button asChild variant="outline" size="sm" className="w-full hover:bg-accent hover:text-white transition-all duration-300">
                        <Link href={`/articles/${article.id}`}>
                          اقرأ المزيد
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">لا توجد مقالات متاحة حالياً</p>
          </div>
        )}

        {/* Enhanced Newsletter Subscription */}
        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-3xl p-10 text-center border border-accent/20 shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/10 text-accent rounded-full mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-4">
            ابق على اطلاع بأحدث المقالات
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            اشترك في نشرتنا الإخبارية لتصلك أحدث المقالات والنصائح المتخصصة
            في مجال المظلات والبرجولات والساندوتش بانل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-right"
            />
            <Button className="px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              اشتراك مجاني
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>

        {/* Enhanced CTA to Blog Page */}
        <div className="text-center mt-16">
          <Button asChild size="lg" className="text-xl px-12 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent">
            <Link href="/articles" className="flex items-center space-x-3 space-x-reverse">
              <span>استكشف جميع المقالات</span>
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <p className="text-muted-foreground mt-4 text-lg">
            أكثر من {articles.length} مقال متخصص في انتظارك
          </p>
        </div>
      </div>
    </section>
  );
}
