interface IndividualReviewSchemaProps {
  itemReviewed: {
    type: 'Service' | 'Product' | 'LocalBusiness' | 'Organization';
    name: string;
    url?: string;
  };
  author: {
    name: string;
    url?: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody: string;
  datePublished: string;
  reviewTitle?: string;
  publisher?: {
    name: string;
    url?: string;
  };
}

export default function IndividualReviewSchema({
  itemReviewed,
  author,
  reviewRating,
  reviewBody,
  datePublished,
  reviewTitle,
  publisher
}: IndividualReviewSchemaProps) {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": itemReviewed.type,
      "name": itemReviewed.name,
      ...(itemReviewed.url && { "url": itemReviewed.url })
    },
    "author": {
      "@type": "Person",
      "name": author.name,
      ...(author.url && { "url": author.url })
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewRating.ratingValue.toString(),
      "bestRating": (reviewRating.bestRating || 5).toString(),
      "worstRating": (reviewRating.worstRating || 1).toString()
    },
    "reviewBody": reviewBody,
    "datePublished": datePublished,
    ...(reviewTitle && { "name": reviewTitle }),
    ...(publisher && {
      "publisher": {
        "@type": "Organization",
        "name": publisher.name,
        ...(publisher.url && { "url": publisher.url })
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}
