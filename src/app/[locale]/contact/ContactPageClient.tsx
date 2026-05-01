'use client';

import { useTranslations } from 'next-intl';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  User,
  MessageSquare,
  Home,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

interface ContactPageClientProps {
  locale: string;
}

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const t = useTranslations('contact');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';
  
  const whatsappMessage = isRTL 
    ? "السلام عليكم، أريد الاستفسار عن خدماتكم والحصول على عرض سعر."
    : "Hello, I would like to inquire about your services and get a quote.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const contactMethods = [
    {
      icon: Phone,
      title: t('callUs'),
      description: t('callUsDesc'),
      value: '+966 55 371 9009',
      action: 'tel:+966553719009',
      buttonText: t('callNow')
    },
    {
      icon: MessageCircle,
      title: t('whatsapp'),
      description: t('whatsappDesc'),
      value: '+966 55 371 9009',
      action: whatsappURL,
      buttonText: t('sendMessage')
    },
    {
      icon: Mail,
      title: t('emailTitle'),
      description: t('emailDesc'),
      value: 'info@deyarsu.com',
      action: 'mailto:info@deyarsu.com',
      buttonText: t('sendEmail')
    },
    {
      icon: MapPin,
      title: t('ourLocation'),
      description: t('locationDesc'),
      value: t('locationValue'),
      action: '#location',
      buttonText: t('viewMap')
    }
  ];

  const workingHours = [
    { day: t('sunToThu'), hours: '8:00 AM - 6:00 PM' },
    { day: t('friday'), hours: '2:00 PM - 6:00 PM' },
    { day: t('saturday'), hours: '9:00 AM - 5:00 PM' },
    { day: t('emergencyService'), hours: '24/7' }
  ];

  const serviceAreas = [
    t('areas.northJeddah'),
    t('areas.southJeddah'),
    t('areas.eastJeddah'),
    t('areas.westJeddah'),
    t('areas.centralJeddah'),
    t('areas.corniche'),
    t('areas.safa'),
    t('areas.nuzha'),
    t('areas.rawdah'),
    t('areas.murjan'),
    t('areas.shati'),
    t('areas.salamah')
  ];

  const breadcrumbItems = [
    { label: t('title'), href: `${localePath}/contact` }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": isRTL ? "ديار جدة العالمية" : "Aldeyar Global Professionals",
      "telephone": "+966553719009",
      "email": "info@deyarsu.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": isRTL ? "جدة" : "Jeddah",
        "addressCountry": "SA"
      },
      "openingHours": [
        "Su-Th 08:00-18:00",
        "Fr 14:00-18:00",
        "Sa 09:00-17:00"
      ],
      "areaServed": isRTL ? "جدة" : "Jeddah"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Navbar />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
          <div className="max-w-7xl mx-auto">
            <nav className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-sm text-gray-600 dark:text-gray-400 mb-8`}>
              <Link href={`${localePath}/`} className="hover:text-primary transition-colors">{t('home')}</Link>
              <span>/</span>
              <span className="text-primary font-medium">{t('title')}</span>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t('pageTitlePart1')} <span className="text-primary">{t('pageTitlePart2')}</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {t('subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={whatsappURL} target="_blank">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <MessageCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('directWhatsapp')}
                  </Button>
                </Link>
                <Link href="tel:+966553719009">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('callNow')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('contactMethods')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('contactMethodsDesc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div key={`contact-method-${method.title}-${index}`} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                  <method.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{method.description}</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-4 text-sm">{method.value}</p>
                  <Link href={method.action} target={method.action.startsWith('http') ? '_blank' : undefined}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-sm">
                      {method.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('sendUsMessage')}
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('fullName')}
                      </label>
                      <div className="relative">
                        <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                        <input
                          type="text"
                          required
                          className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                          placeholder={t('fullNamePlaceholder')}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('phone')} *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                        <input
                          type="tel"
                          required
                          className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                          placeholder={t('phonePlaceholder')}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('email')}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                      <input
                        type="email"
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('serviceType')}
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option value="">{t('selectService')}</option>
                      <option value="mazallat">{t('serviceOptions.carShades')}</option>
                      <option value="sawater">{t('serviceOptions.privacyFences')}</option>
                      <option value="pergolas">{t('serviceOptions.gardenPergolas')}</option>
                      <option value="khayyam">{t('serviceOptions.royalTents')}</option>
                      <option value="byoot-shaar">{t('serviceOptions.traditionalHouses')}</option>
                      <option value="sandwich-panel">{t('serviceOptions.sandwichPanel')}</option>
                      <option value="landscaping">{t('serviceOptions.landscaping')}</option>
                      <option value="renovation">{t('serviceOptions.renovation')}</option>
                      <option value="consultation">{t('serviceOptions.generalConsultation')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('addressArea')}
                    </label>
                    <div className="relative">
                      <Home className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                      <input
                        type="text"
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder={t('addressPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('projectDetails')}
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                      <textarea
                        rows={4}
                        required
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder={t('projectDetailsPlaceholder')}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-3">
                    <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('send')}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className={`w-6 h-6 text-primary ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    {t('workingHours')}
                  </h3>
                  <div className="space-y-3">
                    {workingHours.map((schedule, index) => (
                      <div key={`schedule-${schedule.day}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{schedule.day}</span>
                        <span className="text-gray-600 dark:text-gray-400">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className={`w-6 h-6 text-primary ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    {t('serviceAreas')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceAreas.map((area) => (
                      <div key={`service-area-${area}`} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className={`w-4 h-4 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">
                    {t('needImmediateHelp')}
                  </h3>
                  <p className="mb-4 opacity-90">
                    {t('teamAvailable')}
                  </p>
                  <div className="space-y-3">
                    <Link href="tel:+966553719009" className="block">
                      <Button className="w-full bg-white text-primary hover:bg-gray-100">
                        <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('callNow')}: 9009 371 55 966+
                      </Button>
                    </Link>
                    <Link href={whatsappURL} target="_blank" className="block">
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white/20">
                        <MessageCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('instantWhatsapp')}
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section id="location" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('ourLocationInJeddah')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('servingAllJeddah')}
              </p>
            </div>

            <div className="relative rounded-lg overflow-hidden h-96 shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.5678!2d39.192505!3d21.485811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI5JzA4LjkiTiAzOcKwMTEnMzMuMCJF!5e0!3m2!1sar!2ssa!4v1234567890123!5m2!1sar!2ssa"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={isRTL ? "موقع ديار جدة العالمية في جدة" : "Aldeyar Global Professionals location in Jeddah"}
                className="grayscale-0 hover:grayscale-0 transition-all"
              />
              <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs`}>
                <div className="flex items-start">
                  <MapPin className={`w-5 h-5 text-primary ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-1`} />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{isRTL ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('locationValue')}</p>
                    <a 
                      href="https://maps.google.com/?q=21.485811,39.192505" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      {t('openInGoogleMaps')} {isRTL ? '←' : '→'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('frequentQuestions')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t('findAnswerInFAQ')}
            </p>
            <Link href={`${localePath}/faq`}>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                {t('viewFAQ')}
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
