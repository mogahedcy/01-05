/**
 * Middleware للتحقق من صلاحية المستخدم Admin
 */

import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export async function requireAdmin(request: NextRequest): Promise<{ authorized: boolean; admin?: any; response?: NextResponse }> {
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'غير مصرح. يجب تسجيل الدخول كمسؤول' },
        { status: 401 }
      )
    };
  }

  try {
    const decoded = verifyToken(token) as any;
    return {
      authorized: true,
      admin: { id: decoded.adminId, username: decoded.username }
    };
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'جلسة غير صالحة. يرجى تسجيل الدخول مرة أخرى' },
        { status: 401 }
      )
    };
  }
}
