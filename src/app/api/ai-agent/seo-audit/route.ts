import { type NextRequest, NextResponse } from 'next/server';
import { seoDiagnostics } from '@/lib/seo-diagnostics';
import { requireAdminAuth } from '@/lib/seo-agent-auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    console.log('🔍 بدء فحص SEO شامل...');
    
    const audit = await seoDiagnostics.runFullAudit();

    return NextResponse.json({
      success: true,
      audit: {
        score: audit.score,
        totalIssues: audit.totalIssues,
        criticalIssues: audit.criticalIssues,
        issues: audit.issues,
        strengths: audit.strengths,
        recommendations: audit.recommendations,
        lastAudit: audit.lastAudit
      }
    });
  } catch (error: any) {
    console.error('Error in SEO audit API:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء فحص SEO' },
      { status: 500 }
    );
  }
}
