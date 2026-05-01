'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Home, Briefcase, Phone, MessageCircle, FolderKanban } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();
  const params = useParams();
  
  const locale = (params?.locale as string) || (pathname.startsWith('/en') ? 'en' : 'ar');
  const isRTL = locale === 'ar';

  const navItems = [
    {
      label: isRTL ? 'الرئيسية' : 'Home',
      href: isRTL ? '/' : '/en',
      matchPaths: ['/', '/ar', '/en'],
      icon: Home,
    },
    {
      label: isRTL ? 'خدماتنا' : 'Services',
      href: isRTL ? '/#services' : '/en#services',
      matchPaths: ['/services', '/#services', '/en#services'],
      icon: Briefcase,
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/+966553719009',
      matchPaths: [],
      icon: MessageCircle,
      external: true,
    },
    {
      label: isRTL ? 'معرض الأعمال' : 'Portfolio',
      href: '/portfolio',
      matchPaths: ['/portfolio'],
      icon: FolderKanban,
    },
    {
      label: isRTL ? 'اتصل بنا' : 'Contact',
      href: '/contact',
      matchPaths: ['/contact'],
      icon: Phone,
    },
  ];

  const isItemActive = (matchPaths: string[]) => {
    return matchPaths.some(path => {
      const cleanPathname = pathname.replace(/\/$/, '');
      const cleanPath = path.replace(/\/$/, '');
      
      if (path === '/' || path === '/ar' || path === '/en') {
        return cleanPathname === '' || cleanPathname === '/' || cleanPathname === '/ar' || cleanPathname === '/en';
      }
      
      return cleanPathname === cleanPath || cleanPathname.startsWith(cleanPath + '/');
    });
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-100 shadow-2xl z-50 lg:hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.matchPaths);
          
          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full space-y-1 touch-target transition-all duration-200 active:scale-95 text-gray-600 hover:text-accent"
              >
                <div className="relative rounded-full p-1.5">
                  <Icon className="w-5 h-5" />
                  {item.icon === MessageCircle && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 touch-target transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-accent'
                  : 'text-gray-600 hover:text-accent'
              }`}
            >
              <div className={`relative ${isActive ? 'bg-accent/10' : ''} rounded-full p-1.5`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-accent' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
