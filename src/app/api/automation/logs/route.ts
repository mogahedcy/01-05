import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/seo-agent-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const taskType = searchParams.get('taskType');

    const where = taskType ? { taskType } : {};

    const logs = await prisma.automation_logs.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error: any) {
    console.error('Error fetching automation logs:', error);
    return NextResponse.json(
      { error: 'فشل في جلب سجل المهام' },
      { status: 500 }
    );
  }
}
