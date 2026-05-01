'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface AutoLinkerProps {
  text: string;
  keywords?: string[];
  className?: string;
}

// قائمة افتراضية بأهم الكلمات المفتاحية للمقاولات إذا لم يتم تمرير قائمة
const defaultKeywords = [
  'ساندوتش بانل',
  'مظلات سيارات',
  'مظلات مسابح',
  'سواتر حديد',
  'سواتر قماش',
  'سواتر خشبية',
  'هناجر',
  'مستودعات',
  'برجولات',
  'مظلات شد إنشائي',
  'بيوت شعر',
  'قرميد',
  'مقاولات عامة',
  'تنسيق حدائق',
  'مظلات حدائق',
  'ساندوتش بانل جداري',
  'ساندوتش بانل سقف',
  'غرف ساندوتش بانل',
  'مظلات لكسان',
  'مظلات بي في سي',
  'PVC',
  'مظلات خشبية'
];

export default function AutoLinker({ 
  text, 
  keywords = defaultKeywords,
  className = ""
}: AutoLinkerProps) {
  const locale = useLocale();

  // ترتيب الكلمات من الأطول للأقصر لتجنب تداخل الكلمات (مثل "مظلات سيارات" قبل "مظلات")
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

  // دالة لتحويل النص إلى مصفوفة من النصوص والروابط
  const parseText = (content: string) => {
    if (!content) return null;

    // إنشاء تعبير نمطي (Regex) يبحث عن الكلمات المفتاحية بدقة مع مراعاة حالة الأحرف (للإنجليزي)
    const regexSource = sortedKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexSource})`, 'gi');

    const parts = content.split(regex);

    return parts.map((part, index) => {
      // التحقق مما إذا كان الجزء الحالي هو كلمة مفتاحية
      const isKeyword = sortedKeywords.find(kw => kw.toLowerCase() === part?.toLowerCase());

      if (isKeyword && part) {
        return (
          <Link
            key={index}
            href={`/${locale}/search?q=${encodeURIComponent(isKeyword)}`}
            className="text-blue-600 hover:text-blue-800 font-bold underline decoration-blue-300 hover:decoration-blue-600 transition-all decoration-2 underline-offset-4"
            title={`ابحث عن مشاريع ومقالات حول: ${part}`}
          >
            {part}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`auto-linked-content leading-relaxed ${className}`}>
      {parseText(text)}
    </div>
  );
}

// دالة مساعدة لمعالجة نصوص الـ HTML الخام وإضافة الروابط دون كسر بنية الـ HTML
export const autoLinkHTMLString = (htmlContent: string, locale: string, keywords: string[] = defaultKeywords) => {
  if (!htmlContent) return '';
  
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  const regexSource = sortedKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  
  // Regex يبحث عن الكلمات المفتاحية بشرط ألا تكون داخل وسوم HTML
  // التأكد من أن الكلمة ليست جزءاً من وسم باستخدام (?![^<]*>)
  const safeRegex = new RegExp(`(?![^<]*>)(${regexSource})`, 'gi');
  
  return htmlContent.replace(safeRegex, (match) => {
    return `<a href="/${locale}/search?q=${encodeURIComponent(match)}" class="text-blue-600 hover:text-blue-800 font-bold underline decoration-blue-300 hover:decoration-blue-600 transition-all decoration-2 underline-offset-4" title="${locale === 'en' ? 'Search for' : 'ابحث عن'}: ${match}">${match}</a>`;
  });
};
