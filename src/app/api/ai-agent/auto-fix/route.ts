import { type NextRequest, NextResponse } from 'next/server';
import { seoDiagnostics } from '@/lib/seo-diagnostics';
import { requireAdminAuth } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { issueId } = await request.json();

    if (!issueId || typeof issueId !== 'string') {
      return NextResponse.json(
        { error: 'معرف المشكلة مطلوب' },
        { status: 400 }
      );
    }

    const result = await seoDiagnostics.autoFix(issueId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in auto-fix API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء الإصلاح التلقائي' },
      { status: 500 }
    );
  }
}
