# 🏗️ دليل بنية الموقع الكامل

## 📋 نظرة عامة

**اسم المشروع**: ديار جدة (Aldeyar Global Jeddah)  
**النوع**: موقع شركة لخدمات البناء والتشييد  
**التقنية الأساسية**: Next.js 15 مع TypeScript  
**قاعدة البيانات**: PostgreSQL مع Prisma ORM  
**الاستضافة**: Vercel  
**اللغات المدعومة**: العربية والإنجليزية (باستخدام next-intl)

---

## 🎯 هيكل المشروع الرئيسي

```
update2025-11-22/
├── src/                      # المصدر الرئيسي للكود
│   ├── app/                  # صفحات التطبيق (Next.js App Router)
│   ├── components/           # المكونات القابلة لإعادة الاستخدام
│   ├── lib/                  # وظائف مساعدة وخدمات
│   ├── i18n/                 # إعدادات الترجمة
│   ├── data/                 # بيانات ثابتة
│   └── constants/            # ثوابت التطبيق
├── prisma/                   # مخطط قاعدة البيانات والهجرات
├── public/                   # الملفات الثابتة (صور، أيقونات)
├── messages/                 # ملفات الترجمة (ar.json, en.json)
├── scripts/                  # سكريبتات الإعداد والصيانة
└── docs/                     # التوثيق

```

---

## 🎨 البنية الأمامية (Frontend)

### 1️⃣ صفحات الموقع (`src/app/`)

#### أ) الصفحات العامة

| المسار | الوصف | الملف |
|--------|-------|-------|
| `/` | الصفحة الرئيسية | `app/[locale]/page.tsx` |
| `/about` | من نحن | `app/[locale]/about/page.tsx` |
| `/contact` | اتصل بنا | `app/[locale]/contact/page.tsx` |
| `/services` | صفحة الخدمات | `app/[locale]/services/` |
| `/portfolio` | معرض الأعمال | `app/portfolio/page.tsx` |
| `/articles` | المقالات والمدونة | `app/articles/` |
| `/faq` | الأسئلة الشائعة | `app/faq/page.tsx` |
| `/quote` | طلب عرض سعر | `app/quote/page.tsx` |
| `/search` | البحث | `app/search/page.tsx` |

#### ب) صفحات الخدمات المتخصصة

تحت مسار `/services/`:

1. **مظلات سيارات** - `/services/mazallat`
2. **برجولات** - `/services/pergolas`  
3. **خيام** - `/services/khayyam`
4. **ساتر** - `/services/sawater`
5. **تنسيق حدائق** - `/services/landscaping`
6. **ساندويتش بانل** - `/services/sandwich-panel`
7. **بيوت شعر** - `/services/byoot-shaar`
8. **تجديد وصيانة** - `/services/renovation`

#### ج) لوحة التحكم (Dashboard)

مسار `/dashboard` - محمي بنظام المصادقة:

```
dashboard/
├── page.tsx                  # نظرة عامة
├── projects/                 # إدارة المشاريع
├── articles/                 # إدارة المقالات
├── faqs/                     # إدارة الأسئلة الشائعة
├── comments/                 # إدارة التعليقات
├── automation/               # أدوات الأتمتة
├── ai-agent/                 # وكيل الذكاء الاصطناعي
├── seo-agent/                # وكيل تحسين محركات البحث
├── seo-health/               # صحة SEO
├── indexing-status/          # حالة الفهرسة
└── settings/                 # الإعدادات
```

#### د) صفحات إدارية أخرى

- `/login` - تسجيل الدخول للمدير
- `/audit` - تدقيق SEO
- `/seo-monitor` - مراقبة SEO
- `/manual-indexing` - فهرسة يدوية

---

### 2️⃣ المكونات (`src/components/`)

#### أ) مكونات التخطيط (Layout Components)

| المكون | الوصف |
|--------|-------|
| `Navbar.tsx` | شريط التنقل الرئيسي (546 سطر) |
| `NavbarArabic.tsx` | شريط التنقل العربي |
| `Footer.tsx` | تذييل الموقع (441 سطر) |
| `BottomNavigation.tsx` | شريط التنقل السفلي للجوال |
| `LanguageSwitcher.tsx` | مبدل اللغة |
| `ThemeToggle.tsx` | تبديل الوضع الليلي/النهاري |

#### ب) مكونات الصفحة الرئيسية

| المكون | الوصف |
|--------|-------|
| `HeroSection.tsx` | قسم البطل (Hero) |
| `ServicesSection.tsx` | عرض الخدمات |
| `PortfolioSection.tsx` | معرض الأعمال |
| `TestimonialsSection.tsx` | آراء العملاء |
| `WhyChooseUsSection.tsx` | لماذا نحن |
| `HowItWorksSection.tsx` | كيف نعمل |
| `ServiceAreasSection.tsx` | المناطق المخدومة |
| `BlogSection.tsx` | قسم المدونة |
| `FAQSection.tsx` | الأسئلة الشائعة |
| `QuoteSection.tsx` | طلب عرض سعر |

#### ج) مكونات SEO والبيانات المنظمة

| المكون | الوصف |
|--------|-------|
| `SchemaMarkup.tsx` | البيانات المنظمة الرئيسية |
| `CompanyJsonLd.tsx` | بيانات الشركة |
| `LocalBusinessSchema.tsx` | بيانات الأعمال المحلية |
| `ServiceStructuredData.tsx` | بيانات الخدمات |
| `ProjectStructuredData.tsx` | بيانات المشاريع |
| `ArticleSchema.tsx` | بيانات المقالات |
| `FAQSchema.tsx` | بيانات الأسئلة الشائعة |
| `BreadcrumbSchema.tsx` | بيانات التنقل التفصيلي |
| `ReviewSchema.tsx` | بيانات التقييمات |
| `ProductSchema.tsx` | بيانات المنتجات |
| `VideoObjectSchema.tsx` | بيانات الفيديو |
| `SearchActionSchema.tsx` | بيانات البحث |

#### د) مكونات الوظائف

| المكون | الوصف |
|--------|-------|
| `FloatingCallButton.tsx` | زر الاتصال العائم |
| `WhatsAppWidget.tsx` | أداة واتساب |
| `StickyWhatsApp.tsx` | واتساب ملتصق |
| `ShareButton.tsx` | زر المشاركة |
| `SocialShare.tsx` | المشاركة الاجتماعية |
| `CommentsSystem.tsx` | نظام التعليقات |
| `SearchResults.tsx` | نتائج البحث |
| `AdvancedSearch.tsx` | البحث المتقدم |
| `AdvancedFilters.tsx` | الفلاتر المتقدمة |
| `SavedSearches.tsx` | البحوث المحفوظة |

#### هـ) مكونات الوسائط

| المكون | الوصف |
|--------|-------|
| `OptimizedVideo.tsx` | فيديو محسّن |
| `ProtectedMedia.tsx` | وسائط محمية |
| `WatermarkOverlay.tsx` | علامة مائية |

#### و) مكونات واجهة المستخدم (`components/ui/`)

- `button.tsx` - أزرار
- `card.tsx` - بطاقات
- `dialog.tsx` - نوافذ منبثقة
- `input.tsx` - حقول الإدخال
- `textarea.tsx` - مناطق نصية
- `badge.tsx` - شارات
- `separator.tsx` - فواصل
- `progress.tsx` - أشرطة التقدم
- `tooltip.tsx` - تلميحات
- `dropdown-menu.tsx` - قوائم منسدلة
- `pagination.tsx` - ترقيم الصفحات
- `lazy-image.tsx` - صور كسولة التحميل
- `responsive-image.tsx` - صور متجاوبة

#### ز) مكونات لوحة التحكم (`components/dashboard/`)

- `DatabaseUsage.tsx` - استخدام قاعدة البيانات

#### ح) مكونات صفحات الخدمات (`components/services/`)

- `ArticlesSection.tsx` - قسم المقالات
- `FAQSection.tsx` - قسم الأسئلة الشائعة
- `ProjectsGallery.tsx` - معرض المشاريع
- `SEOImage.tsx` - صور محسنة لـ SEO

---

## ⚙️ البنية الخلفية (Backend)

### 1️⃣ مسارات API (`src/app/api/`)

#### أ) المصادقة والأمان

```
api/auth/
├── login/route.ts           # تسجيل الدخول
├── logout/route.ts          # تسجيل الخروج
├── check/route.ts           # التحقق من الجلسة
└── session/route.ts         # إدارة الجلسة
```

#### ب) المشاريع

```
api/projects/
├── route.ts                 # GET/POST المشاريع
├── [id]/route.ts            # GET/PUT/DELETE مشروع محدد
├── comments/route.ts        # تعليقات المشاريع
└── upload/route.ts          # رفع صور المشاريع
```

#### ج) المقالات

```
api/articles/
├── route.ts                 # GET/POST المقالات
├── [id]/route.ts            # GET/PUT/DELETE مقالة محددة
├── comments/route.ts        # تعليقات المقالات
└── related/route.ts         # مقالات ذات صلة
```

#### د) الأسئلة الشائعة

```
api/faqs/
├── route.ts                 # GET/POST الأسئلة
├── [id]/route.ts            # GET/PUT/DELETE سؤال محدد
└── categories/route.ts      # فئات الأسئلة
```

#### هـ) البحث

```
api/search/
├── route.ts                 # البحث العام
├── projects/route.ts        # البحث في المشاريع
├── articles/route.ts        # البحث في المقالات
└── advanced/route.ts        # البحث المتقدم
```

#### و) التقييمات

```
api/reviews/
├── route.ts                 # GET/POST التقييمات
└── [id]/route.ts            # GET/PUT/DELETE تقييم محدد
```

#### ز) الذكاء الاصطناعي

```
api/ai/
├── route.ts                 # واجهة AI العامة
├── suggestions/route.ts     # اقتراحات ذكية
└── content/route.ts         # إنشاء محتوى
```

```
api/ai-agent/                # وكيل AI للمقالات
api/ai-suggestions/          # اقتراحات المحتوى
api/seo-agent/               # وكيل تحسين SEO
```

#### ح) الفهرسة والأرشفة

```
api/indexing/
├── route.ts                 # الفهرسة العامة
├── google/route.ts          # Google Search Console
├── bing/route.ts            # Bing Webmaster
└── status/route.ts          # حالة الفهرسة
```

```
api/indexnow/                # IndexNow API
api/auto-index/              # الفهرسة التلقائية
api/manual-indexing/         # الفهرسة اليدوية
```

#### ط) SEO والتدقيق

```
api/seo/
├── audit/route.ts           # تدقيق SEO
├── diagnostics/route.ts     # تشخيصات SEO
└── health/route.ts          # صحة SEO
```

```
api/seo-diagnostics/         # تشخيصات مفصلة
api/site-audit/              # تدقيق الموقع
api/sitemap/                 # خرائط الموقع
```

#### ي) الأتمتة

```
api/automation/
├── route.ts                 # واجهة الأتمتة
├── tasks/route.ts           # المهام المجدولة
└── cron/route.ts            # مهام Cron
```

#### ك) الرفع والوسائط

```
api/upload/
├── route.ts                 # رفع ملفات عام
└── image/route.ts           # رفع صور

api/watermark/               # إضافة علامة مائية
```

#### ل) لوحة التحكم

```
api/dashboard/
├── stats/route.ts           # إحصائيات
├── analytics/route.ts       # التحليلات
└── overview/route.ts        # نظرة عامة
```

#### م) قاعدة البيانات والصيانة

```
api/database/
├── backup/route.ts          # النسخ الاحتياطي
├── optimize/route.ts        # التحسين
└── clean/route.ts           # التنظيف

api/healthcheck/route.ts     # فحص صحة النظام
api/webhook/route.ts         # Webhooks
api/cron/route.ts            # مهام مجدولة
```

---

### 2️⃣ قاعدة البيانات (`prisma/schema.prisma`)

#### نماذج قاعدة البيانات الرئيسية:

```prisma
// المشاريع
model projects {
  id               String
  titleAr          String
  titleEn          String
  descriptionAr    String
  descriptionEn    String
  category         String
  imageUrl         String
  images           String[]     // صور متعددة
  location         String?
  city             String?
  completionDate   DateTime?
  featured         Boolean
  views            Int
  likes            Int
  comments         comments[]
  createdAt        DateTime
  updatedAt        DateTime
}

// المقالات
model articles {
  id               String
  titleAr          String
  titleEn          String
  contentAr        String
  contentEn        String
  slug             String        @unique
  category         String
  imageUrl         String
  author           String
  published        Boolean
  views            Int
  readTime         Int
  tags             String[]
  metaDescriptionAr String?
  metaDescriptionEn String?
  createdAt        DateTime
  updatedAt        DateTime
}

// الأسئلة الشائعة
model faqs {
  id               String
  questionAr       String
  questionEn       String
  answerAr         String
  answerEn         String
  category         String
  priority         Int
  service          String?
  views            Int
  helpful          Int
  notHelpful       Int
  createdAt        DateTime
  updatedAt        DateTime
}

// التعليقات
model comments {
  id               String
  projectId        String
  name             String
  email            String
  message          String
  rating           Int?
  status           String        // PENDING/APPROVED/REJECTED
  replies          comment_replies[]
  createdAt        DateTime
  projects         projects
}

// ردود التعليقات
model comment_replies {
  id               String
  commentId        String
  name             String
  message          String
  status           String
  createdAt        DateTime
  comments         comments
}

// المدراء
model admins {
  id               String
  username         String        @unique
  password         String        // مشفر بـ bcrypt
  email            String?       @unique
  fullName         String?
  role             String        // ADMIN/SUPER_ADMIN
  status           String        // ACTIVE/INACTIVE
  lastLogin        DateTime?
  loginCount       Int
  createdAt        DateTime
  updatedAt        DateTime
  admin_sessions   admin_sessions[]
}

// جلسات المدراء
model admin_sessions {
  id               String
  adminId          String
  token            String        @unique
  ip               String?
  userAgent        String?
  expiresAt        DateTime
  createdAt        DateTime
  admins           admins
}
```

---

### 3️⃣ الوظائف المساعدة (`src/lib/`)

#### أ) المصادقة والأمان

| الملف | الوصف |
|-------|-------|
| `auth.ts` | نظام المصادقة الرئيسي |
| `auth-middleware.ts` | Middleware للحماية |
| `jwt.ts` | إدارة JWT tokens |
| `security.ts` | وظائف الأمان |
| `validation.ts` | التحقق من صحة البيانات |

#### ب) قاعدة البيانات

| الملف | الوصف |
|-------|-------|
| `prisma.ts` | اتصال Prisma Client |
| `categoryNormalizer.ts` | توحيد الفئات |

#### ج) الصور والوسائط

| الملف | الوصف |
|-------|-------|
| `cloudinary.ts` | اتصال Cloudinary |
| `cloudinary-helpers.ts` | وظائف مساعدة |
| `cloudinary-transformations.ts` | تحويلات الصور |
| `cloudinary-loader.js` | محمل الصور |
| `image-selector.ts` | اختيار الصور |
| `project-image-selector.ts` | اختيار صور المشاريع |
| `image-seo-utils.ts` | أدوات SEO للصور |
| `google-image-search.ts` | البحث عن الصور |
| `unsplash-search.ts` | البحث في Unsplash |

#### د) الذكاء الاصطناعي

| الملف | الوصف |
|-------|-------|
| `ai-article-agent.ts` | وكيل إنشاء المقالات |
| `ai-faq-agent.ts` | وكيل إنشاء الأسئلة |
| `seo-agent.ts` | وكيل تحسين SEO |
| `seo-agent-auth.ts` | مصادقة وكيل SEO |
| `groq-client.ts` | اتصال Groq AI |

#### هـ) SEO والفهرسة

| الملف | الوصف |
|-------|-------|
| `seo-utils.ts` | أدوات SEO عامة |
| `seo-diagnostics.ts` | تشخيص SEO |
| `sitemap-utils.ts` | أدوات خرائط الموقع |
| `auto-indexing.ts` | الفهرسة التلقائية |

**مجلد الفهرسة** (`lib/indexing/`):
- `index-now-service.ts` - خدمة IndexNow
- `bing-webmaster-service.ts` - خدمة Bing
- `unified-indexing-service.ts` - خدمة موحدة

#### و) التحليلات والأدوات

| الملف | الوصف |
|-------|-------|
| `analytics.ts` | Google Analytics |
| `competitor-analyzer.ts` | تحليل المنافسين |
| `env.ts` | متغيرات البيئة |
| `utils.ts` | وظائف عامة |

#### ز) التصنيفات والخدمات

| الملف | الوصف |
|-------|-------|
| `services-categories-mapping.ts` | ربط الخدمات بالفئات |

---

## 🌍 الترجمة والدولية (`src/i18n/`)

### ملفات الإعداد:

- `request.ts` - طلبات الترجمة
- `routing.ts` - توجيه متعدد اللغات
- `navigation.ts` - التنقل المحلي

### ملفات الترجمة (`messages/`):

- `ar.json` - الترجمة العربية (كاملة)
- `en.json` - الترجمة الإنجليزية (كاملة)

**مثال من البنية**:
```json
{
  "nav": {
    "home": "الرئيسية",
    "about": "من نحن",
    "services": "خدماتنا",
    "portfolio": "أعمالنا",
    "contact": "اتصل بنا"
  },
  "hero": {
    "title": "ديار جدة",
    "subtitle": "خبراء في مظلات السيارات والبرجولات",
    "cta": "احصل على عرض سعر"
  }
  // ... المزيد
}
```

---

## 📦 البيانات الثابتة (`src/data/`)

| الملف | الوصف |
|-------|-------|
| `articles-index.ts` | فهرس المقالات |
| `all-articles.ts` | جميع المقالات |
| `neighborhood-articles.ts` | مقالات الأحياء |
| `technical-articles.ts` | مقالات تقنية |

---

## 🎯 الثوابت (`src/constants/`)

- `projectCategories.ts` - فئات المشاريع

---

## 📁 الملفات العامة (`public/`)

```
public/
├── images/                  # الصور
│   ├── hero/               # صور Hero Section
│   ├── services/           # صور الخدمات
│   ├── projects/           # صور المشاريع
│   └── ...
├── uploads/                 # الملفات المرفوعة
├── favicon.ico              # أيقونة الموقع
├── favicon.svg              # أيقونة SVG
├── logo.png                 # الشعار
├── manifest.json            # PWA Manifest
├── robots.txt               # ملف Robots
├── sitemap.xml              # خريطة الموقع
├── ads.txt                  # Google Ads
└── sw.js                    # Service Worker
```

---

## 🔧 ملفات الإعداد

### 1️⃣ Next.js

**`next.config.js`**:
- إعدادات البناء والتحسين
- إعدادات الصور (Cloudinary, Unsplash)
- إعدادات الأمان (Headers)
- إعدادات Internationalization
- Bundle Analyzer

### 2️⃣ TypeScript

**`tsconfig.json`**:
- إعدادات TypeScript
- مسارات الاختصارات (`@/`)
- خيارات المترجم

### 3️⃣ Tailwind CSS

**`tailwind.config.ts`**:
- الألوان والثيمات
- الخطوط (Noto Sans Arabic)
- الـ Plugins (animate)
- الـ Breakpoints

### 4️⃣ Prisma

**`prisma/schema.prisma`**:
- نماذج قاعدة البيانات
- العلاقات بين الجداول
- الفهارس والقيود

### 5️⃣ Biome (Linting)

**`biome.json`**:
- قواعد الكود
- إعدادات التنسيق

### 6️⃣ ESLint

**`eslint.config.mjs`**:
- قواعد JavaScript/TypeScript
- إعدادات Next.js

### 7️⃣ PostCSS

**`postcss.config.mjs`**:
- Tailwind CSS
- Autoprefixer
- cssnano (تصغير CSS)

### 8️⃣ Vercel

**`vercel.json`**:
- إعدادات النشر
- إعادة التوجيه
- Headers

---

## 🛠️ السكريبتات (`scripts/`)

| السكريبت | الوصف |
|----------|-------|
| `prepare-database.js` | إعداد قاعدة البيانات |
| `production-setup.js` | إعداد الإنتاج |
| `setup-vercel-db.js` | إعداد قاعدة بيانات Vercel |
| `add-more-projects.js` | إضافة مشاريع |
| `migrate-categories.ts` | ترحيل الفئات |

---

## 📝 السكريبتات المتاحة (`package.json`)

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير (منفذ 5000)

# البناء
npm run build            # بناء للإنتاج
npm run vercel-build     # بناء خاص بـ Vercel

# الإنتاج
npm run start            # تشغيل خادم الإنتاج

# الجودة
npm run lint             # فحص الكود + TypeScript
npm run format           # تنسيق الكود

# التحليل
npm run analyze          # تحليل حجم Bundle

# قاعدة البيانات
npm run postinstall      # إنشاء Prisma Client تلقائياً
npm run db:prepare       # إعداد قاعدة البيانات
npm run db:seed          # إضافة بيانات تجريبية

# الإنتاج
npm run production-setup # إعداد بيئة الإنتاج
npm run vercel:setup     # إعداد Vercel DB

# الترحيل
npm run migrate:categories # ترحيل الفئات
```

---

## 🔐 متغيرات البيئة

### متغيرات مطلوبة (`.env` أو `.env.production`):

```bash
# قاعدة البيانات (PostgreSQL)
NEON_DATABASE_URL=          # اتصال Neon
DATABASE_URL_UNPOOLED=      # اتصال مباشر

# المصادقة
JWT_SECRET=                 # سر JWT للمصادقة

# Cloudinary (للصور)
CLOUDINARY_CLOUD_NAME=      # اسم السحابة
CLOUDINARY_API_KEY=         # مفتاح API
CLOUDINARY_API_SECRET=      # سر API

# الموقع
NEXT_PUBLIC_BASE_URL=       # رابط الموقع الأساسي
NEXT_PUBLIC_SITE_NAME=      # اسم الموقع

# الذكاء الاصطناعي (اختياري)
GROQ_API_KEY=               # مفتاح Groq AI
OPENAI_API_KEY=             # مفتاح OpenAI

# الفهرسة (اختياري)
INDEXNOW_API_KEY=           # مفتاح IndexNow
BING_WEBMASTER_KEY=         # مفتاح Bing Webmaster
GOOGLE_SEARCH_CONSOLE_KEY=  # مفتاح Google Search Console
```

---

## 📚 المكتبات والتبعيات الرئيسية

### Frontend:

- **React 18** - مكتبة واجهة المستخدم
- **Next.js 15** - إطار React
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - إطار CSS
- **Framer Motion** - الحركات والانتقالات
- **Lucide React** - الأيقونات
- **Radix UI** - مكونات واجهة المستخدم
- **Swiper** - السلايدر/الكاروسيل
- **next-intl** - الترجمة والدولية

### Backend:

- **Prisma** - ORM لقاعدة البيانات
- **PostgreSQL** - قاعدة البيانات
- **bcryptjs** - تشفير كلمات المرور
- **jsonwebtoken** - JWT للمصادقة
- **zod** - التحقق من صحة البيانات
- **Cloudinary** - إدارة الصور
- **DOMPurify** - تنقية HTML

### الذكاء الاصطناعي:

- **Groq SDK** - Groq AI
- **OpenAI** - OpenAI API

### SEO والتحليلات:

- **Web Vitals** - مقاييس الأداء

### Dev Tools:

- **Biome** - Linter/Formatter
- **ESLint** - JavaScript Linter
- **Bundle Analyzer** - تحليل حجم Bundle

---

## 🎨 النظام التصميمي

### الألوان:

- **Primary**: الأزرق (`#0ea5e9`, `#06b6d4`)
- **Secondary**: الأصفر/الذهبي
- **Accent**: البرتقالي/الأحمر
- **Neutral**: الرمادي (مختلف الدرجات)

### الخطوط:

- **العربية**: Noto Sans Arabic
- **الإنجليزية**: System fonts (Inter, Roboto)

### Breakpoints:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🔒 الأمان

### الإجراءات المطبقة:

1. **المصادقة**:
   - JWT tokens مع انتهاء صلاحية
   - Bcrypt لتشفير كلمات المرور
   - Session management

2. **الحماية**:
   - CSRF protection
   - XSS prevention (DOMPurify)
   - SQL injection prevention (Prisma)
   - Rate limiting على API

3. **Headers الأمان**:
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

4. **التحقق من البيانات**:
   - Zod schemas
   - Input sanitization
   - File upload restrictions

---

## 🚀 SEO والأداء

### التحسينات المطبقة:

1. **SEO الفني**:
   - Meta tags محسّنة
   - Open Graph
   - Twitter Cards
   - Structured Data (Schema.org)
   - Sitemap.xml
   - Robots.txt
   - Canonical URLs
   - Hreflang tags

2. **الأداء**:
   - Next.js Image optimization
   - Dynamic imports
   - Code splitting
   - Static generation
   - Caching strategies
   - Service Worker (PWA)

3. **الصور**:
   - WebP format
   - Lazy loading
   - Responsive images
   - Cloudinary transformations
   - Alt text كامل

4. **الفهرسة**:
   - IndexNow integration
   - Google Search Console
   - Bing Webmaster Tools
   - Automatic indexing
   - Sitemap updates

---

## 📊 الميزات الرئيسية

### 1️⃣ **نظام إدارة المحتوى (CMS)**
- إدارة المشاريع (CRUD)
- إدارة المقالات
- إدارة الأسئلة الشائعة
- إدارة التعليقات
- رفع الصور

### 2️⃣ **متعدد اللغات**
- العربية (افتراضي)
- الإنجليزية
- تبديل سلس بين اللغات
- SEO لكل لغة

### 3️⃣ **البحث المتقدم**
- البحث في المشاريع
- البحث في المقالات
- الفلاتر المتقدمة
- حفظ البحوث

### 4️⃣ **نظام التعليقات**
- تعليقات المشاريع
- الردود على التعليقات
- التقييمات (1-5 نجوم)
- الموافقة على التعليقات

### 5️⃣ **التحليلات والإحصائيات**
- عدد المشاهدات
- عدد الإعجابات
- تحليل الأداء
- صحة SEO

### 6️⃣ **الأتمتة**
- فهرسة تلقائية
- إنشاء محتوى بالذكاء الاصطناعي
- مهام مجدولة
- إشعارات

### 7️⃣ **PWA (Progressive Web App)**
- Service Worker
- Offline support
- App-like experience
- Push notifications (قريباً)

### 8️⃣ **SEO المتقدم**
- Structured Data
- Rich snippets
- Breadcrumbs
- FAQs schema
- Reviews schema

---

## 🗂️ بنية المسارات (Routing)

### النمط:

```
/[locale]/...           # مسارات متعددة اللغات
/api/...                # API routes
/dashboard/...          # لوحة التحكم (محمية)
```

### أمثلة:

```
✅ https://aldeyarksa.tech/ar
✅ https://aldeyarksa.tech/en
✅ https://aldeyarksa.tech/ar/services/mazallat
✅ https://aldeyarksa.tech/en/about
✅ https://aldeyarksa.tech/portfolio/project-123
✅ https://aldeyarksa.tech/api/projects
```

---

## 🔄 دورة حياة الطلب (Request Lifecycle)

### 1. **الطلب الأولي**:
```
المستخدم → Next.js Server → Middleware
```

### 2. **Middleware**:
```
src/middleware.ts:
- التحقق من اللغة
- إعادة التوجيه إذا لزم الأمر
- تحديد locale
```

### 3. **التوجيه (Routing)**:
```
App Router → [locale] → Page Component
```

### 4. **جلب البيانات**:
```
Page → API Route → Prisma → Database → Response
```

### 5. **العرض (Rendering)**:
```
- Server Components (افتراضي)
- Client Components ("use client")
- Static Generation (عند الإمكان)
- Dynamic Rendering (عند الحاجة)
```

---

## 🎯 أفضل الممارسات المطبقة

### 1️⃣ **الكود**:
- ✅ TypeScript في كل مكان
- ✅ مكونات قابلة لإعادة الاستخدام
- ✅ فصل المنطق عن العرض
- ✅ استخدام Hooks بشكل صحيح
- ✅ Error boundaries

### 2️⃣ **الأداء**:
- ✅ Dynamic imports للمكونات الثقيلة
- ✅ Memoization (useMemo, useCallback)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Caching

### 3️⃣ **SEO**:
- ✅ Semantic HTML
- ✅ Structured Data
- ✅ Meta tags كاملة
- ✅ Alt text للصور
- ✅ Sitemaps محدثة

### 4️⃣ **الأمان**:
- ✅ Input validation
- ✅ Output sanitization
- ✅ Authentication/Authorization
- ✅ HTTPS only
- ✅ Secure headers

### 5️⃣ **Accessibility**:
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast
- ✅ Focus indicators

---

## 🎓 مصطلحات مهمة

| المصطلح | الشرح |
|---------|--------|
| **App Router** | نظام التوجيه الجديد في Next.js 13+ |
| **Server Components** | مكونات تعمل على الخادم فقط |
| **Client Components** | مكونات تعمل على المتصفح |
| **Server Actions** | وظائف تعمل على الخادم |
| **Middleware** | طبقة وسيطة لمعالجة الطلبات |
| **Dynamic Route** | مسار ديناميكي (مثل `[id]`) |
| **Locale** | اللغة المحلية (ar أو en) |
| **Schema** | بنية البيانات في Prisma |
| **Migration** | تحديث بنية قاعدة البيانات |
| **Seed** | إضافة بيانات تجريبية |
| **JWT** | JSON Web Token للمصادقة |
| **ORM** | Object-Relational Mapping |

---

## 📖 للمزيد من المعلومات

### الوثائق الموجودة في المشروع:

1. **DEPLOYMENT-GUIDE.md** - دليل النشر على Vercel
2. **READY-TO-PUBLISH.md** - قائمة الفحص النهائية
3. **SEO-HOMEPAGE-AUDIT.md** - تدقيق SEO للصفحة الرئيسية
4. **HOMEPAGE-FINAL-REVIEW.md** - المراجعة النهائية
5. **VERCEL-QUICK-START.md** - بدء سريع مع Vercel
6. **deployment-checklist.md** - قائمة فحص النشر
7. **replit.md** - ملاحظات Replit

### الروابط المفيدة:

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎉 الخلاصة

**موقع ديار جدة** هو تطبيق ويب حديث ومتطور يستخدم:

- ⚛️ **Next.js 15** (App Router) - للأداء العالي
- 🗄️ **PostgreSQL + Prisma** - لإدارة البيانات
- 🎨 **Tailwind CSS** - للتصميم المتجاوب
- 🌍 **next-intl** - لدعم متعدد اللغات
- 🔐 **JWT + bcrypt** - للأمان
- ☁️ **Cloudinary** - لإدارة الصور
- 🤖 **Groq AI** - للذكاء الاصطناعي
- 🚀 **Vercel** - للاستضافة

### الهيكل الإجمالي:

```
موقع احترافي متكامل يتضمن:
├── 📱 واجهة أمامية متجاوبة (8 صفحات خدمات + 10 صفحات عامة)
├── 🎛️ لوحة تحكم إدارية شاملة (10+ أقسام)
├── 🔌 API موحد ومنظم (25+ endpoint)
├── 🗄️ قاعدة بيانات منظمة (10+ جداول)
├── 🌐 دعم كامل للعربية والإنجليزية
├── 🔍 SEO متقدم (98/100)
├── ⚡ أداء عالي (PWA)
└── 🛡️ أمان متطور (JWT + validation)
```

---

**تم إنشاء هذا التوثيق في**: 6 ديسمبر 2025  
**النسخة**: 1.0  
**الحالة**: جاهز للاستخدام ✅
