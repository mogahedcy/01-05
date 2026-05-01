import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import MediaDetailClient from '@/app/[locale]/portfolio/[id]/media/[mediaId]/MediaDetailClient';
import IntlProvider from '@/components/IntlProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAbsoluteUrl } from '@/lib/seo-utils';

interface Props {
  params: Promise<{
    id: string;
    mediaId: string;
    locale: string;
  }>;
}

// دالة جلب البيانات
async function getMediaData(projectId: string, mediaId: string) {
  const decodedId = decodeURIComponent(projectId);
  
  const project = await prisma.projects.findFirst({
    where: {
      OR: [
        { id: decodedId },
        { slug: decodedId }
      ]
    },
    include: {
      media_items: true,
    }
  });

  if (!project) return null;

  // استخراج معرف الصورة الحقيقي من الرابط المحسن لمحركات البحث
  // الرابط يكون بصيغة: slug-name-UUID
  // UUID طوله دائماً 36 حرفاً (مثل: 8dd79cf2-afaf-42ee-b8ad-6e19c8ffe86f)
  let actualMediaId = decodeURIComponent(mediaId);
  if (actualMediaId.length > 36) {
    actualMediaId = actualMediaId.slice(-36);
  }

  const mediaItem = project.media_items.find(item => item.id === actualMediaId);
  if (!mediaItem) return null;

  return { project, mediaItem };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, mediaId, locale } = await params;
  const data = await getMediaData(id, mediaId);
  if (!data) return {};

  const { project, mediaItem } = data;
  const isEn = locale === 'en';
  const baseUrl = 'https://www.deyarsu.com';

  // 1. استخراج الترجمات الذكية من AI Analysis إذا وجدت
  let mediaTitle = mediaItem.title || mediaItem.alt;
  let mediaDesc = mediaItem.description || project.description;

  if (project.suggestedKeywords) {
    try {
      const translation = JSON.parse(project.suggestedKeywords as string);
      const enData = translation.enMetadata || translation;
      
      if (isEn && enData) {
        // محاولة البحث عن ترجمة لهذا الوسيط تحديداً في مصفوفة الصور المترجمة إذا وجدت
        // (بافتراض أن الـ AI قام بترجمة مصفوفة الصور أيضاً)
        mediaTitle = enData.title ? `${enData.title} - ${mediaItem.type}` : mediaTitle;
        mediaDesc = enData.description || mediaDesc;
      }
    } catch (e) {
      console.warn('Metadata Translation Error:', e);
    }
  }

  // إذا لم توجد ترجمة، نستخدم القالب الديناميكي
  const finalTitle = mediaTitle || (isEn ? `${mediaItem.type} for ${project.title}` : `${mediaItem.type === 'IMAGE' ? 'صورة' : 'فيديو'} لمشروع ${project.title}`);
  const finalDesc = mediaDesc?.substring(0, 160) || '';

  const projectSlug = project.slug || project.id;
  const arUrl = `${baseUrl}/portfolio/${projectSlug}/media/${mediaId}`;
  const enUrl = `${baseUrl}/en/portfolio/${projectSlug}/media/${mediaId}`;
  const currentUrl = isEn ? enUrl : arUrl;

  return {
    title: `${finalTitle} | ${isEn ? 'Deyar Jeda International' : 'ديار جدة العالمية'}`,
    description: finalDesc,
    alternates: {
      canonical: currentUrl,
      languages: {
        'ar-SA': arUrl,
        'en-US': enUrl,
        'x-default': arUrl
      }
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: currentUrl,
      siteName: isEn ? 'Deyar Jeda' : 'ديار جدة العالمية',
      locale: isEn ? 'en_US' : 'ar_SA',
      type: mediaItem.type === 'VIDEO' ? 'video.other' : 'article',
      images: [
        {
          url: getAbsoluteUrl(mediaItem.type === 'IMAGE' ? mediaItem.src : (mediaItem.thumbnail || '')),
          width: 1200,
          height: 630,
          alt: finalTitle,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      images: [getAbsoluteUrl(mediaItem.type === 'IMAGE' ? mediaItem.src : (mediaItem.thumbnail || ''))],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function MediaPage({ params }: Props) {
  const { id, mediaId, locale } = await params;
  const data = await getMediaData(id, mediaId);

  if (!data) {
    notFound();
  }

  const { project, mediaItem } = data;

  // إعداد بيانات الـ Schema
  const schemaData = mediaItem.type === 'IMAGE' ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    'contentUrl': getAbsoluteUrl(mediaItem.src),
    'description': mediaItem.description || project.description,
    'name': mediaItem.title || project.title,
    'author': {
      '@type': 'Organization',
      'name': 'ديار جدة العالمية'
    }
  } : {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': mediaItem.title || project.title,
    'description': mediaItem.description || project.description,
    'thumbnailUrl': getAbsoluteUrl(mediaItem.thumbnail || ''),
    'contentUrl': getAbsoluteUrl(mediaItem.src),
    'uploadDate': project.createdAt.toISOString(),
  };

  return (
    <IntlProvider locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Navbar />
      <MediaDetailClient 
        project={project as any} 
        mediaItem={mediaItem as any} 
        locale={locale} 
      />
      <Footer />
    </IntlProvider>
  );
}
