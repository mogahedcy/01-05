'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, SORT_OPTIONS } from '@/constants/projectCategories';

interface ProjectFiltersProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  showSearch?: boolean;
  showStatus?: boolean;
  showCategory?: boolean;
  showSort?: boolean;
  className?: string;
}

export function ProjectFilters({
  searchTerm = '',
  onSearchChange,
  selectedStatus = 'all',
  onStatusChange,
  selectedCategory = 'all',
  onCategoryChange,
  sortBy = 'newest',
  onSortChange,
  showSearch = true,
  showStatus = true,
  showCategory = true,
  showSort = true,
  className = ''
}: ProjectFiltersProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border space-y-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في المشاريع..."
              className="pr-10"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4">
          {/* Status Filter */}
          {showStatus && onStatusChange && (
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              <option value="all">جميع الحالات</option>
              {PROJECT_STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          {showCategory && onCategoryChange && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
            >
              <option value="all">جميع الفئات</option>
              {PROJECT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}

          {/* Sort Filter */}
          {showSort && onSortChange && (
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

// مكون منفصل لاختيار الفئة في النماذج
interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  required = false,
  placeholder = "اختر الفئة",
  className = ""
}: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      required={required}
    >
      <option value="">{placeholder}</option>
      {PROJECT_CATEGORIES.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}