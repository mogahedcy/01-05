'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Bookmark,
  Search,
  X,
  Plus,
  Clock,
  Star,
  Trash2,
  Edit2,
  Save
} from 'lucide-react';

type SearchFilters = Partial<Record<string, string>>;

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
}

export default function SavedSearches() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // تحميل البحثات المحفوظة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      try {
        const searches = JSON.parse(saved).map((search: SavedSearch) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: new Date(search.lastUsed)
        }));
        setSavedSearches(searches);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  // حفظ البحثات في localStorage
  const saveTOLocalStorage = (searches: SavedSearch[]) => {
    localStorage.setItem('savedSearches', JSON.stringify(searches));
  };

  // حفظ بحث جديد
  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;

    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query: searchParams.get('q') || '',
      filters: Object.fromEntries(searchParams.entries()),
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 0
    };

    const updated = [newSearch, ...savedSearches.slice(0, 9)];
    setSavedSearches(updated);
    saveTOLocalStorage(updated);
    setSearchName('');
    setShowSaveForm(false);
  };

  // تطبيق بحث محفوظ
  const applySavedSearch = (search: SavedSearch) => {
    const updatedSearch = {
      ...search,
      lastUsed: new Date(),
      useCount: search.useCount + 1
    };

    const updated = savedSearches.map(s => 
      s.id === search.id ? updatedSearch : s
    );
    setSavedSearches(updated);
    saveTOLocalStorage(updated);

    // تطبيق المعايير على URL
    const params = new URLSearchParams(search.filters);
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  // حذف بحث محفوظ
  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    saveTOLocalStorage(updated);
  };

  // تحرير اسم البحث
  const updateSearchName = (id: string, newName: string) => {
    const updated = savedSearches.map(s => 
      s.id === id ? { ...s, name: newName } : s
    );
    setSavedSearches(updated);
    saveTOLocalStorage(updated);
    setEditingId(null);
  };

  const formatFilters = (filters: SearchFilters): string[] => {
    const active: string[] = [];
    if (filters.category) active.push(filters.category);
    if (filters.location) active.push(filters.location);
    if (filters.featured === 'true') active.push('مميز');
    if (filters.hasVideo === 'true') active.push('فيديو');
    return active;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSaved(!showSaved)}
        className="flex items-center gap-2"
      >
        <Bookmark className="w-4 h-4" />
        البحثات المحفوظة
        {savedSearches.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {savedSearches.length}
          </Badge>
        )}
      </Button>

      {showSaved && (
        <Card className="absolute top-full left-0 sm:right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">البحثات المحفوظة</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveForm(true)}
                  className="text-primary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaved(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* نموذج حفظ بحث جديد */}
            {showSaveForm && (
              <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="اسم البحث..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveCurrentSearch();
                      }
                    }}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={saveCurrentSearch} disabled={!searchName.trim()}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveForm(false)}
                  className="text-xs text-gray-500"
                >
                  إلغاء
                </Button>
              </div>
            )}

            {/* قائمة البحثات المحفوظة */}
            {savedSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">لا توجد بحثات محفوظة</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveForm(true)}
                  className="mt-2 text-xs"
                >
                  احفظ البحث الحالي
                </Button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {savedSearches
                  .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
                  .map((search) => (
                  <div
                    key={search.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => applySavedSearch(search)}>
                        {editingId === search.id ? (
                          <Input
                            defaultValue={search.name}
                            onBlur={(e) => updateSearchName(search.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateSearchName(search.id, (e.target as HTMLInputElement).value);
                              }
                            }}
                            className="text-sm font-medium"
                            autoFocus
                          />
                        ) : (
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {search.name}
                          </h4>
                        )}

                        {search.query && (
                          <p className="text-xs text-gray-600 mb-2">
                            البحث: "{search.query}"
                          </p>
                        )}

                        {/* الفلاتر النشطة */}
                        {formatFilters(search.filters).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {formatFilters(search.filters).map((filter, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {filter}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {search.lastUsed.toLocaleDateString('ar-SA')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {search.useCount}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(search.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedSearch(search.id);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* إحصائيات */}
            {savedSearches.length > 0 && (
              <div className="pt-3 border-t text-xs text-gray-500 text-center">
                {savedSearches.length} بحث محفوظ •{' '}
                {savedSearches.reduce((sum, s) => sum + s.useCount, 0)} استخدام
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
