'use client';

import Link from 'next/link';
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Instagram,
  Twitter,
  MessageCircle,
  Star,
  Award,
  Shield,
  Users,
  Building,
  Umbrella,
  TreePine,
  Wrench,
  Hammer,
  Tent,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
  Calendar,
  Send,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

const serviceIcons = {
  carShades: Umbrella,
  pergolas: Building,
  fences: Shield,
  sandwichPanel: Wrench,
  renovation: Hammer,
  landscaping: TreePine,
  traditionalHouses: Tent,
  royalTents: Award,
};

const serviceColors = {
  carShades: 'text-blue-400',
  pergolas: 'text-green-400',
  fences: 'text-purple-400',
  sandwichPanel: 'text-orange-400',
  renovation: 'text-red-400',
  landscaping: 'text-emerald-400',
  traditionalHouses: 'text-amber-400',
  royalTents: 'text-indigo-400',
};

const serviceRoutes = {
  carShades: 'mazallat',
  pergolas: 'pergolas',
  fences: 'sawater',
  sandwichPanel: 'sandwich-panel',
  renovation: 'renovation',
  landscaping: 'landscaping',
  traditionalHouses: 'byoot-shaar',
  royalTents: 'khayyam',
};

const quickLinkIcons = {
  portfolio: Building,
  about: Award,
  articles: ExternalLink,
  quotes: Send,
  faq: CheckCircle,
  contact: MessageCircle,
  privacy: Shield,
  terms: CheckCircle,
};

const quickLinkRoutes = {
  portfolio: '/portfolio',
  about: '/about',
  articles: '/articles',
  quotes: '/quote',
  faq: '/faq',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/aldiyarglobal',
    icon: Instagram,
    color: 'hover:bg-pink-600',
    bgColor: 'bg-pink-500'
  },
  {
    name: 'Twitter / X',
    href: 'https://x.com/jedahdeyar',
    icon: Twitter,
    color: 'hover:bg-slate-900',
    bgColor: 'bg-slate-800'
  },
  {
    name: 'Snapchat',
    href: 'https://www.snapchat.com/add/abdulkader9696',
    icon: ({ className }: { className: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.1 2.6c2.2 0 3.9 1.7 3.9 3.8 0 .5-.1 1-.3 1.5 1 .6 2.2 1 3.4 1.2.3.1.5.4.4.7-.1.4-.7 1-1.8 1.4-.2.1-.4.2-.6.2.1.4.2.8.2 1.2 0 2.9-2.4 5.2-5.3 5.2-2.9 0-5.3-2.3-5.3-5.2 0-.4.1-.8.2-1.2-.2-.1-.4-.1-.6-.2-1.1-.4-1.7-1-1.8-1.4-.1-.3.1-.6.4-.7 1.2-.3 2.4-.7 3.4-1.2-.2-.5-.3-1-.3-1.5 0-2.1 1.7-3.8 3.9-3.8zm0 1.5c-1.4 0-2.5 1-2.5 2.3 0 .5.2 1 .5 1.5.2.2.2.5.1.7-.1.2-.2.3-.4.4-.8.5-1.9.9-2.9 1.2.3.2.6.4 1 .5.4.2.8.3 1.1.4.2.1.4.2.5.4.1.2.1.4 0 .6-.2.4-.3.8-.3 1.2 0 2.1 1.7 3.7 3.9 3.7s3.9-1.7 3.9-3.7c0-.4-.1-.8-.3-1.2-.1-.2-.1-.4 0-.6.1-.2.3-.3.5-.4.3-.1.7-.2 1.1-.4.4-.2.7-.3 1-.5-1-.3-2.1-.7-2.9-1.2-.2-.1-.4-.2-.4-.4-.1-.2 0-.5.1-.7.3-.4.5-.9.5-1.5 0-1.3-1.1-2.3-2.5-2.3z"/>
      </svg>
    ),
    color: 'hover:bg-yellow-500 hover:text-black',
    bgColor: 'bg-yellow-400'
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const t = useTranslations('footer');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';

  const services = Object.keys(serviceIcons).map((key) => {
    const serviceKey = key as keyof typeof serviceIcons;
    return {
      name: t(`services.${serviceKey}`),
      href: `${localePath}/services/${serviceRoutes[serviceKey]}`,
      icon: serviceIcons[serviceKey],
      color: serviceColors[serviceKey],
    };
  });

  const quickLinks = Object.keys(quickLinkIcons).map((key) => {
    const linkKey = key as keyof typeof quickLinkIcons;
    return {
      name: t(`links.${linkKey}`),
      href: `${localePath}${quickLinkRoutes[linkKey]}`,
      icon: quickLinkIcons[linkKey],
    };
  });

  const areas = ['north', 'central', 'east', 'south', 'west', 'faisaliyah', 'zahra', 'naim'].map((area) => 
    t(`areas.${area}`)
  );

  const achievements = [
    { icon: Users, number: '5000+', label: t('stats.clients'), color: 'text-blue-400' },
    { icon: Building, number: '5000+', label: t('stats.projects'), color: 'text-green-400' },
    { icon: Award, number: '15', label: t('stats.experience'), color: 'text-yellow-400' },
    { icon: Star, number: '4.9', label: t('stats.rating'), color: 'text-purple-400' }
  ];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const spaceClass = isRTL ? 'space-x-reverse space-x-' : 'space-x-';

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'} mb-6`}>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -top-2 ${isRTL ? '-right-2' : '-left-2'} w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center`}>
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {t('companyName')}
                  </h2>
                  <p className="text-accent text-sm font-medium">
                    {t('companySubtitle')}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                {t('companyDescription')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.label} className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <achievement.icon className={`w-6 h-6 mx-auto mb-2 ${achievement.color}`} />
                    <div className="text-2xl font-bold text-white mb-1">
                      {achievement.number}
                    </div>
                    <div className="text-xs text-gray-400">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{t('stayConnected')}</h3>
                <p className="text-gray-300">{t('latestOffers')}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className={`flex items-center justify-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                  <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} bg-white/10 rounded-full px-4 py-2`}>
                    <Phone className="w-4 h-4 text-accent" />
                    <Link href="tel:+966553719009" className="text-white hover:text-accent transition-colors font-medium">
                      966553719009+
                    </Link>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} bg-white/10 rounded-full px-4 py-2`}>
                    <Mail className="w-4 h-4 text-accent" />
                    <Link href="mailto:info@deyarsu.com" className="text-white hover:text-accent transition-colors font-medium">
                      {t('emailContact')}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-4">{t('followUs')}</h4>
                <div className={`flex justify-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 ${social.bgColor} rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="footer-buttons flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  asChild 
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 py-6 text-base font-bold rounded-xl focus-visible-ring"
                  aria-label={t('requestQuote')}
                >
                  <Link href={`${localePath}/quote`} className={`flex items-center justify-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <Send className="w-5 h-5" />
                    <span>{t('requestQuote')}</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1 border-white/30 text-white hover:bg-white/10 py-6 text-base font-bold rounded-xl focus-visible-ring"
                  aria-label="WhatsApp"
                >
                  <Link href="https://wa.me/966553719009" className={`flex items-center justify-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-links grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className={`text-xl font-bold text-white mb-6 flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Wrench className="w-5 h-5 text-accent" />
              <span>{t('ourServices')}</span>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-gray-300 hover:text-white transition-colors duration-200 group`}
                  >
                    <service.icon className={`w-4 h-4 ${service.color} group-hover:scale-110 transition-transform`} />
                    <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-white mb-6 flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <ExternalLink className="w-5 h-5 text-accent" />
              <span>{t('quickLinks')}</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-gray-300 hover:text-white transition-colors duration-200 group`}
                  >
                    <link.icon className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                    <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-white mb-6 flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <MapPin className="w-5 h-5 text-accent" />
              <span>{t('serviceAreas')}</span>
            </h3>
            <ul className="space-y-3">
              {areas.map((area) => (
                <li key={area} className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-gray-300 hover:text-white transition-colors duration-200 group`}>
                  <CheckCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-white mb-6 flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Phone className="w-5 h-5 text-accent" />
              <span>{t('contactInfo')}</span>
            </h3>
            <div className="space-y-4">
              <div className={`flex items-start ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t('callUs')}</p>
                  <Link href="tel:+966553719009" className="text-white hover:text-accent transition-colors font-medium">
                    966553719009+
                  </Link>
                </div>
              </div>

              <div className={`flex items-start ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t('emailContact')}</p>
                  <Link href="mailto:info@deyarsu.com" className="text-white hover:text-accent transition-colors font-medium">
                    info@deyarsu.com
                  </Link>
                </div>
              </div>

              <div className={`flex items-start ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t('location')}</p>
                  <p className="text-white">{t('jeddahSA')}</p>
                </div>
              </div>

              <div className={`flex items-start ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t('workHours')}</p>
                  <p className="text-white">{t('customerService247')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sr-only">
          <p>{t('seo.description')}</p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'} text-sm text-gray-400`}>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <Globe className="w-4 h-4" />
                <span>© {currentYear} {t('companyName')}</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <Heart className="w-4 h-4 text-red-400" />
                <span>{t('allRightsReserved')}</span>
              </div>
            </div>

            <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'} text-sm`}>
              <Link href={`${localePath}/privacy`} className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <span className="text-gray-600">•</span>
              <Link href={`${localePath}/terms`} className="text-gray-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="https://www.deyarsu.com" className="text-accent hover:text-white transition-colors font-medium">
                www.deyarsu.com
              </Link>
            </div>
          </div>

          <div className="border-t border-white/5 mt-6 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                {t('developedBy')}
              </p>
              <div className={`flex items-center justify-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                <span className="text-accent font-medium">Mujahed Ahmed Alhemiry</span>
                <Link
                  href="tel:+967773505749"
                  className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-gray-400 hover:text-accent transition-colors`}
                >
                  <Phone className="w-4 h-4" />
                  <span>967773505749+</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
