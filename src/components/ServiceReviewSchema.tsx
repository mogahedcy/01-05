interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
}

interface ServiceReviewSchemaProps {
  serviceName: string;
  serviceUrl: string;
  reviews: Review[];
  provider?: {
    name: string;
    url: string;
  };
}

export default function ServiceReviewSchema({
  serviceName,
  serviceUrl,
  reviews,
  provider = {
    name: 'ديار جدة العالمية - Deyar Jeddah',
    url: 'https://www.deyarsu.com'
  }
}: ServiceReviewSchemaProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate aggregate rating from real reviews
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const reviewCount = reviews.length;

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "url": serviceUrl,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      "url": provider.url
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(2),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.message,
      "datePublished": review.createdAt.toISOString().split('T')[0]
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}
