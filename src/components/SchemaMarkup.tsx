import type { Project } from '@prisma/client';

interface SchemaMarkupProps {
  project?: Project & {
    mediaItems: Array<{
      src: string;
      type: string;
      alt?: string;
    }>;
  };
}

export default function SchemaMarkup({ project }: SchemaMarkupProps) {
  if (!project) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": `https://www.deyarsu.com/portfolio/${project.id}`,
    "creator": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "url": "https://www.deyarsu.com"
    },
    "dateCreated": project.createdAt,
    "dateModified": project.updatedAt,
    "inLanguage": "ar",
    "keywords": `${project.category}, جدة, ${project.location}, مظلات, سواتر`,
    "image": project.mediaItems
      ?.filter(item => item.type === 'IMAGE')
      .map(item => ({
        "@type": "ImageObject",
        "url": item.src,
        "caption": item.alt || project.title
      })),
    "video": project.mediaItems
      ?.filter(item => item.type === 'VIDEO')
      .map(item => ({
        "@type": "VideoObject",
        "contentUrl": item.src,
        "name": project.title,
        "description": project.description,
        "thumbnailUrl": item.alt || project.mediaItems?.find(m => m.type === 'IMAGE')?.src
      }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  );
}