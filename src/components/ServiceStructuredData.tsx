
interface ServiceStructuredDataProps {
  service: {
    name: string;
    description: string;
    url: string;
    provider: string;
    areaServed: string;
    offers?: Array<{
      name: string;
      description: string;
      price?: string;
    }>;
  };
}

export default function ServiceStructuredData({ service }: ServiceStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "provider": {
      "@type": "Organization",
      "name": service.provider,
      "url": "https://www.deyarsu.com",
      "logo": "https://www.deyarsu.com/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+966-55-371-9009",
        "contactType": "customer service",
        "areaServed": "SA",
        "availableLanguage": "Arabic"
      }
    },
    "areaServed": {
      "@type": "Place",
      "name": service.areaServed
    },
    "serviceType": service.name,
    "category": "Construction Services",
    "hasOfferCatalog": service.offers ? {
      "@type": "OfferCatalog",
      "name": `خدمات ${service.name}`,
      "itemListElement": service.offers.map((offer, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": offer.name,
          "description": offer.description
        },
        "position": index + 1,
        "price": offer.price || "حسب الطلب",
        "priceCurrency": "SAR"
      }))
    } : undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "أحمد المالكي"
        },
        "reviewBody": "خدمة ممتازة وجودة عالية في التنفيذ"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
