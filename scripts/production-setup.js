const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupProduction() {
  try {
    console.log('🚀 إعداد قاعدة البيانات للإنتاج...');

    // التحقق من DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL غير موجود!');
      process.exit(1);
    }

    console.log('✅ DATABASE_URL موجود');

    // 1. تطبيق مخطط قاعدة البيانات
    console.log('📋 تطبيق مخطط قاعدة البيانات...');
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });

    // 2. توليد Prisma Client
    console.log('⚙️ توليد Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 3. إنشاء حساب المدير
    console.log('👤 إنشاء حساب المدير...');
    
    const adminData = {
      username: 'admin',
      password: 'aldeyar2024',
      email: 'admin@deyarsu.com',
      fullName: 'مدير النظام'
    };

    // التحقق من وجود المدير
    const existingAdmin = await prisma.admins.findUnique({
      where: { username: adminData.username }
    });

    if (existingAdmin) {
      console.log('✅ حساب المدير موجود بالفعل');
    } else {
      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(adminData.password, 12);

      // إنشاء المدير
      await prisma.admins.create({
        data: {
          id: `admin-${Date.now()}`,
          username: adminData.username,
          password: hashedPassword,
          email: adminData.email,
          fullName: adminData.fullName,
          role: 'ADMIN',
          status: 'ACTIVE',
          loginCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ تم إنشاء حساب المدير بنجاح!');
    }

    // 4. إضافة بيانات العينة (اختياري)
    console.log('📊 إضافة بيانات العينة...');
    try {
      execSync('node scripts/add-more-projects.js', { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️ لم يتم العثور على ملف المشاريع التجريبية');
    }

    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
    console.log('');
    console.log('📋 بيانات تسجيل الدخول:');
    console.log(`👤 اسم المستخدم: ${adminData.username}`);
    console.log(`🔑 كلمة المرور: ${adminData.password}`);
    console.log(`📧 البريد الإلكتروني: ${adminData.email}`);
    console.log('🔗 رابط لوحة التحكم: https://deyarsu.com/login');

  } catch (error) {
    console.error('❌ خطأ في الإعداد:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupProduction();