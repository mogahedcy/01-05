'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const serviceImages = {
  carShades: '/uploads/mazallat-1.webp',
  sandwichPanel: '/uploads/sandwich-panel-1.jpg',
  renovation: '/uploads/renovation-1.jpg',
  pergolas: '/uploads/pergola-1.jpg',
  fences: '/uploads/sawater-1.webp',
  traditionalHouses: '/uploads/byoot-shaar-1.webp',
  landscaping: '/uploads/landscaping-1.webp',
  royalTents: '/uploads/khayyam-1.webp',
};

const serviceColors: Record<string, { badge?: string; badgeColor?: string }> = {
  carShades: { badge: 'mostRequested', badgeColor: 'bg-red-500' },
  sandwichPanel: {},
  renovation: {},
  pergolas: { badge: 'featured', badgeColor: 'bg-amber-500' },
  fences: {},
  traditionalHouses: {},
  landscaping: {},
  royalTents: {},
};

const serviceRoutes = {
  carShades: 'mazallat',
  sandwichPanel: 'sandwich-panel',
  renovation: 'renovation',
  pergolas: 'pergolas',
  fences: 'sawater',
  traditionalHouses: 'byoot-shaar',
  landscaping: 'landscaping',
  royalTents: 'khayyam',
};

function TiltCard({ service, isRTL, ArrowIcon, t, localePath }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (clientX: number, clientY: number, rect: DOMRect) => {
    const xPct = (clientX - rect.left) / rect.width - 0.5;
    const yPct = (clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY, e.currentTarget.getBoundingClientRect());
  };

  const handleReset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleReset}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleReset}
      className="group relative h-full bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black rounded-2xl overflow-hidden border-2 border-transparent hover:border-amber-500/60 shadow-lg hover:shadow-[0_0_35px_rgba(245,158,11,0.2)] transition-all duration-300"
    >
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="h-full flex flex-col"
      >
        {service.badge && (
          <div 
            style={{ transform: "translateZ(40px)" }}
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20`}
          >
            {t(service.badge)}
          </div>
        )}

        <div 
          style={{ transform: "translateZ(20px)" }}
          className="relative w-full h-48 overflow-hidden rounded-t-xl"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="p-6 text-center relative mt-2 flex-grow flex flex-col">
          <h3 
            style={{ transform: "translateZ(30px)" }}
            className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-amber-500 transition-colors"
          >
            {service.title}
          </h3>
          <p 
            style={{ transform: "translateZ(20px)" }}
            className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium mb-6"
          >
            {service.description}
          </p>

          <ul 
            style={{ transform: "translateZ(20px)" }}
            className="space-y-3 mb-8 text-left"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {service.features.map((feature: string, index: number) => (
              <li key={`${service.id}-feature-${index}`} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className={`w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 group-hover:scale-150 transition-transform`} />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div style={{ transform: "translateZ(40px)" }} className="mt-auto">
            {service.price && (
              <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-6 text-center">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {service.price}
                </p>
              </div>
            )}

            <Button asChild variant="outline" className="w-full bg-transparent border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 font-bold shadow-sm group-hover:shadow-xl">
              <Link href={service.href} className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <span>{t('moreInfo')}</span>
                <ArrowIcon className={`w-4 h-4 ${isRTL ? 'group-hover:translate-x-2' : 'group-hover:-translate-x-2'} transition-transform duration-300`} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const locale = useLocale();
  const t = useTranslations('servicesSection');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';

  const services = Object.keys(serviceImages).map((key) => {
    const serviceKey = key as keyof typeof serviceImages;
    const colors = serviceColors[serviceKey];
    const route = serviceRoutes[serviceKey];
    
    return {
      id: route,
      key: serviceKey,
      title: t(`servicesData.${serviceKey}.title`),
      description: t(`servicesData.${serviceKey}.description`),
      image: serviceImages[serviceKey],
      features: [
        t(`servicesData.${serviceKey}.features.0`),
        t(`servicesData.${serviceKey}.features.1`),
      ],
      href: `${localePath}/services/${route}`,
      price: t.has(`servicesData.${serviceKey}.price`) ? t(`servicesData.${serviceKey}.price`) : undefined,
      ...colors,
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": isRTL ? "خدمات ديار جدة العالمية" : "Deyar Jeddah Services",
    "provider": {
      "@type": "Organization",
      "name": isRTL ? "ديار جدة العالمية" : "Deyar Jeddah",
      "url": "https://www.deyarsu.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isRTL ? "خدمات ديار جدة العالمية" : "Deyar Jeddah Services",
      "itemListElement": services
        .filter(service => service.price)
        .map(service => {
          const numericPrice = service.price ? service.price.replace(/[^\d]/g, '') : '';
          if (!numericPrice) return null;
          
          return {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": service.title,
              "description": service.description,
              "serviceType": service.title,
              "url": `https://www.deyarsu.com${service.href}`
            },
            "price": numericPrice,
            "priceCurrency": "SAR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "SAR",
              "price": numericPrice,
              "unitText": isRTL ? "ريال سعودي" : "Saudi Riyal"
            },
            "description": service.price
          };
        })
        .filter(Boolean)
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-[#0a0a0a]" dir={isRTL ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full mb-4">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">الخدمات الملكية</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" style={{ perspective: "2000px" }}>
          {services.map((service) => (
            <TiltCard 
              key={service.id} 
              service={service} 
              isRTL={isRTL} 
              ArrowIcon={ArrowIcon} 
              t={t} 
              localePath={localePath} 
            />
          ))}
        </div>

        <div className="text-center relative overflow-hidden bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-black rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('ctaTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button asChild size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30">
                <Link href="https://wa.me/+966553719009" className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <span>{t('contactNow')}</span>
                  <ArrowIcon className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Link href={`${localePath}/portfolio`} className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <span>{t('viewPortfolio')}</span>
                  <ArrowIcon className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
