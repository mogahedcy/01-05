import { 
  PROJECT_CATEGORIES, 
  LEGACY_CATEGORIES_MAP,
  ARTICLE_CATEGORIES,
  LEGACY_ARTICLE_CATEGORIES_MAP
} from '@/constants/projectCategories';

export type NormalizedCategory = typeof PROJECT_CATEGORIES[number];

export interface CategoryValidationResult {
  isValid: boolean;
  normalizedCategory: string | null;
  originalCategory: string;
  wasTransformed: boolean;
}

export function normalizeCategoryName(category: string | null | undefined): CategoryValidationResult {
  if (!category || category.trim() === '') {
    return {
      isValid: false,
      normalizedCategory: null,
      originalCategory: category || '',
      wasTransformed: false
    };
  }

  const trimmedCategory = category.trim();

  if (PROJECT_CATEGORIES.includes(trimmedCategory as any)) {
    return {
      isValid: true,
      normalizedCategory: trimmedCategory,
      originalCategory: trimmedCategory,
      wasTransformed: false
    };
  }

  const mappedCategory = LEGACY_CATEGORIES_MAP[trimmedCategory];
  if (mappedCategory) {
    return {
      isValid: true,
      normalizedCategory: mappedCategory,
      originalCategory: trimmedCategory,
      wasTransformed: true
    };
  }

  for (const validCategory of PROJECT_CATEGORIES) {
    if (trimmedCategory.includes(validCategory) || validCategory.includes(trimmedCategory)) {
      return {
        isValid: true,
        normalizedCategory: validCategory,
        originalCategory: trimmedCategory,
        wasTransformed: true
      };
    }
  }

  return {
    isValid: false,
    normalizedCategory: null,
    originalCategory: trimmedCategory,
    wasTransformed: false
  };
}

export function isValidCategory(category: string | null | undefined): boolean {
  const result = normalizeCategoryName(category);
  return result.isValid;
}

export function getAllValidCategories(): readonly string[] {
  return PROJECT_CATEGORIES;
}

export function getLegacyCategoryMapping(): Record<string, string> {
  return LEGACY_CATEGORIES_MAP;
}

export function normalizeArticleCategoryName(category: string | null | undefined): CategoryValidationResult {
  if (!category || category.trim() === '') {
    return {
      isValid: false,
      normalizedCategory: null,
      originalCategory: category || '',
      wasTransformed: false
    };
  }

  const trimmedCategory = category.trim();

  if (ARTICLE_CATEGORIES.includes(trimmedCategory as any)) {
    return {
      isValid: true,
      normalizedCategory: trimmedCategory,
      originalCategory: trimmedCategory,
      wasTransformed: false
    };
  }

  const mappedCategory = LEGACY_ARTICLE_CATEGORIES_MAP[trimmedCategory];
  if (mappedCategory) {
    return {
      isValid: true,
      normalizedCategory: mappedCategory,
      originalCategory: trimmedCategory,
      wasTransformed: true
    };
  }

  for (const validCategory of ARTICLE_CATEGORIES) {
    if (trimmedCategory.includes(validCategory) || validCategory.includes(trimmedCategory)) {
      return {
        isValid: true,
        normalizedCategory: validCategory,
        originalCategory: trimmedCategory,
        wasTransformed: true
      };
    }
  }

  return {
    isValid: false,
    normalizedCategory: null,
    originalCategory: trimmedCategory,
    wasTransformed: false
  };
}

export function isValidArticleCategory(category: string | null | undefined): boolean {
  const result = normalizeArticleCategoryName(category);
  return result.isValid;
}

export function getAllValidArticleCategories(): readonly string[] {
  return ARTICLE_CATEGORIES;
}

export function getLegacyArticleCategoryMapping(): Record<string, string> {
  return LEGACY_ARTICLE_CATEGORIES_MAP;
}
