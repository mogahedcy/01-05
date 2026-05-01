interface LocalBusinessSchemaProps {
  locale?: string;
}

export default function LocalBusinessSchema({ locale = 'ar' }: LocalBusinessSchemaProps) {
  const isArabic = locale === 'ar';

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.deyarsu.com/#organization",
    "name": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah",
    "alternateName": isArabic 
      ? "ديار جدة العالمية | مظلات وبرجولات جدة"
      : "Aldeyar | Shades and Pergolas Jeddah",
    "description": isArabic
      ? "شركة متخصصة في تركيب المظلات والبرجولات والسواتر والساندوتش بانل وتنسيق الحدائق في جدة مع خبرة 15 عاماً وضمان 10 سنوات"
      : "Specialized company in installing shades, pergolas, fences, sandwich panels, and landscaping in Jeddah with 15 years of experience and 10-year warranty",
    "url": "https://www.deyarsu.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.deyarsu.com/images/logo.png",
      "width": "250",
      "height": "250"
    },
    "image": [
      "https://www.deyarsu.com/images/slider1.webp",
      "https://www.deyarsu.com/images/slider2.webp",
      "https://www.deyarsu.com/images/slider3.webp"
    ],
    "telephone": "+966553719009",
    "email": "info@deyarsu.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": isArabic ? "جدة" : "Jeddah",
      "addressLocality": isArabic ? "جدة" : "Jeddah",
      "addressRegion": isArabic ? "منطقة مكة المكرمة" : "Makkah Region",
      "postalCode": "21442",
      "addressCountry": {
        "@type": "Country",
        "name": "SA"
      }
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.5433",
      "longitude": "39.1728"
    },
    "hasMap": "https://www.google.com/maps?cid=YOUR_CID_HERE",
    "areaServed": [
      {
        "@type": "City",
        "name": isArabic ? "جدة" : "Jeddah",
        "containedIn": {
          "@type": "AdministrativeArea",
          "name": isArabic ? "منطقة مكة المكرمة" : "Makkah Region"
        }
      },
      {
        "@type": "City",
        "name": isArabic ? "مكة المكرمة" : "Makkah"
      },
      {
        "@type": "City",
        "name": isArabic ? "الطائف" : "Taif"
      }
    ],
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday"
        ],
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
    "paymentAccepted": isArabic 
      ? "نقداً، بطاقات ائتمان، تحويل بنكي"
      : "Cash, Credit Cards, Bank Transfer",
    "currenciesAccepted": "SAR",
    "foundingDate": "2010",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "287",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isArabic ? "خدمات ديار جدة العالمية" : "Aldeyar Professional Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "تركيب مظلات سيارات" : "Car Shades Installation",
            "description": isArabic 
              ? "تركيب مظلات سيارات بتصاميم عصرية وخامات عالية الجودة"
              : "Installing car shades with modern designs and high-quality materials",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "تركيب برجولات حدائق" : "Garden Pergolas Installation",
            "description": isArabic 
              ? "تركيب برجولات خشبية وحديدية للحدائق والاستراحات"
              : "Installing wooden and iron pergolas for gardens and rest areas",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "تركيب سواتر" : "Privacy Fences Installation",
            "description": isArabic 
              ? "تركيب سواتر للخصوصية والحماية بأنواع متعددة"
              : "Installing privacy fences for protection in various types",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "ساندوتش بانل" : "Sandwich Panel Installation",
            "description": isArabic 
              ? "تركيب ساندوتش بانل للعزل الحراري والصوتي"
              : "Installing sandwich panels for thermal and acoustic insulation",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "تنسيق حدائق" : "Landscaping",
            "description": isArabic 
              ? "تصميم وتنسيق الحدائق بأحدث الأساليب"
              : "Designing and landscaping gardens with the latest techniques",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "بيوت شعر تراثية" : "Traditional Hair Houses",
            "description": isArabic 
              ? "تصنيع وتركيب بيوت شعر تراثية أصيلة"
              : "Manufacturing and installing authentic traditional hair houses",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "خيام ملكية" : "Royal Tents",
            "description": isArabic 
              ? "تصنيع وتركيب خيام ملكية فاخرة للمناسبات"
              : "Manufacturing and installing luxury royal tents for events",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "ترميم ملحقات" : "Annex Renovation",
            "description": isArabic 
              ? "ترميم وتجديد الملحقات والاستراحات"
              : "Renovating and refurbishing annexes and rest areas",
            "provider": {
              "@id": "https://www.deyarsu.com/#organization"
            }
          }
        }
      ]
    },
    "slogan": isArabic 
      ? "خبرة 15 عاماً في خدمتكم - ضمان 10 سنوات"
      : "15 Years of Experience at Your Service - 10-Year Warranty",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+966553719009",
        "contactType": isArabic ? "خدمة العملاء" : "Customer Service",
        "areaServed": "SA",
        "availableLanguage": ["ar", "en", "Arabic", "English"],
        "contactOption": "TollFree"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/aldiyarglobal",
      "https://wa.me/966553719009",
      "https://vm.tiktok.com/ZShKSH6o9/"
    ],
    "knowsLanguage": ["ar", "en"],
    "keywords": isArabic
      ? "مظلات سيارات جدة، برجولات خشبية، سواتر خصوصية، ساندوتش بانل، تنسيق حدائق، بيوت شعر، خيام ملكية، ترميم ملحقات"
      : "car shades jeddah, wooden pergolas, privacy fences, sandwich panel, landscaping, traditional houses, royal tents, renovation"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
