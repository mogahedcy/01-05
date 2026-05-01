import React from 'react';
import StructuredDataScript from './StructuredDataScript';

interface Review {
  author: string;
  datePublished: string;
  reviewBody: string;
  rating: number;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string | string[];
  price: string;
  currency?: string;
  availability?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  brand?: string;
  sku?: string;
  category?: string;
  location?: string;
  duration?: string;
  materials?: string[];
  reviews?: Review[];
}

export default function ProductSchema({ 
  name, 
  description, 
  image = 'https://www.deyarsu.com/images/hero-bg.webp',
  price,
  currency = 'SAR',
  availability = 'https://schema.org/InStock',
  rating,
  brand = 'ديار جدة العالمية',
  sku,
  category,
  location,
  duration,
  materials,
  reviews
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": Array.isArray(image) ? image : [image],
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    ...(category && { "category": category }),
    "offers": {
      "@type": "Offer",
      "url": "https://www.deyarsu.com",
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": brand
      }
    },
    ...(sku && { "sku": sku }),
    ...(rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.ratingValue,
        "reviewCount": rating.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    ...(reviews && reviews.length > 0 && {
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "datePublished": review.datePublished,
        "reviewBody": review.reviewBody,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        }
      }))
    }),
    "additionalProperty": [
      ...(location ? [{
        "@type": "PropertyValue",
        "name": "الموقع",
        "value": location
      }] : []),
      ...(duration ? [{
        "@type": "PropertyValue",
        "name": "المدة",
        "value": duration
      }] : []),
      ...(materials && materials.length > 0 ? [{
        "@type": "PropertyValue",
        "name": "المواد",
        "value": materials.join(", ")
      }] : [])
    ]
  };

  return <StructuredDataScript data={schema} />;
}
