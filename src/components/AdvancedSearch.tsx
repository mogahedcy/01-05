'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, Calendar, User, Clock, Tag, Star, Brain, Zap, X, Bookmark, BookmarkCheck, TrendingUp, Eye, Heart, SortAsc, SortDesc, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  rating: number;
  commentsCount: number;
  keywords: string[];
  searchScore?: number;
}

interface AdvancedSearchProps {
  articles: Article[];
  onSearchResults: (results: Article[]) => void;
  className?: string;
}

const categories = [
  'الكل',
  'مظلات سيارات',
  'سواتر',
  'خيم ملكية',
  'بيوت شعر ملكي',
  'برجولات',
  'تنسيق حدائق',
  'هناجر',
  'شبوك',
  'قراميد',
  'ساندوتش بانل'
];

const authors = [
  'الكل',
  'فريق ديار جدة العالمية',
  'المهندس أحمد الديار',
  'أستاذ التراث عبدالله',
  'أخصائي التنسيق فيصل',
  'خبير الساندوتش بانل',
  'مهندس الترميم'
];

const sortOptions = [
  { value: 'relevance', label: 'الأكثر صلة', icon: Brain },
  { value: 'date', label: 'الأحدث', icon: Calendar },
  { value: 'views', label: 'الأكثر مشاهدة', icon: Eye },
  { value: 'likes', label: 'الأكثر إعجاباً', icon: Heart },
  { value: 'rating', label: 'الأعلى تقييماً', icon: Star },
  { value: 'readTime', label: 'وقت القراءة', icon: Clock }
];

export default function AdvancedSearch({ articles, onSearchResults, className = '' }: AdvancedSearchProps) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedAuthor, setSelectedAuthor] = useState('الكل');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedReadTime, setSelectedReadTime] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedSearches');
      const history = localStorage.getItem('searchHistory');
      if (saved) setSavedSearches(JSON.parse(saved));
      if (history) setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Perform search function
  const performSearch = useCallback((query: string) => {
    setIsSearching(true);

    // Get all tags from articles for filtering
    const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

    let filteredArticles = [...articles];

    // Apply text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

      filteredArticles = filteredArticles.map(article => {
        let score = 0;
        const searchableText = `${article.title} ${article.excerpt} ${article.content} ${article.tags.join(' ')} ${article.keywords.join(' ')}`.toLowerCase();

        // Calculate relevance score
        for (const term of searchTerms) {
          if (article.title.toLowerCase().includes(term)) score += 10;
          if (article.category.toLowerCase().includes(term)) score += 8;
          if (article.excerpt.toLowerCase().includes(term)) score += 5;
          if (article.keywords.some(keyword => keyword.toLowerCase().includes(term))) score += 7;
          if (article.tags.some(tag => tag.toLowerCase().includes(term))) score += 6;
          if (searchableText.includes(term)) score += 3;
        }

        // Boost featured articles
        if (article.featured) score += 2;
        if (article.views > 1000) score += 1;

        return { ...article, searchScore: score };
      }).filter(article => article.searchScore && article.searchScore > 0);
    }

    // Apply category filter
    if (selectedCategory !== 'الكل') {
      filteredArticles = filteredArticles.filter(article => article.category === selectedCategory);
    }

    // Apply author filter
    if (selectedAuthor !== 'الكل') {
      filteredArticles = filteredArticles.filter(article => article.author === selectedAuthor);
    }

    // Apply date filter
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filteredArticles = filteredArticles.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate >= filterDate;
      });
    }

    // Apply read time filter
    if (selectedReadTime) {
      const [min, max] = selectedReadTime.split('-').map(Number);
      filteredArticles = filteredArticles.filter(article => {
        const readTime = Number.parseInt(article.readTime);
        return readTime >= min && readTime <= max;
      });
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'views':
        filteredArticles.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        filteredArticles.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filteredArticles.sort((a, b) => b.rating - a.rating);
        break;
      case 'readTime':
        filteredArticles.sort((a, b) => Number.parseInt(a.readTime) - Number.parseInt(b.readTime));
        break;
      case 'relevance':
      default:
        if (query.trim()) {
          filteredArticles.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
        } else {
          // Default sort by date for non-search results
          filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        break;
    }

    onSearchResults(filteredArticles);
    setIsSearching(false);

    // Save to search history
    if (query.trim() && typeof window !== 'undefined') {
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  }, [articles, selectedCategory, selectedAuthor, selectedDate, selectedReadTime, sortBy, selectedTags, onSearchResults, searchHistory]);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [performSearch]);

  // Perform search whenever search parameters change
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      performSearch('');
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCategory, selectedAuthor, selectedDate, selectedReadTime, sortBy, selectedTags, debouncedSearch, performSearch]);

  // Get all unique tags from articles
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

  // Generate search suggestions
  const generateSuggestions = () => {
    if (!searchQuery) return [];

    const suggestions = [];
    const query = searchQuery.toLowerCase();

    // Article title suggestions
    articles.forEach(article => {
      if (article.title.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'title',
          text: article.title,
          category: article.category
        });
      }
    });

    // Tag suggestions
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'tag',
          text: tag,
          category: 'تاغ'
        });
      }
    });

    // Category suggestions
    categories.forEach(category => {
      if (category !== 'الكل' && category.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          text: category,
          category: 'فئة'
        });
      }
    });

    return suggestions.slice(0, 8);
  };

  const suggestions = generateSuggestions();

  // Save current search
  const saveCurrentSearch = () => {
    if (!searchQuery.trim()) return;

    const searchData = {
      query: searchQuery,
      category: selectedCategory,
      author: selectedAuthor,
      tags: selectedTags,
      timestamp: new Date().toISOString()
    };

    const searchString = JSON.stringify(searchData);
    const newSaved = [searchString, ...savedSearches.filter(s => s !== searchString)].slice(0, 5);
    setSavedSearches(newSaved);

    if (typeof window !== 'undefined') {
      localStorage.setItem('savedSearches', JSON.stringify(newSaved));
    }
  };

  // Load saved search
  const loadSavedSearch = (savedSearchString: string) => {
    try {
      const searchData = JSON.parse(savedSearchString);
      setSearchQuery(searchData.query);
      setSelectedCategory(searchData.category);
      setSelectedAuthor(searchData.author);
      setSelectedTags(searchData.tags || []);
    } catch (error) {
      console.error('Error loading saved search:', error);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('الكل');
    setSelectedAuthor('الكل');
    setSelectedDate('');
    setSelectedReadTime('');
    setSortBy('relevance');
    setSelectedTags([]);
    setShowSuggestions(false);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Advanced Search Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">البحث الذكي المتقدم</h2>
              <p className="text-sm text-gray-600">اعثر على المقالات المناسبة بسرعة ودقة</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">مدعوم بالذكاء الاصطناعي</span>
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="ابحث في المقالات..."
              className="w-full pr-12 pl-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (searchQuery || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 max-h-80 overflow-y-auto">
              {/* Current suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">اقتراحات</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${suggestion.type}-${suggestion.text}-${index}`}
                      onClick={() => {
                        setSearchQuery(suggestion.text);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded-md flex items-center justify-between"
                    >
                      <span>{suggestion.text}</span>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="border-t border-gray-100 p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">عمليات البحث السابقة</div>
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={`history-${historyItem}-${index}`}
                      onClick={() => {
                        setSearchQuery(historyItem);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded-md flex items-center space-x-2 space-x-reverse"
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{historyItem}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <Filter className="w-4 h-4" />
            <span>فلاتر متقدمة</span>
          </Button>

          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveCurrentSearch}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Bookmark className="w-4 h-4" />
              <span>حفظ البحث</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <RotateCcw className="w-4 h-4" />
            <span>مسح الفلاتر</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">الفئة</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">المؤلف</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {authors.map((author) => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ترتيب حسب</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ النشر من</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Read Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">وقت القراءة (دقائق)</label>
              <select
                value={selectedReadTime}
                onChange={(e) => setSelectedReadTime(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">الكل</option>
                <option value="1-3">1-3 دقائق</option>
                <option value="4-7">4-7 دقائق</option>
                <option value="8-15">8-15 دقائق</option>
                <option value="16-30">أكثر من 15 دقيقة</option>
              </select>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">التاغات</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Tag className="w-3 h-3 ml-1 inline" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-gray-100">
          <div className="flex items-center space-x-2 space-x-reverse mb-3">
            <BookmarkCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">عمليات البحث المحفوظة</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((savedSearch, index) => {
              const searchData = JSON.parse(savedSearch);
              return (
                <button
                  key={`saved-search-${index}`}
                  onClick={() => loadSavedSearch(savedSearch)}
                  className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                >
                  {searchData.query}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(selectedCategory !== 'الكل' || selectedAuthor !== 'الكل' || selectedTags.length > 0 || selectedDate || selectedReadTime) && (
        <div className="p-4 bg-amber-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-amber-900">الفلاتر النشطة</span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-amber-700 hover:text-amber-900 underline"
            >
              مسح الكل
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'الكل' && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                الفئة: {selectedCategory}
              </Badge>
            )}
            {selectedAuthor !== 'الكل' && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                المؤلف: {selectedAuthor}
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-amber-100 text-amber-800">
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="mr-1 hover:text-amber-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedDate && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                من تاريخ: {selectedDate}
              </Badge>
            )}
            {selectedReadTime && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                وقت القراءة: {selectedReadTime} دقائق
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Search Status */}
      {isSearching && (
        <div className="p-4 text-center">
          <div className="inline-flex items-center space-x-2 space-x-reverse text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
            <span>جارٍ البحث...</span>
          </div>
        </div>
      )}
    </div>
  );
}
