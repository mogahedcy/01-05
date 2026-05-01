import { type NextRequest, NextResponse } from 'next/server';
import { seoDiagnostics } from '@/lib/seo-diagnostics';
import { requireAdmin } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for comprehensive audit

export async function GET(request: NextRequest) {
  // التحقق من صلاحيات Admin
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const auditResult = await seoDiagnostics.runFullAudit();
    
    return NextResponse.json({
      success: true,
      data: auditResult
    });
  } catch (error: any) {
    console.error('خطأ في فحص SEO:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'حدث خطأ أثناء الفحص'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // التحقق من صلاحيات Admin
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { checkType } = await request.json();
    
    let issues = [];
    
    switch (checkType) {
      case 'broken_links':
        issues = await seoDiagnostics.checkBrokenLinks();
        break;
      case 'missing_alt':
        issues = await seoDiagnostics.checkMissingAltText();
        break;
      case 'meta_tags':
        issues = await seoDiagnostics.checkMetaTags();
        break;
      case 'duplicate_content':
        issues = await seoDiagnostics.checkDuplicateContent();
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'نوع فحص غير صالح'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: { issues, count: issues.length }
    });
  } catch (error: any) {
    console.error('خطأ في الفحص المحدد:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'حدث خطأ أثناء الفحص'
    }, { status: 500 });
  }
}
