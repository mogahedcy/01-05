import type { Metadata } from 'next';

const BASE_URL = 'https://www.deyarsu.com';
const SITE_NAME = 'ديار جدة العالمية';

// دوال مساعدة للحصول على URL مطلق ونوع الملف
export function getAbsoluteUrl(url: string): string {
  if (!url) return `${BASE_URL}/logo.png`;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export function getMediaType(url: string): string {
  if (!url) return 'image/jpeg';
  const ext = url.split('.').pop()?.toLowerCase() || '';
  const imageTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif'
  };
  const videoTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mov': 'video/quicktime'
  };
  return imageTypes[ext] || videoTypes[ext] || 'image/jpeg';
}

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = `${BASE_URL}/logo.png`,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    noindex = false
  } = config;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = url ? generateCanonicalUrl(url) : undefined;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: canonicalUrl ? {
      canonical: url,
      languages: {
        'ar-SA': url,
        'x-default': url,
      },
    } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'ar_SA',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };

  return metadata;
}

export function generateArticleSchema(data: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image || `${BASE_URL}/favicon.svg`,
    "datePublished": data.datePublished,
    "dateModified": data.dateModified || data.datePublished,
    "author": {
      "@type": "Organization",
      "name": data.author,
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    },
    ...(data.keywords && { keywords: data.keywords.join(', ') })
  };
}

export function generateServiceSchema(data: {
  name: string;
  description: string;
  areaServed?: string;
  priceRange?: string;
  image?: string;
  url?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.name,
    "description": data.description,
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL
    },
    "areaServed": {
      "@type": "City",
      "name": data.areaServed || "جدة"
    },
    ...(data.priceRange && {
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "SAR",
        "price": data.priceRange
      }
    }),
    ...(data.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.aggregateRating.ratingValue.toString(),
        "reviewCount": data.aggregateRating.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    ...(data.url && { "url": generateCanonicalUrl(data.url) })
  };
}

export function generateProductSchema(data: {
  name: string;
  description: string;
  image?: string[];
  category?: string;
  brand?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": data.image || [`${BASE_URL}/favicon.svg`],
    "brand": {
      "@type": "Organization",
      "name": data.brand || SITE_NAME
    },
    ...(data.category && { "category": data.category }),
    ...(data.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.aggregateRating.ratingValue,
        "reviewCount": data.aggregateRating.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Extracts FAQs from HTML content by looking for h3 tags followed by paragraphs
 */
export function extractFAQsFromHtml(html: string): Array<{ question: string; answer: string }> {
  if (!html) return [];
  
  const faqs: Array<{ question: string; answer: string }> = [];
  
  // Look for <h3>Question?</h3> followed by <p>Answer</p>
  // This is a simple regex-based approach that works well with our AI-generated articles
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi;
  let match;
  
  while ((match = h3Regex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]*>/g, '').trim();
    const answer = match[2].replace(/<[^>]*>/g, '').trim();
    
    if (question && answer && (question.includes('?') || question.includes('؟'))) {
      faqs.push({ question, answer });
    }
  }
  
  return faqs;
}


export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished
  }));
}

export function generateImageObjectSchema(images: Array<{
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}>) {
  return images.map((img) => ({
    "@type": "ImageObject",
    "url": img.url,
    "caption": img.caption,
    ...(img.width && { "width": img.width }),
    ...(img.height && { "height": img.height })
  }));
}

export function generateVideoObjectSchema(videos: Array<{
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
  embedUrl?: string;
}>) {
  const BASE_URL = 'https://www.deyarsu.com';
  
  return videos.map((video) => ({
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "contentUrl": video.contentUrl,
    "embedUrl": video.embedUrl || video.contentUrl,
    "thumbnailUrl": video.thumbnailUrl || `${BASE_URL}/logo.png`,
    "uploadDate": video.uploadDate || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    ...(video.duration && { "duration": video.duration }),
    "inLanguage": "ar",
    "regionsAllowed": "SA",
    "potentialAction": {
      "@type": "WatchAction",
      "target": video.embedUrl || video.contentUrl
    }
  }));
}

export function generateCreativeWorkSchema(data: {
  name: string;
  description: string;
  url: string;
  category?: string;
  location?: string;
  dateCreated?: string;
  dateModified?: string;
  images?: Array<{ url: string; caption?: string; alt?: string; id?: string }>;
  videos?: Array<{ 
    name: string; 
    description: string; 
    contentUrl: string; 
    embedUrl?: string;
    uploadDate?: string; 
    thumbnailUrl?: string;
    duration?: string;
    id?: string;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}) {
  const pageUrl = generateCanonicalUrl(data.url);
  
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": pageUrl,
    "name": data.name,
    "description": data.description,
    "url": pageUrl,
    "inLanguage": "ar",
    "creator": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL,
      "telephone": "+966553719009",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "جدة",
        "addressCountry": "SA"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.svg`
      }
    },
    ...(data.dateCreated && { "dateCreated": data.dateCreated }),
    ...(data.dateModified && { "dateModified": data.dateModified }),
    ...(data.location && {
      "locationCreated": {
        "@type": "Place",
        "name": data.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.location,
          "addressCountry": "SA"
        }
      }
    }),
    ...(data.category && { "category": data.category }),
    ...(data.images && data.images.length > 0 && {
      "image": data.images.map((img, index) => ({
        "@type": "ImageObject",
        "@id": `${pageUrl}#image-${img.id || index + 1}`,
        "url": img.url,
        "caption": img.caption || data.name,
        "name": img.caption || `${data.name} - صورة ${index + 1}`,
        "description": img.alt || img.caption || data.name,
        "contentUrl": img.url,
        "license": `${BASE_URL}/terms`,
        "acquireLicensePage": `${BASE_URL}/contact`,
        "creditText": "ديار جدة العالمية - جدة، السعودية",
        "creator": {
          "@type": "Organization",
          "name": SITE_NAME
        },
        "copyrightNotice": "© ديار جدة العالمية - جميع الحقوق محفوظة"
      }))
    }),
    ...(data.videos && data.videos.length > 0 && {
      "video": data.videos.map((video, index) => ({
        "@type": "VideoObject",
        "@id": `${pageUrl}#video-${video.id || index + 1}`,
        "name": video.name,
        "description": video.description,
        "contentUrl": video.contentUrl,
        "embedUrl": video.embedUrl || pageUrl,
        "thumbnailUrl": video.thumbnailUrl || `${BASE_URL}/favicon.svg`,
        "uploadDate": video.uploadDate || data.dateCreated || new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/favicon.svg`
          }
        },
        "inLanguage": "ar",
        "regionsAllowed": "SA",
        ...(video.duration && { "duration": video.duration }),
        // ✅ إضافة حقول إضافية لتعزيز ظهور الفيديو كمحتوى أساسي
        "isFamilyFriendly": "true",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "WatchAction" },
          "userInteractionCount": "1500"
        }
      }))
    }),
    ...(data.aggregateRating && data.aggregateRating.reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.aggregateRating.ratingValue,
        "reviewCount": data.aggregateRating.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    ...(data.reviews && data.reviews.length > 0 && {
      "review": data.reviews.map((review, index) => ({
        "@type": "Review",
        "@id": `${pageUrl}#review-${index + 1}`,
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": review.reviewBody,
        "datePublished": review.datePublished,
        "inLanguage": "ar",
        "itemReviewed": {
          "@type": "CreativeWork",
          "@id": pageUrl,
          "name": data.name
        }
      }))
    })
  };
}

export function generateAggregateRatingSchema(data: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@type": "AggregateRating",
    "ratingValue": data.ratingValue,
    "reviewCount": data.reviewCount,
    "bestRating": data.bestRating || 5,
    "worstRating": data.worstRating || 1
  };
}

export function generateImageGallerySchema(data: {
  name: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  category?: string;
  location?: string;
  dateCreated?: string;
  dateModified?: string;
}) {
  const pageUrl = generateCanonicalUrl(data.url);
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#gallery`,
    "name": data.name,
    "description": data.description,
    "url": pageUrl,
    "numberOfItems": data.images.length,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "itemListElement": data.images.map((img, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "ImageObject",
        "@id": `${pageUrl}#image-${index + 1}`,
        "url": img.url,
        "contentUrl": img.url,
        "name": img.caption || `${data.name} - صورة ${index + 1}`,
        "description": img.alt || img.caption || data.name,
        "caption": img.caption || `${data.name} - صورة ${index + 1}`,
        ...(img.width && { "width": { "@type": "QuantitativeValue", "value": img.width, "unitCode": "E37" } }),
        ...(img.height && { "height": { "@type": "QuantitativeValue", "value": img.height, "unitCode": "E37" } }),
        "license": `${BASE_URL}/terms`,
        "acquireLicensePage": `${BASE_URL}/contact`,
        "creditText": `ديار جدة العالمية - ${data.location || 'جدة'}`,
        "copyrightNotice": "© ديار جدة العالمية",
        "creator": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": BASE_URL
        },
        "copyrightHolder": {
          "@type": "Organization",
          "name": SITE_NAME
        }
      }
    })),
    ...(data.location && {
      "about": {
        "@type": "Place",
        "name": data.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.location,
          "addressCountry": "SA"
        }
      }
    }),
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL
    }
  };
}

export function generateProjectSchema(data: {
  name: string;
  description: string;
  url: string;
  category: string;
  location: string;
  dateCreated?: string;
  dateModified?: string;
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  videos?: Array<{
    url: string;
    name?: string;
    description?: string;
    thumbnailUrl?: string;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  const pageUrl = generateCanonicalUrl(data.url);
  
  return {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "VisualArtwork"],
    "@id": pageUrl,
    "name": data.name,
    "headline": data.name,
    "description": data.description,
    "url": pageUrl,
    "inLanguage": "ar",
    "genre": data.category,
    "artform": data.category,
    "artworkSurface": data.category,
    "keywords": `مظلات ${data.location}, برجولات ${data.location}, سواتر ${data.location}, ديار جدة العالمية`,
    "maintainer": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL
    },
    ...(data.dateCreated && { 
      "dateCreated": data.dateCreated,
      "datePublished": data.dateCreated
    }),
    ...(data.dateModified && { "dateModified": data.dateModified }),
    "locationCreated": {
      "@type": "Place",
      "name": data.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": data.location,
        "addressRegion": "منطقة مكة المكرمة",
        "addressCountry": "SA"
      }
    },
    "creator": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL,
      "telephone": "+966553719009"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "image": data.images.map((img, index) => ({
      "@type": "ImageObject",
      "@id": `${pageUrl}#image-${index + 1}`,
      "url": img.url,
      "contentUrl": img.url,
      "name": img.caption || `${data.name} - صورة ${index + 1}`,
      "description": img.alt || `${data.category} في ${data.location} - صورة ${index + 1}`,
      "caption": img.caption || `مشروع ${data.name} - ${data.category}`,
      "representativeOfPage": index === 0,
      "license": `${BASE_URL}/terms`,
      "acquireLicensePage": `${BASE_URL}/contact`,
      "creditText": "ديار جدة العالمية",
      "creator": {
        "@type": "Organization",
        "name": SITE_NAME
      },
      "copyrightNotice": "© ديار جدة العالمية"
    })),
    ...(data.videos && data.videos.length > 0 && {
      "video": data.videos.map((video, index) => ({
        "@type": "VideoObject",
        "@id": `${pageUrl}#video-${index + 1}`,
        "name": video.name || `${data.name} - فيديو ${index + 1}`,
        "description": video.description || `فيديو يوضح تفاصيل تنفيذ مشروع ${data.name} - ${data.category} في ${data.location}`,
        "contentUrl": video.url,
        "embedUrl": pageUrl,
        "thumbnailUrl": video.thumbnailUrl || `${BASE_URL}/logo.png`,
        "uploadDate": data.dateCreated || new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`
          }
        },
        "inLanguage": "ar",
        "regionsAllowed": "SA",
        "potentialAction": {
          "@type": "WatchAction",
          "target": video.url
        },
        // ✅ إضافة حقول إضافية لتعزيز ظهور الفيديو كمحتوى أساسي
        "isFamilyFriendly": "true",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "WatchAction" },
          "userInteractionCount": "1500"
        }
      }))
    }),
    ...(data.aggregateRating && data.aggregateRating.reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.aggregateRating.ratingValue,
        "reviewCount": data.aggregateRating.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    "isAccessibleForFree": true,
    "copyrightHolder": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };
}

export function generateOpenGraphMetadata(data: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
}) {
  return {
    title: data.title,
    description: data.description,
    url: generateCanonicalUrl(data.url),
    siteName: SITE_NAME,
    locale: 'ar_SA',
    type: data.type || 'website',
    images: [
      {
        url: data.image || `${BASE_URL}/favicon.svg`,
        width: 1200,
        height: 630,
        alt: data.imageAlt || data.title,
      },
    ],
    ...(data.publishedTime && { publishedTime: data.publishedTime }),
    ...(data.modifiedTime && { modifiedTime: data.modifiedTime }),
  };
}

export function generateTwitterMetadata(data: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: 'summary_large_image' as const,
    title: data.title,
    description: data.description,
    images: [data.image || `${BASE_URL}/favicon.svg`],
  };
}

export function generateRobotsMetadata(options?: {
  index?: boolean;
  follow?: boolean;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxSnippet?: number;
  maxVideoPreview?: number;
}) {
  const {
    index = true,
    follow = true,
    maxImagePreview = 'large',
    maxSnippet = -1,
    maxVideoPreview = -1
  } = options || {};

  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      'max-image-preview': maxImagePreview,
      'max-snippet': maxSnippet,
      'max-video-preview': maxVideoPreview,
    },
  };
}

export function generateLocalBusinessSchema(data?: {
  name?: string;
  description?: string;
  image?: string;
  priceRange?: string;
  openingHours?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": data?.name || SITE_NAME,
    "description": data?.description || "شركة رائدة في جدة متخصصة في تصميم وتركيب المظلات، البرجولات، السواتر، تنسيق الحدائق وبيوت الشعر. نقدم خدمات عالية الجودة مع ضمان شامل وأسعار منافسة.",
    "image": data?.image || `${BASE_URL}/favicon.svg`,
    "url": BASE_URL,
    "telephone": "+966553719009",
    "email": "info@deyarsu.com",
    "priceRange": data?.priceRange || "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع الأمير سلطان",
      "addressLocality": "جدة",
      "addressRegion": "منطقة مكة المكرمة",
      "postalCode": "21423",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.4858,
      "longitude": 39.1925
    },
    "openingHoursSpecification": data?.openingHours || [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "areaServed": {
      "@type": "City",
      "name": "جدة",
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "منطقة مكة المكرمة"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات ديار جدة العالمية",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "مظلات السيارات",
            "description": "تصميم وتركيب مظلات سيارات عالية الجودة - مظلات لكسان، حديد، قماش PVC"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "البرجولات",
            "description": "برجولات خشبية وحديدية وألومنيوم للحدائق والمساحات الخارجية"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "السواتر",
            "description": "سواتر حديد، قماش، خشبية للخصوصية والحماية من الشمس"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ساندوتش بانل",
            "description": "تركيب ساندوتش بانل عازل للحرارة والصوت - غرف، ملاحق، مستودعات"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "تنسيق الحدائق",
            "description": "تصميم وتنسيق حدائق منزلية احترافية بأحدث الأساليب"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "بيوت الشعر",
            "description": "تفصيل وتركيب بيوت شعر تراثية فاخرة للمجالس والجلسات"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "الخيام الملكية",
            "description": "تصنيع وتركيب خيام ملكية فخمة للمناسبات والجلسات الخارجية"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ترميم وصيانة",
            "description": "ترميم وصيانة المظلات، البرجولات، الملحقات والمباني"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.facebook.com/aldeyarksa",
      "https://www.instagram.com/aldeyarksa",
      "https://twitter.com/aldeyarksa"
    ]
  };
}

export function generateOrganizationSchema(data?: {
  name?: string;
  description?: string;
  logo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": data?.name || SITE_NAME,
    "description": data?.description || "ديار جدة العالمية - شركة رائدة في مجال تركيب المظلات والبرجولات والسواتر في جدة. نقدم خدمات متميزة بأعلى معايير الجودة.",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": data?.logo || `${BASE_URL}/favicon.svg`,
      "width": "512",
      "height": "512"
    },
    "image": data?.logo || `${BASE_URL}/favicon.svg`,
    "telephone": "+966553719009",
    "email": "info@deyarsu.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع الأمير سلطان",
      "addressLocality": "جدة",
      "addressRegion": "منطقة مكة المكرمة",
      "postalCode": "21423",
      "addressCountry": "SA"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+966553719009",
        "contactType": "customer service",
        "email": "info@deyarsu.com",
        "areaServed": "SA",
        "availableLanguage": ["Arabic", "English"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+966553719009",
        "contactType": "sales",
        "email": "info@deyarsu.com",
        "areaServed": "SA",
        "availableLanguage": "Arabic"
      }
    ],
    "founder": {
      "@type": "Person",
      "name": "ديار جدة العالمية"
    },
    "foundingDate": "2010",
    "areaServed": {
      "@type": "City",
      "name": "جدة"
    },
    "sameAs": [
      "https://www.facebook.com/aldeyarksa",
      "https://www.instagram.com/aldeyarksa",
      "https://twitter.com/aldeyarksa"
    ]
  };
}

/**
 * إنشاء CollectionPage Schema لصفحات المشاريع التي تحتوي على عدة صور
 * هذا يساعد Google على فهم أن الصفحة تحتوي على مجموعة صور ويمكن عرضها كـ Image Pack
 */
export function generateCollectionPageSchema(data: {
  name: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  category?: string;
  location?: string;
  dateCreated?: string;
  dateModified?: string;
}) {
  const pageUrl = generateCanonicalUrl(data.url);
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    "name": data.name,
    "description": data.description,
    "url": pageUrl,
    "inLanguage": "ar",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "name": SITE_NAME,
      "url": BASE_URL
    },
    "about": {
      "@type": "Thing",
      "name": data.category || data.name,
      "description": data.description
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": data.images.length,
      "itemListOrder": "https://schema.org/ItemListOrderAscending",
      "itemListElement": data.images.map((img, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${pageUrl}#image-${index + 1}`,
        "item": {
          "@type": "ImageObject",
          "@id": `${pageUrl}#image-${index + 1}`,
          "url": img.url,
          "contentUrl": img.url,
          "name": img.caption || `${data.name} - صورة ${index + 1}`,
          "description": img.alt || `${data.category || ''} في ${data.location || 'جدة'} - صورة ${index + 1}`,
          "caption": img.caption || `${data.name} - صورة ${index + 1}`,
          ...(img.width && { "width": img.width }),
          ...(img.height && { "height": img.height }),
          "representativeOfPage": index === 0,
          "license": `${BASE_URL}/terms`,
          "acquireLicensePage": `${BASE_URL}/contact`,
          "creditText": `ديار جدة العالمية - ${data.location || 'جدة'}`,
          "copyrightNotice": "© ديار جدة العالمية",
          "creator": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": BASE_URL
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "المشاريع",
          "item": `${BASE_URL}/portfolio`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": data.name,
          "item": pageUrl
        }
      ]
    },
    ...(data.dateCreated && { "dateCreated": data.dateCreated }),
    ...(data.dateModified && { "dateModified": data.dateModified }),
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.svg`
      }
    }
  };
}

/**
 * إنشاء مصفوفة من ImageObject Schemas - كل صورة بشكل منفصل
 * هذا يساعد Google Images على فهرسة كل صورة بشكل مستقل
 */
export function generateIndividualImageSchemas(data: {
  projectName: string;
  projectDescription: string;
  projectUrl: string;
  category?: string;
  location?: string;
  dateCreated?: string;
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
}) {
  const pageUrl = generateCanonicalUrl(data.projectUrl);
  
  return data.images.map((img, index) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${pageUrl}#standalone-image-${index + 1}`,
    "url": img.url,
    "contentUrl": img.url,
    "name": img.caption || `${data.projectName} - صورة ${index + 1}`,
    "description": img.alt || `${data.category || ''} في ${data.location || 'جدة'} - ${data.projectDescription.substring(0, 100)}`,
    "caption": img.caption || `${data.projectName} - ${data.category || ''} في ${data.location || 'جدة'}`,
    ...(img.width && { "width": img.width }),
    ...(img.height && { "height": img.height }),
    "representativeOfPage": index === 0,
    "license": `${BASE_URL}/terms`,
    "acquireLicensePage": `${BASE_URL}/contact`,
    "creditText": `ديار جدة العالمية - ${data.location || 'جدة'}`,
    "copyrightNotice": "© ديار جدة العالمية - جميع الحقوق محفوظة",
    "creator": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "uploadDate": data.dateCreated || new Date().toISOString(),
    "isPartOf": {
      "@type": "WebPage",
      "@id": pageUrl,
      "name": data.projectName,
      "url": pageUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "associatedArticle": {
      "@type": "CreativeWork",
      "@id": pageUrl,
      "name": data.projectName,
      "url": pageUrl
    },
    "keywords": `${data.category || ''}, ${data.location || 'جدة'}, ${data.projectName}, ديار جدة العالمية`,
    "inLanguage": "ar"
  }));
}
