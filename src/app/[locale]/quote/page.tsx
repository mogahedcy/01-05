import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  Calculator,
  FileText,
  Send,
  CheckCircle,
  Clock,
  Star,
  Phone,
  MessageCircle,
  User,
  Mail,
  Home,
  Ruler,
  MessageSquare,
  DollarSign,
  Shield,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import IntlProvider from '@/components/IntlProvider'

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const canonicalPath = isArabic ? '/quote' : '/en/quote';
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah Global' }],
    robots: 'index, follow',
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ar': `${baseUrl}/quote`,
        'en': `${baseUrl}/en/quote`,
        'x-default': `${baseUrl}/quote`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${baseUrl}${canonicalPath}`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah Global',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: t('meta.title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${baseUrl}/logo.png`],
    }
  }
}

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'quote' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  
  const services = [
    { id: 'mazallat', name: t('services.mazallat.name'), price: t('services.mazallat.price') },
    { id: 'sawater', name: t('services.sawater.name'), price: t('services.sawater.price') },
    { id: 'pergolas', name: t('services.pergolas.name'), price: t('services.pergolas.price') },
    { id: 'khayyam', name: t('services.khayyam.name'), price: t('services.khayyam.price') },
    { id: 'byoot-shaar', name: t('services.byootShaar.name'), price: t('services.byootShaar.price') },
    { id: 'sandwich-panel', name: t('services.sandwichPanel.name'), price: t('services.sandwichPanel.price') },
    { id: 'landscaping', name: t('services.landscaping.name'), price: t('services.landscaping.price') },
    { id: 'renovation', name: t('services.renovation.name'), price: t('services.renovation.price') }
  ];

  const whyChooseUs = [
    {
      title: t('whyChoose.items.freeQuotes.title'),
      description: t('whyChoose.items.freeQuotes.description'),
      icon: FileText
    },
    {
      title: t('whyChoose.items.competitive.title'),
      description: t('whyChoose.items.competitive.description'),
      icon: DollarSign
    },
    {
      title: t('whyChoose.items.transparency.title'),
      description: t('whyChoose.items.transparency.description'),
      icon: CheckCircle
    },
    {
      title: t('whyChoose.items.warranty.title'),
      description: t('whyChoose.items.warranty.description'),
      icon: Shield
    }
  ];

  const pricingFeatures = t.raw('sidebar.included.items') as string[];
  const responseTimeItems = t.raw('sidebar.responseTime.items') as string[];

  const whatsappMessage = isArabic 
    ? "السلام عليكم، أريد طلب عرض سعر مفصل."
    : "Hello, I would like to request a detailed quote.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const breadcrumbItems = [
    { label: t('breadcrumb.quote'), href: `/${locale}/quote` }
  ];

  // Structured Data Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": isArabic ? "طلب عرض سعر - ديار جدة العالمية" : "Quote Request - Deyar Jeddah Global",
    "description": t('meta.description'),
    "provider": {
      "@type": "LocalBusiness",
      "name": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah Global",
      "telephone": "+966553719009",
      "email": "info@deyarsu.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": isArabic ? "جدة" : "Jeddah",
        "addressCountry": "SA"
      }
    },
    "areaServed": isArabic ? "جدة" : "Jeddah",
    "offers": {
      "@type": "Offer",
      "description": isArabic ? "عرض سعر مجاني" : "Free Quote",
      "price": "0",
      "priceCurrency": "SAR"
    }
  };

  return (
    <IntlProvider locale={locale}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData)
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />

      {/* hreflang tags */}
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/quote`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/quote`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/quote`} />

      <Navbar />

      <div className={`min-h-screen bg-white ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className={`flex justify-center items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''} text-sm text-gray-600 mb-8`}>
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">{t('breadcrumb.home')}</Link>
              <span>/</span>
              <span className="text-primary font-medium">{t('breadcrumb.quote')}</span>
            </nav>

            <Calculator className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>

            <div className={`mt-8 flex justify-center gap-8 text-sm text-gray-600 flex-wrap`}>
              <div className="flex items-center">
                <CheckCircle className={`w-4 h-4 text-green-600 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {t('hero.features.freeQuote')}
              </div>
              <div className="flex items-center">
                <Clock className={`w-4 h-4 text-green-600 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {t('hero.features.fastResponse')}
              </div>
              <div className="flex items-center">
                <Star className={`w-4 h-4 text-green-600 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {t('hero.features.expertConsultation')}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('whyChoose.title')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((feature, index) => (
                <div key={`why-choose-${feature.title}-${index}`} className="text-center">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className={`text-2xl font-bold text-gray-900 mb-6 flex items-center`}>
                    <FileText className={`w-6 h-6 text-primary ${isArabic ? 'ml-3' : 'mr-3'}`} />
                    {t('form.title')}
                  </h2>

                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('form.contactInfo.title')}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.contactInfo.fullName')} {t('form.required')}
                          </label>
                          <div className="relative">
                            <User className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} aria-hidden="true" />
                            <input
                              id="fullName"
                              name="fullName"
                              type="text"
                              required
                              aria-required="true"
                              aria-describedby="fullName-help"
                              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                              placeholder={t('form.contactInfo.fullNamePlaceholder')}
                            />
                          </div>
                          <p id="fullName-help" className="mt-1 text-xs text-gray-500">{t('form.contactInfo.fullNameHelp')}</p>
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.contactInfo.phone')} {t('form.required')}
                          </label>
                          <div className="relative">
                            <Phone className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} aria-hidden="true" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              required
                              aria-required="true"
                              aria-describedby="phone-help"
                              pattern="^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$"
                              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                              placeholder={t('form.contactInfo.phonePlaceholder')}
                            />
                          </div>
                          <p id="phone-help" className="mt-1 text-xs text-gray-500">{t('form.contactInfo.phoneHelp')}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.contactInfo.email')}
                          </label>
                          <div className="relative">
                            <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} aria-hidden="true" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              aria-describedby="email-help"
                              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                              placeholder={t('form.contactInfo.emailPlaceholder')}
                            />
                          </div>
                          <p id="email-help" className="mt-1 text-xs text-gray-500">{t('form.contactInfo.emailHelp')}</p>
                        </div>
                        <div>
                          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.contactInfo.area')} {t('form.required')}
                          </label>
                          <div className="relative">
                            <Home className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} aria-hidden="true" />
                            <input
                              id="area"
                              name="area"
                              type="text"
                              required
                              aria-required="true"
                              aria-describedby="area-help"
                              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                              placeholder={t('form.contactInfo.areaPlaceholder')}
                            />
                          </div>
                          <p id="area-help" className="mt-1 text-xs text-gray-500">{t('form.contactInfo.areaHelp')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('form.serviceDetails.title')}</h3>
                      <div>
                        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('form.serviceDetails.serviceType')} {t('form.required')}
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          required
                          aria-required="true"
                          aria-describedby="serviceType-help"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">{t('form.serviceDetails.serviceTypePlaceholder')}</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} - {service.price}
                            </option>
                          ))}
                        </select>
                        <p id="serviceType-help" className="mt-1 text-xs text-gray-500">{t('form.serviceDetails.serviceTypeHelp')}</p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('form.projectDetails.title')}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.projectDetails.area')}
                          </label>
                          <div className="relative">
                            <Ruler className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                            <input
                              type="number"
                              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                              placeholder={t('form.projectDetails.areaPlaceholder')}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.projectDetails.budget')}
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">{t('form.projectDetails.budgetPlaceholder')}</option>
                            <option value="5000-10000">{t('form.projectDetails.budgetOptions.5k-10k')}</option>
                            <option value="10000-20000">{t('form.projectDetails.budgetOptions.10k-20k')}</option>
                            <option value="20000-50000">{t('form.projectDetails.budgetOptions.20k-50k')}</option>
                            <option value="50000+">{t('form.projectDetails.budgetOptions.50k+')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('form.projectDetails.preferredDate')}
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">{t('form.projectDetails.preferredTime')}</option>
                            <option value="morning">{t('form.projectDetails.timeOptions.morning')}</option>
                            <option value="afternoon">{t('form.projectDetails.timeOptions.afternoon')}</option>
                            <option value="evening">{t('form.projectDetails.timeOptions.evening')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                      <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.additionalDetails.title')} {t('form.required')}
                      </label>
                      <div className="relative">
                        <MessageSquare className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} aria-hidden="true" />
                        <textarea
                          id="projectDetails"
                          name="projectDetails"
                          rows={4}
                          required
                          aria-required="true"
                          aria-describedby="projectDetails-help"
                          className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
                          placeholder={t('form.additionalDetails.placeholder')}
                        />
                      </div>
                      <p id="projectDetails-help" className="mt-1 text-xs text-gray-500">{t('form.additionalDetails.help')}</p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary`}
                      />
                      <label htmlFor="terms" className={`${isArabic ? 'mr-2' : 'ml-2'} text-sm text-gray-700`}>
                        {t('form.terms.agree')} <Link href={`/${locale}/terms`} className="text-primary hover:underline">{t('form.terms.termsOfService')}</Link> {t('form.terms.and')}
                        <Link href={`/${locale}/privacy`} className="text-primary hover:underline"> {t('form.terms.privacyPolicy')}</Link>
                      </label>
                    </div>

                    <Button type="submit" aria-label={t('form.submit')} className="w-full bg-primary hover:bg-primary/90 py-4 text-lg">
                      <Send className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} aria-hidden="true" />
                      {t('form.submit')}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">

                {/* Quick Contact */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t('sidebar.directContact.title')}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    {t('sidebar.directContact.description')}
                  </p>
                  <div className="space-y-3">
                    <Link href="tel:+966553719009" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Phone className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                        {t('sidebar.directContact.callNow')}: 9009 371 55 966+
                      </Button>
                    </Link>
                    <Link href={whatsappURL} target="_blank" className="block">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                        <MessageCircle className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                        {t('sidebar.directContact.whatsapp')}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className={`text-xl font-bold text-gray-900 mb-4 flex items-center`}>
                    <Award className={`w-6 h-6 text-primary ${isArabic ? 'ml-3' : 'mr-3'}`} />
                    {t('sidebar.included.title')}
                  </h3>
                  <div className="space-y-3">
                    {pricingFeatures.map((feature, index) => (
                      <div key={`pricing-feature-${index}`} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className={`w-4 h-4 text-green-600 ${isArabic ? 'ml-3' : 'mr-3'} shrink-0`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Quick View */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t('sidebar.services.title')}
                  </h3>
                  <div className="space-y-3">
                    {services.slice(0, 4).map((service) => (
                      <div key={service.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                        <div className="text-primary text-xs">{service.price}</div>
                      </div>
                    ))}
                    <Link href={`/${locale}/#services`} className="block text-center">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        {t('sidebar.services.viewAll')}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">
                    {t('sidebar.responseTime.title')}
                  </h3>
                  <div className="space-y-2 text-sm opacity-90">
                    {responseTimeItems.map((item, index) => (
                      <p key={`response-${index}`}>• {item}</p>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('process.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('process.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('process.steps.request.title')}</h3>
                <p className="text-gray-600 text-sm">{t('process.steps.request.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('process.steps.inspect.title')}</h3>
                <p className="text-gray-600 text-sm">{t('process.steps.inspect.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('process.steps.quote.title')}</h3>
                <p className="text-gray-600 text-sm">{t('process.steps.quote.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('process.steps.execute.title')}</h3>
                <p className="text-gray-600 text-sm">{t('process.steps.execute.description')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </IntlProvider>
  )
}
