'use client';

import Link from 'next/link';
import { Image as ImageIcon, FileText, HelpCircle, Star, ArrowDown } from 'lucide-react';
import { useLocale } from 'next-intl';

interface ServiceContentNavigationProps {
  projectsCount: number;
  articlesCount: number;
  faqsCount: number;
  reviewsCount?: number;
}

export default function ServiceContentNavigation({
  projectsCount,
  articlesCount,
  faqsCount,
  reviewsCount = 0
}: ServiceContentNavigationProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const sections = [
    {
      id: 'projects',
      icon: ImageIcon,
      title: isRTL ? 'معرض الأعمال' : 'Projects Gallery',
      count: projectsCount,
      label: isRTL ? 'مشروع' : 'projects',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'articles',
      icon: FileText,
      title: isRTL ? 'المقالات' : 'Articles',
      count: articlesCount,
      label: isRTL ? 'مقالة' : 'articles',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'faqs',
      icon: HelpCircle,
      title: isRTL ? 'الأسئلة الشائعة' : 'FAQs',
      count: faqsCount,
      label: isRTL ? 'سؤال' : 'questions',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  // Add reviews section if there are reviews
  if (reviewsCount > 0) {
    sections.push({
      id: 'reviews',
      icon: Star,
      title: isRTL ? 'التقييمات' : 'Reviews',
      count: reviewsCount,
      label: isRTL ? 'تقييم' : 'reviews',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    });
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white py-8 border-y border-gray-200 sticky top-0 z-40 shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            {isRTL ? 'انتقل إلى:' : 'Jump to:'}
          </span>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${section.bgColor} border ${section.borderColor} hover:shadow-md transition-all duration-300 group`}
            >
              <section.icon className={`w-5 h-5 ${section.iconColor} group-hover:scale-110 transition-transform`} />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-primary">{section.title}</span>
                <span className="text-xs text-muted-foreground">
                  {section.count} {section.label}
                </span>
              </div>
              <ArrowDown className={`w-4 h-4 ${section.iconColor} group-hover:translate-y-1 transition-transform hidden md:block`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
