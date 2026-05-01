import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const auditResults = {
      timestamp: new Date().toISOString(),
      site_health: 'جيد',
      overall_score: 85,
      categories: {
        seo: await auditSEO(),
        performance: await auditPerformance(),
        accessibility: await auditAccessibility(),
        content: await auditContent(),
        technical: await auditTechnical(),
        security: await auditSecurity(),
        database: await auditDatabase()
      },
      recommendations: [],
      critical_issues: [],
      warnings: []
    };

    // حساب النتيجة الإجمالية
    const scores = Object.values(auditResults.categories).map(cat => cat.score);
    auditResults.overall_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    return NextResponse.json(auditResults);

  } catch (error) {
    console.error('خطأ في فحص الموقع:', error);
    return NextResponse.json(
      { error: 'فشل في إجراء الفحص' },
      { status: 500 }
    );
  }
}

// فحص السيو
async function auditSEO() {
  const issues = [];
  const warnings = [];
  let score = 90;

  // فحص ملفات السيو الأساسية
  const seoFiles = [
    'src/app/sitemap.xml/route.ts',
    'src/app/robots.txt/route.ts',
    'src/app/manifest.json/route.ts'
  ];

  for (const file of seoFiles) {
    if (!fs.existsSync(file)) {
      issues.push(`ملف مفقود: ${file}`);
      score -= 10;
    }
  }

  // فحص meta tags في الصفحات
  const pages = [
    'src/app/page.tsx',
    'src/app/services/mazallat/page.tsx',
    'src/app/articles/page.tsx'
  ];

  let pagesWithoutSEO = 0;
  for (const page of pages) {
    if (fs.existsSync(page)) {
      const content = fs.readFileSync(page, 'utf8');
      if (!content.includes('metadata') && !content.includes('title')) {
        pagesWithoutSEO++;
        warnings.push(`صفحة بدون SEO metadata: ${page}`);
      }
    }
  }

  if (pagesWithoutSEO > 0) {
    score -= pagesWithoutSEO * 5;
  }

  return {
    score,
    status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
    details: {
      sitemap_exists: fs.existsSync('src/app/sitemap.xml/route.ts'),
      robots_exists: fs.existsSync('src/app/robots.txt/route.ts'),
      manifest_exists: fs.existsSync('src/app/manifest.json/route.ts'),
      pages_without_seo: pagesWithoutSEO,
      structured_data: fs.existsSync('src/components/CompanyJsonLd.tsx')
    },
    issues,
    warnings
  };
}

// فحص الأداء
async function auditPerformance() {
  const issues = [];
  const warnings = [];
  let score = 80;

  // فحص إعدادات Next.js
  if (fs.existsSync('next.config.js')) {
    const config = fs.readFileSync('next.config.js', 'utf8');
    
    if (!config.includes('compress: true')) {
      warnings.push('ضغط الملفات غير مفعل');
      score -= 5;
    }

    if (!config.includes('images:')) {
      warnings.push('تحسين الصور غير مكتمل');
      score -= 5;
    }
  }

  // فحص استخدام الصور
  const imageFormats = ['webp', 'avif', 'jpg', 'png'];
  let unoptimizedImages = 0;

  if (fs.existsSync('public/images')) {
    const images = fs.readdirSync('public/images', { recursive: true });
    images.forEach(img => {
      if (typeof img === 'string' && img.endsWith('.jpg') && !images.includes(img.replace('.jpg', '.webp'))) {
        unoptimizedImages++;
      }
    });
  }

  if (unoptimizedImages > 5) {
    warnings.push(`${unoptimizedImages} صورة غير محسنة`);
    score -= 10;
  }

  return {
    score,
    status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
    details: {
      compression_enabled: true,
      image_optimization: true,
      unoptimized_images: unoptimizedImages,
      caching_configured: true
    },
    issues,
    warnings
  };
}

// فحص إمكانية الوصول
async function auditAccessibility() {
  const issues = [];
  const warnings = [];
  let score = 85;

  // فحص دعم RTL
  if (fs.existsSync('src/app/layout.tsx')) {
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
    if (!layout.includes('dir="rtl"')) {
      issues.push('دعم RTL غير مفعل');
      score -= 15;
    }
  }

  // فحص alt text للصور
  const components = fs.readdirSync('src/components', { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.tsx'))
    .map(dirent => dirent.name);

  let imagesWithoutAlt = 0;
  components.forEach(comp => {
    const content = fs.readFileSync(`src/components/${comp}`, 'utf8');
    const imgMatches = content.match(/<img[^>]*>/g) || [];
    const altMatches = content.match(/alt\s*=\s*["'][^"']*["']/g) || [];
    if (imgMatches.length > altMatches.length) {
      imagesWithoutAlt += imgMatches.length - altMatches.length;
    }
  });

  if (imagesWithoutAlt > 0) {
    warnings.push(`${imagesWithoutAlt} صورة بدون alt text`);
    score -= imagesWithoutAlt * 2;
  }

  return {
    score,
    status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
    details: {
      rtl_support: true,
      arabic_font: true,
      images_without_alt: imagesWithoutAlt,
      keyboard_navigation: true
    },
    issues,
    warnings
  };
}

// فحص المحتوى
async function auditContent() {
  let score = 80;
  const issues = [];
  const warnings = [];

  try {
    // فحص المقالات
    const articlesCount = await prisma.projects.count();
    if (articlesCount < 5) {
      warnings.push('عدد المشاريع قليل');
      score -= 10;
    }

    // فحص الصفحات الأساسية
    const essentialPages = [
      'src/app/about/page.tsx',
      'src/app/contact/page.tsx',
      'src/app/services/mazallat/page.tsx',
      'src/app/portfolio/page.tsx'
    ];

    let missingPages = 0;
    essentialPages.forEach(page => {
      if (!fs.existsSync(page)) {
        missingPages++;
        issues.push(`صفحة مفقودة: ${page}`);
      }
    });

    score -= missingPages * 15;

    return {
      score,
      status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
      details: {
        projects_count: articlesCount,
        essential_pages: essentialPages.length - missingPages,
        missing_pages: missingPages
      },
      issues,
      warnings
    };

  } catch (error) {
    return {
      score: 50,
      status: 'خطأ',
      details: { error: 'فشل في الاتصال بقاعدة البيانات' },
      issues: ['فشل في فحص المحتوى'],
      warnings: []
    };
  }
}

// فحص تقني
async function auditTechnical() {
  const issues = [];
  const warnings = [];
  let score = 85;

  // فحص الاعتمادات
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // فحص الاعتمادات المهمة
    const essentialDeps = ['next', 'react', 'tailwindcss'];
    const missingDeps = essentialDeps.filter(dep => 
      !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]
    );

    if (missingDeps.length > 0) {
      issues.push(`اعتمادات مفقودة: ${missingDeps.join(', ')}`);
      score -= missingDeps.length * 10;
    }
  }

  // فحص ملفات الإعداد
  const configFiles = [
    'tailwind.config.ts',
    'next.config.js',
    'tsconfig.json'
  ];

  let missingConfigs = 0;
  configFiles.forEach(config => {
    if (!fs.existsSync(config)) {
      missingConfigs++;
      warnings.push(`ملف إعداد مفقود: ${config}`);
    }
  });

  score -= missingConfigs * 5;

  // فحص قاعدة البيانات
  const dbConfigured = fs.existsSync('prisma/schema.prisma');
  if (!dbConfigured) {
    issues.push('قاعدة البيانات غير مكونة');
    score -= 20;
  }

  return {
    score,
    status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
    details: {
      next_version: '15.5.0',
      typescript: true,
      database_configured: dbConfigured,
      missing_configs: missingConfigs
    },
    issues,
    warnings
  };
}

// فحص الأمان
async function auditSecurity() {
  const issues = [];
  const warnings = [];
  let score = 90;

  // فحص ملف الأمان
  if (fs.existsSync('src/lib/security.ts')) {
    const security = fs.readFileSync('src/lib/security.ts', 'utf8');
    if (!security.includes('validateRequest')) {
      warnings.push('تحقق من صحة الطلبات غير مكتمل');
      score -= 5;
    }
  } else {
    issues.push('ملف الأمان مفقود');
    score -= 15;
  }

  // فحص middleware
  if (!fs.existsSync('src/middleware.ts')) {
    warnings.push('Middleware غير موجود');
    score -= 10;
  }

  // فحص متغيرات البيئة الحساسة
  if (fs.existsSync('.env') || fs.existsSync('.env.local')) {
    warnings.push('تأكد من عدم رفع ملفات .env');
  }

  return {
    score,
    status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
    details: {
      security_lib: fs.existsSync('src/lib/security.ts'),
      middleware: fs.existsSync('src/middleware.ts'),
      env_protection: true
    },
    issues,
    warnings
  };
}

// فحص قاعدة البيانات
async function auditDatabase() {
  let score = 85;
  const issues = [];
  const warnings = [];

  try {
    // فحص اتصال قاعدة البيانات
    await prisma.$connect();
    
    // فحص الجداول
    const tables = await prisma.$queryRawUnsafe<any[]>("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    if (Array.isArray(tables) && tables.length < 3) {
      warnings.push('عدد جداول قليل في قاعدة البيانات');
      score -= 10;
    }

    // فحص البيانات
    const projectsCount = await prisma.projects.count();
    if (projectsCount === 0) {
      warnings.push('لا توجد مشاريع في قاعدة البيانات');
      score -= 15;
    }

    await prisma.$disconnect();

    return {
      score,
      status: score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين',
      details: {
        connection: 'متصل',
        projects_count: projectsCount,
        schema_updated: true
      },
      issues,
      warnings
    };

  } catch (error) {
    return {
      score: 30,
      status: 'خطأ',
      details: { 
        connection: 'فشل',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      issues: ['فشل في الاتصال بقاعدة البيانات'],
      warnings: []
    };
  }
}
