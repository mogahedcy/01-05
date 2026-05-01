import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchPageClient from '@/components/SearchPageClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>; 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const q = typeof sp?.q === 'string' ? sp.q : '';
  const isArabic = locale === 'ar';
  
  let title = isArabic ? 'البحث' : 'Search';
  let description = isArabic 
    ? 'ابحث في مشاريع ومقالات ديار جدة العالمية، واستكشف أفضل مظلات السيارات، البرجولات، والسواتر.' 
    : 'Search Deyar Jeddah projects and articles, and explore the best car shades, pergolas, and fences.';

  if (q) {
    title = isArabic ? `نتائج البحث عن "${q}"` : `Search results for "${q}"`;
    description = isArabic 
      ? `اكتشف نتائج البحث عن "${q}" في مشاريع وخدمات ومقالات ديار جدة العالمية.` 
      : `Discover search results for "${q}" in Deyar Jeddah projects, services, and articles.`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
  const canonicalUrl = `${baseUrl}${locale === 'ar' ? '' : '/en'}/search${q ? `?q=${encodeURIComponent(q)}` : ''}`;

  return {
    title,
    description,
    robots: {
      index: q ? false : true, // Do not index search results pages to avoid crawl traps, index the base search page
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah'}`,
      description,
      url: canonicalUrl,
      type: 'website',
    }
  };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    }>
      <SearchPageClient locale={locale} />
    </Suspense>
  );
}
