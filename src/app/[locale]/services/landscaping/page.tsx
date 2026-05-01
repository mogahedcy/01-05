import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ReviewSchema from '@/components/ReviewSchema';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { generateServiceSchema } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

import {
  Star,
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Award,
  Shield,
  TreePine,
  Flower2,
  Droplets,
  Scissors,
  Check,
  Mail,
  Sun,
  MapPin
} from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landscaping' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/landscaping';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = 'https://www.deyarsu.com/uploads/landscaping-1.webp';
  
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

const serviceTypes = [
  { id: 'design', icon: TreePine, image: 'https://ext.same-assets.com/4049809232/447736083.jpeg', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  { id: 'grass', icon: Flower2, image: 'https://ext.same-assets.com/4049809232/2214971808.jpeg', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 'waterfalls', icon: Droplets, image: 'https://ext.same-assets.com/4049809232/1002713684.jpeg', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'lighting', icon: Sun, image: 'https://ext.same-assets.com/4049809232/795805632.jpeg', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' }
];

const galleryImages = [
  { id: 1, src: 'https://ext.same-assets.com/4049809232/1574876251.jpeg', titleAr: 'حديقة منزلية عصرية', titleEn: 'Modern Home Garden', categoryAr: 'حدائق منزلية', categoryEn: 'Home Gardens' },
  { id: 2, src: 'https://ext.same-assets.com/4049809232/447736083.jpeg', titleAr: 'تنسيق حديقة فيلا', titleEn: 'Villa Garden Design', categoryAr: 'حدائق فلل', categoryEn: 'Villa Gardens' },
  { id: 3, src: 'https://ext.same-assets.com/4049809232/2214971808.jpeg', titleAr: 'شلال مائي', titleEn: 'Water Fountain', categoryAr: 'شلالات', categoryEn: 'Waterfalls' },
  { id: 4, src: 'https://ext.same-assets.com/4049809232/1002713684.jpeg', titleAr: 'إضاءة حدائق', titleEn: 'Garden Lighting', categoryAr: 'إضاءة', categoryEn: 'Lighting' },
  { id: 5, src: 'https://ext.same-assets.com/4049809232/795805632.jpeg', titleAr: 'عشب صناعي', titleEn: 'Artificial Grass', categoryAr: 'عشب', categoryEn: 'Grass' },
  { id: 6, src: 'https://ext.same-assets.com/4049809232/3414519594.jpeg', titleAr: 'نوافير راقصة', titleEn: 'Dancing Fountains', categoryAr: 'نوافير', categoryEn: 'Fountains' }
];

export default async function LandscapingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'landscaping' });
  const isArabic = locale === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = 'https://www.deyarsu.com/uploads/landscaping-1.webp';
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.landscaping'), href: `${localePath}/services/landscaping`, current: true }
  ];

  const whatsappMessage = isArabic ? "السلام عليكم، أريد الاستفسار عن خدمة تنسيق الحدائق." : "Hello, I would like to inquire about landscaping service.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const heroFeatures = [
    { icon: MapPin, text: t('hero.features.allAreas') },
    { icon: Shield, text: t('hero.features.warranty') },
    { icon: Award, text: t('hero.features.projects') }
  ];

  const stats = [
    { number: '2000+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '100%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '150-500',
    image: pageImage,
    url: `${localePath}/services/landscaping`,
    aggregateRating: { ratingValue: 4.9, reviewCount: 150 }
  });

  const reviewSchemaData = {
    serviceName: t('schema.serviceName'),
    aggregateRating: { ratingValue: 4.9, reviewCount: 150 }
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ReviewSchema {...reviewSchemaData} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 lg:py-32 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-green-600">{t('hero.titleHighlight')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
                {heroFeatures.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 space-x-reverse">
                    <feature.icon className="w-4 h-4 text-green-600" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="tel:+966553719009">
                  <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callCta')}
                  </Button>
                </Link>
                <Link href={whatsappURL} target="_blank">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50">
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
                {t('serviceTypes.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('serviceTypes.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceTypes.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={service.id} className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className={`${service.bgColor} p-6 text-center`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${service.iconColor} rounded-full bg-white/80 mb-4`}>
                        <ServiceIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{t(`serviceTypes.${service.id}.title`)}</h3>
                    </div>

                    <div className="relative h-48 overflow-hidden">
                      <Image src={service.image} alt={t(`serviceTypes.${service.id}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">{t(`serviceTypes.${service.id}.description`)}</p>
                      <ul className="space-y-2 mb-4">
                        {(t.raw(`serviceTypes.${service.id}.features`) as string[]).map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-lg font-bold text-green-600 mb-4">{t(`serviceTypes.${service.id}.price`)}</div>
                      <Link href={whatsappURL} target="_blank">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
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
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
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

        {/* Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {isArabic ? 'معرض أعمالنا' : 'Our Portfolio'}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image src={image.src} alt={isArabic ? image.titleAr : image.titleEn} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-semibold text-sm">{isArabic ? image.titleAr : image.titleEn}</h3>
                        <p className="text-xs opacity-80">{isArabic ? image.categoryAr : image.categoryEn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {isArabic ? 'جاهز لتحويل حديقتك؟' : 'Ready to Transform Your Garden?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isArabic ? 'تواصل معنا اليوم واحصل على استشارة مجانية' : 'Contact us today for a free consultation'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isArabic ? 'واتساب الآن' : 'WhatsApp Now'}
                </Button>
              </Link>
              <Link href="tel:+966553719009">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {isArabic ? 'اتصل الآن' : 'Call Now'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
