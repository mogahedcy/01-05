import { neighborhoodArticles } from './neighborhood-articles';
import { technicalArticles } from './technical-articles';

// تصدير جميع المقالات مدمجة
export const allArticles = [
  ...neighborhoodArticles,
  ...technicalArticles
];

// دالة للحصول على مقال بناءً على slug
export function getArticleBySlug(slug: string) {
  return allArticles.find(article => article.slug === slug);
}

// دالة للحصول على المقالات المميزة
export function getFeaturedArticles() {
  return allArticles.filter(article => article.featured);
}

// دالة للحصول على المقالات حسب الفئة
export function getArticlesByCategory(category: string) {
  return allArticles.filter(article => article.category === category);
}
