/**
 * Utility functions for generating SEO-optimized alt text for images
 */

interface AltTextOptions {
  serviceType?: string;
  material?: string;
  location?: string;
  projectDetails?: string;
  imageIndex?: number;
  companyName?: string;
}

/**
 * Generate SEO-optimized alt text following the pattern:
 * {serviceType} {material} في {location} - {projectDetails} | {companyName}
 * 
 * Example: "مظلات سيارات PVC في حي الروضة جدة - مشروع فيلا المهندس أحمد | ديار جدة العالمية"
 */
export function generateAltText(options: AltTextOptions): string {
  const {
    serviceType = '',
    material = '',
    location = 'جدة',
    projectDetails = '',
    imageIndex,
    companyName = 'ديار جدة العالمية'
  } = options;

  const parts: string[] = [];

  // Main service description
  if (serviceType) {
    parts.push(serviceType);
  }
  
  if (material) {
    parts.push(material);
  }

  // Location
  if (location) {
    parts.push(`في ${location}`);
  }

  // Project details
  if (projectDetails) {
    parts.push(`- ${projectDetails}`);
  } else if (imageIndex !== undefined) {
    parts.push(`- صورة ${imageIndex + 1}`);
  }

  // Company branding
  parts.push(`| ${companyName}`);

  return parts.join(' ').trim();
}

/**
 * Generate alt text for service images
 */
export function generateServiceAltText(serviceName: string, location = 'جدة'): string {
  return generateAltText({
    serviceType: serviceName,
    location: `${location}، السعودية`,
    projectDetails: 'تركيب احترافي بضمان 10 سنوات'
  });
}

/**
 * Generate alt text for project images
 */
export function generateProjectAltText(
  projectTitle: string,
  category: string,
  location: string,
  imageIndex = 0
): string {
  return generateAltText({
    serviceType: category,
    location: `${location}، السعودية`,
    projectDetails: `${projectTitle} - صورة ${imageIndex + 1}`,
  });
}

/**
 * Generate alt text for hero/banner images
 */
export function generateHeroAltText(description: string): string {
  return `${description} - ديار جدة العالمية | أفضل شركة مظلات وسواتر في جدة`;
}

/**
 * Generate caption for images (longer, more descriptive)
 */
export function generateImageCaption(
  serviceType: string,
  projectName: string,
  location: string,
  additionalInfo?: string
): string {
  const caption = `صورة توضيحية لمشروع ${projectName} من نوع ${serviceType} في ${location}. تنفيذ ديار جدة العالمية بجودة عالية وضمان 10 سنوات`;
  
  if (additionalInfo) {
    return `${caption}. ${additionalInfo}`;
  }
  
  return caption;
}

/**
 * Service-specific alt text generators
 */
export const serviceAltTextGenerators = {
  carShades: (location = 'جدة') => 
    generateServiceAltText('مظلات سيارات PVC عالية الجودة', location),
  
  pergolas: (location = 'جدة') =>
    generateServiceAltText('برجولات خشبية وحديدية للحدائق', location),
  
  fences: (location = 'جدة') =>
    generateServiceAltText('سواتر حديد للخصوصية والحماية', location),
  
  landscaping: (location = 'جدة') =>
    generateServiceAltText('تنسيق وتصميم حدائق منزلية', location),
  
  sandwichPanel: (location = 'جدة') =>
    generateServiceAltText('ساندوتش بانل للعزل الحراري', location),
  
  traditionalHouses: (location = 'جدة') =>
    generateServiceAltText('بيوت شعر تراثية أصيلة', location),
  
  royalTents: (location = 'جدة') =>
    generateServiceAltText('خيام ملكية فاخرة', location),
  
  renovation: (location = 'جدة') =>
    generateServiceAltText('ترميم وصيانة الملحقات', location),
};

/**
 * Validate alt text length (should be 125 characters or less for optimal SEO)
 */
export function validateAltText(altText: string): {
  isValid: boolean;
  length: number;
  recommendation?: string;
} {
  const length = altText.length;
  
  if (length === 0) {
    return {
      isValid: false,
      length,
      recommendation: 'Alt text should not be empty'
    };
  }
  
  if (length > 125) {
    return {
      isValid: false,
      length,
      recommendation: `Alt text is too long (${length} chars). Recommended: 125 chars or less`
    };
  }
  
  return {
    isValid: true,
    length
  };
}
