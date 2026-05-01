import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { prisma } from '@/lib/prisma';
import {
  generateCreativeWorkSchema,
  generateImageGallerySchema,
  generateProjectSchema,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
  generateRobotsMetadata,
  getAbsoluteUrl,
  getMediaType,
  generateCollectionPageSchema,
  generateIndividualImageSchemas
} from '@/lib/seo-utils';
import ProjectDetailsClient from './ProjectDetailsClient';
import IntlProvider from '@/components/IntlProvider';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ✅ إيقاف التخزين المؤقت لضمان جلب أحدث البيانات (خصوصاً الـ thumbnails للفيديوهات)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

// دالة لإنشاء thumbnail من فيديو Cloudinary
function generateVideoThumbnail(videoUrl: string): string | null {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) return null;

  // تحويل رابط الفيديو إلى رابط صورة مصغرة
  // مثال: video/upload/v123/folder/video.mp4 → image/upload/so_2,w_1280,h_720,c_fill/v123/folder/video.jpg
  try {
    const urlParts = videoUrl.split('/upload/');
    if (urlParts.length !== 2) return null;

    const baseUrl = urlParts[0].replace('/video/', '/image/');
    const resourcePath = urlParts[1].replace(/\.[^.]+$/, '.jpg');

    // إضافة تحويلات للحصول على إطار من الثانية الثانية لتجنب الشاشة السوداء في البداية
    return `${baseUrl}/upload/so_2,w_1280,h_720,c_fill,q_auto,f_jpg/${resourcePath}`;
  } catch {
    return null;
  }
}

// دالة جلب المشروع مباشرة من قاعدة البيانات - بدون تزامن مع API
async function getProject(id: string) {
  try {
    // فك ترميز URL للتعامل مع الأحرف العربية
    const decodedId = decodeURIComponent(id);

    // البحث باستخدام المعرف أو الـ slug مع جلب البيانات الأساسية بسرعة
    const project = await (prisma as any).projects.findFirst({
      where: {
        OR: [
          { id: decodedId },
          { slug: decodedId }
        ]
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        description: true,
        descriptionEn: true,
        category: true,
        location: true,
        locationEn: true,
        completionDate: true,
        client: true,
        clientEn: true,
        featured: true,
        projectDuration: true,
        projectCost: true,
        views: true,
        likes: true,
        rating: true,
        status: true,
        slug: true,
        metaTitle: true,
        metaTitleEn: true,
        metaDescription: true,
        metaDescriptionEn: true,
        keywords: true,
        keywordsEn: true,
        createdAt: true,
        updatedAt: true,
        suggestedKeywords: true,
        media_items: {
          select: {
            id: true,
            type: true,
            src: true,
            thumbnail: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            alt: true
          },
          orderBy: { order: 'asc' }
        },
        project_tags: {
          select: { id: true, name: true }
        },
        project_materials: {
          select: { id: true, name: true }
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    // جلب التعليقات بشكل منفصل (lazy loading) لتحسين الأداء
    let comments: any[] = [];
    if (project) {
      comments = await (prisma as any).comments.findMany({
        where: {
          projectId: project.id,
          rating: { gt: 0 }
        },
        select: {
          id: true,
          name: true,
          message: true,
          rating: true,
          createdAt: true
        },
        take: 10
      });
    }

    if (!project) {
      return null;
    }

    // تنسيق البيانات بنفس طريقة API
    return {
      ...project,
      mediaItems: project.media_items || [],
      tags: project.project_tags || [],
      materials: project.project_materials || [],
      comments: comments || [],
      views: project.views || 0,
      rating: project.rating || 0,
      _count: project._count
    };
  } catch (err) {
    console.error('❌ خطأ في جلب المشروع:', err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  const isEn = locale === 'en';

  const project = await getProject(id);

  if (!project) {
    return {
      title: isEn ? 'Project Not Found | Deyar Jeda' : 'المشروع غير موجود | ديار جدة العالمية',
      description: isEn ? 'The requested project is not available' : 'المشروع المطلوب غير متوفر',
      robots: 'noindex, nofollow'
    };
  }

  // استخدام الحقول الإنجليزية المباشرة إذا وجدت
  if (isEn) {
    if (!(project as any).titleEn && project.suggestedKeywords) {
      try {
        const parsed = JSON.parse(project.suggestedKeywords);
        const isBadFallback = parsed.title?.startsWith('Project:') && /[\u0600-\u06FF]/.test(parsed.title);
        if (!isBadFallback) {
          if (parsed.title) (project as any).titleEn = parsed.title;
          if (parsed.description) (project as any).descriptionEn = parsed.description;
          if (parsed.metaTitle) (project as any).metaTitleEn = parsed.metaTitle;
          if (parsed.metaDescription) (project as any).metaDescriptionEn = parsed.metaDescription;
        }
      } catch (e) {}
    }

    project.title = (project as any).titleEn || project.title;
    project.description = (project as any).descriptionEn || project.description;
    project.metaTitle = (project as any).metaTitleEn || project.metaTitle;
    project.metaDescription = (project as any).metaDescriptionEn || project.metaDescription;
  }

  // استخراج جميع الصور والفيديوهات للمشروع
  const allImages = project.mediaItems?.filter((item: any) => item.type === 'IMAGE') || [];
  const allVideos = project.mediaItems?.filter((item: any) => item.type === 'VIDEO') || [];

  // تحسين اختيار الصورة الرئيسية للمشاركة بناءً على البيانات الفعلية للمشروع
  let shareImage = '';

  if (allVideos.length > 0) {
    const generatedThumb = generateVideoThumbnail(allVideos[0].src);
    if (generatedThumb) {
      shareImage = generatedThumb;
    } else if (allVideos[0].thumbnail) {
      shareImage = getAbsoluteUrl(allVideos[0].thumbnail);
    }
  }

  if (!shareImage && allImages.length > 0) {
    shareImage = getAbsoluteUrl(allImages[0].src);
  }

  if (!shareImage) {
    shareImage = 'https://www.deyarsu.com/images/slider1.webp';
  }

  const projectKeywords = project.keywords ? project.keywords.split(',').map((k: string) => k.trim()) : [];
  const dynamicKeywords = [
    project.title,
    project.category,
    project.location,
    ...projectKeywords,
    isEn ? 'Deyar Jeda International' : 'ديار جدة العالمية'
  ].filter(Boolean);

  const seoTitle = project.metaTitle || (isEn ? `${project.title} | Deyar Jeda` : `${project.title} | ديار جدة العالمية`);
  const seoDescription = project.metaDescription ||
    (isEn ? `${project.description.substring(0, 150)}... Professional implementation in ${project.location} with 10 years warranty.` :
      `${project.description.substring(0, 150)}... تنفيذ احترافي في ${project.location} بضمان 10 سنوات.`);

  const localePrefix = isEn ? '/en' : '';
  const pageUrl = `${localePrefix}/portfolio/${project.slug || id}`;
  const fullUrl = `https://www.deyarsu.com${pageUrl}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: dynamicKeywords.join(', '),
    alternates: {
      canonical: fullUrl,
      languages: {
        'ar-SA': `https://www.deyarsu.com/portfolio/${project.slug || id}`,
        'en-US': `https://www.deyarsu.com/en/portfolio/${project.slug || id}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: fullUrl,
      siteName: isEn ? 'Deyar Jeda' : 'ديار جدة العالمية',
      locale: isEn ? 'en_US' : 'ar_SA',
      type: 'article',
      publishedTime: project.createdAt.toISOString(),
      modifiedTime: (project.updatedAt || project.createdAt).toISOString(),
      authors: [isEn ? 'Deyar Jeda International' : 'ديار جدة العالمية'],
      section: project.category,
      tags: project.tags?.map((t: any) => t.name) || [],
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
        ...allImages.slice(1, 4).map((img: any) => ({
          url: getAbsoluteUrl(img.src),
          width: 1200,
          height: 630,
          alt: img.alt || project.title,
        }))
      ],
      videos: allVideos.length > 0
        ? allVideos.map((video: any) => ({
          url: getAbsoluteUrl(video.src),
          width: 1280,
          height: 720,
          type: 'video/mp4',
        }))
        : undefined,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: seoTitle,
      description: seoDescription.substring(0, 200),
      creator: '@deyarjeddah',
      site: '@deyarjeddah',
      // ✅ جميع الصور (Twitter يدعم حتى 4 صور)
      images: allImages.length > 0
        ? allImages.slice(0, 4).map((img: any, index: number) => ({
          url: getAbsoluteUrl(img.src),
          alt: img.alt || img.title || `${project.title} - صورة ${index + 1}`,
        }))
        : [{ url: shareImage }],
    },
    robots: generateRobotsMetadata()
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id, locale } = await params;
  const decodedId = decodeURIComponent(id);
  const project = await getProject(decodedId);

  if (!project) {
    notFound();
  }

  // 301 Redirect من UUID إلى Slug لتحسين SEO وتوحيد الفهرسة
  if (UUID_REGEX.test(decodedId) && project.slug && project.slug !== decodedId) {
    const localePrefix = locale === 'en' ? '/en' : '';
    permanentRedirect(`${localePrefix}/portfolio/${project.slug}`);
  }

  // إعداد البيانات بناءً على اللغة
  const isEn = locale === 'en';
  
  // تطبيق البيانات الإنجليزية المباشرة في المكون الرئيسي
  if (isEn) {
    // Fallback لاستخراج ترجمة Groq المحفوظة مسبقاً في suggestedKeywords
    if (!(project as any).titleEn && project.suggestedKeywords) {
      try {
        const parsed = JSON.parse(project.suggestedKeywords);
        const isBadFallback = parsed.title?.startsWith('Project:') && /[\u0600-\u06FF]/.test(parsed.title);
        if (!isBadFallback) {
          if (parsed.title) (project as any).titleEn = parsed.title;
          if (parsed.description) (project as any).descriptionEn = parsed.description;
          if (parsed.location) (project as any).locationEn = parsed.location;
          if (parsed.metaTitle) (project as any).metaTitleEn = parsed.metaTitle;
          if (parsed.metaDescription) (project as any).metaDescriptionEn = parsed.metaDescription;
        }
      } catch (e) {}
    }

    project.title = (project as any).titleEn || project.title;
    project.description = (project as any).descriptionEn || project.description;
    project.metaTitle = (project as any).metaTitleEn || project.metaTitle;
    project.metaDescription = (project as any).metaDescriptionEn || project.metaDescription;
    project.location = (project as any).locationEn || project.location;
    project.client = (project as any).clientEn || project.client;
  }

  // إعداد structured data
  const images = project.mediaItems?.filter((item: any) => item.type === 'IMAGE') || [];
  const videos = project.mediaItems?.filter((item: any) => item.type === 'VIDEO') || [];
  const localePrefix = isEn ? '/en' : '';
  const fullUrl = getAbsoluteUrl(`${localePrefix}/portfolio/${project.slug || id}`);

  const breadcrumbItems = [
    { label: isEn ? 'Projects' : 'المشاريع', href: `${localePrefix}/portfolio` },
    { label: project.title, href: `${localePrefix}/portfolio/${project.slug || id}`, current: true }
  ];

  // جلب التعليقات للمشروع لإضافتها كـ Reviews في الـ schema
  // استخدام الخصائص الصحيحة: name, rating, message, createdAt
  const projectReviews = project.comments?.filter((comment: any) =>
    comment.rating && comment.rating > 0 && comment.name && comment.message
  ) || [];

  // حساب التقييم الفعلي من التعليقات
  const validReviews = projectReviews.filter((c: any) => c.rating >= 1 && c.rating <= 5);
  const averageRating = validReviews.length > 0
    ? Math.round((validReviews.reduce((sum: number, c: any) => sum + c.rating, 0) / validReviews.length) * 10) / 10
    : 0;

  const structuredData = generateCreativeWorkSchema({
    name: project.title,
    description: project.description,
    url: `/portfolio/${project.slug || id}`,
    category: project.category,
    location: project.location,
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    images: images.map((item: any, index: number) => ({
      id: item.id || `img-${index + 1}`,
      url: getAbsoluteUrl(item.src),
      caption: item.title || item.description || `${project.title} - صورة ${index + 1}`,
      alt: item.alt || item.title || `${project.category} في ${project.location} - صورة ${index + 1}`
    })),
    videos: videos.map((item: any, index: number) => {
      const videoThumbnail = generateVideoThumbnail(item.src);

      return {
        id: item.id || `vid-${index + 1}`,
        name: item.title || `${project.title} - فيديو ${index + 1}`,
        description: item.description || `فيديو يوضح تفاصيل مشروع ${project.title} في ${project.location}`,
        contentUrl: getAbsoluteUrl(item.src),
        embedUrl: fullUrl,
        thumbnailUrl: videoThumbnail || (item.thumbnail ? getAbsoluteUrl(item.thumbnail) : undefined),
        uploadDate: project.createdAt.toISOString(),
        duration: item.duration,
        // ✅ وضع الفيديو كمحتوى أساسي في الـ metadata
        mainEntityOfPage: index === 0
      };
    }),
    aggregateRating: validReviews.length > 0 && averageRating > 0 ? {
      ratingValue: averageRating,
      reviewCount: validReviews.length
    } : undefined,
    reviews: validReviews.length > 0 ? validReviews.map((comment: any) => ({
      author: comment.name?.trim() || 'عميل',
      rating: Math.min(5, Math.max(1, Number(comment.rating))),
      reviewBody: comment.message?.trim() || '',
      datePublished: comment.createdAt ? new Date(comment.createdAt).toISOString() : new Date().toISOString()
    })).filter((r: any) => r.reviewBody.length > 0) : undefined
  });

  const imageGallerySchema = images.length > 1 ? generateImageGallerySchema({
    name: `معرض صور ${project.title}`,
    description: `معرض صور مشروع ${project.title} - ${project.category} في ${project.location} | ديار جدة العالمية`,
    url: `/portfolio/${project.slug || id}`,
    category: project.category,
    location: project.location,
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    images: images.map((item: any, index: number) => ({
      url: getAbsoluteUrl(item.src),
      caption: item.title || item.description || `${project.title} - ${project.category} في ${project.location} - صورة ${index + 1} | ديار جدة العالمية`,
      alt: item.alt || `${project.category} في ${project.location} - صورة ${index + 1} | ديار جدة العالمية`,
      width: 1200,
      height: 800
    }))
  }) : null;

  const projectSchema = images.length > 0 ? generateProjectSchema({
    name: project.title,
    description: project.description,
    url: `/portfolio/${project.slug || id}`,
    category: project.category,
    location: project.location,
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    images: images.map((item: any, index: number) => ({
      url: getAbsoluteUrl(item.src),
      caption: item.title || `${project.title} - صورة ${index + 1}`,
      alt: item.alt || `${project.category} في ${project.location}`
    })),
    videos: videos.length > 0 ? videos.map((item: any, index: number) => ({
      url: getAbsoluteUrl(item.src),
      name: item.title || `${project.title} - فيديو ${index + 1}`,
      description: item.description || `فيديو مشروع ${project.title}`,
      thumbnailUrl: generateVideoThumbnail(item.src) || undefined
    })) : undefined,
    aggregateRating: validReviews.length > 0 && averageRating > 0 ? {
      ratingValue: averageRating,
      reviewCount: validReviews.length
    } : undefined
  }) : null;

  // ✅ VideoObject Schema - مستقل لتعزيز الفهرسة كفيديو أساسي
  const videoObjectSchema = videos.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": project.title,
    "description": project.description,
    "thumbnailUrl": generateVideoThumbnail(videos[0].src) || (videos[0].thumbnail ? getAbsoluteUrl(videos[0].thumbnail) : undefined),
    "uploadDate": project.createdAt.toISOString(),
    "contentUrl": getAbsoluteUrl(videos[0].src),
    "embedUrl": fullUrl,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": "1500"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.deyarsu.com/logo.png"
      }
    }
  } : null;

  return (
    <IntlProvider locale={locale}>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />

      {/* ✅ Video Object Schema - للفهرسة كمحتوى فيديو أساسي */}
      {videoObjectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoObjectSchema),
          }}
        />
      )}

      {/* ✅ Creative Work Schema - للمشروع والصور والفيديوهات */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* ✅ Project Schema - بيانات المشروع المتقدمة */}
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectSchema),
          }}
        />
      )}

      {/* ✅ Image Gallery Schema - معرض الصور (جميع الصور) */}
      {imageGallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageGallerySchema),
          }}
        />
      )}

      {/* ✅ CollectionPage Schema - لإظهار الصفحة كمجموعة صور */}
      {images.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateCollectionPageSchema({
              name: `معرض ${project.title}`,
              description: `مجموعة صور مشروع ${project.title} - ${project.category} في ${project.location} | ديار جدة العالمية`,
              url: `/portfolio/${project.slug || id}`,
              images: images.map((item: any, index: number) => ({
                url: getAbsoluteUrl(item.src),
                caption: item.title || `${project.title} - صورة ${index + 1}`,
                alt: item.alt || `${project.category} في ${project.location} - صورة ${index + 1}`,
                width: 1200,
                height: 800
              })),
              category: project.category,
              location: project.location,
              dateCreated: project.createdAt.toISOString(),
              dateModified: project.updatedAt.toISOString()
            })),
          }}
        />
      )}

      {/* ✅ Individual ImageObject Schemas - كل صورة بشكل مستقل للفهرسة الفردية */}
      {images.length > 0 && generateIndividualImageSchemas({
        projectName: project.title,
        projectDescription: project.description,
        projectUrl: `/portfolio/${project.slug || id}`,
        category: project.category,
        location: project.location,
        dateCreated: project.createdAt.toISOString(),
        images: images.map((item: any, index: number) => ({
          url: getAbsoluteUrl(item.src),
          caption: item.title || `${project.title} - صورة ${index + 1}`,
          alt: item.alt || `${project.category} في ${project.location} - صورة ${index + 1}`,
          width: 1200,
          height: 800
        }))
      }).map((schema, index) => (
        <script
          key={`individual-image-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      {/* ✅ LocalBusiness Schema - معلومات الشركة والتقييمات */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'ديار جدة العالمية',
            description: `${project.category} في ${project.location} - تنفيذ ديار جدة العالمية بجودة عالية وضمان 10 سنوات`,
            image: images.length > 0 ? images.map((img: any) => getAbsoluteUrl(img.src)) : ['https://www.deyarsu.com/logo.png'],
            address: {
              '@type': 'PostalAddress',
              addressLocality: project.location || 'جدة',
              addressRegion: 'منطقة مكة المكرمة',
              addressCountry: 'SA'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '21.5433',
              longitude: '39.1728'
            },
            telephone: '+966553719009',
            priceRange: '$$',
            ...(validReviews.length > 0 && averageRating > 0 ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: averageRating.toString(),
                reviewCount: validReviews.length.toString(),
                bestRating: '5',
                worstRating: '1'
              }
            } : {}),
            ...(validReviews.length > 0 ? {
              review: validReviews.map((comment: any) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: comment.name?.trim() || 'عميل'
                },
                datePublished: comment.createdAt ? new Date(comment.createdAt).toISOString() : new Date().toISOString(),
                reviewBody: comment.message?.trim() || '',
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: Math.min(5, Math.max(1, Number(comment.rating))).toString(),
                  bestRating: '5',
                  worstRating: '1'
                }
              }))
            } : {})
          }),
        }}
      />

      <Navbar />
      <ProjectDetailsClient project={project} projectId={id} locale={locale} />
      <Footer />
    </IntlProvider>
  );
}
