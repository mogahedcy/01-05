import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Home, Phone, MessageCircle } from 'lucide-react';
import { generateCanonicalUrl } from '@/lib/seo-utils';
import ShareButton from '@/components/ShareButton';
import IntlProvider from '@/components/IntlProvider';
import RelatedProjects from '@/components/RelatedProjects';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import FloatingCallButton from '@/components/FloatingCallButton';
import BottomNavigation from '@/components/BottomNavigation';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getFAQ(slug: string) {
  try {
    const faq = await prisma.faqs.findFirst({
      where: {
        slug: decodeURIComponent(slug),
        status: 'PUBLISHED'
      }
    });
    return faq;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const faqData = await getFAQ(slug);
  const faq = faqData as any;
  const isEn = locale === 'en';

  if (!faq) {
    return {
      title: isEn ? 'Question Not Found | Aldeyar Global' : 'سؤال غير موجود | ديار جدة العالمية',
    };
  }

  const title = isEn 
    ? (faq.metaTitleEn || `${faq.questionEn || faq.question} | FAQ - Aldeyar Global`)
    : (faq.metaTitle || `${faq.question} | الأسئلة الشائعة - ديار جدة العالمية`);

  const description = isEn
    ? (faq.metaDescriptionEn || (faq.answerEn || faq.answer).substring(0, 160))
    : (faq.metaDescription || faq.answer.substring(0, 160));

  const arUrl = generateCanonicalUrl(`/faq/${slug}`);
  const enUrl = generateCanonicalUrl(`/en/faq/${slug}`);

  return {
    title,
    description,
    keywords: isEn ? (faq.keywordsEn || faq.keywords) : (faq.keywords || `أسئلة شائعة، ${faq.category}، ديار جدة العالمية`),
    alternates: {
      canonical: isEn ? enUrl : arUrl,
      languages: {
        'ar': arUrl,
        'en': enUrl,
        'x-default': arUrl
      }
    },
    openGraph: {
      title,
      description,
      url: isEn ? enUrl : arUrl,
      siteName: isEn ? 'Aldeyar Global Professionals' : 'ديار جدة العالمية',
      locale: isEn ? 'en_US' : 'ar_SA',
      type: 'article',
      images: [{ url: 'https://www.deyarsu.com/logo.png', width: 1200, height: 630 }]
    }
  };
}

export default async function FAQDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const faqData = await getFAQ(slug);
  const faq = faqData as any;
  const isEn = locale === 'en';

  if (!faq) notFound();

  // التحويل للمحتوى الصحيح بناءً على اللغة
  const displayQuestion = isEn ? (faq.questionEn || faq.question) : faq.question;
  const displayAnswer = isEn ? (faq.answerEn || faq.answer) : faq.answer;
  const displayCategory = faq.category;

  const cleanText = (text: string): string => {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    "inLanguage": isEn ? "en" : "ar-SA",
    mainEntity: [{
      '@type': 'Question',
      name: cleanText(displayQuestion),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanText(displayAnswer)
      }
    }]
  };

  return (
    <IntlProvider locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={isEn ? "/en" : "/"} className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{isEn ? 'Home' : 'الرئيسية'}</span>
            </Link>
            <span>/</span>
            <Link href={isEn ? "/en/faq" : "/faq"} className="hover:text-accent transition-colors">
              {isEn ? 'FAQ' : 'الأسئلة الشائعة'}
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">{displayCategory}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8">
              <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary/5 p-8 border-b border-gray-100">
                  <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold mb-4">
                    {displayCategory}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                    {displayQuestion}
                  </h1>
                </div>

                <div className="p-8">
                  <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-primary mb-8">
                    <div dangerouslySetInnerHTML={{ __html: displayAnswer }} />
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <Link href={isEn ? "/en/faq" : "/faq"} className="flex items-center gap-2 text-accent hover:underline font-medium">
                      <ArrowRight className={`w-4 h-4 ${isEn ? 'rotate-180' : ''}`} />
                      <span>{isEn ? 'Back to all questions' : 'العودة إلى جميع الأسئلة'}</span>
                    </Link>
                    <ShareButton title={displayQuestion} text={cleanText(displayAnswer)} />
                  </div>
                </div>
              </article>
              
              <div className="mt-8">
                 <RelatedProjects category={faq.category} currentId={faq.id} />
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-primary rounded-2xl p-6 text-white shadow-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4">{isEn ? 'Expert Consultation' : 'تحدث مع خبرائنا'}</h3>
                <p className="text-white/80 mb-6 text-sm">
                  {isEn ? 'Have more questions? Our experts in Jeddah are ready to help.' : 'لديك سؤال إضافي؟ فريقنا من الخبراء جاهز لمساعدتك في جدة.'}
                </p>
                <div className="space-y-3">
                  <a href="tel:+966553719009" className="flex items-center justify-center gap-2 w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-all">
                    <Phone className="w-5 h-5" />
                    {isEn ? 'Call Us' : 'اتصل بنا'}
                  </a>
                  <a href="https://wa.me/966553719009" className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all">
                    <MessageCircle className="w-5 h-5" />
                    {isEn ? 'WhatsApp' : 'واتساب'}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppWidget />
      <FloatingCallButton />
      <BottomNavigation />
    </IntlProvider>
  );
}
