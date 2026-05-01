'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Globe,
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

export default function NavbarArabic() {
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
    { icon: Star, text: '15 عام خبرة', color: 'text-amber-600' },
    { icon: Shield, text: 'ضمان 10 سنوات', color: 'text-green-600' },
    { icon: Clock, text: 'خدمة 24/7', color: 'text-blue-600' },
    { icon: CheckCircle, text: 'جودة مضمونة', color: 'text-emerald-600' }
  ];

  const mainNavItems = [
    { label: 'الرئيسية', href: '/', icon: Home },
    { label: 'من نحن', href: '/about', icon: User },
    { label: 'أعمالنا', href: '/portfolio', icon: Building2 },
    { label: 'المدونة', href: '/articles', icon: FileText },
    { label: 'تواصل معنا', href: '/contact', icon: Phone }
  ];

  const servicesItems = [
    {
      label: 'مظلات سيارات',
      href: '/services/mazallat',
      icon: Car,
      description: 'مظلات سيارات عالية الجودة بتصاميم متنوعة',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'خيام ملكية',
      href: '/services/khayyam',
      icon: Tent,
      description: 'خيام ملكية فاخرة للمناسبات والحدائق',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'بيوت شعر',
      href: '/services/byoot-shaar',
      icon: Home,
      description: 'بيوت شعر تراثية أصيلة بتصاميم عصرية',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'برجولات',
      href: '/services/pergolas',
      icon: Grid,
      description: 'برجولات خشبية وحديدية للحدائق والمسابح',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'سواتر',
      href: '/services/sawater',
      icon: Layers,
      description: 'سواتر للخصوصية والحماية بأنواعها المختلفة',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'ساندوتش بانل',
      href: '/services/sandwich-panel',
      icon: Building2,
      description: 'ساندوتش بانل للعزل الحراري والصوتي',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'تنسيق حدائق',
      href: '/services/landscaping',
      icon: Trees,
      description: 'تنسيق وتصميم الحدائق المنزلية والتجارية',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'ترميم ملحقات',
      href: '/services/renovation',
      icon: Hammer,
      description: 'ترميم وصيانة جميع أنواع الملحقات',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const pathname = usePathname() || '/';
  const isEnglish = pathname.startsWith('/en');
  
  const toggleLanguage = () => {
    if (isEnglish) {
      const newPath = pathname.replace(/^\/en/, '');
      window.location.href = newPath || '/';
    } else {
      window.location.href = `/en${pathname}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full" dir="rtl">
      <div className="bg-primary text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a 
                href="mailto:info@deyarsu.com" 
                className="flex items-center hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 ml-2" />
                info@deyarsu.com
              </a>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 ml-2" />
                جدة، المملكة العربية السعودية
              </span>
            </div>
            <div className="flex items-center gap-4">
              {features.map((feature, index) => (
                <span key={index} className={`flex items-center ${feature.color} bg-white/10 px-2 py-0.5 rounded-full text-xs`}>
                  <feature.icon className="w-3 h-3 ml-1" />
                  {feature.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">د</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-primary dark:text-white">ديار جدة العالمية</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">العالمية</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              <div 
                className="relative group"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium">
                  <Wrench className="w-4 h-4" />
                  خدماتنا
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-2 gap-2">
                    {servicesItems.map((service, index) => (
                      <Link
                        key={index}
                        href={service.href}
                        className={`flex items-start gap-3 p-3 rounded-xl hover:${service.bgColor} dark:hover:bg-gray-800 transition-colors group`}
                      >
                        <div className={`p-2 rounded-lg ${service.bgColor} ${service.color} group-hover:scale-110 transition-transform`}>
                          <service.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">{service.label}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/search"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                بحث
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={isEnglish ? "التبديل للعربية" : "Switch to English"}
              >
                <Globe className="w-5 h-5" />
                <span className="sr-only">Toggle Language</span>
              </button>
              
              <ThemeToggle />
              <a
                href="https://wa.me/966553719009"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>

              <button
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              >
                <span className="flex items-center gap-3">
                  <Wrench className="w-5 h-5" />
                  خدماتنا
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileServicesOpen && (
                <div className="pr-8 mt-2 space-y-1">
                  {servicesItems.map((service, index) => (
                    <Link
                      key={index}
                      href={service.href}
                      className={`flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <service.icon className={`w-4 h-4 ${service.color}`} />
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/search"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="w-5 h-5" />
              بحث
            </Link>

            <div className="mt-4 px-4">
              <a
                href="https://wa.me/966553719009"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
