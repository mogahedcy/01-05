# 🛠️ خطة تنفيذ التحسينات - الصفحة الرئيسية

## ✅ تم إنجازه (Commit 5b2888b)

### 1. Schema Markup Improvements
- ✅ إضافة `OrganizationSchema.tsx` - بيانات منظمة كاملة للشركة
- ✅ إضافة `WebSiteSchema.tsx` - بيانات الموقع مع SearchAction
- ✅ تحسين `ProductSchema` - إضافة currency (SAR) وimage URL وbrand
- ✅ إنشاء `HOMEPAGE-AUDIT-REPORT.md` - تقرير تدقيق شامل

### الفوائد:
- 🎯 Google Knowledge Panel أفضل
- 🎯 Rich Snippets محسّنة في نتائج البحث
- 🎯 SearchAction للبحث المباشر من Google
- 🎯 معلومات الشركة الكاملة (عنوان، هاتف، ساعات العمل)

---

## 🔄 قيد التنفيذ

### 2. Mobile Responsiveness Fixes

#### أ) تحسين Touch Targets
```typescript
// src/components/ui/button.tsx
// التغيير المطلوب: زيادة الحد الأدنى للحجم

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      size: {
        default: "h-12 py-3 px-6", // ✅ زيادة من h-10 إلى h-12
        sm: "h-10 px-4", // ✅ زيادة من h-9 إلى h-10
        lg: "h-14 px-8", // ✅ زيادة من h-12 إلى h-14
        icon: "h-12 w-12", // ✅ زيادة من h-10 w-10
      }
    }
  }
)
```

#### ب) تحسين Typography للجوال
```typescript
// src/components/HeroSection.tsx
// التغيير: زيادة أحجام الخطوط الأساسية

// قبل: text-xs sm:text-sm
// بعد: text-sm sm:text-base md:text-lg

// قبل: text-sm sm:text-base md:text-lg
// بعد: text-base sm:text-lg md:text-xl
```

#### ج) تحسين Grid Gaps
```typescript
// src/components/ServicesSection.tsx
// التغيير: زيادة المسافات بين البطاقات

// قبل: gap-4 sm:gap-6 lg:gap-10
// بعد: gap-6 sm:gap-8 lg:gap-12
```

---

### 3. Image Optimization

#### أ) Alt Text Improvements
سنقوم بإنشاء نمط موحد لـ alt text:

```typescript
// Pattern:
`${serviceType} ${material} ${location} - ${projectDetails} | ${companyName}`

// أمثلة:
"مظلات سيارات PVC في حي الروضة جدة - مشروع فيلا المهندس أحمد | ديار جدة"
"برجولات خشبية للحدائق في جدة - فيلا بحي الشاطئ | ديار جدة"
"سواتر حديد للخصوصية في جدة - استراحة حي النعيم | ديار جدة"
```

#### ب) Image Compression
```bash
# أوامر ضغط الصور:

# 1. تثبيت sharp
npm install sharp

# 2. سكريبت الضغط
node scripts/compress-images.js

# الهدف:
# - Hero images: < 150KB
# - Service images: < 100KB
# - Thumbnail images: < 50KB
```

#### ج) تحسين Image Sitemap
```typescript
// src/app/sitemap-images.xml/route.ts
// إضافة معلومات إضافية:

<image:image>
  <image:loc>...</image:loc>
  <image:caption>...</image:caption>
  <image:title>...</image:title>
  <image:geo_location>جدة، السعودية</image:geo_location>
  <image:license>https://www.aldeyarksa.tech/terms</image:license>
</image:image>
```

---

### 4. Performance Optimization

#### أ) Preload Critical Assets
```typescript
// src/app/layout.tsx
// إضافة في <head>:

<link 
  rel="preload" 
  href="/images/hero-bg.webp" 
  as="image" 
  type="image/webp"
/>
<link 
  rel="preconnect" 
  href="https://fonts.googleapis.com"
/>
<link 
  rel="dns-prefetch" 
  href="https://www.google-analytics.com"
/>
```

#### ب) Code Splitting
```typescript
// src/app/[locale]/page.tsx
// تقسيم المكونات الثقيلة:

const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection'),
  {
    loading: () => <Skeleton className="h-[400px]" />,
    ssr: false // تحميل على العميل فقط
  }
);

const FAQSection = dynamic(
  () => import('@/components/FAQSection'),
  {
    loading: () => <Skeleton className="h-[600px]" />,
    ssr: true // مهم لـ SEO
  }
);
```

#### ج) Cache Headers
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

---

### 5. Internal Linking Strategy

#### نمط الروابط الداخلية:
```typescript
// في كل صفحة خدمة، إضافة روابط لـ:
1. خدمات ذات صلة (2-3 روابط)
2. مشاريع ذات صلة (2-3 روابط)
3. مقالات ذات صلة (2-3 روابط)
4. أسئلة شائعة ذات صلة (2-3 روابط)

// مثال في صفحة مظلات السيارات:
<section className="related-services">
  <h3>خدمات ذات صلة</h3>
  <ul>
    <li><Link href="/services/pergolas">برجولات حدائق</Link></li>
    <li><Link href="/services/sawater">سواتر خصوصية</Link></li>
    <li><Link href="/services/landscaping">تنسيق حدائق</Link></li>
  </ul>
</section>
```

---

### 6. Heading Hierarchy Fix

#### المشكلة الحالية:
```html
<!-- ❌ غير منظم -->
<h2>خدماتنا</h2>
<h4>مظلات السيارات</h4>
<h4>البرجولات</h4>
```

#### الحل:
```html
<!-- ✅ منظم -->
<h2>خدماتنا</h2>
<div className="service-category">
  <h3>مظلات السيارات</h3>
  <h4>مظلات PVC</h4>
  <h4>مظلات لكسان</h4>
</div>
<div className="service-category">
  <h3>البرجولات</h3>
  <h4>برجولات خشبية</h4>
  <h4>برجولات حديد</h4>
</div>
```

---

## 📝 ملفات محددة تحتاج تعديل

### أولوية عالية 🔴

1. ✅ `src/components/OrganizationSchema.tsx` - تم إنشاؤه
2. ✅ `src/components/WebSiteSchema.tsx` - تم إنشاؤه
3. ✅ `src/app/[locale]/page.tsx` - تم تحديثه
4. ⏳ `src/components/ui/button.tsx` - يحتاج تحديث
5. ⏳ `src/components/HeroSection.tsx` - يحتاج تحسين
6. ⏳ `src/components/ServicesSection.tsx` - يحتاج تحسين
7. ⏳ `src/app/sitemap-images.xml/route.ts` - يحتاج تحسين

### أولوية متوسطة 🟡

8. ⏳ `next.config.js` - إضافة headers
9. ⏳ `src/app/layout.tsx` - إضافة preload
10. ⏳ `scripts/compress-images.js` - إنشاء سكريبت جديد
11. ⏳ `src/components/Footer.tsx` - تحسين mobile layout
12. ⏳ `src/components/Navbar.tsx` - تحسين mobile menu

### أولوية منخفضة 🟢

13. ⏳ إضافة FAQ Schema للخدمات
14. ⏳ تحسين Internal Linking
15. ⏳ إضافة Image Schema
16. ⏳ تحديث lastmod في sitemap

---

## 📊 النتائج المتوقعة

### بعد تطبيق جميع التحسينات:

| المقياس | قبل | بعد | التحسن |
|---------|-----|-----|---------|
| PageSpeed Mobile | 72 | 85+ | +18% |
| PageSpeed Desktop | 88 | 95+ | +8% |
| SEO Score | 88 | 96+ | +9% |
| Accessibility | 90 | 95+ | +6% |
| Best Practices | 85 | 95+ | +12% |
| **المتوسط** | **84.6** | **93.2** | **+10.2%** |

### Rich Snippets Coverage:
- ✅ Organization: 100%
- ✅ LocalBusiness: 100%
- ✅ WebSite: 100%
- ✅ Product: 100%
- ✅ Review: 100%
- ✅ HowTo: 100%
- ✅ FAQ: 100%
- ✅ Breadcrumb: 100%

**إجمالي التغطية: 100%** 🎉

---

## 🎯 الخطوات التالية

1. ✅ إنهاء Schema Markup (تم)
2. ⏳ تحسين Mobile UI (قيد التنفيذ)
3. ⏳ ضغط وتحسين الصور
4. ⏳ تحسين الأداء (cache, preload)
5. ⏳ إضافة Internal Linking
6. ⏳ اختبار نهائي على أجهزة حقيقية

---

**تاريخ آخر تحديث**: 6 ديسمبر 2025  
**الحالة**: قيد التنفيذ ⏳  
**التقدم**: 30% ✅
