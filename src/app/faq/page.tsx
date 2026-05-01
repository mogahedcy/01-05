import type { Metadata } from 'next';
import { Suspense } from 'react';
import FAQPageClient from './FAQPageClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { generateCanonicalUrl } from '@/lib/seo-utils';
import { prisma } from '@/lib/prisma';
import EnhancedFAQSchema from '@/components/EnhancedFAQSchema';
import IntlProvider from '@/components/IntlProvider';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة | ديار جدة العالمية - إجابات شاملة',
  description: 'إجابات شاملة على الأسئلة الشائعة حول خدمات ديار جدة العالمية في جدة. المظلات، السواتر، البرجولات، الخيام، الأسعار، الضمان، التركيب والصيانة.',
  keywords: 'أسئلة شائعة جدة، مظلات أسئلة، سواتر أسئلة، أسعار مظلات، ضمان مظلات، ديار جدة العالمية',
  authors: [{ name: 'ديار جدة العالمية' }],
  creator: 'ديار جدة العالمية',
  publisher: 'ديار جدة العالمية',
  robots: 'index, follow',
  openGraph: {
    title: 'الأسئلة الشائعة | ديار جدة العالمية',
    description: 'إجابات شاملة على الأسئلة الشائعة حول خدماتنا في جدة',
    url: generateCanonicalUrl('/faq'),
    siteName: 'ديار جدة العالمية',
    images: [
      {
        url: 'https://www.deyarsu.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'الأسئلة الشائعة - ديار جدة العالمية'
      }
    ],
    locale: 'ar_SA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الأسئلة الشائعة | ديار جدة العالمية',
    description: 'إجابات شاملة على الأسئلة الشائعة حول خدماتنا',
    images: ['https://www.deyarsu.com/logo.png']
  },
  alternates: {
    canonical: '/faq'
  }
};

async function getFAQs() {
  try {
    const faqs = await prisma.faqs.findMany({
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
        category: true,
        slug: true,
        metaTitle: true,
        keywords: true,
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
        <p className="text-gray-600">جاري تحميل الأسئلة الشائعة...</p>
      </div>
    </div>
  );
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  
  return (
    <IntlProvider locale="ar">
      <EnhancedFAQSchema faqs={faqs} />
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <FAQPageClient initialFAQs={faqs} />
      </Suspense>
      <Footer />
    </IntlProvider>
  );
}
