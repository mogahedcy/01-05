import React from 'react';
import StructuredDataScript from './StructuredDataScript';

interface VideoObjectSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}

export default function VideoObjectSchema({ 
  name, 
  description, 
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration = 'PT2M'
}: VideoObjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
    "publisher": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.deyarsu.com/logo.png"
      }
    }
  };

  return <StructuredDataScript data={schema} />;
}
