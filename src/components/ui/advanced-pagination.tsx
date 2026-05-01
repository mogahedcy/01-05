'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
  compact?: boolean;
}

export function AdvancedPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showItemsPerPage = true,
  onItemsPerPageChange,
  className,
  compact = false
}: AdvancedPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show around current page

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show ellipsis if needed
      if (currentPage > delta + 2) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1 && !compact) {
    return null;
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Items info */}
      <div className="text-sm text-gray-600">
        عرض {startItem} إلى {endItem} من أصل {totalItems} عنصر
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Items per page selector */}
        {showItemsPerPage && onItemsPerPageChange && !compact && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">عرض:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        )}

        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          {!compact && <span className="hidden sm:inline mr-1">السابق</span>}
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="px-2 py-1">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "min-w-[2.5rem]",
                    currentPage === page && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {!compact && <span className="hidden sm:inline ml-1">التالي</span>}
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default AdvancedPagination;
