import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { generateCanonicalUrl } from '@/lib/seo-utils';
import ShareButton from '@/components/ShareButton';
import IntlProvider from '@/components/IntlProvider';
import RelatedProjects from '@/components/RelatedProjects';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getFAQ(slug: string) {
  try {
    const faq = await prisma.faqs.findFirst({
      where: {
        slug,
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
  const { slug } = await params;
  const faq = await getFAQ(slug);

  if (!faq) {
    return {
      title: 'سؤال غير موجود | ديار جدة العالمية',
      description: 'السؤال المطلوب غير موجود'
    };
  }

  const title = faq.metaTitle || `${faq.question} | الأسئلة الشائعة - ديار جدة العالمية`;
  const description = faq.metaDescription || faq.answer.substring(0, 160);

  return {
    title,
    description,
    keywords: faq.keywords || `أسئلة شائعة، ${faq.category}، ديار جدة العالمية`,
    authors: [{ name: 'ديار جدة العالمية' }],
    openGraph: {
      title,
      description,
      url: generateCanonicalUrl(`/faq/${slug}`),
      siteName: 'ديار جدة العالمية',
      locale: 'ar_SA',
      type: 'article',
      images: [
        {
          url: 'https://www.deyarsu.com/logo.png',
          width: 1200,
          height: 630,
          alt: faq.question
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.deyarsu.com/logo.png']
    },
    alternates: {
      canonical: generateCanonicalUrl(`/faq/${slug}`)
    }
  };
}

export default async function FAQDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const faq = await getFAQ(slug);

  if (!faq) {
    notFound();
  }

  const cleanText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: cleanText(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanText(faq.answer)
      }
    }]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://www.deyarsu.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'الأسئلة الشائعة',
        item: 'https://www.deyarsu.com/faq'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: faq.question,
        item: `https://www.deyarsu.com/faq/${slug}`
      }
    ]
  };

  return (
    <IntlProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            <span>/</span>
            <Link href="/faq" className="hover:text-accent transition-colors">
              الأسئلة الشائعة
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">{faq.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold mb-3">
                        {faq.category}
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-primary">
                        {faq.question}
                      </h1>
                    </div>
                  </div>

                  {faq.views > 0 && (
                    <p className="text-sm text-gray-600">
                      {faq.views} مشاهدة
                    </p>
                  )}
                </div>

                <div className="p-8">
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">الإجابة:</h2>
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-primary prose-p:text-gray-700 prose-p:leading-relaxed text-right"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/faq"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة إلى جميع الأسئلة</span>
                    </Link>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">شارك:</span>
                      <ShareButton title={faq.question} text={faq.answer} />
                    </div>
                  </div>
                </div>
              </article>

              {faq.relatedQuestions && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">أسئلة ذات صلة</h3>
                  <div className="space-y-2">
                    {faq.relatedQuestions.split(',').map((q, i) => (
                      <Link
                        key={i}
                        href="/faq"
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                      >
                        • {q.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* مشاريع ذات صلة - Cross-Selling */}
              <div className="mt-4">
                <RelatedProjects category={faq.category} />
              </div>
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                {/* بطاقة الخبراء */}
                <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-2">💬 تحدث مع خبرائنا</h3>
                  <p className="text-white/80 text-sm mb-4">
                    لديك سؤال إضافي؟ فريقنا من الخبراء جاهز لمساعدتك في جدة.
                  </p>
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-white/90 transition-colors"
                  >
                    🟢 واتساب مجاني
                  </a>
                </div>

                {/* تقييم ديار */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">⭐ ثقة العملاء</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-xl">★★★★★</span>
                    <span className="text-gray-700 font-semibold">4.9 / 5</span>
                  </div>
                  <p className="text-sm text-gray-600">+1000 مشروع منجز في جدة والمنطقة الغربية</p>
                </div>

                {/* رابط عرض السعر */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">💰 احصل على سعر فوري</h3>
                  <p className="text-sm text-gray-600 mb-4">احسب تكلفة مشروعك مجاناً عبر أداة تقدير الأسعار</p>
                  <Link
                    href="/quote"
                    className="block w-full text-center bg-accent text-white font-bold py-3 px-4 rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    احسب السعر الآن
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </IntlProvider>
  );
}
