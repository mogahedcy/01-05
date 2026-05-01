// Type for structured data - allows any valid JSON-LD schema
type StructuredDataType = Record<string, unknown>;

export default function StructuredDataScript({ data }: { data?: StructuredDataType | StructuredDataType[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ديار جدة العالمية",
    "alternateName": "Al Deyar Professional Global",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.svg`,
    "image": `${baseUrl}/favicon.svg`,
    "description": "شركة رائدة في تركيب مظلات السيارات، البرجولات، السواتر، تنسيق الحدائق في جدة والمملكة العربية السعودية",
    "foundingDate": "2010",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966553719009",
      "contactType": "customer service",
      "areaServed": "SA",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al Makarunah Rd, تقاطع، التحليه",
      "addressLocality": "جدة",
      "addressRegion": "منطقة مكة المكرمة",
      "postalCode": "23461",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.509375,
      "longitude": 39.192188
    },
    "openingHours": "Mo-Sa 08:00-18:00",
    "priceRange": "$$",
    "areaServed": [
      { "@type": "City", "name": "جدة" },
      { "@type": "City", "name": "الطائف" },
      { "@type": "State", "name": "منطقة مكة المكرمة" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات ديار جدة العالمية",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "مظلات السيارات", "description": "تركيب مظلات سيارات لكسان وحديد وقماش PVC بأعلى معايير الجودة في جدة" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "البرجولات", "description": "تصميم وتنفيذ برجولات خشبية وحديدية وألومنيوم للحدائق والمساحات الخارجية" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "السواتر", "description": "تركيب سواتر حديد وقماش وخشبية للخصوصية والحماية من الشمس" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ساندوتش بانل", "description": "تركيب ساندوتش بانل عازل حراري وصوتي لغرف ومستودعات وملاحق" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنسيق الحدائق", "description": "تصميم وتنسيق حدائق منزلية احترافية بأحدث الأساليب والتقنيات" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "بيوت الشعر", "description": "تفصيل وتركيب بيوت شعر تراثية فاخرة للمجالس والجلسات العربية" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "الخيام الملكية", "description": "تصنيع وتركيب خيام ملكية فخمة للمناسبات والجلسات الخارجية" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ترميم وصيانة", "description": "ترميم وصيانة شاملة للمظلات والبرجولات والملحقات والمباني" } }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/aldeyar.jeddah",
      "https://www.instagram.com/aldeyar.jeddah",
      "https://twitter.com/aldeyar_jeddah",
      "https://www.linkedin.com/company/aldeyar-global",
      "https://www.youtube.com/@aldeyar-jeddah",
      "https://share.google/GKcHjw3Gl5MX85WmQ"
    ],
    "hasMap": "https://share.google/GKcHjw3Gl5MX85WmQ"
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    "name": "ديار جدة العالمية",
    "image": `${baseUrl}/favicon.svg`,
    "url": baseUrl,
    "telephone": "+966553719009",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al Makarunah Rd, تقاطع، التحليه",
      "addressLocality": "جدة",
      "addressRegion": "منطقة مكة المكرمة",
      "postalCode": "23461",
      "addressCountry": "SA"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 21.509375, "longitude": 39.192188 },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "priceRange": "$$",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "125" },
    "sameAs": [
      "https://www.facebook.com/aldeyar.jeddah",
      "https://www.instagram.com/aldeyar.jeddah",
      "https://twitter.com/aldeyar_jeddah",
      "https://www.linkedin.com/company/aldeyar-global",
      "https://www.youtube.com/@aldeyar-jeddah",
      "https://share.google/GKcHjw3Gl5MX85WmQ"
    ],
    "hasMap": "https://share.google/GKcHjw3Gl5MX85WmQ"
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ديار جدة العالمية",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const extraData = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
      {extraData.map((d, i) => (
        <script key={`structured-extra-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}
