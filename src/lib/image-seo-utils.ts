/**
 * نظام تحسين الصور لمحركات البحث (Image SEO System)
 * يقوم بتوليد alt text تلقائي، structured data، ومعلومات SEO للصور
 */

export interface ImageContext {
  projectTitle?: string;
  projectCategory?: string;
  projectLocation?: string;
  articleTitle?: string;
  serviceType?: string;
  keywords?: string[];
}

export interface ImageMetadata {
  alt: string;
  title: string;
  description: string;
  keywords: string[];
  context: string;
}

/**
 * توليد alt text محسّن تلقائياً بناءً على السياق
 */
export function generateOptimizedAltText(
  imageSrc: string,
  context: ImageContext
): ImageMetadata {
  const { 
    projectTitle, 
    projectCategory, 
    projectLocation,
    articleTitle,
    serviceType,
    keywords = []
  } = context;

  let alt = '';
  let title = '';
  let description = '';
  let contextType = '';

  // تحديد نوع السياق
  if (projectTitle && projectCategory) {
    contextType = 'project';
    
    // alt text للمشاريع
    alt = `${projectTitle} - ${projectCategory}`;
    if (projectLocation) {
      alt += ` في ${projectLocation}`;
    }
    alt += ' | ديار جدة العالمية';

    // العنوان
    title = `صورة ${projectCategory} - ${projectTitle}`;

    // الوصف
    description = `مشروع ${projectCategory} تم تنفيذه بواسطة ديار جدة العالمية`;
    if (projectLocation) {
      description += ` في ${projectLocation}`;
    }
    description += '. صورة توضيحية للجودة والاحترافية في التنفيذ.';

  } else if (articleTitle) {
    contextType = 'article';
    
    // alt text للمقالات
    alt = `صورة توضيحية لمقال: ${articleTitle} | ديار جدة العالمية`;
    title = `${articleTitle} - صورة توضيحية`;
    description = `صورة توضيحية تدعم محتوى مقال ${articleTitle} على موقع ديار جدة العالمية`;

  } else if (serviceType) {
    contextType = 'service';
    
    // alt text للخدمات
    alt = `خدمة ${serviceType} - ديار جدة العالمية في جدة`;
    title = `${serviceType} - ديار جدة العالمية`;
    description = `صورة توضيحية لخدمة ${serviceType} التي نقدمها في ديار جدة العالمية`;
  } else {
    // Fallback: إذا لم يتوفر أي سياق، نستخدم قيم افتراضية
    contextType = 'general';
    const imageName = imageSrc.split('/').pop()?.split('.')[0] || 'صورة';
    
    alt = `${projectTitle || imageName} - ديار جدة العالمية`;
    title = projectTitle || imageName;
    description = `صورة من ديار جدة العالمية - ${projectTitle || 'معرض أعمالنا'}`;
  }

  // إضافة الكلمات المفتاحية
  const allKeywords = [
    ...keywords,
    'ديار جدة العالمية',
    'جدة',
    projectCategory || serviceType || 'خدمات',
    projectLocation || 'السعودية'
  ].filter(Boolean);

  return {
    alt,
    title,
    description,
    keywords: allKeywords,
    context: contextType
  };
}

/**
 * توليد Structured Data للصور (ImageObject Schema)
 */
export function generateImageObjectSchema(
  imageUrl: string,
  metadata: ImageMetadata,
  pageUrl: string,
  uploadDate?: Date
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": imageUrl,
    "url": imageUrl,
    "name": metadata.title,
    "description": metadata.description,
    "caption": metadata.alt,
    "keywords": metadata.keywords.join(', '),
    "uploadDate": uploadDate ? uploadDate.toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "url": "https://www.deyarsu.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ديار جدة العالمية",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.deyarsu.com/favicon.svg"
      }
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "ديار جدة العالمية"
    },
    "license": "https://www.deyarsu.com/terms",
    "acquireLicensePage": "https://www.deyarsu.com/contact",
    "creditText": "ديار جدة العالمية - جدة، السعودية",
    "creator": {
      "@type": "Organization",
      "name": "ديار جدة العالمية"
    },
    "copyrightNotice": "© ديار جدة العالمية - جميع الحقوق محفوظة",
    "isPartOf": {
      "@type": "WebPage",
      "url": pageUrl
    }
  };
}

/**
 * توليد معلومات Image Sitemap للصورة
 */
export function generateImageSitemapEntry(
  imageUrl: string,
  metadata: ImageMetadata,
  pageUrl: string,
  location = 'جدة، السعودية'
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  const fullPageUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;

  return {
    imageUrl: fullImageUrl,
    pageUrl: fullPageUrl,
    caption: metadata.alt,
    title: metadata.title,
    description: metadata.description,
    location,
    license: `${baseUrl}/terms`,
    keywords: metadata.keywords
  };
}

/**
 * معالجة دفعة من الصور وتوليد metadata لها
 */
export function processImagesBatch(
  images: Array<{ src: string; alt?: string | null }>,
  context: ImageContext
): Array<{ src: string; metadata: ImageMetadata }> {
  return images.map((image, index) => {
    // إذا كان alt موجود، نستخدمه، وإلا نولد واحد جديد
    let metadata: ImageMetadata;
    
    if (image.alt && image.alt.trim().length > 10) {
      // استخدام alt الموجود مع تحسينه
      metadata = {
        alt: image.alt,
        title: image.alt,
        description: image.alt,
        keywords: [
          context.projectCategory || context.serviceType || '',
          context.projectLocation || 'جدة',
          'ديار جدة العالمية'
        ].filter(Boolean),
        context: context.projectTitle ? 'project' : 'service'
      };
    } else {
      // توليد metadata جديد
      const enhancedContext = {
        ...context,
        projectTitle: context.projectTitle ? `${context.projectTitle} - صورة ${index + 1}` : undefined
      };
      metadata = generateOptimizedAltText(image.src, enhancedContext);
    }

    return {
      src: image.src,
      metadata
    };
  });
}

/**
 * توليد نص بديل ديناميكي بناءً على الفئة
 */
export function generateCategoryBasedAlt(
  category: string,
  projectTitle: string,
  location = 'جدة',
  imageIndex = 0
): string {
  // التأكد من وجود قيم صالحة
  const safeCategory = category || 'مشروع';
  const safeTitle = projectTitle || 'ديار جدة العالمية';
  const safeLocation = location || 'جدة';
  
  const templates: { [key: string]: string } = {
    'مظلات سيارات': `مظلات سيارات ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'مظلات': `مظلات سيارات ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'سواتر': `سواتر ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'خيم ملكية': `خيم ملكية ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'بيوت شعر ملكي': `بيوت شعر ملكي ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'بيوت شعر': `بيوت شعر ملكي ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'برجولات': `برجولات ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'تنسيق حدائق': `تنسيق حدائق ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'هناجر': `هناجر ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'شبوك': `شبوك ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'قراميد': `قراميد ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'ساندوتش بانل': `ساندوتش بانل ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
    'ترميم': `ساندوتش بانل ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`,
  };

  return templates[safeCategory] || `${safeCategory} - ${safeTitle} في ${safeLocation} - صورة ${imageIndex + 1} | ديار جدة العالمية`;
}

/**
 * استخراج الكلمات المفتاحية من النص
 */
export function extractKeywordsFromText(text: string): string[] {
  const commonKeywords = [
    'مظلات سيارات', 'سواتر', 'خيم ملكية', 'بيوت شعر ملكي', 'برجولات',
    'تنسيق حدائق', 'هناجر', 'شبوك', 'قراميد', 'ساندوتش بانل',
    'جدة', 'السعودية', 'تركيب', 'تصميم', 'تنفيذ', 'PVC', 'حديد', 'خشب', 'قماش'
  ];

  return commonKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}
