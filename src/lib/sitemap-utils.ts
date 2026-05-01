/**
 * أدوات مساعدة لتوليد خرائط المواقع (Sitemaps)
 */

/**
 * تنظيف URL من المسافات والأحرف الخاصة
 */
export function cleanUrl(url: string): string {
  return url.replace(/\s+/g, '');
}

/**
 * ترميز URL بشكل آمن مع معالجة المسافات
 */
export function safeEncodeUrl(url: string): string {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      const cleanedPath = urlObj.pathname.split('/').map(part => 
        part.includes(' ') ? encodeURIComponent(part.trim()) : part
      ).join('/');
      return `${urlObj.protocol}//${urlObj.host}${cleanedPath}${urlObj.search}${urlObj.hash}`;
    } catch (e) {
      return cleanUrl(url);
    }
  }
  
  return cleanUrl(url);
}

/**
 * إنشاء علامات صورة لـ XML sitemap
 * ملاحظة: لا تستخدم <image:description> لأنها غير مدعومة في Google Image Sitemaps
 */
export function createImageTags(params: {
  imageUrl: string;
  caption: string;
  title: string;
  geoLocation?: string;
  license?: string;
}): string {
  const cleanImageUrl = safeEncodeUrl(params.imageUrl);
  const { caption, title, geoLocation, license } = params;
  
  let tags = `<image:image><image:loc>${cleanImageUrl}</image:loc><image:caption><![CDATA[${caption}]]></image:caption><image:title><![CDATA[${title}]]></image:title>`;
  
  if (geoLocation) {
    tags += `<image:geo_location><![CDATA[${geoLocation}]]></image:geo_location>`;
  }
  
  if (license) {
    tags += `<image:license><![CDATA[${license}]]></image:license>`;
  }
  
  tags += `</image:image>`;
  
  return tags;
}

/**
 * إنشاء علامات فيديو لـ XML sitemap
 */
export function createVideoTags(params: {
  thumbnailUrl: string;
  title: string;
  description: string;
  contentUrl: string;
  playerUrl: string;
  baseUrl: string;
}): string {
  const cleanThumbnailUrl = safeEncodeUrl(params.thumbnailUrl);
  const cleanContentUrl = safeEncodeUrl(params.contentUrl);
  const cleanPlayerUrl = safeEncodeUrl(params.playerUrl);
  
  return `<video:video><video:thumbnail_loc>${cleanThumbnailUrl}</video:thumbnail_loc><video:title><![CDATA[${params.title}]]></video:title><video:description><![CDATA[${params.description}]]></video:description><video:content_loc>${cleanContentUrl}</video:content_loc><video:player_loc allow_embed="yes">${cleanPlayerUrl}</video:player_loc><video:family_friendly>yes</video:family_friendly><video:uploader info="${params.baseUrl}">ديار جدة العالمية</video:uploader></video:video>`;
}

/**
 * escape XML special characters
 */
export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
