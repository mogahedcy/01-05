import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center space-x-2 space-x-reverse text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <Link 
        href="/" 
        className="flex items-center text-gray-600 hover:text-primary transition-colors"
        aria-label="الرئيسية"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 space-x-reverse">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.current ? (
            <span className="text-primary font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
