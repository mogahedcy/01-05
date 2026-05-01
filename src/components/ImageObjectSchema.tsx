import React from 'react';
import StructuredDataScript from './StructuredDataScript';

interface ImageObjectSchemaProps {
  contentUrl: string;
  description: string;
  name: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  encodingFormat?: string;
}

export default function ImageObjectSchema({
  contentUrl,
  description,
  name,
  width = 1920,
  height = 1080,
  thumbnailUrl,
  encodingFormat = 'image/webp'
}: ImageObjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": contentUrl,
    "description": description,
    "name": name,
    "encodingFormat": encodingFormat,
    "width": width.toString(),
    "height": height.toString(),
    ...(thumbnailUrl && {
      "thumbnail": {
        "@type": "ImageObject",
        "contentUrl": thumbnailUrl,
        "width": "400",
        "height": "300"
      }
    }),
    "creator": {
      "@type": "Organization",
      "name": "ديار جدة العالمية"
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "ديار جدة العالمية"
    },
    "creditText": "ديار جدة العالمية - جدة",
    "acquireLicensePage": "https://www.deyarsu.com/contact",
    "license": "https://www.deyarsu.com/terms",
    "inLanguage": "ar"
  };

  return <StructuredDataScript data={schema} />;
}
