'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Loader2 } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' }
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    setIsOpen(false);
    
    // Safety check: ensure pathname doesn't already contain the locale prefix
    // though next-intl usePathname should handle this, some browser states might differ
    let cleanPathname = pathname;
    if (cleanPathname.startsWith('/en/') || cleanPathname === '/en') {
      cleanPathname = cleanPathname.replace(/^\/en/, '') || '/';
    }
    
    startTransition(() => {
      router.replace(cleanPathname, { locale: newLocale as 'ar' | 'en' });
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
        aria-label="تغيير اللغة / Change Language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : (
          <Globe className="w-4 h-4 text-primary" />
        )}
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-xs">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                locale === lang.code 
                  ? 'bg-primary/5 text-primary font-semibold' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              role="menuitem"
              dir={lang.dir}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {locale === lang.code && (
                <span className="mr-auto rtl:ml-auto rtl:mr-0 text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
