'use client';

import Link from 'next/link';
import { Calendar, ArrowLeft, Eye, Heart, Clock, Star, Grid, Loader2, Layers, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResultItem {
  id: string | number;
  type: 'project' | 'article' | 'faq';
  title: string;
  description: string;
  category: string;
  image: string;
  url: string;
  createdAt: string | Date;
  views: number;
  likes: number;
  rating: number;
  featured: boolean;
  author: string;
  authorAvatar: string;
  readTime: string;
  tags: string[];
  source: 'project' | 'article' | 'faq';
}

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  searchQuery: string;
  viewType?: 'grid' | 'list';
  locale: string;
}

function highlight(text: string, query: string) {
  if (!query || !text) return text;
  try {
    const parts = text.split(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  } catch {
    return text;
  }
}

export default function SearchResults({ results, isLoading, searchQuery, viewType = 'grid', locale }: SearchResultsProps) {
  const isEn = locale === 'en';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{isEn ? 'Searching...' : 'جاري البحث...'}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Grid className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{isEn ? 'No results' : 'لا توجد نتائج'}</h3>
        <p className="text-gray-600">{isEn ? 'No results found for your search query.' : 'لم نجد أي نتائج تطابق معايير البحث الخاصة بك.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
          {isEn ? `Search Results (${results.length} items)` : `نتائج البحث (${results.length} عنصر)`}
        </h2>
      </div>

      {/* Results Grid/List */}
      <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {results.map((item) => (
          <Link
            key={`search-result-${item.id}-${item.type}`}
            href={item.url}
            className="group"
          >
            <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col shadow-sm">
              {/* Image or FAQ Badge */}
              {item.type === 'faq' ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border-b border-gray-100 flex items-center justify-center min-h-[192px]">
                  <div className="text-center">
                    <div className="p-4 bg-blue-500 rounded-2xl inline-block mb-3 shadow-lg">
                      <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-blue-900">{isEn ? 'FAQ' : 'سؤال شائع'}</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || '/placeholder.webp'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-blue-600 text-white border-none px-3 py-1">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-none flex items-center gap-1 px-3 py-1">
                      <Layers className="w-3 h-3" />
                      {item.type === 'project' ? (isEn ? 'Project' : 'مشروع') : (isEn ? 'Article' : 'مقال')}
                    </Badge>
                    {item.featured && (
                      <Badge className="bg-amber-500 text-white border-none px-3 py-1">{isEn ? 'Featured' : 'مميز'}</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {highlight(item.title, searchQuery)}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {highlight(item.description, searchQuery)}
                </p>

                {/* Meta Info */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.authorAvatar || '/logo.png'}
                        alt={item.author}
                        className="w-6 h-6 rounded-full border border-gray-100 shadow-sm"
                      />
                      <span className="font-medium text-gray-700">{item.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mx-1" />
                      {item.readTime}
                    </div>
                  </div>

                  {/* Stats & Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      {item.rating > 0 && (
                        <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          {item.rating}
                        </div>
                      )}
                      <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.views}
                      </div>
                    </div>
                    
                    <div className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-[-4px] transition-transform">
                      {isEn ? 'Read More' : 'اقرأ المزيد'}
                      <ArrowLeft className={`w-4 h-4 ${isEn ? 'rotate-180 mr-2' : 'ml-2'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
