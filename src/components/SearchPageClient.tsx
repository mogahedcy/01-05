'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResults from '@/components/SearchResults';
import AdvancedFilters from '@/components/AdvancedFilters';
import SavedSearches from '@/components/SavedSearches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

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

interface FiltersState {
  category: string;
  location: string;
  featured: boolean | null;
  minRating: number;
  dateRange: string;
  hasVideo: boolean | null;
  priceRange: string;
}

const SORT_VALUES = ['relevance', 'date', 'name', 'views', 'rating'] as const;
type SortOption = typeof SORT_VALUES[number];
const SEARCH_TYPE_VALUES = ['all', 'projects', 'articles', 'faqs'] as const;
type SearchType = typeof SEARCH_TYPE_VALUES[number];

export default function SearchPageClient({ locale }: { locale: string }) {
  const isEn = locale === 'en';
  const isArabic = locale === 'ar';
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryParam = searchParams?.get('q') || '';
  
  // Initialize with defaults to match server render
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [type, setType] = useState<SearchType>('all');
  const [inputSearch, setInputSearch] = useState('');
  
  const [filters, setFilters] = useState<FiltersState>({
    category: '',
    location: '',
    featured: null,
    minRating: 0,
    dateRange: '',
    hasVideo: null,
    priceRange: ''
  });

  const [isMounted, setIsMounted] = useState(false);

  // Read searchParams after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (searchParams) {
      setQuery(searchParams.get('q') || '');
      setInputSearch(searchParams.get('q') || '');
      setType((searchParams.get('type') as any) || 'all');
      setSortBy((searchParams.get('sort') as any) || 'relevance');
      setFilters(prev => ({
        ...prev,
        category: searchParams.get('category') || '',
        location: searchParams.get('location') || ''
      }));
    }
  }, [searchParams]);

  const limit = 12;

  const performSearch = useCallback(async (
    searchQuery: string,
    currentFilters: FiltersState,
    pageNum: number,
    replaceResults = false
  ) => {
    // Removed the early return to allow fetching all results when search query is empty

    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ 
        q: searchQuery, 
        page: String(pageNum), 
        limit: String(limit), 
        sortBy, 
        type,
        locale
      });
      
      if (currentFilters.category) queryParams.set('category', currentFilters.category);
      if (currentFilters.location) queryParams.set('location', currentFilters.location);
      if (currentFilters.minRating > 0) queryParams.set('minRating', String(currentFilters.minRating));
      if (currentFilters.featured !== null) queryParams.set('featured', String(currentFilters.featured));

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        if (replaceResults) {
          setResults(data.results || []);
        } else {
          setResults(prev => [...prev, ...(data.results || [])]);
        }
        setHasMore(data.hasMore);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [type, sortBy, locale]);

  useEffect(() => {
    setPage(1);
    performSearch(query, filters, 1, true);
  }, [query, type, sortBy, filters.category, filters.location, filters.minRating, filters.featured, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams(searchParams?.toString() || '');
    if (inputSearch) sp.set('q', inputSearch);
    else sp.delete('q');
    router.push(`${pathname}?${sp.toString()}`);
  };

  const handleFiltersChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const categories = isArabic ? [
    { id: 'مظلات سيارات', name: 'مظلات سيارات', icon: '🚗' },
    { id: 'برجولات', name: 'برجولات', icon: '🏛️' },
    { id: 'سواتر', name: 'سواتر', icon: '🧱' },
    { id: 'ساندوتش بانل', name: 'ساندوتش بانل', icon: '🏗️' },
    { id: 'تنسيق حدائق', name: 'تنسيق حدائق', icon: '🌿' },
    { id: 'بيوت شعر', name: 'بيوت شعر', icon: '⛺' },
    { id: 'خيام ملكية', name: 'خيام ملكية', icon: '🏕️' },
    { id: 'ترميم', name: 'ترميم', icon: '🔨' },
  ] : [
    { id: 'مظلات سيارات', name: 'Car Shades', icon: '🚗' },
    { id: 'برجولات', name: 'Pergolas', icon: '🏛️' },
    { id: 'سواتر', name: 'Screens', icon: '🧱' },
    { id: 'ساندوتش بانل', name: 'Sandwich Panel', icon: '🏗️' },
    { id: 'تنسيق حدائق', name: 'Landscaping', icon: '🌿' },
    { id: 'بيوت شعر', name: 'Hair Houses', icon: '⛺' },
    { id: 'خيام ملكية', name: 'Royal Tents', icon: '🏕️' },
    { id: 'ترميم', name: 'Renovation', icon: '🔨' },
  ];

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": isArabic ? (query ? `نتائج البحث عن "${query}"` : 'البحث في ديار جدة') : (query ? `Search results for "${query}"` : 'Search Deyar Jeddah'),
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": results.map((result, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": result.type === 'project' ? 'CreativeWork' : result.type === 'article' ? 'Article' : 'Question',
          "name": result.title,
          "url": `https://www.deyarsu.com${result.url}`,
          "description": result.description
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Search Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-blue-900 mb-6 tracking-tight">
            {isEn ? 'Search Results' : 'نتائج البحث'}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden focus-within:border-blue-500 transition-all">
              <SearchIcon className="w-6 h-6 text-gray-400 ml-4 shrink-0" />
              <Input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder={isEn ? 'What are you looking for?' : 'عن ماذا تبحث اليوم؟'}
                className="border-none focus-visible:ring-0 text-lg h-14 w-full px-2"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-none">
                {isEn ? 'Search' : 'بحث'}
              </Button>
            </div>
          </form>

          {query && (
            <p className="text-gray-500 mt-6 font-medium bg-white inline-block px-6 py-2 rounded-full shadow-sm border border-gray-100">
              {isEn ? `Showing ${results.length} of ${total} results for ` : `نعرض ${results.length} من أصل ${total} نتيجة لـ `}
              <span className="text-blue-600 font-bold">"{query}"</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1 space-y-8">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              isArabic={isArabic}
            />
            <SavedSearches isArabic={isArabic} />
          </aside>

          <div className="lg:col-span-3">
            <SearchResults results={results} isLoading={loading && page === 1} searchQuery={query} locale={locale} />
            
            {hasMore && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => { const next = page + 1; setPage(next); performSearch(query, filters, next, false); }} 
                  variant="outline"
                  disabled={loading}
                  className="px-10 py-6 h-auto text-lg font-bold border-2 border-blue-100 text-blue-600 hover:bg-blue-50 rounded-2xl"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> {isEn ? 'Loading...' : 'جاري التحميل...'}</>
                  ) : (
                    isEn ? 'Load More Results' : 'تحميل المزيد من النتائج'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
