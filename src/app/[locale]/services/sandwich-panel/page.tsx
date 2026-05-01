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
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Shield,
  Check,
  MapPin,
  Building,
  Square,
  Warehouse,
  Home
} from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sandwichPanel' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/sandwich-panel';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = 'https://ext.same-assets.com/3073684241/sandwich-panel-hero.jpeg';
  
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

const panelTypes = [
  { id: 'walls', icon: Square, image: 'https://ext.same-assets.com/3073684241/wall-panel.jpeg', bgColor: 'bg-slate-50', iconColor: 'text-slate-600' },
  { id: 'roofs', icon: Building, image: 'https://ext.same-assets.com/3073684241/roof-panel.jpeg', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'rooms', icon: Home, image: 'https://ext.same-assets.com/3073684241/ready-room.jpeg', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  { id: 'warehouses', icon: Warehouse, image: 'https://ext.same-assets.com/3073684241/warehouse.jpeg', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' }
];

const galleryImages = [
  { id: 1, src: 'https://ext.same-assets.com/3073684241/panel-1.jpeg', titleAr: 'ساندوتش بانل جدران', titleEn: 'Wall Sandwich Panel', categoryAr: 'جدران', categoryEn: 'Walls' },
  { id: 2, src: 'https://ext.same-assets.com/3073684241/panel-2.jpeg', titleAr: 'ساندوتش بانل أسقف', titleEn: 'Roof Sandwich Panel', categoryAr: 'أسقف', categoryEn: 'Roofs' },
  { id: 3, src: 'https://ext.same-assets.com/3073684241/panel-3.jpeg', titleAr: 'غرفة جاهزة', titleEn: 'Ready Room', categoryAr: 'غرف جاهزة', categoryEn: 'Ready Rooms' },
  { id: 4, src: 'https://ext.same-assets.com/3073684241/panel-4.jpeg', titleAr: 'مستودع', titleEn: 'Warehouse', categoryAr: 'مستودعات', categoryEn: 'Warehouses' },
  { id: 5, src: 'https://ext.same-assets.com/3073684241/panel-5.jpeg', titleAr: 'مكتب جاهز', titleEn: 'Ready Office', categoryAr: 'مكاتب', categoryEn: 'Offices' },
  { id: 6, src: 'https://ext.same-assets.com/3073684241/panel-6.jpeg', titleAr: 'عزل حراري', titleEn: 'Thermal Insulation', categoryAr: 'عزل', categoryEn: 'Insulation' }
];

export default async function SandwichPanelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'sandwichPanel' });
  const isArabic = locale === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = 'https://ext.same-assets.com/3073684241/sandwich-panel-hero.jpeg';
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.sandwichPanel'), href: `${localePath}/services/sandwich-panel`, current: true }
  ];

  const whatsappMessage = isArabic ? "السلام عليكم، أريد الاستفسار عن خدمة الساندوتش بانل." : "Hello, I would like to inquire about sandwich panel service.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const heroFeatures = [
    { icon: MapPin, text: t('hero.features.allAreas') },
    { icon: Shield, text: t('hero.features.warranty') },
    { icon: Award, text: t('hero.features.projects') }
  ];

  const stats = [
    { number: '800+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '100%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '85-8000',
    image: pageImage,
    url: '/services/sandwich-panel'
  });

  const reviewSchemaData = {
    serviceName: t('schema.serviceName'),
    aggregateRating: { ratingValue: 4.9, reviewCount: 90 }
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ReviewSchema {...reviewSchemaData} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-20 lg:py-32 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-slate-600">{t('hero.titleHighlight')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
                {heroFeatures.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 space-x-reverse">
                    <feature.icon className="w-4 h-4 text-slate-600" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="tel:+966553719009">
                  <Button size="lg" className="text-lg px-8 py-4 bg-slate-600 hover:bg-slate-700">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callCta')}
                  </Button>
                </Link>
                <Link href={whatsappURL} target="_blank">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-slate-600 text-slate-600 hover:bg-slate-50">
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
                {t('panelTypes.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('panelTypes.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {panelTypes.map((panel) => {
                const PanelIcon = panel.icon;
                return (
                  <div key={panel.id} className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className={`${panel.bgColor} p-6 text-center`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${panel.iconColor} rounded-full bg-white/80 mb-4`}>
                        <PanelIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{t(`panelTypes.${panel.id}.title`)}</h3>
                    </div>

                    <div className="relative h-48 overflow-hidden">
                      <Image src={panel.image} alt={t(`panelTypes.${panel.id}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">{t(`panelTypes.${panel.id}.description`)}</p>
                      <ul className="space-y-2 mb-4">
                        {(t.raw(`panelTypes.${panel.id}.features`) as string[]).map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-slate-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-lg font-bold text-slate-600 mb-4">{t(`panelTypes.${panel.id}.price`)}</div>
                      <Link href={whatsappURL} target="_blank">
                        <Button className="w-full bg-slate-600 hover:bg-slate-700">
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
        <section className="py-16 bg-gradient-to-r from-slate-600 to-gray-700 text-white">
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
        <section className="py-20 bg-gradient-to-r from-slate-600 to-gray-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {isArabic ? 'جاهز لمشروعك؟' : 'Ready for Your Project?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isArabic ? 'تواصل معنا اليوم واحصل على استشارة مجانية' : 'Contact us today for a free consultation'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="bg-white text-slate-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isArabic ? 'واتساب الآن' : 'WhatsApp Now'}
                </Button>
              </Link>
              <Link href="tel:+966553719009">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-600 text-lg px-8 py-4">
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
