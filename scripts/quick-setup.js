
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 بدء الإعداد السريع...');

try {
  // التأكد من وجود مجلد prisma
  if (!fs.existsSync('prisma')) {
    fs.mkdirSync('prisma', { recursive: true });
  }

  // التحقق من وجود DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ يرجى إعداد DATABASE_URL في متغيرات البيئة');
    console.log('💡 افتح تبويب Database في Replit لإنشاء قاعدة بيانات PostgreSQL');
    return;
  }

  // تثبيت التبعيات
  console.log('📦 تثبيت التبعيات...');
  execSync('npm install', { stdio: 'inherit' });

  // توليد Prisma Client
  console.log('⚙️ توليد Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // إنشاء مايجريشن أولي
  console.log('📋 إنشاء مايجريشن قاعدة البيانات...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('✅ تم الإعداد بنجاح!');
  console.log('🎯 يمكنك الآن تشغيل التطبيق باستخدام: npm run dev');
} catch (error) {
  console.error('❌ خطأ في الإعداد:', error.message);
  console.log('💡 تأكد من إعداد قاعدة بيانات PostgreSQL في Replit أولاً');
}
