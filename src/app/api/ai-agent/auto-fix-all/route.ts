import { type NextRequest, NextResponse } from 'next/server';
import { seoDiagnostics } from '@/lib/seo-diagnostics';
import { requireAdminAuth } from '@/lib/seo-agent-auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    console.log('🔧 بدء الإصلاح التلقائي لجميع المشاكل...');
    
    const result = await seoDiagnostics.autoFixAll();

    return NextResponse.json({
      success: true,
      fixed: result.fixed,
      failed: result.failed,
      results: result.results
    });
  } catch (error: any) {
    console.error('Error in auto-fix-all API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء الإصلاح التلقائي الشامل' },
      { status: 500 }
    );
  }
}
