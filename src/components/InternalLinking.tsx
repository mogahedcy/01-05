
'use client';

import { useMemo } from 'react';
import Link from 'next/link';

interface InternalLinkingProps {
  currentPage: string;
  category?: string;
  location?: string;
}

export default function InternalLinking({ currentPage, category, location }: InternalLinkingProps) {
  const serviceLinks = [
    { href: '/services/mazallat', text: 'مظلات السيارات', keywords: ['مظلات', 'سيارات'] },
    { href: '/services/pergolas', text: 'البرجولات', keywords: ['برجولات', 'حدائق'] },
    { href: '/services/sawater', text: 'السواتر', keywords: ['سواتر', 'خصوصية'] },
    { href: '/services/landscaping', text: 'تنسيق الحدائق', keywords: ['تنسيق', 'حدائق'] }
  ];

  const portfolioLinks = [
    { href: '/portfolio', text: 'معرض الأعمال', keywords: ['أعمال', 'مشاريع'] },
    { href: '/portfolio/reviews', text: 'آراء العملاء', keywords: ['آراء', 'تقييمات'] }
  ];

  const relevantLinks = useMemo(() => {
    const allLinks = [...serviceLinks, ...portfolioLinks];
    return allLinks.filter(link => 
      link.href !== currentPage &&
      (!category || !link.keywords.some(keyword => 
        category.toLowerCase().includes(keyword.toLowerCase())
      ))
    ).slice(0, 4);
  }, [currentPage, category]);

  if (relevantLinks.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-primary">
        قد يهمك أيضاً
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {relevantLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-accent hover:text-primary transition-colors text-sm font-medium"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
