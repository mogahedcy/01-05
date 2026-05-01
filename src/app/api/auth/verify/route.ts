
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالدخول' },
        { status: 401 }
      );
    }

    // فك تشفير الـ token
    const decoded = verifyToken(token) as any;

    // البحث عن المدير
    const admin = await prisma.admins.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        status: true
      }
    });

    if (!admin || admin.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'الحساب غير نشط أو غير موجود' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'جلسة غير صالحة' },
      { status: 401 }
    );
  }
}
