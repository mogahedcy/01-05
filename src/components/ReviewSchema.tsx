interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  title?: string;
}

interface ReviewSchemaProps {
  serviceName: string;
  itemType?: 'Service' | 'Product' | 'LocalBusiness';
  serviceUrl?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Review[];
  provider?: {
    name: string;
    url?: string;
  };
}

export default function ReviewSchema({ 
  serviceName,
  itemType = 'Service',
  serviceUrl,
  aggregateRating = { ratingValue: 4.8, reviewCount: 156 },
  reviews,
  provider
}: ReviewSchemaProps) {
  const defaultReviews: Review[] = [
    {
      author: 'أحمد المالكي',
      rating: 5,
      reviewBody: 'خدمة ممتازة وجودة عالية في التنفيذ. فريق محترف جداً والتزام بالمواعيد. أنصح بالتعامل مع ديار جدة العالمية.',
      datePublished: '2024-11-15',
      title: 'خدمة ممتازة'
    },
    {
      author: 'فاطمة السعودي',
      rating: 5,
      reviewBody: 'النتيجة فاقت التوقعات! جودة عالية وتصميم أنيق. فريق ديار جدة العالمية محترف جداً ويهتم بأدق التفاصيل.',
      datePublished: '2024-10-28',
      title: 'فاقت التوقعات'
    },
    {
      author: 'عبدالرحمن الزهراني',
      rating: 5,
      reviewBody: 'الشغل ممتاز والتصميم يجمع بين الجمالية والوظيفية. السعر مناسب جداً مقارنة بالجودة. أنصح بهم بقوة.',
      datePublished: '2024-10-10',
      title: 'جودة استثنائية'
    },
    {
      author: 'سارة القحطاني',
      rating: 4,
      reviewBody: 'تجربة جيدة بشكل عام. الفريق ملتزم والتنفيذ كان حسب الاتفاق. التواصل ممتاز طوال فترة العمل.',
      datePublished: '2024-09-22',
      title: 'تجربة جيدة'
    }
  ];

  const reviewsToUse = reviews || defaultReviews;

  const defaultProvider = {
    name: 'ديار جدة العالمية',
    url: 'https://www.deyarsu.com'
  };

  const providerData = provider || defaultProvider;

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": itemType,
    "name": serviceName,
    ...(serviceUrl && { "url": serviceUrl }),
    ...(itemType === 'Service' && {
      "provider": {
        "@type": "Organization",
        "name": providerData.name,
        ...(providerData.url && { "url": providerData.url })
      }
    }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue.toString(),
      "reviewCount": aggregateRating.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviewsToUse.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished,
      ...(review.title && { "name": review.title })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}
