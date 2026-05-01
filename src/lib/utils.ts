import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string, id?: string): string {
  // تحويل النص العربي إلى رابط مناسب
  const arabicToEnglish: { [key: string]: string } = {
    'أ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
    'ة': 'h', 'ى': 'a', 'ء': 'a'
  };

  let slug = text
    .toLowerCase()
    .trim()
    // تحويل الأرقام العربية إلى إنجليزية
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    // تحويل الحروف العربية
    .split('')
    .map(char => arabicToEnglish[char] || char)
    .join('')
    // إزالة الرموز والمسافات
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // إضافة ID إذا كان متوفراً
  if (id) {
    slug = `${slug}-${id.substring(0, 8)}`;
  }

  return slug || 'project';
}