'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import arMessages from '../../messages/ar.json';
import enMessages from '../../messages/en.json';

interface IntlProviderProps {
  children: ReactNode;
  locale?: string;
}

export default function IntlProvider({ children, locale: propLocale }: IntlProviderProps) {
  const params = useParams();
  const locale = propLocale || (params?.locale as string) || 'ar';
  const messages = locale === 'en' ? enMessages : arMessages;
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Riyadh">
      {children}
    </NextIntlClientProvider>
  );
}
