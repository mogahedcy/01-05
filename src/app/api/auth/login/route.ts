import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         '0.0.0.0';
}

function sanitizeInput(input: string): string {
  // Basic sanitization to prevent common XSS and ensure input is not empty
  if (!input) return '';
  return input.trim().replace(/[<>"']/g, '');
}

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const now = Date.now();
    const rec = attempts.get(ip);
    if (rec && rec.resetAt > now && rec.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'محاولات كثيرة، حاول لاحقاً' }, { status: 429 });
    }

    const { username, password } = await request.json();

    // تنظيف المدخلات
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المدير في قاعدة البيانات
    const admin = await prisma.admins.findUnique({
      where: { username: cleanUsername }
    });

    if (!admin) {
      const recFail = attempts.get(ip);
      if (!recFail || recFail.resetAt <= now) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      } else {
        attempts.set(ip, { count: recFail.count + 1, resetAt: recFail.resetAt });
      }
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(cleanPassword, admin.password);

    if (!isPasswordValid) {
      const recFail = attempts.get(ip);
      if (!recFail || recFail.resetAt <= now) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      } else {
        attempts.set(ip, { count: recFail.count + 1, resetAt: recFail.resetAt });
      }
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء JWT token
    const token = signToken(
      {
        adminId: admin.id,
        username: admin.username
      },
      '24h'
    );

    // تحديث تاريخ آخر تسجيل دخول
    await prisma.admins.update({ // Corrected model name to 'admins'
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        loginCount: (admin.loginCount || 0) + 1, // Ensure loginCount is handled if null
        updatedAt: new Date() // Assuming an updatedAt field exists
      }
    });

    // نجاح: تصفير عداد المحاولات لهذا الـ IP
    attempts.delete(ip);

    // إنشاء الاستجابة مع الكوكيز
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName // Assuming fullName exists in the Admin model
      },
      message: 'تم تسجيل الدخول بنجاح'
    });

    // إعداد الكوكيز الآمنة
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60, // seconds
      path: '/'
    });

    // The original code also set a 'session-id' cookie, which is removed here as per the edited snippet.
    // If session management is still required, it should be handled explicitly.

    return response;

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// The PUT function from the original code is removed as it's not part of the provided edited snippet.
// If the intention was to keep it, it should have been included in the edited snippet.
