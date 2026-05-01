
import React from 'react';

interface ProjectStructuredDataProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    completionDate: string;
    projectCost?: string;
    mediaItems: Array<{
      type: 'IMAGE' | 'VIDEO';
      src: string;
      title?: string;
      description?: string;
    }>;
    rating?: number;
    views?: number;
  };
}

export default function ProjectStructuredData({ project }: ProjectStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "url": "https://www.deyarsu.com",
      "logo": "https://www.deyarsu.com/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "جدة",
        "addressCountry": "SA"
      }
    },
    "dateCreated": project.completionDate,
    "keywords": [
      project.category,
      "جدة",
      "السعودية",
      "مظلات",
      "سواتر",
      "برجولات",
      "تنسيق حدائق",
      "ديار جدة العالمية"
    ].join(", "),
    "locationCreated": {
      "@type": "Place",
      "name": project.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "جدة",
        "addressCountry": "SA"
      }
    },
    "image": project.mediaItems
      .filter(item => item.type === 'IMAGE')
      .map(item => ({
        "@type": "ImageObject",
        "url": item.src,
        "name": item.title || project.title,
        "description": item.description || project.description,
        "creator": "ديار جدة العالمية"
      })),
    "video": project.mediaItems
      .filter(item => item.type === 'VIDEO')
      .map(item => ({
        "@type": "VideoObject",
        "name": item.title || project.title,
        "description": item.description || project.description,
        "contentUrl": item.src,
        "uploadDate": project.completionDate,
        "creator": "ديار جدة العالمية"
      })),
    "aggregateRating": project.rating ? {
      "@type": "AggregateRating",
      "ratingValue": project.rating,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ViewAction",
      "userInteractionCount": project.views || 0
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
