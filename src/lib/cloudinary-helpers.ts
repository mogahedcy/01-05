/**
 * دوال مساعدة لـ Cloudinary تعمل في المتصفح
 * هذا الملف لا يحتوي على أي كود server-side
 */

/**
 * تحقق من صحة رابط Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

/**
 * استخراج معرف العام من رابط Cloudinary
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!isCloudinaryUrl(url)) return null;

  const matches = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.|$)/);
  return matches ? matches[1].split('.')[0] : null;
}
