'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  featured: boolean;
}

const categoryKeys = ['all', 'carShades', 'fences', 'royalTents', 'traditionalHouses', 'pergolas', 'landscaping', 'hangars', 'chainLink', 'tiles', 'sandwichPanel'];

const categoryMapping: Record<string, string> = {
  'all': 'الكل',
  'carShades': 'مظلات سيارات',
  'fences': 'سواتر',
  'royalTents': 'خيم ملكية',
  'traditionalHouses': 'بيوت شعر ملكي',
  'pergolas': 'برجولات',
  'landscaping': 'تنسيق حدائق',
  'hangars': 'هناجر',
  'chainLink': 'شبوك',
  'tiles': 'قراميد',
  'sandwichPanel': 'ساندوتش بانل'
};

export default function FAQSection({ initialFaqs = [] }: { initialFaqs?: FAQ[] }) {
  const locale = useLocale();
  const t = useTranslations('faq');
  const isRTL = locale === 'ar';
  const isFirstRender = React.useRef(true);

  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [loading, setLoading] = useState(initialFaqs.length === 0);
  const [openFAQ, setOpenFAQ] = useState<string | null>(initialFaqs.length > 0 ? initialFaqs[0].id : null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = categoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
    arabicLabel: categoryMapping[key]
  }));

  useEffect(() => {
    if (isFirstRender.current && initialFaqs.length > 0) {
      isFirstRender.current = false;
      setLoading(false);
      return;
    }
    isFirstRender.current = false;

    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faqs?status=PUBLISHED&limit=50');
        const data = await response.json();
        
        if (data.success && data.faqs) {
          setFaqs(data.faqs);
          if (data.faqs.length > 0 && !openFAQ) {
            setOpenFAQ(data.faqs[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (faqs.length === 0) {
      fetchFAQs();
    }
  }, [initialFaqs, faqs.length, openFAQ]);

  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => {
        const arabicCategory = categoryMapping[selectedCategory];
        return faq.category === arabicCategory;
      });

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const generateFAQSchema = () => {
    if (!faqs || faqs.length === 0) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    return JSON.stringify(schema);
  };

  const faqSchema = generateFAQSchema();

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className={`transition-all duration-300 ${
                selectedCategory === category.key
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'hover:bg-accent/10 hover:border-accent'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-4 mb-12">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className={`w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      faq.category === 'مظلات' ? 'bg-blue-100 text-blue-700' :
                      faq.category === 'ساندوتش بانل' ? 'bg-orange-100 text-orange-700' :
                      faq.category === 'ترميم' ? 'bg-green-100 text-green-700' :
                      faq.category === 'تنسيق حدائق' ? 'bg-emerald-100 text-emerald-700' :
                      faq.category === 'أسعار' ? 'bg-purple-100 text-purple-700' :
                      faq.category === 'خدمة عملاء' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {faq.category}
                    </span>
                    <h3 className={`text-lg font-semibold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-accent" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className={`bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl p-4 ${isRTL ? 'border-r-4' : 'border-l-4'} border-accent`}>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">{t('noResults')}</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            {t('ctaTitle')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
              <Link href="https://wa.me/+966553719009" className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <MessageCircle className="w-5 h-5" />
                <span>{t('contactWhatsApp')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              <Link href="tel:+966553719009" className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                <Phone className="w-5 h-5" />
                <span>{t('directCall')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
