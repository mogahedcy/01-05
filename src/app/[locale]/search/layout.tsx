import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return {
    title: isAr ? 'بحث متقدم عن المظلات والسواتر في جدة' : 'Advanced Search for Shades & Pergolas in Jeddah',
    description: isAr 
      ? 'ابحث في مشاريع ومقالات ديار جدة العالمية. مظلات سيارات، برجولات، سواتر، والمزيد مع خيارات تصفية متقدمة.' 
      : 'Search through Deyar Jeddah projects and articles. Car shades, pergolas, fences, and more with advanced filtering options.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}/search`,
      languages: {
        'ar': '/ar/search',
        'en': '/en/search',
      },
    },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.deyarsu.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.deyarsu.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
