import Link from 'next/link';
import BreadcrumbSchema from './BreadcrumbSchema';

interface HomePageBreadcrumbProps {
  locale?: string;
}

export default function HomePageBreadcrumb({ locale = 'ar' }: HomePageBreadcrumbProps) {
  const isRTL = locale === 'ar';
  const homeText = isRTL ? 'الرئيسية' : 'Home';
  const homeHref = isRTL ? '/' : '/en';

  return (
    <>
      <nav 
        aria-label={isRTL ? "مسار التنقل" : "Breadcrumb"}
        className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto">
          <ol className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-sm sm:text-base`}>
            <li className="flex items-center">
              <Link 
                href={homeHref}
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                {homeText}
              </Link>
            </li>
          </ol>
        </div>
      </nav>
      <BreadcrumbSchema 
        items={[]}
        baseUrl="https://www.deyarsu.com"
        homeName={homeText}
      />
    </>
  );
}
