import { type NextRequest, NextResponse } from 'next/server';
import { sessionManager, auditLogger, getClientIP } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session-id')?.value;

    if (sessionId) {
      // تدمير الجلسة
      sessionManager.destroySession(sessionId);
    }

    // تسجيل الخروج في السجل
    auditLogger.log({
      adminId: 'unknown',
      action: 'LOGOUT',
      resource: 'auth',
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: true
    });

    // إنشاء الاستجابة وإزالة الكوكيز
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

    // إزالة الكوكيز
    response.cookies.delete('admin-token');
    response.cookies.delete('session-id');

    return response;

  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الخروج' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // حذف الكوكيز
  response.cookies.delete('admin-token');
  response.cookies.delete('session-id');
  
  return response;
}
