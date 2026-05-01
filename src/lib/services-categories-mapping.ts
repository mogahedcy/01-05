/**
 * ربط بين صفحات الخدمات وفئات المشاريع في قاعدة البيانات
 * يسهل عرض المشاريع المناسبة تلقائياً في كل صفحة خدمة
 */

export interface ServiceCategoryMapping {
  serviceSlug: string;
  serviceName: string;
  serviceNameAr: string;
  categories: string[]; // الفئات في قاعدة البيانات
  searchKeywords: string[]; // كلمات إضافية للبحث
  relatedCategories?: string[]; // فئات مرتبطة (اختياري)
}

export const SERVICE_CATEGORY_MAPPINGS: ServiceCategoryMapping[] = [
  {
    serviceSlug: 'mazallat',
    serviceName: 'Car Shades',
    serviceNameAr: 'المظلات',
    categories: ['مظلات سيارات', 'مظلات', 'مظلة سيارات', 'مظلة'],
    searchKeywords: ['مواقف السيارات', 'حماية سيارات', 'مظلة حديد', 'مظلة PVC'],
    relatedCategories: ['سواتر', 'برجولات']
  },
  {
    serviceSlug: 'sawater',
    serviceName: 'Fences',
    serviceNameAr: 'السواتر',
    categories: ['سواتر', 'ساتر', 'سواتر خصوصية', 'سواتر حديد'],
    searchKeywords: ['خصوصية', 'حماية', 'ساتر قماش', 'ساتر خشب'],
    relatedCategories: ['مظلات', 'برجولات']
  },
  {
    serviceSlug: 'pergolas',
    serviceName: 'Pergolas',
    serviceNameAr: 'البرجولات',
    categories: ['برجولات', 'برجولة', 'برجول'],
    searchKeywords: ['برجولة خشبية', 'برجولة حديد', 'برجولة ألومنيوم', 'حدائق'],
    relatedCategories: ['مظلات', 'تنسيق حدائق']
  },
  {
    serviceSlug: 'sandwich-panel',
    serviceName: 'Sandwich Panel',
    serviceNameAr: 'ساندوتش بانل',
    categories: ['ساندوتش بانل', 'ساندويش بانل', 'عزل حراري'],
    searchKeywords: ['عزل', 'غرف', 'ملاحق', 'مستودعات'],
    relatedCategories: ['ترميم']
  },
  {
    serviceSlug: 'landscaping',
    serviceName: 'Landscaping',
    serviceNameAr: 'تنسيق الحدائق',
    categories: ['تنسيق حدائق', 'حدائق', 'تصميم حدائق', 'زراعة'],
    searchKeywords: ['عشب صناعي', 'نوافير', 'ديكور حدائق', 'زراعة نباتات'],
    relatedCategories: ['برجولات', 'بيوت شعر']
  },
  {
    serviceSlug: 'byoot-shaar',
    serviceName: 'Traditional Tents',
    serviceNameAr: 'بيوت الشعر',
    categories: ['بيوت شعر', 'بيت شعر', 'خيام تراثية'],
    searchKeywords: ['مجالس', 'استراحات', 'تراثي', 'شعر تقليدي'],
    relatedCategories: ['خيام ملكية', 'تنسيق حدائق']
  },
  {
    serviceSlug: 'khayyam',
    serviceName: 'Royal Tents',
    serviceNameAr: 'الخيام الملكية',
    categories: ['خيام ملكية', 'خيمة ملكية', 'خيام'],
    searchKeywords: ['خيام فاخرة', 'مناسبات', 'أفراح', 'احتفالات'],
    relatedCategories: ['بيوت شعر']
  },
  {
    serviceSlug: 'renovation',
    serviceName: 'Renovation',
    serviceNameAr: 'الترميم',
    categories: ['ترميم', 'ترميم ملحقات', 'صيانة'],
    searchKeywords: ['تجديد', 'إصلاح', 'صيانة مباني', 'ملاحق'],
    relatedCategories: ['ساندوتش بانل']
  }
];

/**
 * الحصول على mapping خدمة معينة
 */
export function getServiceMapping(serviceSlug: string): ServiceCategoryMapping | undefined {
  return SERVICE_CATEGORY_MAPPINGS.find(m => m.serviceSlug === serviceSlug);
}

/**
 * الحصول على جميع الفئات المرتبطة بخدمة (رئيسية + مرتبطة)
 */
export function getAllRelatedCategories(serviceSlug: string): string[] {
  const mapping = getServiceMapping(serviceSlug);
  if (!mapping) return [];
  
  return [
    ...mapping.categories,
    ...(mapping.relatedCategories || [])
  ];
}

/**
 * بناء شرط WHERE لاستعلام قاعدة البيانات
 * @param serviceSlug - slug الخدمة
 * @param searchInDescription - البحث في حقل description (للمشاريع فقط، المقالات تستخدم excerpt)
 */
export function buildCategoryWhereClause(serviceSlug: string, searchInDescription = true) {
  const mapping = getServiceMapping(serviceSlug);
  if (!mapping) return {};

  // البحث في الفئة والعنوان
  const orConditions = [];

  // البحث في الفئات الرئيسية
  for (const category of mapping.categories) {
    orConditions.push({ category: { contains: category } });
    orConditions.push({ title: { contains: category } });
  }

  // البحث في الكلمات المفتاحية
  for (const keyword of mapping.searchKeywords) {
    orConditions.push({ title: { contains: keyword } });
    // فقط للمشاريع التي تحتوي على حقل description
    if (searchInDescription) {
      orConditions.push({ description: { contains: keyword } });
    }
  }

  return {
    OR: orConditions
  };
}

/**
 * بناء شرط WHERE للمقالات (لا تستخدم description)
 */
export function buildArticleCategoryWhereClause(serviceSlug: string) {
  const mapping = getServiceMapping(serviceSlug);
  if (!mapping) return {};

  const orConditions = [];

  // البحث في الفئات الرئيسية
  for (const category of mapping.categories) {
    orConditions.push({ category: { contains: category } });
    orConditions.push({ title: { contains: category } });
  }

  // البحث في الكلمات المفتاحية (في العنوان والمحتوى فقط)
  for (const keyword of mapping.searchKeywords) {
    orConditions.push({ title: { contains: keyword } });
    orConditions.push({ content: { contains: keyword } });
  }

  return {
    OR: orConditions
  };
}

/**
 * الحصول على اسم الخدمة بالعربية
 */
export function getServiceNameAr(serviceSlug: string): string {
  const mapping = getServiceMapping(serviceSlug);
  return mapping?.serviceNameAr || '';
}

/**
 * التحقق من تطابق مشروع مع خدمة
 */
export function doesProjectMatchService(
  projectCategory: string | null,
  projectTitle: string | null,
  serviceSlug: string
): boolean {
  const mapping = getServiceMapping(serviceSlug);
  if (!mapping) return false;

  const searchText = `${projectCategory || ''} ${projectTitle || ''}`.toLowerCase();

  // التحقق من الفئات الرئيسية
  for (const category of mapping.categories) {
    if (searchText.includes(category.toLowerCase())) {
      return true;
    }
  }

  // التحقق من الكلمات المفتاحية
  for (const keyword of mapping.searchKeywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return false;
}
