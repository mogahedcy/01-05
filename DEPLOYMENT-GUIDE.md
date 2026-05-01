# 🚀 دليل نشر الموقع على Vercel

## 📋 المتطلبات
- حساب GitHub
- حساب Vercel (مجاني)
- المتصفح

---

## خطوة 1️⃣: رفع الكود على GitHub

### أ) إنشاء مستودع GitHub:
1. اذهب إلى [github.com/new](https://github.com/new)
2. اسم المستودع: `aldeyar-global-website`
3. اجعله خاص (Private) أو عام حسب رغبتك
4. انقر **Create repository**

### ب) رفع الكود:
```bash
# في Terminal هنا في Replit، قم بتشغيل:
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aldeyar-global-website.git
git push -u origin main
```

**⚠️ هام:** استبدل `YOUR-USERNAME` باسم حسابك في GitHub

---

## خطوة 2️⃣: إنشاء حساب Vercel

1. اذهب إلى [vercel.com/signup](https://vercel.com/signup)
2. انقر **Continue with GitHub**
3. قم بتسجيل الدخول وامنح الصلاحيات

---

## خطوة 3️⃣: نشر الموقع على Vercel

### أ) استيراد المشروع:
1. في لوحة Vercel، انقر **Add New** → **Project**
2. اختر المستودع `aldeyar-global-website`
3. انقر **Import**

### ب) إعدادات المشروع:
- **Framework Preset**: Next.js (يتم اكتشافه تلقائياً)
- **Root Directory**: `./` (الافتراضي)
- **Build Command**: `npm run vercel-build` (موجود بالفعل)
- **Output Directory**: `.next` (موجود بالفعل)

### ج) متغيرات البيئة (سنضيفها لاحقاً):
**لا تضف شيء الآن - فقط انقر Deploy**

انتظر حتى ينتهي النشر (2-3 دقائق)...

---

## خطوة 4️⃣: إنشاء قاعدة بيانات Vercel Postgres

### أ) في لوحة Vercel:
1. اذهب إلى مشروعك
2. انقر تبويب **Storage**
3. انقر **Connect Database**
4. اختر **Postgres** → **Continue**

### ب) إعدادات قاعدة البيانات:
- **Database Name**: `aldeyar_production_db`
- **Region**: اختر **Washington D.C. (iad1)** (الأقرب للسعودية)
- انقر **Create**

### ج) ربط القاعدة بالمشروع:
1. بعد إنشاء القاعدة، انقر **Connect**
2. اختر مشروعك `aldeyar-global-website`
3. انقر **Connect**

**✅ تم!** Vercel سيضيف متغيرات البيئة تلقائياً:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

---

## خطوة 5️⃣: إضافة المتغيرات المتبقية

### في Vercel → Settings → Environment Variables:

أضف هذه المتغيرات:

#### 1. JWT Secret (مطلوب):
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

#### 2. Cloudinary (لرفع الصور):
```
CLOUDINARY_CLOUD_NAME=dj6gk4wmy
CLOUDINARY_API_KEY=716159954779798
CLOUDINARY_API_SECRET=q_Y8NaKz2H5Q6D_9bAZZPklrJk0
```

#### 3. URL الأساسي:
```
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

**⚠️ مهم:** استبدل `your-project-name` باسم مشروعك الفعلي في Vercel

---

## خطوة 6️⃣: إعداد قاعدة البيانات

### أ) تحديث Prisma Schema محلياً:

في ملف `prisma/schema.prisma`، تأكد من أن datasource يستخدم:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

### ب) تطبيق المخطط على قاعدة البيانات:

**في Terminal:**
```bash
# 1. سحب متغيرات البيئة من Vercel
npx vercel env pull .env.local

# 2. تطبيق المخطط
npx prisma db push

# 3. إنشاء حساب المدير
node scripts/production-setup.js
```

---

## خطوة 7️⃣: إعادة النشر

```bash
# في Terminal:
git add .
git commit -m "Configure for Vercel deployment"
git push
```

سيتم النشر تلقائياً في Vercel! 🎉

---

## 🔗 روابط مهمة بعد النشر:

- **الموقع:** `https://your-project-name.vercel.app`
- **لوحة التحكم:** `https://your-project-name.vercel.app/login`
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `aldeyar2024`

---

## 🌐 ربط دومين مخصص (اختياري)

### إذا كان لديك دومين (مثل aldeyarksa.tech):

1. في Vercel → Settings → Domains
2. انقر **Add**
3. أدخل دومينك: `aldeyarksa.tech`
4. اتبع التعليمات لتحديث DNS في مزود الدومين

**سجلات DNS المطلوبة:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## ✅ قائمة التحقق النهائية:

- [ ] الكود على GitHub
- [ ] المشروع منشور على Vercel
- [ ] قاعدة بيانات Postgres منشأة ومتصلة
- [ ] جميع متغيرات البيئة مضافة
- [ ] تم تطبيق مخطط قاعدة البيانات
- [ ] تم إنشاء حساب المدير
- [ ] الموقع يعمل على الرابط
- [ ] تسجيل الدخول يعمل

---

## 🆘 في حالة حدوث مشاكل:

### المشكلة: خطأ في البناء (Build Error)
**الحل:** تحقق من Logs في Vercel → Deployments → اضغط على آخر deployment

### المشكلة: قاعدة البيانات لا تعمل
**الحل:** تأكد من أن `POSTGRES_PRISMA_URL` موجود في Environment Variables

### المشكلة: الصور لا تُرفع
**الحل:** تحقق من أن متغيرات Cloudinary مضافة بشكل صحيح

---

## 📞 الدعم:
- **وثائق Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **وثائق Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **وثائق Prisma:** [prisma.io/docs](https://prisma.io/docs)

---

**🎉 مبروك! موقعك الآن على الإنترنت!**
