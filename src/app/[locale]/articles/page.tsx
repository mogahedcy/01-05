import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArticlesPageClient from './ArticlesPageClient';
import StructuredDataScript from '@/components/StructuredDataScript';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic 
      ? 'أرشيف المقالات | ديار جدة العالمية - مقالات ونصائح في المظلات والبرجولات'
      : 'Articles Archive | Aldeyar Professionals - Tips on Shades and Pergolas',
    description: isArabic
      ? 'اكتشف أحدث المقالات والنصائح حول المظلات، البرجولات، السواتر، وتنسيق الحدائق من خبراء ديار جدة العالمية في جدة.'
      : 'Discover the latest articles and tips about shades, pergolas, fences, and landscaping from Deyar Jeddah experts in Jeddah.',
    keywords: isArabic
      ? 'مقالات مظلات, نصائح برجولات, مقالات تنسيق حدائق, مظلات جدة, برجولات جدة, ديار جدة العالمية'
      : 'shades articles, pergolas tips, landscaping articles, Jeddah shades, Jeddah pergolas, Aldeyar Professionals',
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah' }],
    creator: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
    publisher: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
    robots: 'index, follow',
    openGraph: {
      title: isArabic 
        ? 'أرشيف المقالات | ديار جدة العالمية'
        : 'Articles Archive | Aldeyar Professionals',
      description: isArabic
        ? 'اكتشف مقالاتنا المتخصصة في المظلات والبرجولات والسواتر وتنسيق الحدائق'
        : 'Discover our specialized articles on shades, pergolas, fences, and landscaping',
      url: `https://www.deyarsu.com${locale === 'en' ? '/en' : ''}/articles`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
      images: [
        {
          url: 'https://www.deyarsu.com/uploads/mazallat-1.webp',
          width: 1200,
          height: 630,
          alt: isArabic ? 'أرشيف مقالات ديار جدة العالمية' : 'Deyar Jeddah Articles Archive'
        }
      ],
      locale: isArabic ? 'ar_SA' : 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic 
        ? 'أرشيف المقالات | ديار جدة العالمية'
        : 'Articles Archive | Aldeyar Professionals',
      description: isArabic
        ? 'اكتشف مقالاتنا المتخصصة في المظلات والبرجولات'
        : 'Discover our specialized articles on shades and pergolas',
      images: ['https://www.deyarsu.com/uploads/mazallat-1.webp']
    },
    alternates: {
      canonical: locale === 'ar' ? '/articles' : '/en/articles',
      languages: {
        'ar': '/articles',
        'en': '/en/articles',
        'x-default': '/articles',
      },
    }
  };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const articlesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isArabic 
      ? 'أرشيف المقالات - ديار جدة العالمية'
      : 'Articles Archive - Deyar Jeddah',
    description: isArabic
      ? 'مقالات متخصصة في المظلات والبرجولات والسواتر وتنسيق الحدائق'
      : 'Specialized articles on shades, pergolas, fences, and landscaping',
    url: `https://www.deyarsu.com${locale === 'en' ? '/en' : ''}/articles`,
    publisher: {
      '@type': 'Organization',
      name: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.deyarsu.com/logo.svg'
      }
    }
  };

  return (
    <>
      <StructuredDataScript data={articlesStructuredData} />
      <Navbar />
      <Suspense fallback={<LoadingFallback isArabic={isArabic} />}>
        <ArticlesPageClient locale={locale} />
      </Suspense>
      <Footer />
    </>
  );
}

function LoadingFallback({ isArabic }: { isArabic: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
        <p className="text-gray-600">
          {isArabic ? 'جاري تحميل المقالات...' : 'Loading articles...'}
        </p>
      </div>
    </div>
  );
}
