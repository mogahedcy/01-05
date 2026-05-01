import type { BreadcrumbItem } from './Breadcrumb';

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
  homeName?: string;
  locale?: string;
}

export default function BreadcrumbSchema({ 
  items, 
  baseUrl = 'https://www.deyarsu.com',
  homeName,
  locale = 'ar'
}: BreadcrumbSchemaProps) {
  // Use provided homeName or default based on locale
  const homeLabel = homeName || (locale === 'ar' ? 'الرئيسية' : 'Home');
  const homeUrl = locale === 'ar' ? baseUrl : `${baseUrl}/en`;
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeLabel,
        "item": {
          "@type": "Thing",
          "@id": homeUrl
        }
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": {
          "@type": "Thing",
          "@id": `${baseUrl}${item.href}`
        }
      }))
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
