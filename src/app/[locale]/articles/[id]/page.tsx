import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetailsClient from './ArticleDetailsClient';
import ArticleSchema from '@/components/ArticleSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { generateCanonicalUrl, getAbsoluteUrl, extractFAQsFromHtml, generateVideoObjectSchema } from '@/lib/seo-utils';
import FAQSchema from '@/components/FAQSchema';
import IntlProvider from '@/components/IntlProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import FloatingCallButton from '@/components/FloatingCallButton';
import BottomNavigation from '@/components/BottomNavigation';

// ✅ ISR - تحديث الصفحة تلقائياً كل ساعة مع دعم صفحات جديدة
export const dynamicParams = true;
export const revalidate = 3600; // إعادة بناء كل ساعة

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

import { prisma } from '@/lib/prisma';

async function getArticle(id: string) {
  try {
    const decodedId = decodeURIComponent(id);

    const article = await (prisma as any).articles.findFirst({
      where: {
        OR: [
          { id: decodedId },
          { slug: decodedId }
        ]
      },
      include: {
        article_media_items: { orderBy: { order: 'asc' } },
        article_tags: true,
        _count: { select: { article_comments: true, article_likes: true, article_views: true } }
      }
    });

    if (!article) {
      return null;
    }

    // تنسيق البيانات لتتطابق مع ما يتوقعه المكون
    return {
      ...article,
      mediaItems: article.article_media_items || [],
      tags: article.article_tags || [],
      views: article.views || 0,
      likes: article._count?.article_likes || 0,
      commentsCount: article._count?.article_comments || 0,
    };
  } catch (err) {
    console.error('❌ خطأ في جلب المقالة مباشرة من قاعدة البيانات:', err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  try {
    const { id, locale } = await params;
    const article = await getArticle(id);
    const isEnglish = locale === 'en';

    if (!article) {
      return {
        title: isEnglish ? 'Article Not Found | Aldeyar Global' : 'المقالة غير موجودة | ديار جدة العالمية',
        description: isEnglish ? 'The requested article is not available' : 'المقالة المطلوبة غير متوفرة'
      };
    }

    // استخدام الحقول الإنجليزية إذا كانت متوفرة
    const title = isEnglish ? (article.titleEn || article.title) : article.title;
    const excerpt = isEnglish ? (article.excerptEn || article.excerpt) : article.excerpt;
    const brandName = isEnglish ? 'Aldeyar Global Professionals' : 'ديار جدة العالمية';

    // Fallback: try aiAnalysis for old articles
    if (isEnglish && !article.titleEn && article.aiAnalysis) {
      try {
        const analysisData = JSON.parse(article.aiAnalysis);
        if (analysisData.englishVersion) {
          if (analysisData.englishVersion.title) article.titleEn = analysisData.englishVersion.title;
          if (analysisData.englishVersion.metaDescription) article.excerptEn = analysisData.englishVersion.metaDescription;
        }
      } catch (e) { }
    }

    const mainImage = article.mediaItems?.find((item: any) => item.type === 'IMAGE');
    const seoTitle = `${title} | ${brandName}`;
    const seoDescription = excerpt || article.content.substring(0, 160);
    const articleSlug = article.slug || article.id;
    const baseUrl = 'https://www.deyarsu.com';

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: isEnglish
        ? [article.category, 'Aldeyar Global', 'Jeddah', 'Saudi Arabia', ...(article.tags || []).map((t: any) => t.name)].join(', ')
        : [article.category, 'ديار جدة العالمية', 'جدة', 'السعودية', ...(article.tags || []).map((t: any) => t.name)].join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: generateCanonicalUrl(`${isEnglish ? '/en' : ''}/articles/${articleSlug}`),
        siteName: brandName,
        images: mainImage ? [
          {
            url: getAbsoluteUrl(mainImage.src),
            width: 1200,
            height: 630,
            alt: title
          }
        ] : [],
        locale: isEnglish ? 'en_US' : 'ar_SA',
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author]
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: mainImage ? [getAbsoluteUrl(mainImage.src)] : []
      },
      alternates: {
        canonical: generateCanonicalUrl(`${isEnglish ? '/en' : ''}/articles/${articleSlug}`),
        languages: {
          'ar': `${baseUrl}/articles/${articleSlug}`,
          'en': `${baseUrl}/en/articles/${articleSlug}`,
          'x-default': `${baseUrl}/articles/${articleSlug}`,
        }
      }
    };
  } catch (error) {
    console.error('خطأ في generateMetadata:', error);
    return {
      title: 'ديار جدة العالمية',
      description: 'مقالات متخصصة في المظلات والبرجولات'
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id, locale } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  const mainImage = article.mediaItems?.find((item: any) => item.type === 'IMAGE');
  const isEnglish = locale === 'en';

  // تطبيق المحتوى الإنجليزي إذا كان موجوداً ومطلوباً
  if (isEnglish) {
    if (article.titleEn) article.title = article.titleEn;
    if (article.contentEn) article.content = article.contentEn;
    if (article.excerptEn) article.excerpt = article.excerptEn;
    // Fallback: try aiAnalysis if no separate English fields
    if (!article.contentEn && article.aiAnalysis) {
      try {
        const analysisData = JSON.parse(article.aiAnalysis);
        if (analysisData.englishVersion) {
          article.title = analysisData.englishVersion.title || article.title;
          article.excerpt = analysisData.englishVersion.excerpt || article.excerpt;
          article.content = analysisData.englishVersion.content || article.content;
          article.category = analysisData.englishVersion.category || article.category;
        }
      } catch (e) { }
    }
  }

  const allImages = article.mediaItems
    ?.filter((item: any) => item.type === 'IMAGE')
    .map((item: any) => item.src) || [];

  const articleUrl = generateCanonicalUrl(`${isEnglish ? '/en' : ''}/articles/${article.slug || article.id}`);
  
  // Use DB keywords if available, otherwise fallback to tags/category
  const dbKeywords = isEnglish 
    ? (article.keywordsEn || article.keywords) 
    : article.keywords;
    
  const articleKeywords = dbKeywords
    ? dbKeywords.split(',').map((k: string) => k.trim())
    : (isEnglish
        ? [article.category, 'Aldeyar Global Professionals', 'Jeddah', 'Saudi Arabia', ...(article.tags || []).map((t: any) => t.name)]
        : [article.category, 'ديار جدة العالمية', 'جدة', 'السعودية', ...(article.tags || []).map((t: any) => t.name)]);

  const plainTextContent = article.content
    ?.replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || '';

  const wordCount = plainTextContent.split(/\s+/).length;

  // Extract FAQs for Legendary Search Appearance
  const extractedFaqs = extractFAQsFromHtml(article.content || '');

  const breadcrumbItems = isEnglish
    ? [
        { label: 'Blog', href: '/en/articles' },
        { label: article.category, href: `/en/articles?category=${encodeURIComponent(article.category)}` },
        { label: article.title, href: `/en/articles/${article.slug || article.id}` }
      ]
    : [
        { label: 'المدونة', href: '/articles' },
        { label: article.category, href: `/articles?category=${encodeURIComponent(article.category)}` },
        { label: article.title, href: `/articles/${article.slug || article.id}` }
      ];

  const validComments = (article.comments || []).filter(
    (c: any) => c.rating && c.rating >= 1 && c.rating <= 5 && c.name && c.message
  );

  const averageRating = validComments.length > 0
    ? Math.round((validComments.reduce((sum: number, c: any) => sum + c.rating, 0) / validComments.length) * 10) / 10
    : 0;

  const reviewsSchema = validComments.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": article.title,
    "aggregateRating": averageRating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": validComments.length,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "review": validComments.map((comment: any) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": comment.name?.trim() || (isEnglish ? 'Reader' : 'قارئ')
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": Math.min(5, Math.max(1, Number(comment.rating))),
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": comment.message?.trim() || '',
      "datePublished": comment.createdAt ? new Date(comment.createdAt).toISOString() : new Date().toISOString()
    })).filter((r: any) => r.reviewBody.length > 0)
  } : null;

  return (
    <IntlProvider locale={locale}>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <ArticleSchema
        headline={article.title}
        description={article.excerpt || article.content?.substring(0, 160) || ''}
        author={{
          name: article.author || (isEnglish ? 'Aldeyar Global Professionals' : 'ديار جدة العالمية'),
          url: 'https://www.deyarsu.com'
        }}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt || article.publishedAt}
        image={allImages.length > 0 ? allImages : (mainImage?.src ? [mainImage.src] : undefined)}
        url={articleUrl}
        articleBody={plainTextContent}
        keywords={articleKeywords}
        articleSection={article.category}
        wordCount={wordCount}
        locale={locale}
      />
      {extractedFaqs.length > 0 && <FAQSchema faqs={extractedFaqs} />}
      {(() => {
        const videos = article.mediaItems
          ?.filter((item: any) => item.type === 'VIDEO')
          .map((video: any) => ({
            name: video.title || article.title,
            description: video.caption || article.excerpt || article.title,
            contentUrl: getAbsoluteUrl(video.src),
            thumbnailUrl: video.thumbnail ? getAbsoluteUrl(video.thumbnail) : (mainImage ? getAbsoluteUrl(mainImage.src) : undefined),
            uploadDate: article.publishedAt
          }));

        if (videos && videos.length > 0) {
          const videoSchema = generateVideoObjectSchema(videos);
          return (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />
          );
        }
        return null;
      })()}
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}
      <Navbar />
      <ArticleDetailsClient article={article} locale={locale} />
      <Footer />
      <WhatsAppWidget />
      <FloatingCallButton />
      <BottomNavigation />
    </IntlProvider>
  );
}
