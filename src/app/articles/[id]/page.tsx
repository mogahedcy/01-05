import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetailsClient from './ArticleDetailsClient';
import ArticleSchema from '@/components/ArticleSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { generateCanonicalUrl, getAbsoluteUrl } from '@/lib/seo-utils';
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

async function getArticle(id: string) {
  try {
    // فك ترميز URL للتعامل مع الأحرف العربية
    const decodedId = decodeURIComponent(id);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
      ? (process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') 
          ? process.env.NEXT_PUBLIC_BASE_URL 
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}`)
      : (process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:5000');
    const response = await fetch(`${baseUrl}/api/articles/${encodeURIComponent(decodedId)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const article = await response.json();
    return article;
  } catch (err) {
    const error = err as { message?: string; status?: number };
    console.error('خطأ في جلب المقالة:', error);

    if (error?.message?.includes('404') || error?.status === 404) {
      notFound();
    }

    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  try {
    const { id, locale } = await params;
    const article = await getArticle(id);

    if (!article) {
      return {
        title: 'المقالة غير موجودة | ديار جدة العالمية',
        description: 'المقالة المطلوبة غير متوفرة'
      };
    }

    // تطبيق الترجمة الإنجليزية للميتا إذا كانت مطلوبة
    if (locale === 'en' && article.aiAnalysis) {
      try {
        const analysisData = JSON.parse(article.aiAnalysis);
        if (analysisData.englishVersion) {
          article.title = analysisData.englishVersion.title || article.title;
          article.excerpt = analysisData.englishVersion.metaDescription || analysisData.englishVersion.excerpt || article.excerpt;
        }
      } catch (e) {}
    }

    const mainImage = article.mediaItems?.find((item: any) => item.type === 'IMAGE');
    const seoTitle = `${article.title} | ديار جدة العالمية`;
    const seoDescription = article.excerpt || article.content.substring(0, 160);

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [
        article.category,
        'ديار جدة العالمية',
        'جدة',
        'السعودية',
        ...(article.tags || []).map((t: any) => t.name)
      ].join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: generateCanonicalUrl(`/articles/${article.slug || article.id}`),
        siteName: 'ديار جدة العالمية',
        images: mainImage ? [
          {
            url: getAbsoluteUrl(mainImage.src),
            width: 1200,
            height: 630,
            alt: article.title
          }
        ] : [],
        locale: 'ar_SA',
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
        canonical: generateCanonicalUrl(`/articles/${article.slug || article.id}`)
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
    
    // تطبيق الترجمة الإنجليزية إذا كانت مطلوبة
    if (locale === 'en' && article.aiAnalysis) {
      try {
        const analysisData = JSON.parse(article.aiAnalysis);
        if (analysisData.englishVersion) {
          article.title = analysisData.englishVersion.title || article.title;
          article.excerpt = analysisData.englishVersion.excerpt || article.excerpt;
          article.content = analysisData.englishVersion.content || article.content;
          article.category = analysisData.englishVersion.category || article.category;
        }
      } catch (e) {}
    }

    const allImages = article.mediaItems
      ?.filter((item: any) => item.type === 'IMAGE')
      .map((item: any) => item.src) || [];
    
    const articleUrl = generateCanonicalUrl(`/articles/${article.slug || article.id}`);
    const articleKeywords = [
      article.category,
      'ديار جدة العالمية',
    'جدة',
    'السعودية',
    ...(article.tags || []).map((t: any) => t.name)
  ];

  const plainTextContent = article.content
    ?.replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || '';
  
  const wordCount = plainTextContent.split(/\s+/).length;

  const breadcrumbItems = [
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
        "name": comment.name?.trim() || 'قارئ'
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
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema
        headline={article.title}
        description={article.excerpt || article.content?.substring(0, 160) || ''}
        author={{
          name: article.author || 'ديار جدة العالمية',
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
      />
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}
      <Navbar />
      <ArticleDetailsClient article={article} />
      <Footer />
      <WhatsAppWidget />
      <FloatingCallButton />
      <BottomNavigation />
    </IntlProvider>
  );
}
