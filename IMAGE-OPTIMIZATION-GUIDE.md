# 🖼️ دليل تحسين الصور والـ Alt Text

## ✅ تم تطبيقه

### 1. Alt Text Utility
تم إنشاء `src/lib/image-alt-text.ts` - مكتبة شاملة لإنشاء alt text محسّن

#### الوظائف المتاحة:

```typescript
// 1. Alt text عام
generateAltText({
  serviceType: 'مظلات سيارات',
  material: 'PVC',
  location: 'حي الروضة جدة',
  projectDetails: 'مشروع فيلا المهندس أحمد'
});
// النتيجة: "مظلات سيارات PVC في حي الروضة جدة - مشروع فيلا المهندس أحمد | ديار جدة"

// 2. Alt text للخدمات
generateServiceAltText('مظلات سيارات', 'جدة');
// النتيجة: "مظلات سيارات في جدة، السعودية - تركيب احترافي بضمان 10 سنوات | ديار جدة"

// 3. Alt text للمشاريع
generateProjectAltText('فيلا العليا', 'مظلات سيارات', 'جدة', 0);
// النتيجة: "مظلات سيارات في جدة، السعودية - فيلا العليا - صورة 1 | ديار جدة"

// 4. Alt text لصور Hero
generateHeroAltText('مظلات وبرجولات حدائق فاخرة');
// النتيجة: "مظلات وبرجولات حدائق فاخرة - ديار جدة | أفضل شركة مظلات وسواتر في جدة"

// 5. Caption مفصل للصور
generateImageCaption('مظلات سيارات', 'فيلا الروضة', 'جدة', 'خامات PVC ألمانية');
```

#### مولدات خاصة بكل خدمة:

```typescript
serviceAltTextGenerators.carShades('جدة');
serviceAltTextGenerators.pergolas('الطائف');
serviceAltTextGenerators.fences('جدة');
serviceAltTextGenerators.landscaping('جدة');
// ... وغيرها
```

#### التحقق من جودة Alt Text:

```typescript
validateAltText('مظلات سيارات في جدة');
// النتيجة: { isValid: true, length: 22 }

validateAltText('نص طويل جداً جداً...'); // أكثر من 125 حرف
// النتيجة: { 
//   isValid: false, 
//   length: 150, 
//   recommendation: 'Alt text is too long...' 
// }
```

---

## 📐 معايير Alt Text المحسّن

### النمط الموحد:
```
{نوع الخدمة} {المادة} في {الموقع} - {تفاصيل المشروع} | {اسم الشركة}
```

### أمثلة صحيحة ✅:

1. **صور المشاريع**:
   ```
   "مظلات سيارات PVC في حي الروضة جدة - مشروع فيلا المهندس أحمد - صورة 1 | ديار جدة"
   ```

2. **صور الخدمات**:
   ```
   "برجولات خشبية للحدائق في جدة، السعودية - تركيب احترافي بضمان 10 سنوات | ديار جدة"
   ```

3. **صور Hero**:
   ```
   "مظلات وبرجولات حدائق فاخرة - تركيب برجولات خشبية ومظلات سيارات جدة | ديار جدة"
   ```

### أمثلة خاطئة ❌:

```
❌ "صورة"
❌ "مشروع 1"
❌ "image.jpg"
❌ "project-photo"
❌ "" (فارغ)
```

---

## 🎯 إرشادات التطبيق

### 1. في المكونات:

```typescript
import { generateServiceAltText, generateProjectAltText } from '@/lib/image-alt-text';

// في مكون الخدمة:
<Image 
  src="/uploads/car-shades.jpg"
  alt={generateServiceAltText('مظلات سيارات PVC', 'جدة')}
  width={800}
  height={600}
/>

// في مكون المشروع:
<Image 
  src={project.image}
  alt={generateProjectAltText(
    project.title,
    project.category,
    project.location,
    index
  )}
  width={600}
  height={400}
/>
```

### 2. في API Routes:

```typescript
import { generateProjectAltText, generateImageCaption } from '@/lib/image-alt-text';

// في sitemap-images.xml:
const optimizedAlt = media.alt || generateProjectAltText(
  project.title,
  project.category,
  project.location,
  index
);

const caption = media.description || generateImageCaption(
  project.category,
  project.title,
  project.location,
  'تركيب احترافي مع ضمان 10 سنوات'
);
```

---

## 📊 حجم الصور المثالي

### الأحجام الموصى بها:

| نوع الصورة | الحجم المثالي | الحجم الأقصى | التنسيق |
|-----------|--------------|--------------|----------|
| Hero Images | < 150 KB | 200 KB | WebP |
| Service Images | < 100 KB | 150 KB | WebP |
| Project Images | < 80 KB | 120 KB | WebP |
| Thumbnails | < 30 KB | 50 KB | WebP |
| Icons | < 10 KB | 20 KB | SVG/WebP |

### أبعاد الصور:

| نوع الصورة | العرض | الارتفاع | Aspect Ratio |
|-----------|-------|----------|--------------|
| Hero | 1920px | 1080px | 16:9 |
| Service Card | 800px | 600px | 4:3 |
| Project Card | 600px | 400px | 3:2 |
| Thumbnail | 300px | 200px | 3:2 |
| OG Image | 1200px | 630px | 1.91:1 |

---

## 🛠️ أدوات الضغط

### 1. Online Tools:
```
✅ Squoosh: https://squoosh.app/
✅ TinyPNG: https://tinypng.com/
✅ Compressor.io: https://compressor.io/
```

### 2. Command Line (Sharp):
```bash
npm install sharp

# سكريبت الضغط:
node scripts/compress-images.js
```

### 3. Cloudinary Transformations:
```typescript
// في الكود:
const imageUrl = cloudinary.url(publicId, {
  fetch_format: 'auto',
  quality: 'auto:eco',
  width: 800,
  crop: 'scale'
});
```

---

## ✅ Checklist تحسين الصور

### قبل رفع الصور:

- [ ] الصورة بتنسيق WebP
- [ ] الحجم أقل من الحد الأقصى
- [ ] الأبعاد مناسبة للاستخدام
- [ ] الصورة محسّنة (compressed)
- [ ] اسم الملف وصفي (car-shades-jeddah.webp)

### بعد رفع الصور:

- [ ] Alt text محسّن ومطابق للنمط
- [ ] Title attribute موجود
- [ ] Loading="lazy" للصور غير الحرجة
- [ ] Priority للصور الحرجة (Hero)
- [ ] Sizes attribute محدد بشكل صحيح

### في Sitemap:

- [ ] image:loc موجود (URL كامل)
- [ ] image:caption وصفي وكامل
- [ ] image:title محدد
- [ ] image:geo_location محدد
- [ ] image:license موجود (إذا لزم)

---

## 🎯 النتائج المتوقعة

### قبل التحسين:
```
❌ Alt text: "صورة"، "مشروع 1"
❌ حجم الصور: 300-500 KB
❌ تنسيق: JPG
❌ Image sitemap: معلومات ناقصة
```

### بعد التحسين:
```
✅ Alt text: محسّن ومتبع للنمط الموحد
✅ حجم الصور: 50-150 KB (تخفيض 60%)
✅ تنسيق: WebP
✅ Image sitemap: معلومات كاملة
```

### التأثير على SEO:
```
📈 تحسين فهرسة الصور: +40%
📈 ظهور في Google Images: +35%
📈 سرعة تحميل الصفحة: +25%
📈 Core Web Vitals: تحسن ملحوظ
```

---

## 📝 مثال تطبيقي كامل

### في المكون:
```typescript
import Image from 'next/image';
import { generateProjectAltText } from '@/lib/image-alt-text';

export function ProjectCard({ project, imageIndex = 0 }) {
  const altText = generateProjectAltText(
    project.title,
    project.category,
    project.location,
    imageIndex
  );

  return (
    <div className="project-card">
      <Image
        src={project.imageUrl}
        alt={altText}
        width={600}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,..."
      />
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
}
```

### في Sitemap:
```typescript
import { generateProjectAltText, generateImageCaption } from '@/lib/image-alt-text';

const projectImages = project.media_items.map((media, index) => ({
  url: `${baseUrl}${media.src}`,
  alt: generateProjectAltText(
    project.title,
    project.category,
    project.location,
    index
  ),
  caption: generateImageCaption(
    project.category,
    project.title,
    project.location,
    'تنفيذ احترافي بضمان 10 سنوات'
  ),
  title: `${project.category} - ${project.title} - صورة ${index + 1}`,
  location: `${project.location}، السعودية`
}));
```

---

## 🚀 الخطوات التالية

1. **تطبيق في المكونات الحالية** (أولوية عالية)
   - [ ] HeroSection.tsx
   - [ ] ServicesSection.tsx
   - [ ] PortfolioSection.tsx

2. **تحديث Sitemap** (أولوية عالية)
   - [x] استخدام المولدات الجديدة
   - [x] التحقق من جميع الحقول

3. **ضغط الصور الموجودة** (أولوية متوسطة)
   - [ ] صور Hero
   - [ ] صور الخدمات
   - [ ] صور المشاريع

4. **اختبار ومراجعة** (أولوية عالية)
   - [ ] Google Rich Results Test
   - [ ] Image Search Test
   - [ ] PageSpeed Insights

---

**تاريخ الإنشاء**: 6 ديسمبر 2025  
**الحالة**: الأداة جاهزة للاستخدام ✅  
**الملف**: `src/lib/image-alt-text.ts`
