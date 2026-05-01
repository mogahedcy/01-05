import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ReviewSchema from '@/components/ReviewSchema';
import ProjectsGallery from '@/components/services/ProjectsGallery';
import ArticlesSection from '@/components/services/ArticlesSection';
import FAQSection from '@/components/services/FAQSection';
import ReviewsSection from '@/components/services/ReviewsSection';
import ServiceContentNavigation from '@/components/ServiceContentNavigation';
import ServiceReviewSchema from '@/components/ServiceReviewSchema';
import ContentRefreshNotification from '@/components/ContentRefreshNotification';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  generateServiceSchema, 
  generateFAQSchema,
  generateProductSchema,
} from '@/lib/seo-utils';
import { getServiceContentUpdates } from '@/lib/cache-manager';

import {
  Car,
  Shield,
  Sun,
  Droplets,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Award,
  Users,
  Clock,
  MapPin,
  Zap,
  ThumbsUp,
  Target
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { buildCategoryWhereClause } from '@/lib/services-categories-mapping';
import { getLocalizedServiceContent } from '@/lib/related-content-fetcher';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'mazallat' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/mazallat';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = `${baseUrl}/uploads/mazallat-1.webp`;
  
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
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: isArabic ? 'مظلات سيارات جدة - ديار جدة العالمية' : 'Car Shades Jeddah - Deyar Jeddah',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: [pageImage],
    },
  };
}



const shadeTypeIcons = {
  cars: Car,
  gardens: Sun,
  schools: Shield,
  pools: Droplets
};

export default async function MazallatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'mazallat' });
  const isArabic = locale === 'ar';
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = `${baseUrl}/uploads/mazallat-1.webp`;
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.mazallat'), href: `${localePath}/services/mazallat`, current: true }
  ];

  const { projects, articles, faqs, reviews } = await getLocalizedServiceContent('mazallat', locale);

  // Get content updates for cache notification
  const categoryWhere = buildCategoryWhereClause('mazallat');
  const contentUpdates = await getServiceContentUpdates(categoryWhere);

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const heroFeatures = [
    { icon: MapPin, text: t('hero.features.allAreas') },
    { icon: Clock, text: t('hero.features.warranty') },
    { icon: Star, text: t('hero.features.projects') }
  ];

  const whyChooseUsFeatures = [
    {
      icon: Award,
      title: t('whyChooseUs.features.experience.title'),
      description: t('whyChooseUs.features.experience.description'),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Shield,
      title: t('whyChooseUs.features.warranty.title'),
      description: t('whyChooseUs.features.warranty.description'),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      title: t('whyChooseUs.features.team.title'),
      description: t('whyChooseUs.features.team.description'),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Zap,
      title: t('whyChooseUs.features.speed.title'),
      description: t('whyChooseUs.features.speed.description'),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: ThumbsUp,
      title: t('whyChooseUs.features.satisfaction.title'),
      description: t('whyChooseUs.features.satisfaction.description'),
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Target,
      title: t('whyChooseUs.features.prices.title'),
      description: t('whyChooseUs.features.prices.description'),
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const shadeTypes = ['cars', 'gardens', 'schools', 'pools'].map((id) => ({
    id,
    title: t(`shadeTypes.${id}.title`),
    description: t(`shadeTypes.${id}.description`),
    features: t.raw(`shadeTypes.${id}.features`) as string[],
    price: t(`shadeTypes.${id}.price`),
    bgColor: id === 'cars' ? 'bg-blue-50' : id === 'gardens' ? 'bg-green-50' : id === 'schools' ? 'bg-purple-50' : 'bg-cyan-50',
    iconColor: id === 'cars' ? 'text-blue-600' : id === 'gardens' ? 'text-green-600' : id === 'schools' ? 'text-purple-600' : 'text-cyan-600',
    icon: shadeTypeIcons[id as keyof typeof shadeTypeIcons]
  }));

  const stats = [
    { number: '5000+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '99%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const relatedServices = [
    {
      id: 'sawater',
      title: t('relatedServices.sawater.title'),
      description: t('relatedServices.sawater.description'),
      href: '/services/sawater',
      features: t.raw('relatedServices.sawater.features') as string[]
    },
    {
      id: 'pergolas',
      title: t('relatedServices.pergolas.title'),
      description: t('relatedServices.pergolas.description'),
      href: '/services/pergolas',
      features: t.raw('relatedServices.pergolas.features') as string[]
    },
    {
      id: 'khayyam',
      title: t('relatedServices.khayyam.title'),
      description: t('relatedServices.khayyam.description'),
      href: '/services/khayyam',
      features: t.raw('relatedServices.khayyam.features') as string[]
    }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '2500-10000',
    image: pageImage,
    url: '/services/mazallat'
  });

  const faqSchema = generateFAQSchema(faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));

  const productSchema = generateProductSchema({
    name: t('schema.productName'),
    description: t('schema.productDescription'),
    image: [pageImage],
    category: isArabic ? 'مظلات خارجية' : 'Outdoor Shades',
    brand: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Professionals',
    aggregateRating: {
      ratingValue: 4.9,
      reviewCount: 167
    }
  });

  const reviewSchemaData = {
    serviceName: t('schema.serviceName'),
    aggregateRating: {
      ratingValue: 4.9,
      reviewCount: 167
    }
  };

  const projectsListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('schema.projectsListName'),
    "description": t('schema.projectsListDescription'),
    "numberOfItems": projects.length,
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "ImageObject",
        "name": project.title,
        "description": project.description,
        "url": `${baseUrl}/portfolio/${project.slug || project.id}`,
        "contentUrl": project.media_items?.[0]?.src || '',
        "thumbnailUrl": project.media_items?.[0]?.src || '',
        "caption": project.media_items?.[0]?.alt || project.title,
        "width": "1200",
        "height": "800",
        "uploadDate": new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": isArabic ? "ديار جدة العالمية" : "Aldeyar Global Professionals"
        },
        "publisher": {
          "@type": "Organization",
          "name": isArabic ? "ديار جدة العالمية" : "Aldeyar Global Professionals",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        }
      }
    }))
  };

  const articlesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('schema.articlesListName'),
    "description": t('schema.articlesListDescription'),
    "numberOfItems": articles.length,
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "url": `${baseUrl}/articles/${article.slug || article.id}`,
        "image": article.article_media_items?.[0]?.src || '',
        "author": {
          "@type": "Organization",
          "name": isArabic ? "ديار جدة العالمية" : "Aldeyar Global Professionals"
        },
        "publisher": {
          "@type": "Organization",
          "name": isArabic ? "ديار جدة العالمية" : "Aldeyar Global Professionals",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "datePublished": article.publishedAt || article.createdAt,
        "dateModified": article.publishedAt || article.createdAt
      }
    }))
  };

  const categoryName = isArabic ? 'المظلات' : 'Shades';

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesListSchema) }}
      />
      <ReviewSchema {...reviewSchemaData} />
      <ServiceReviewSchema 
        serviceName={t('pageTitle')}
        serviceUrl={`${baseUrl}${isArabic ? '' : '/en'}/services/mazallat`}
        reviews={reviews}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex mb-8">
                <Breadcrumb items={breadcrumbItems} className="bg-accent/10 text-accent px-4 py-2 rounded-full font-medium" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-accent">{t('hero.titleHighlight')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
                {heroFeatures.map((feature) => (
                  <div key={`hero-feature-${feature.text.substring(0, 10)}`} className="flex items-center space-x-2 space-x-reverse">
                    <feature.icon className="w-4 h-4 text-accent" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="tel:+966553719009">
                  <Button size="lg" className="text-lg px-8 py-4">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callCta')}
                  </Button>
                </Link>
                <Link href="https://wa.me/+966553719009" target="_blank">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('hero.whatsappCta')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute top-1/4 left-8 w-16 h-16 bg-accent/10 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-8 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('servicesSection.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('servicesSection.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {shadeTypes.map((service) => (
                <div
                  key={service.id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className={`${service.bgColor} p-6 text-center relative`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.iconColor} rounded-full bg-white/80 mb-4`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">{service.title}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={`feature-${service.id}-${index}`} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="text-lg font-bold text-accent mb-4">
                      {service.price}
                    </div>

                    <Link href={`https://wa.me/+966553719009?text=${encodeURIComponent(isArabic ? `أرغب في الحصول على معلومات عن ${service.title}` : `I would like to get information about ${service.title}`)}`} target="_blank">
                      <Button className="w-full group-hover:bg-accent transition-colors">
                        {t('servicesSection.moreInfo')}
                        <ArrowIcon className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceContentNavigation 
          projectsCount={projects.length}
          articlesCount={articles.length}
          faqsCount={faqs.length}
          reviewsCount={reviews.length}
        />

        <div id="projects">
          <ProjectsGallery projects={projects} categoryName={categoryName} />
        </div>

        <div id="articles">
          <ArticlesSection articles={articles} categoryName={categoryName} />
        </div>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('whyChooseUs.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUsFeatures.map((feature, index) => (
                <div
                  key={`why-feature-${index}`}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconColor} ${feature.bgColor} rounded-2xl mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 SEO Intensive Article Section */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg md:prose-xl prose-primary mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center leading-tight">
                {t('seoArticle.title')}
              </h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed text-justify mb-12">
                {(t.raw('seoArticle.paragraphs') as string[]).map((paragraph, index) => (
                  <p key={`seo-p-${index}`} className="text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                  <Target className="w-6 h-6 text-accent mr-3 rtl:ml-3 rtl:mr-0" />
                  {t('seoArticle.keywordsTitle')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(t.raw('seoArticle.keywordsList') as string[]).map((keyword, index) => (
                    <span 
                      key={`seo-k-${index}`}
                      className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:border-accent hover:text-accent transition-colors cursor-default"
                    >
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
          <ReviewsSection 
            reviews={reviews}
            categoryName={categoryName}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        </div>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('relatedServices.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('relatedServices.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((service) => (
                <Link key={service.id} href={service.href}>
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                    <h3 className="text-xl font-bold text-primary mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={`related-${service.id}-${index}`} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/80 mb-10">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="tel:+966553719009">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('cta.callButton')}
                </Button>
              </Link>
              <Link href="https://wa.me/+966553719009" target="_blank">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('cta.whatsappButton')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
        
        {/* Content Refresh Notification */}
        <ContentRefreshNotification 
          lastUpdate={contentUpdates.mostRecentUpdate}
          contentType="projects"
        />
      </div>
    </>
  );
}
