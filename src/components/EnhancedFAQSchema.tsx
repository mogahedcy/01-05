interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  slug?: string | null;
  metaTitle?: string | null;
  keywords?: string | null;
}

interface EnhancedFAQSchemaProps {
  faqs: FAQ[];
  baseUrl?: string;
}

function stripHtmlAndCleanText(text: string): string {
  if (!text) return '';
  
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
}

export default function EnhancedFAQSchema({ faqs, baseUrl = 'https://www.deyarsu.com' }: EnhancedFAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const validFaqs = faqs.filter(faq => 
    faq.question && 
    faq.answer && 
    stripHtmlAndCleanText(faq.question).length > 5 &&
    stripHtmlAndCleanText(faq.answer).length > 20
  );

  if (validFaqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(faq => ({
      '@type': 'Question',
      name: stripHtmlAndCleanText(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtmlAndCleanText(faq.answer)
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'الأسئلة الشائعة',
        item: `${baseUrl}/faq`
      }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'الأسئلة الشائعة',
    description: 'إجابات على أكثر الأسئلة شيوعاً حول خدماتنا',
    url: `${baseUrl}/faq`,
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: 'ديار جدة العالمية',
      url: baseUrl
    },
    breadcrumb: breadcrumbSchema
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
