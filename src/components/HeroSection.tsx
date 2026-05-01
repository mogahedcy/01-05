'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Star, Shield, Award } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function HeroSection() {
  const locale = useLocale();
  const t = useTranslations('hero');
  const tFeatures = useTranslations('features');
  
  const isRTL = locale === 'ar';

  const serviceLinks = locale === 'ar' ? [
    { href: '/services/mazallat', label: 'مظلات سيارات جدة' },
    { href: '/services/pergolas', label: 'برجولات حدائق جدة' },
    { href: '/services/sawater', label: 'سواتر خصوصية جدة' },
    { href: '/services/sandwich-panel', label: 'ساندوتش بانل جدة' },
    { href: '/services/landscaping', label: 'تنسيق حدائق جدة' },
    { href: '/services/byoot-shaar', label: 'بيوت شعر تراثية' },
  ] : [
    { href: '/en/services/mazallat', label: 'Car Shades Jeddah' },
    { href: '/en/services/pergolas', label: 'Garden Pergolas Jeddah' },
    { href: '/en/services/sawater', label: 'Privacy Fences Jeddah' },
    { href: '/en/services/sandwich-panel', label: 'Sandwich Panel Jeddah' },
    { href: '/en/services/landscaping', label: 'Landscaping Jeddah' },
    { href: '/en/services/byoot-shaar', label: 'Traditional Houses' },
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black" 
      aria-label={isRTL ? "قسم البطل الرئيسي" : "Hero Section"}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75"
          poster="/images/slider1.webp"
        >
          <source src="/%D8%AF%D9%8A%D8%A7%D8%B1%20%D8%AC%D8%AF%D8%A9%20%D9%85%D8%B8%D9%84%D8%A7%D8%AA%20.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-10" />
      </div>

      <div className="relative z-20 text-center text-white px-4 max-w-7xl mx-auto pt-20">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 animate-fade-in px-4">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-4 py-2.5 sm:px-4 sm:py-2.5 md:px-5 rounded-full text-sm sm:text-sm font-bold shadow-xl flex items-center gap-2 sm:gap-2 transform hover:scale-105 transition-transform">
            <Star className="w-4 h-4 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
            <span className="whitespace-nowrap">{tFeatures('experience')}</span>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2.5 sm:px-4 sm:py-2.5 md:px-5 rounded-full text-sm sm:text-sm font-bold shadow-xl flex items-center gap-2 sm:gap-2 transform hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{tFeatures('warranty')}</span>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2.5 sm:px-4 sm:py-2.5 md:px-5 rounded-full text-sm sm:text-sm font-bold shadow-xl flex items-center gap-2 sm:gap-2 transform hover:scale-105 transition-transform">
            <Award className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('projects')}</span>
          </div>
        </div>

        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-tight animate-slide-up px-4">
          <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent block drop-shadow-2xl pb-2">
            {t('companyName')}
          </span>
          <span className="hero-subtitle block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-4 text-amber-500 font-extrabold drop-shadow-lg">
            {t('tagline')}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 text-gray-200 leading-relaxed max-w-4xl mx-auto font-medium px-4 drop-shadow-md">
          {t('description')}
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center items-stretch sm:items-center mb-12 sm:mb-16 md:mb-20 px-4 max-w-2xl mx-auto ${isRTL ? 'space-x-reverse' : ''}`}>
          <div className="relative group">
            {/* Glowing effect underneath */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-xl blur opacity-70 group-hover:opacity-100 animate-pulse transition duration-1000 group-hover:duration-200"></div>
            <Button 
              asChild 
              size="lg" 
              className="relative w-full sm:w-auto text-lg sm:text-xl font-bold shadow-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white transform hover:scale-105 transition-all duration-300 py-6 sm:py-7 px-8 sm:px-10 rounded-xl"
              aria-label={isRTL ? "تواصل معنا عبر واتساب للحصول على استشارة مجانية" : "Contact us on WhatsApp for a free consultation"}
            >
              <Link href="https://wa.me/+966553719009" className={`flex items-center justify-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 animate-bounce" />
                <span>{t('freeConsultation')}</span>
              </Link>
            </Button>
          </div>

          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto text-lg sm:text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] bg-white/10 backdrop-blur-md border-2 border-white hover:bg-white text-white hover:text-black font-bold transform hover:scale-105 transition-all duration-300 py-6 sm:py-7 px-8 sm:px-10 rounded-xl"
            aria-label={isRTL ? "اتصل بنا على رقم الهاتف" : "Call us on phone"}
          >
            <Link href="tel:+966553719009" className={`flex items-center justify-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Phone className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
              <span className="text-base sm:text-lg" dir="ltr">+966553719009</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-3 text-sm sm:text-sm max-w-4xl mx-auto px-4 pb-10">
          {serviceLinks.map((link, index) => (
            <Link 
              key={index}
              href={link.href} 
              className="px-4 py-2.5 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 text-white font-medium whitespace-nowrap min-h-[44px] flex items-center justify-center shadow-lg hover:shadow-amber-500/50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
