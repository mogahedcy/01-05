import React from 'react';
import StructuredDataScript from './StructuredDataScript';

interface SearchActionSchemaProps {
  baseUrl?: string;
}

export default function SearchActionSchema({ baseUrl = 'https://www.deyarsu.com' }: SearchActionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": baseUrl,
    "name": "ديار جدة العالمية",
    "description": "شركة متخصصة في المظلات، البرجولات، السواتر، وتنسيق الحدائق في جدة",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <StructuredDataScript data={schema} />;
}
