import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import ContactPageClient from './ContactPageClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const canonicalPath = isArabic ? '/contact' : '/en/contact';
  
  return {
    title: isArabic 
      ? 'تواصل معنا | ديار جدة العالمية - خدمة العملاء 24/7'
      : 'Contact Us | Aldeyar Global Professionals - 24/7 Customer Service',
    description: isArabic
      ? 'تواصل مع فريق ديار جدة العالمية في جدة عبر الهاتف أو واتساب. خدمة عملاء متميزة 24/7، استشارة مجانية فورية.'
      : 'Contact Aldeyar Global Professionals team in Jeddah via phone or WhatsApp. Excellent 24/7 customer service, instant free consultation.',
    keywords: isArabic
      ? 'تواصل معنا جدة، خدمة العملاء، استشارة مجانية، رقم تواصل مظلات'
      : 'contact us jeddah, customer service, free consultation, shades contact number',
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ar': `${baseUrl}/contact`,
        'en': `${baseUrl}/en/contact`,
        'x-default': `${baseUrl}/contact`,
      },
    },
    openGraph: {
      title: isArabic ? 'تواصل معنا | ديار جدة العالمية' : 'Contact Us | Aldeyar Global Professionals',
      description: isArabic 
        ? 'تواصل مع فريق ديار جدة العالمية في جدة. خدمة عملاء متميزة 24/7.'
        : 'Contact Aldeyar Global Professionals team in Jeddah. Excellent 24/7 customer service.',
      url: `${baseUrl}${canonicalPath}`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'تواصل معنا - ديار جدة العالمية' : 'Contact Us - Aldeyar Global Professionals',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'تواصل معنا | ديار جدة العالمية' : 'Contact Us | Aldeyar Global Professionals',
      description: isArabic ? 'خدمة عملاء متميزة 24/7 واستشارة مجانية في جدة' : 'Excellent 24/7 customer service and free consultation in Jeddah',
      images: [`${baseUrl}/logo.png`],
    }
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <ContactPageClient locale={locale} />;
}
