/**
 * مكتبة توليد Slug العربي لمعرض الأعمال
 * تحويل العنوان العربي إلى رابط URL محسّن لمحركات البحث
 */

/**
 * تنظيف وتوليد slug من نص عربي
 * @param text النص المراد تحويله
 * @param category التصنيف (اختياري)
 * @returns slug محسّن
 */
export function generateArabicSlug(text: string, category?: string): string {
  if (!text) return '';

  // 1. تنظيف النص وإزالة الرموز الخاصة
  let slug = text
    .trim()
    // إبقاء الأحرف العربية، الإنجليزية، الأرقام، المسافات، والشرطات
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
    // استبدال المسافات بشرطات
    .replace(/\s+/g, '-')
    // استبدال الشرطات المتعددة بشرطة واحدة
    .replace(/-+/g, '-')
    // إزالة الشرطات من البداية والنهاية
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  // 2. إضافة التصنيف إذا كان موجوداً ولم يكن في الـ slug
  if (category) {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    if (!slug.includes(categorySlug)) {
      slug = `${categorySlug}-${slug}`;
    }
  }

  return slug;
}

/**
 * تحويل slug العربي إلى إنجليزي (Transliteration)
 * @param arabicSlug الـ slug العربي
 * @returns slug إنجليزي
 */
export function transliterateToEnglish(arabicSlug: string): string {
  const transliterations: Record<string, string> = {
    // الخدمات
    'مظلات': 'car-shades',
    'مظله': 'shade',
    'برجولات': 'pergolas',
    'برجوله': 'pergola',
    'سواتر': 'fences',
    'ساتر': 'fence',
    'ساندوتش-بانل': 'sandwich-panels',
    'تنسيق-حدائق': 'landscaping',
    'حدائق': 'gardens',
    'ترميم': 'renovation',
    'هناجر': 'hangars',
    'قرميد': 'tiles',
    
    // المواد
    'خشبية': 'wooden',
    'خشب': 'wood',
    'حديد': 'iron',
    'معدنية': 'metal',
    'معدن': 'metal',
    'بلاستيك': 'plastic',
    'قماش': 'fabric',
    'pvc': 'pvc',
    'مجلفن': 'galvanized',
    
    // المواقع
    'جدة': 'jeddah',
    'الرياض': 'riyadh',
    'مكة': 'makkah',
    'المدينة': 'madinah',
    'الدمام': 'dammam',
    'الخبر': 'khobar',
    'الطائف': 'taif',
    
    // الأحياء والمناطق
    'حي': 'district',
    'النعيم': 'al-naeem',
    'الروضة': 'ar-rawdah',
    'الحمراء': 'al-hamra',
    'السلامة': 'as-salamah',
    'البساتين': 'al-basatin',
    
    // أنواع المباني
    'فيلا': 'villa',
    'استراحة': 'rest-house',
    'مدرسة': 'school',
    'مستشفى': 'hospital',
    'مسجد': 'mosque',
    'شركة': 'company',
    'محل': 'shop',
    
    // الأنواع
    'سيارات': 'cars',
    'سيارة': 'car',
    'مسابح': 'pools',
    'مسبح': 'pool',
    'مداخل': 'entrances',
    'مدخل': 'entrance',
    
    // صفات
    'فاخرة': 'luxury',
    'فاخر': 'luxurious',
    'عصرية': 'modern',
    'عصري': 'modern',
    'كلاسيكية': 'classic',
    'كبيرة': 'large',
    'صغيرة': 'small',
    'جديدة': 'new',
    'متطورة': 'advanced',
    
    // أرقام
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };

  let englishSlug = arabicSlug;
  
  // استبدال الكلمات العربية بنظيراتها الإنجليزية
  Object.entries(transliterations).forEach(([arabic, english]) => {
    const regex = new RegExp(arabic, 'g');
    englishSlug = englishSlug.replace(regex, english);
  });

  // إزالة أي أحرف عربية متبقية
  englishSlug = englishSlug.replace(/[\u0600-\u06FF]/g, '');
  
  // تنظيف نهائي
  englishSlug = englishSlug
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return englishSlug;
}

/**
 * توليد slug مع التحقق من التفرد في قاعدة البيانات
 * @param title العنوان
 * @param category التصنيف
 * @param checkUnique دالة للتحقق من التفرد
 * @returns slug فريد
 */
export async function generateUniqueSlug(
  title: string,
  category?: string,
  checkUnique?: (slug: string) => Promise<boolean>
): Promise<string> {
  const slug = generateArabicSlug(title, category);
  
  if (!checkUnique) {
    return slug;
  }

  // التحقق من التفرد وإضافة رقم تسلسلي إذا لزم الأمر
  let counter = 1;
  let uniqueSlug = slug;
  
  while (await checkUnique(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * استخراج معلومات من الـ slug
 * @param slug الـ slug المراد تحليله
 * @returns كائن يحتوي على المعلومات المستخرجة
 */
export function parseSlugInfo(slug: string): {
  category?: string;
  location?: string;
  year?: string;
  service?: string;
} {
  const parts = slug.split('-');
  const info: any = {};

  // استخراج التصنيف
  const categories = ['مظلات', 'برجولات', 'سواتر', 'ساندوتش-بانل', 'تنسيق-حدائق', 'ترميم'];
  for (const cat of categories) {
    if (slug.includes(cat)) {
      info.category = cat;
      break;
    }
  }

  // استخراج الموقع
  const locations = ['جدة', 'الرياض', 'مكة', 'المدينة', 'الدمام', 'الخبر'];
  for (const loc of locations) {
    if (slug.includes(loc)) {
      info.location = loc;
      break;
    }
  }

  // استخراج السنة
  const yearMatch = slug.match(/20\d{2}/);
  if (yearMatch) {
    info.year = yearMatch[0];
  }

  return info;
}

/**
 * توليد alt text محسّن للصور من الـ slug
 * @param slug الـ slug
 * @param imageIndex رقم الصورة
 * @returns نص بديل محسّن
 */
export function generateImageAltFromSlug(slug: string, imageIndex = 1): string {
  const info = parseSlugInfo(slug);
  const title = slug.replace(/-/g, ' ');
  
  const templates = [
    `${title} - صورة رئيسية | ديار جدة العالمية`,
    `تفاصيل ${title} - منظر قريب`,
    `${title} جودة عالية - صورة جانبية`,
    `تركيب ${title} احترافي - الخامات`,
    `${title} - منظر شامل`
  ];

  return templates[(imageIndex - 1) % templates.length] || `${title} - صورة ${imageIndex}`;
}
