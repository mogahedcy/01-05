import type { Metadata } from 'next';
import { Suspense } from 'react';
import FAQPageClient from '@/app/[locale]/faq/FAQPageClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import EnhancedFAQSchema from '@/components/EnhancedFAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import IntlProvider from '@/components/IntlProvider';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'الأسئلة الشائعة | ديار جدة العالمية - إجابات شاملة' : 'FAQ | Aldeyar Global Professionals - Comprehensive Answers',
    description: isArabic
      ? 'إجابات شاملة على الأسئلة الشائعة حول خدمات ديار جدة العالمية في جدة. المظلات، السواتر، البرجولات، الخيام، الأسعار، الضمان، التركيب والصيانة.'
      : 'Comprehensive answers to frequently asked questions about Aldeyar Global services in Jeddah. Shades, fences, pergolas, tents, prices, warranty, installation and maintenance.',
    keywords: isArabic
      ? 'أسئلة شائعة جدة، مظلات أسئلة، سواتر أسئلة، أسعار مظلات، ضمان مظلات، ديار جدة العالمية'
      : 'FAQ Jeddah, shade questions, fence questions, shade prices, shade warranty, Aldeyar Global Professionals',
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals' }],
    robots: 'index, follow',
    openGraph: {
      title: isArabic ? 'الأسئلة الشائعة | ديار جدة العالمية' : 'FAQ | Aldeyar Global Professionals',
      description: isArabic ? 'إجابات شاملة على الأسئلة الشائعة حول خدماتنا في جدة' : 'Comprehensive answers to FAQ about our services in Jeddah',
      url: `https://www.deyarsu.com/${locale}/faq`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals',
      images: [
        {
          url: 'https://www.deyarsu.com/logo.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'الأسئلة الشائعة - ديار جدة العالمية' : 'FAQ - Aldeyar Global Professionals'
        }
      ],
      locale: isArabic ? 'ar_SA' : 'en_US',
      type: 'website'
    },
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {
        'ar': '/ar/faq',
        'en': '/en/faq',
        'x-default': '/ar/faq'
      }
    }
  };
}

async function getFAQs() {
  try {
    const faqs = await (prisma as any).faqs.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { views: 'desc' }
      ],
      select: {
        id: true,
        question: true,
        answer: true,
        questionEn: true,
        answerEn: true,
        category: true,
        slug: true,
        metaTitle: true,
        metaTitleEn: true,
        keywords: true,
        keywordsEn: true,
        featured: true,
        order: true,
        views: true,
        helpfulness: true,
        createdAt: true
      }
    });
    
    return faqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

function LoadingFallback({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{locale === 'ar' ? 'جاري تحميل الأسئلة الشائعة...' : 'Loading FAQ...'}</p>
      </div>
    </div>
  );
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const faqsData = await getFAQs();
  const faqs = faqsData as any[];
  
  const breadcrumbItems = [
    { label: locale === 'en' ? 'FAQ' : 'الأسئلة الشائعة', href: `/${locale}/faq`, current: true }
  ];

  return (
    <IntlProvider locale={locale}>
      <EnhancedFAQSchema faqs={faqs} />
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <Navbar />
      <Suspense fallback={<LoadingFallback locale={locale} />}>
        <FAQPageClient initialFAQs={faqs} locale={locale} />
      </Suspense>
      <Footer />
    </IntlProvider>
  );
}
