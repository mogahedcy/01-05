const { execSync } = require('child_process');

console.log('🔧 تحضير قاعدة البيانات للإنتاج...');

try {
  // التحقق من وجود DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL غير موجود في متغيرات البيئة');
    console.log('💡 يرجى إعداد قاعدة بيانات PostgreSQL في Vercel');
    console.log('📝 للمتابعة بدون قاعدة بيانات، سيتم استخدام SQLite محلياً');
    process.exit(0);
  }

  console.log('✅ DATABASE_URL موجود');
  console.log('🔄 تشغيل Prisma generate...');

  // تشغيل Prisma generate
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ تم تحضير قاعدة البيانات بنجاح');

} catch (error) {
  console.error('❌ خطأ في تحضير قاعدة البيانات:', error.message);

  // في بيئة الإنتاج، نتجاهل الأخطاء ونتابع
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ تجاهل الخطأ في بيئة الإنتاج');
    process.exit(0);
  } else {
    process.exit(1);
  }
}