import { sanitizeInput, escapeHtml } from './security';

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized?: any;
}

// Field validation rules
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  sanitize?: boolean;
  escape?: boolean;
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+966|0)?[5-9]\d{8}$/,
  arabicText: /^[\u0600-\u06FF\s\d\.,!?()-]+$/,
  englishText: /^[a-zA-Z\s\d\.,!?()-]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#[0-9A-F]{6}$/i,
  decimal: /^\d+(\.\d{1,2})?$/,
  integer: /^\d+$/
};

// Project validation schema
export const projectValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
    sanitize: true,
    escape: true
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    sanitize: true,
    escape: true
  },
  category: {
    required: true,
    custom: (value: string) => {
      const validCategories = [
        'المظلات', 'البرجولات', 'السواتر', 'تنسيق الحدائق',
        'الترميم', 'الساندوتش بانل', 'بيوت الشعر', 'الخيام'
      ];
      return validCategories.includes(value) || 'فئة غير صالحة';
    }
  },
  location: {
    maxLength: 100,
    sanitize: true,
    escape: true
  },
  budget: {
    custom: (value: any) => {
      const num = Number.parseFloat(value);
      return (!isNaN(num) && num >= 0 && num <= 10000000) || 'الميزانية يجب أن تكون رقم موجب أقل من 10 مليون';
    }
  },
  status: {
    required: true,
    custom: (value: string) => {
      const validStatuses = ['مكتمل', 'قيد التنفيذ', 'متوقف', 'ملغي'];
      return validStatuses.includes(value) || 'حالة غير صالحة';
    }
  },
  clientName: {
    maxLength: 100,
    sanitize: true,
    escape: true
  },
  projectDate: {
    custom: (value: string) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      const now = new Date();
      const minDate = new Date('2000-01-01');
      return (date <= now && date >= minDate) || 'تاريخ غير صالح';
    }
  },
  duration: {
    maxLength: 50,
    sanitize: true,
    escape: true
  },
  area: {
    maxLength: 50,
    sanitize: true,
    escape: true
  },
  materials: {
    maxLength: 1000,
    sanitize: true,
    escape: true
  },
  challenges: {
    maxLength: 1000,
    sanitize: true,
    escape: true
  },
  solutions: {
    maxLength: 1000,
    sanitize: true,
    escape: true
  },
  featured: {
    custom: (value: any) => typeof value === 'boolean' || 'يجب أن تكون القيمة true أو false'
  }
};

// Admin validation schema
export const adminValidationSchema = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    sanitize: true
  },
  email: {
    pattern: patterns.email,
    maxLength: 100,
    sanitize: true
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value: string) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

      if (!hasUpper) return 'كلمة المرور يجب أن تحتوي على حرف كبير';
      if (!hasLower) return 'كلمة المرور يجب أن تحتوي على حرف صغير';
      if (!hasNumber) return 'كلمة المرور يجب أن تحتوي على رقم';
      if (!hasSpecial) return 'كلمة المرور يجب أن تحتوي على رمز خاص';

      return true;
    }
  }
};

// Media validation schema
export const mediaValidationSchema = {
  url: {
    required: true,
    pattern: patterns.url,
    custom: (value: string) => {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.avi'];
      const hasValidExtension = validExtensions.some(ext => value.toLowerCase().includes(ext));
      return hasValidExtension || 'نوع الملف غير مدعوم';
    }
  },
  type: {
    required: true,
    custom: (value: string) => {
      return ['image', 'video'].includes(value) || 'نوع الوسائط غير صالح';
    }
  },
  caption: {
    maxLength: 200,
    sanitize: true,
    escape: true
  }
};

// Comment validation schema
export const commentValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    sanitize: true,
    escape: true
  },
  email: {
    pattern: patterns.email,
    maxLength: 100,
    sanitize: true
  },
  comment: {
    required: true,
    minLength: 5,
    maxLength: 1000,
    sanitize: true,
    escape: true
  },
  rating: {
    custom: (value: any) => {
      const num = Number.parseInt(value);
      return (!isNaN(num) && num >= 1 && num <= 5) || 'التقييم يجب أن يكون بين 1 و 5';
    }
  }
};

// Generic validator function
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitizedValue = value;

  // Check if required
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push('هذا الحقل مطلوب');
    return { valid: false, errors, warnings };
  }

  // Skip validation if value is empty and not required
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return { valid: true, errors, warnings, sanitized: sanitizedValue };
  }

  // Convert to string for validation
  const stringValue = String(value);

  // Sanitize input
  if (rules.sanitize) {
    sanitizedValue = sanitizeInput(stringValue);
  }

  // Escape HTML
  if (rules.escape) {
    sanitizedValue = escapeHtml(sanitizedValue);
  }

  // Check minimum length
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`يجب أن يكون النص ${rules.minLength} أحرف على الأقل`);
  }

  // Check maximum length
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`يجب أن يكون النص ${rules.maxLength} أحرف أو أقل`);
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('تنسيق غير صالح');
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (customResult !== true) {
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else {
        errors.push('قيمة غير صالحة');
      }
    }
  }

  // Add warnings for potential issues
  if (stringValue.length > 0 && stringValue.length < 3) {
    warnings.push('النص قصير جداً');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitized: sanitizedValue
  };
}

// Validate entire object against schema
export function validateObject(data: any, schema: Record<string, ValidationRule>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sanitized: any = {};

  for (const [field, rules] of Object.entries(schema)) {
    const fieldResult = validateField(data[field], rules);

    if (!fieldResult.valid) {
      fieldResult.errors.forEach(error => {
        errors.push(`${field}: ${error}`);
      });
    }

    fieldResult.warnings.forEach(warning => {
      warnings.push(`${field}: ${warning}`);
    });

    // Store sanitized value
    if (fieldResult.sanitized !== undefined) {
      sanitized[field] = fieldResult.sanitized;
    } else {
      sanitized[field] = data[field];
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitized
  };
}

// Specific validation functions
export const validateProject = (data: any): ValidationResult => {
  return validateObject(data, projectValidationSchema);
};

export const validateAdmin = (data: any): ValidationResult => {
  return validateObject(data, adminValidationSchema);
};

export const validateMedia = (data: any): ValidationResult => {
  return validateObject(data, mediaValidationSchema);
};

export const validateComment = (data: any): ValidationResult => {
  return validateObject(data, commentValidationSchema);
};

// File validation
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
  }

  // Check file type
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (!allowedTypes.includes(file.type)) {
    errors.push('نوع الملف غير مدعوم');
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push('اسم الملف طويل جداً');
  }

  // Security check - file extension vs MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const isImage = allowedImageTypes.includes(file.type);
  const isVideo = allowedVideoTypes.includes(file.type);

  if (isImage && !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) {
    errors.push('امتداد الملف لا يطابق نوعه');
  }

  if (isVideo && !['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
    errors.push('امتداد الملف لا يطابق نوعه');
  }

  // Warnings for optimization
  if (file.size > 5 * 1024 * 1024) {
    warnings.push('حجم الملف كبير - قد يؤثر على سرعة التحميل');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Batch file validation
export const validateFiles = (files: FileList | File[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileArray = Array.from(files);

  // Check total number of files
  if (fileArray.length > 20) {
    errors.push('لا يمكن رفع أكثر من 20 ملف في المرة الواحدة');
  }

  // Check total size
  const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSize = 50 * 1024 * 1024; // 50MB total
  if (totalSize > maxTotalSize) {
    errors.push('الحجم الإجمالي للملفات يجب أن يكون أقل من 50 ميجابايت');
  }

  // Validate each file
  fileArray.forEach((file, index) => {
    const fileResult = validateFile(file);
    fileResult.errors.forEach(error => {
      errors.push(`الملف ${index + 1}: ${error}`);
    });
    fileResult.warnings.forEach(warning => {
      warnings.push(`الملف ${index + 1}: ${warning}`);
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default {
  patterns,
  validateField,
  validateObject,
  validateProject,
  validateAdmin,
  validateMedia,
  validateComment,
  validateFile,
  validateFiles
};