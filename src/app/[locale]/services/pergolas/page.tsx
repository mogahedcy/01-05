import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ReviewSchema from '@/components/ReviewSchema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateServiceSchema } from '@/lib/seo-utils';

import ProjectsGallery from '@/components/services/ProjectsGallery';
import ArticlesSection from '@/components/services/ArticlesSection';
import FAQSection from '@/components/services/FAQSection';
import ReviewsSection from '@/components/services/ReviewsSection';
import ServiceContentNavigation from '@/components/ServiceContentNavigation';
import ServiceReviewSchema from '@/components/ServiceReviewSchema';
import ContentRefreshNotification from '@/components/ContentRefreshNotification';
import { generateFAQSchema, generateProductSchema } from '@/lib/seo-utils';
import { getServiceContentUpdates } from '@/lib/cache-manager';
import { prisma } from '@/lib/prisma';
import { buildCategoryWhereClause } from '@/lib/services-categories-mapping';
import { getLocalizedServiceContent } from '@/lib/related-content-fetcher';

export const dynamic = 'force-dynamic';
export const revalidate = 0;



import {
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Shield,
  Check,
  MapPin,
  TreePine,
  Hammer,
  Grid3X3,
  Sun
} from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pergolas' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/pergolas';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = 'https://ext.same-assets.com/3073684241/pergolas-hero.jpeg';
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('keywords'),
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah' }],
    robots: 'index, follow',
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ar': `${baseUrl}${pageUrl}`,
        'en': `${baseUrl}/en${pageUrl}`,
        'x-default': `${baseUrl}${pageUrl}`,
      },
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      url: `${baseUrl}${canonicalPath}`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [{ url: pageImage, width: 1200, height: 630, alt: t('pageTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: [pageImage],
    },
  };
}

const pergolaTypes = [
  { id: 'wooden', icon: TreePine, image: 'https://ext.same-assets.com/3073684241/wooden-pergola.jpeg', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 'iron', icon: Hammer, image: 'https://ext.same-assets.com/3073684241/iron-pergola.jpeg', bgColor: 'bg-gray-50', iconColor: 'text-gray-600' },
  { id: 'mixed', icon: Grid3X3, image: 'https://ext.same-assets.com/3073684241/mixed-pergola.jpeg', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'rooftop', icon: Sun, image: 'https://ext.same-assets.com/3073684241/rooftop-pergola.jpeg', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' }
];

const galleryImages = [
  { id: 1, src: 'https://ext.same-assets.com/3073684241/pergola-1.jpeg', titleAr: 'برجولة خشبية', titleEn: 'Wooden Pergola', categoryAr: 'برجولات خشبية', categoryEn: 'Wooden Pergolas' },
  { id: 2, src: 'https://ext.same-assets.com/3073684241/pergola-2.jpeg', titleAr: 'برجولة حديدية', titleEn: 'Iron Pergola', categoryAr: 'برجولات حديدية', categoryEn: 'Iron Pergolas' },
  { id: 3, src: 'https://ext.same-assets.com/3073684241/pergola-3.jpeg', titleAr: 'برجولة مختلطة', titleEn: 'Mixed Pergola', categoryAr: 'برجولات مختلطة', categoryEn: 'Mixed Pergolas' },
  { id: 4, src: 'https://ext.same-assets.com/3073684241/pergola-4.jpeg', titleAr: 'برجولة سطح', titleEn: 'Rooftop Pergola', categoryAr: 'برجولات أسطح', categoryEn: 'Rooftop Pergolas' },
  { id: 5, src: 'https://ext.same-assets.com/3073684241/pergola-5.jpeg', titleAr: 'برجولة حديقة', titleEn: 'Garden Pergola', categoryAr: 'برجولات حدائق', categoryEn: 'Garden Pergolas' },
  { id: 6, src: 'https://ext.same-assets.com/3073684241/pergola-6.jpeg', titleAr: 'برجولة فاخرة', titleEn: 'Luxury Pergola', categoryAr: 'برجولات فاخرة', categoryEn: 'Luxury Pergolas' }
];

export default async function PergolasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'pergolas' });
  const isArabic = locale === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = 'https://ext.same-assets.com/3073684241/pergolas-hero.jpeg';
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.pergolas'), href: `${localePath}/services/pergolas`, current: true }
  ];

  const { projects, articles, faqs, reviews } = await getLocalizedServiceContent('pergolas', locale);
  const categoryWhere = buildCategoryWhereClause('pergolas');
  const contentUpdates = await getServiceContentUpdates(categoryWhere);
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const categoryName = isArabic ? 'البرجولات' : 'Pergolas';

  // استخراج صور المشاريع الفعلية لبطاقات الأنواع (أول 4 مشاريع لها صورة)
  const projectImagesForTypes = projects
    .filter((p: any) => p.media_items?.[0]?.src)
    .slice(0, 4)
    .map((p: any) => p.media_items[0].src);

  // الصور الاحتياطية (ثابتة) في حال قلّ عدد المشاريع
  const fallbackImages = [
    'https://ext.same-assets.com/3073684241/wooden-pergola.jpeg',
    'https://ext.same-assets.com/3073684241/iron-pergola.jpeg',
    'https://ext.same-assets.com/3073684241/mixed-pergola.jpeg',
    'https://ext.same-assets.com/3073684241/rooftop-pergola.jpeg',
  ];

  const pergolaTypesWithImages = pergolaTypes.map((type, index) => ({
    ...type,
    image: projectImagesForTypes[index] || type.image,
  }));

  const whatsappMessage = isArabic ? "السلام عليكم، أريد الاستفسار عن خدمة البرجولات." : "Hello, I would like to inquire about pergola service.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const heroFeatures = [
    { icon: MapPin, text: t('hero.features.allAreas') },
    { icon: Shield, text: t('hero.features.warranty') },
    { icon: Award, text: t('hero.features.projects') }
  ];

  const stats = [
    { number: '3000+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '100%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '3500-6000',
    image: pageImage,
    url: '/services/pergolas'
  });

  const reviewSchemaData = {
    serviceName: t('schema.serviceName'),
    aggregateRating: { ratingValue: 4.9, reviewCount: 180 }
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ReviewSchema {...reviewSchemaData} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 lg:py-32 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-amber-600">{t('hero.titleHighlight')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
                {heroFeatures.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 space-x-reverse">
                    <feature.icon className="w-4 h-4 text-amber-600" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="tel:+966553719009">
                  <Button size="lg" className="text-lg px-8 py-4 bg-amber-600 hover:bg-amber-700">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callCta')}
                  </Button>
                </Link>
                <Link href={whatsappURL} target="_blank">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-amber-600 text-amber-600 hover:bg-amber-50">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('hero.whatsappCta')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('pergolaTypes.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('pergolaTypes.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pergolaTypesWithImages.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <div key={type.id} className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className={`${type.bgColor} p-6 text-center`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${type.iconColor} rounded-full bg-white/80 mb-4`}>
                        <TypeIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{t(`pergolaTypes.${type.id}.title`)}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">{t(`pergolaTypes.${type.id}.description`)}</p>
                      <ul className="space-y-2 mb-4">
                        {(t.raw(`pergolaTypes.${type.id}.features`) as string[]).map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-amber-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-lg font-bold text-amber-600 mb-4">{t(`pergolaTypes.${type.id}.price`)}</div>
                      <Link href={whatsappURL} target="_blank">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">
                          {isArabic ? 'طلب عرض سعر' : 'Request Quote'}
                          <ArrowIcon className="w-4 h-4 mr-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceContentNavigation projectsCount={projects.length} articlesCount={articles.length} faqsCount={faqs.length} reviewsCount={reviews.length} />

        <div id="projects">
          <ProjectsGallery projects={projects} categoryName={categoryName} />
        </div>

        <div id="articles">
          <ArticlesSection articles={articles} categoryName={categoryName} />
        </div>

        {/* 🚀 SEO Intensive Article Section */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg md:prose-xl prose-primary mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center leading-tight">
                {t('seoArticle.title')}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-justify mb-12">
                {(t.raw('seoArticle.paragraphs') as string[]).map((paragraph: string, index: number) => (
                  <p key={`seo-p-${index}`} className="text-lg">{paragraph}</p>
                ))}
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                  <Award className="w-6 h-6 text-amber-600 mr-3 rtl:ml-3 rtl:mr-0" />
                  {t('seoArticle.keywordsTitle')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(t.raw('seoArticle.keywordsList') as string[]).map((keyword: string, index: number) => (
                    <span key={`seo-k-${index}`} className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:border-amber-600 hover:text-amber-600 transition-colors cursor-default">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id="faqs">
          <FAQSection faqs={faqs} categoryName={categoryName} />
        </div>

        <div id="reviews">
          <ReviewsSection reviews={reviews} categoryName={categoryName} averageRating={averageRating} totalReviews={totalReviews} />
        </div>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {isArabic ? 'جاهز للحصول على برجولتك؟' : 'Ready to Get Your Pergola?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isArabic ? 'تواصل معنا اليوم واحصل على استشارة مجانية' : 'Contact us today for a free consultation'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isArabic ? 'واتساب الآن' : 'WhatsApp Now'}
                </Button>
              </Link>
              <Link href="tel:+966553719009">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {isArabic ? 'اتصل الآن' : 'Call Now'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
        
        <ContentRefreshNotification lastUpdate={contentUpdates.mostRecentUpdate} contentType="projects" />
      </div>
    </>
  );
}
