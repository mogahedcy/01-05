'use client';

import Script from 'next/script';

interface OrganizationSchemaProps {
  locale?: string;
}

export default function OrganizationSchema({ locale = 'ar' }: OrganizationSchemaProps) {
  const isArabic = locale === 'ar';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah Professionals",
    "alternateName": isArabic ? "الديار للمظلات والسواتر" : "Aldeyar Shades and Fences",
    "url": "https://www.deyarsu.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.deyarsu.com/images/logo.png",
      "width": 1024,
      "height": 1024
    },
    "image": "https://www.deyarsu.com/images/hero-bg.webp",
    "description": isArabic 
      ? "شركة ديار جدة العالمية - رائدة في تركيب المظلات، البرجولات، السواتر، وتنسيق الحدائق في جدة. خبرة 15 عاماً، ضمان 10 سنوات، تركيب احترافي."
      : "Deyar Jeddah Professionals - Leading company for installing shades, pergolas, fences, and landscaping in Jeddah. 15 years experience, 10 year warranty, professional installation.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al Makarunah Rd, تقاطع، التحليه",
      "addressLocality": isArabic ? "جدة" : "Jeddah",
      "addressRegion": isArabic ? "منطقة مكة المكرمة" : "Makkah Province",
      "postalCode": "23461",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.509375,
      "longitude": 39.192188
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+966-55-371-9009",
        "contactType": "customer service",
        "areaServed": ["SA", "Jeddah", "Makkah"],
        "availableLanguage": ["ar", "en"],
        "hoursAvailable": {
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
          "opens": "08:00",
          "closes": "22:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+966-55-371-9009",
        "contactType": "sales",
        "areaServed": "SA",
        "availableLanguage": ["ar", "en"]
      }
    ],
    "email": "info@deyarsu.com",
    "telephone": "+966553719009",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "14:00",
        "closes": "22:00"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": isArabic ? "جدة" : "Jeddah"
      },
      {
        "@type": "City",
        "name": isArabic ? "الطائف" : "Taif"
      },
      {
        "@type": "AdministrativeArea",
        "name": isArabic ? "منطقة مكة المكرمة" : "Makkah Province"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/aldeyarksa",
      "https://www.instagram.com/aldeyarksa",
      "https://twitter.com/aldeyarksa",
      "https://www.youtube.com/@aldeyarksa",
      "https://www.linkedin.com/company/aldeyarksa"
    ],
    "foundingDate": "2010",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 25
    },
    "slogan": isArabic 
      ? "خبرة 15 عاماً في تركيب المظلات والسواتر"
      : "15 Years Experience in Shades and Fences Installation",
    "knowsAbout": [
      isArabic ? "مظلات سيارات" : "Car Shades",
      isArabic ? "برجولات حدائق" : "Garden Pergolas",
      isArabic ? "سواتر خصوصية" : "Privacy Fences",
      isArabic ? "ساندوتش بانل" : "Sandwich Panel",
      isArabic ? "تنسيق حدائق" : "Landscaping",
      isArabic ? "بيوت شعر" : "Traditional Houses"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": isArabic ? "تركيب مظلات سيارات" : "Car Shades Installation",
          "description": isArabic ? "تركيب مظلات سيارات عالية الجودة مع ضمان 10 سنوات" : "High quality car shades installation with 10 year warranty"
        },
        "areaServed": isArabic ? "جدة، السعودية" : "Jeddah, Saudi Arabia"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": isArabic ? "تصميم وتركيب برجولات" : "Pergolas Design and Installation",
          "description": isArabic ? "تصميم وتركيب برجولات خشبية وحديدية للحدائق" : "Design and installation of wooden and metal pergolas"
        },
        "areaServed": isArabic ? "جدة، السعودية" : "Jeddah, Saudi Arabia"
      }
    ],
    "award": [
      isArabic ? "أفضل شركة مظلات في جدة 2024" : "Best Shades Company in Jeddah 2024",
      isArabic ? "شهادة الجودة ISO 9001" : "ISO 9001 Quality Certificate"
    ]
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}
