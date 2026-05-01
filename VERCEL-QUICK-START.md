# 🚀 دليل النشر السريع على Vercel

## الخطوات الأساسية (10 دقائق):

### 1️⃣ رفع الكود على GitHub
```bash
git init
git add .
git commit -m "Ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

### 2️⃣ نشر على Vercel
1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اختر المستودع
3. انقر **Deploy** (لا تضف متغيرات الآن)

### 3️⃣ إنشاء قاعدة البيانات
1. في Vercel → **Storage** → **Create Database**
2. اختر **Postgres** → اسم: `aldeyar_db`
3. المنطقة: **Washington D.C. (iad1)**
4. **Create** → **Connect to Project**

### 4️⃣ إضافة المتغيرات المتبقية
في Vercel → Settings → Environment Variables:

```env
JWT_SECRET=your-secret-key-here-change-in-production
CLOUDINARY_CLOUD_NAME=dj6gk4wmy
CLOUDINARY_API_KEY=716159954779798
CLOUDINARY_API_SECRET=q_Y8NaKz2H5Q6D_9bAZZPklrJk0
```

### 5️⃣ إعداد قاعدة البيانات محلياً
```bash
# سحب متغيرات البيئة
npx vercel env pull .env.local

# تطبيق المخطط
npx prisma db push

# إنشاء حساب المدير
node scripts/setup-vercel-db.js
```

### 6️⃣ إعادة النشر
```bash
git push
```

## ✅ تم! موقعك على الإنترنت

**تسجيل الدخول:**
- الرابط: `https://your-project.vercel.app/login`
- المستخدم: `admin`
- كلمة المرور: `aldeyar2024`

---

## 🌐 ربط دومين مخصص (اختياري)

**في Vercel → Settings → Domains:**
1. أضف: `aldeyarksa.tech`
2. أضف: `www.aldeyarksa.tech`

**في مزود الدومين (GoDaddy/Namecheap):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

للدليل الكامل، راجع: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
