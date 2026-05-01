import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

export async function requireAdminAuth(request: NextRequest): Promise<{ adminId: string; username: string } | NextResponse> {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح. يجب تسجيل الدخول كمدير' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;

    if (!decoded || !decoded.adminId) {
      return NextResponse.json(
        { error: 'رمز المصادقة غير صالح' },
        { status: 401 }
      );
    }

    const admin = await prisma.admins.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, username: true }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'المدير غير موجود' },
        { status: 401 }
      );
    }

    return { adminId: admin.id, username: admin.username };
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'خطأ في التحقق من الهوية' },
      { status: 500 }
    );
  }
}

export function validateStringInput(input: any, fieldName: string, minLength = 10, maxLength = 50000): string | null {
  if (!input || typeof input !== 'string') {
    return `${fieldName} يجب أن يكون نصاً`;
  }

  const trimmed = input.trim();
  
  if (trimmed.length < minLength) {
    return `${fieldName} قصير جداً (الحد الأدنى ${minLength} حرف)`;
  }

  if (trimmed.length > maxLength) {
    return `${fieldName} طويل جداً (الحد الأقصى ${maxLength} حرف)`;
  }

  return null;
}

export function validateKeywordsArray(keywords: any, fieldName = 'الكلمات المفتاحية'): string | null {
  if (!Array.isArray(keywords)) {
    return `${fieldName} يجب أن تكون قائمة`;
  }

  if (keywords.length === 0) {
    return `${fieldName} لا يمكن أن تكون فارغة`;
  }

  if (keywords.length > 100) {
    return `عدد ${fieldName} كبير جداً (الحد الأقصى 100)`;
  }

  for (const keyword of keywords) {
    if (typeof keyword !== 'string' || keyword.trim().length === 0) {
      return `جميع ${fieldName} يجب أن تكون نصوصاً غير فارغة`;
    }
    if (keyword.trim().length > 200) {
      return `كلمة مفتاحية طويلة جداً (الحد الأقصى 200 حرف)`;
    }
  }

  return null;
}
