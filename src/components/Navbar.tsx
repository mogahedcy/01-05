'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale, useTranslations } from 'next-intl';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Home,
  User,
  FileText,
  Star,
  Award,
  Search,
  Wrench,
  ChevronDown,
  Menu,
  X,
  Shield,
  Clock,
  CheckCircle,
  Tent,
  Car,
  Hammer,
  Grid,
  Layers,
  Trees,
  Building2,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations('navbar');
  const tFeatures = useTranslations('features');
  const tServices = useTranslations('services');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsMobileServicesOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    { icon: Star, text: tFeatures('experience'), color: 'text-amber-600' },
    { icon: Shield, text: tFeatures('warranty'), color: 'text-green-600' },
    { icon: Clock, text: tFeatures('service247'), color: 'text-blue-600' },
    { icon: CheckCircle, text: tFeatures('qualityGuaranteed'), color: 'text-emerald-600' }
  ];

  const mainNavItems = [
    { label: t('home'), href: `${localePath}/`, icon: Home },
    { label: t('about'), href: `${localePath}/about`, icon: User },
    { label: t('portfolio'), href: `${localePath}/portfolio`, icon: Building2 },
    { label: t('blog'), href: `${localePath}/articles`, icon: FileText },
    { label: t('contact'), href: `${localePath}/contact`, icon: Phone }
  ];

  const servicesItems = [
    {
      label: tServices('carShades.title'),
      href: `${localePath}/services/mazallat`,
      icon: Car,
      description: tServices('carShades.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: tServices('tents.title'),
      href: `${localePath}/services/khayyam`,
      icon: Tent,
      description: tServices('tents.description'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      label: tServices('hairHouses.title'),
      href: `${localePath}/services/byoot-shaar`,
      icon: Home,
      description: tServices('hairHouses.description'),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: tServices('fences.title'),
      href: `${localePath}/services/sawater`,
      icon: Shield,
      description: tServices('fences.description'),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: tServices('landscaping.title'),
      href: `${localePath}/services/landscaping`,
      icon: Trees,
      description: tServices('landscaping.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: tServices('pergolas.title'),
      href: `${localePath}/services/pergolas`,
      icon: Grid,
      description: tServices('pergolas.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: tServices('renovation.title'),
      href: `${localePath}/services/renovation`,
      icon: Hammer,
      description: tServices('renovation.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: tServices('sandwichPanel.title'),
      href: `${localePath}/services/sandwich-panel`,
      icon: Layers,
      description: tServices('sandwichPanel.description'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const companyName = isRTL ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals';
  const companySubtitle = isRTL ? 'خبرة +15 عاماً في جدة والمملكة' : '15+ Years in Jeddah & KSA';
  const location = isRTL ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia';

  return (
    <>
      <div className="bg-gradient-to-r from-primary via-primary/95 to-accent text-white py-2 hidden lg:block border-b border-white/10" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${isRTL ? 'space-x-6 space-x-reverse' : 'space-x-6'}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <Phone className="w-4 h-4" />
                <Link href="tel:+966553719009" className="hover:text-white/80 transition-colors font-medium text-sm">
                  +966 553 719 009
                </Link>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <Mail className="w-4 h-4" />
                <Link href="mailto:info@deyarsu.com" className="hover:text-white/80 transition-colors text-sm">
                  info@deyarsu.com
                </Link>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            </div>

            <div className={`flex items-center ${isRTL ? 'space-x-6 space-x-reverse' : 'space-x-6'}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                {features.slice(0, 3).map((feature) => (
                  <div key={feature.text} className={`flex items-center ${isRTL ? 'space-x-1.5 space-x-reverse' : 'space-x-1.5'}`}>
                    <feature.icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <Link
                  href="https://www.instagram.com/aldiyarglobal"
                  className="hover:text-white/80 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link
                  href="https://wa.me/966553719009"
                  className="hover:text-white/80 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-100 dark:border-gray-800'
            : 'bg-white dark:bg-gray-900 shadow-lg'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">

            <Link href={`${localePath}/`} className={`flex items-center ${isRTL ? 'space-x-2 sm:space-x-3 space-x-reverse' : 'space-x-2 sm:space-x-3'} group flex-shrink-0`}>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-lg lg:rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                </div>
                <div className={`absolute -top-0.5 ${isRTL ? '-right-0.5 sm:-right-1' : '-left-0.5 sm:-left-1'} w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md`}>
                  <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 text-white fill-current" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-amber-400 dark:to-green-400 leading-tight">
                  {companyName}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground dark:text-gray-400 hidden sm:block">
                  {companySubtitle}
                </div>
              </div>
            </Link>

            <div className={`flex items-center ${isRTL ? 'space-x-1 sm:space-x-2 space-x-reverse' : 'space-x-1 sm:space-x-2'} lg:hidden`}>
              <Link
                href="tel:+966553719009"
                className="p-2 sm:p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                aria-label={isRTL ? "اتصال" : "Call"}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              
              <Link
                href="https://wa.me/966553719009"
                className="p-2 sm:p-2.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <LanguageSwitcher />
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isRTL ? "القائمة" : "Menu"}
                className="w-10 h-10 sm:w-11 sm:h-11 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? 
                  <X className="w-5 h-5 sm:w-6 sm:h-6" /> : 
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                }
              </Button>
            </div>

            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}>
              {mainNavItems.slice(0, 2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent hover:bg-primary/5 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} group`}
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${localePath}/#services`;
                  }}
                  onFocus={() => setIsServicesOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsServicesOpen(true);
                    } else if (e.key === 'Escape') {
                      setIsServicesOpen(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent hover:bg-primary/5 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} group`}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-controls="services-menu"
                >
                  <Wrench className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('services')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isServicesOpen && (
                  <div 
                    id="services-menu"
                    className={`mega-menu absolute top-full ${isRTL ? 'right-0' : 'left-0'} w-[min(900px,calc(100vw-2rem))] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 transform translate-y-2 z-50 max-h-[calc(100vh-200px)] overflow-y-auto`}
                    role="menu"
                    aria-label={isRTL ? "قائمة الخدمات" : "Services Menu"}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-primary dark:text-accent mb-2">{t('specializedServices')}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{t('servicesDescription')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {servicesItems.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className={`flex items-start ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'} p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}
                          role="menuitem"
                        >
                          <div className={`p-3 rounded-lg ${service.bgColor} dark:bg-opacity-20 group-hover:scale-105 transition-transform`}>
                            <service.icon className={`w-6 h-6 ${service.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-accent transition-colors mb-1">
                              {service.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                        {features.map((feature) => (
                          <div key={feature.text} className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                            <feature.icon className={`w-4 h-4 ${feature.color}`} />
                            <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`${localePath}/quote`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        {t('getQuote')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {mainNavItems.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent hover:bg-primary/5 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} group`}
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
              <Button asChild variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary hover:text-white dark:border-primary/30 dark:text-primary-foreground dark:hover:bg-primary">
                <Link href={`${localePath}/search`} className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <Search className="w-4 h-4" />
                  <span>{t('search')}</span>
                </Link>
              </Button>

              <LanguageSwitcher />
              <ThemeToggle />

              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 px-6">
                <Link href="tel:+966553719009" className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <Phone className="w-4 h-4" />
                  <span>{t('callNow')}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/98 backdrop-blur-sm max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
              
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <Link href="tel:+966553719009" className="text-sm font-medium truncate">
                      +966 553 719 009
                    </Link>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                    <Link
                      href="https://wa.me/966553719009"
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                    <Link
                      href="https://www.instagram.com/aldiyarglobal"
                      className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'} px-3 sm:px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors active:bg-primary/10`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex items-center justify-between w-full rounded-lg hover:bg-primary/5 transition-colors">
                  <Link
                    href={`${localePath}/#services`}
                    className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'} px-3 sm:px-4 py-3 flex-1`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Wrench className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900">{t('services')}</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                    className={`px-3 sm:px-4 py-3 ${isRTL ? 'border-r' : 'border-l'} border-gray-100`}
                    aria-label={isRTL ? "عرض قائمة الخدمات" : "Show services menu"}
                    aria-expanded={isMobileServicesOpen}
                    aria-controls="mobile-services-menu"
                  >
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isMobileServicesOpen && (
                  <div 
                    id="mobile-services-menu"
                    className="bg-gray-50 rounded-lg mt-2 overflow-hidden"
                    role="menu"
                    aria-label={isRTL ? "قائمة الخدمات" : "Services Menu"}
                  >
                    {servicesItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'} px-3 sm:px-4 py-3 hover:bg-white transition-colors border-b border-gray-100 last:border-b-0 active:bg-primary/5`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileServicesOpen(false);
                        }}
                      >
                        <service.icon className={`w-5 h-5 ${service.color} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{service.label}</div>
                          <div className="text-xs text-gray-600 hidden sm:block truncate">{service.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-primary to-accent h-11 sm:h-12 text-base">
                  <Link href={`${localePath}/quote`} onClick={() => setIsMenuOpen(false)}>
                    {t('freeQuote')}
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="border-primary/20 text-primary h-10 text-sm">
                    <Link href={`${localePath}/search`} onClick={() => setIsMenuOpen(false)}>
                      {t('search')}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-10 text-sm">
                    <Link href={`${localePath}/contact`} onClick={() => setIsMenuOpen(false)}>
                      {t('contact')}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {features.map((feature) => (
                    <div key={feature.text} className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} p-2 bg-gray-50 rounded`}>
                      <feature.icon className={`w-3 h-3 ${feature.color} flex-shrink-0`} />
                      <span className="font-medium text-gray-700 truncate">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
