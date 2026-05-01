'use client';

import { useEffect } from 'react';

interface LocaleHtmlUpdaterProps {
  locale: string;
}

export default function LocaleHtmlUpdater({ locale }: LocaleHtmlUpdaterProps) {
  useEffect(() => {
    const html = document.documentElement;
    
    if (locale === 'en') {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    } else {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    }
  }, [locale]);

  return null;
}
