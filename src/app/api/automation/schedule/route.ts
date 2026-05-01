import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/seo-agent-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    let schedule = await prisma.automation_schedules.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!schedule) {
      schedule = await prisma.automation_schedules.create({
        data: {
          generateEnabled: false,
          generateFrequency: 'daily',
          generateCount: 3,
          fixEnabled: false,
          fixFrequency: 'weekly',
          faqEnabled: false,
          faqFrequency: 'weekly',
          faqCount: 5,
        }
      });
    }

    return NextResponse.json({
      success: true,
      schedule: {
        generateEnabled: schedule.generateEnabled,
        generateFrequency: schedule.generateFrequency,
        generateCount: schedule.generateCount,
        generateNiche: schedule.generateNiche,
        generateAutoPublish: schedule.generateAutoPublish,
        fixEnabled: schedule.fixEnabled,
        fixFrequency: schedule.fixFrequency,
        lastGenerateRun: schedule.lastGenerateRun,
        lastFixRun: schedule.lastFixRun,
        nextGenerateRun: schedule.nextGenerateRun,
        nextFixRun: schedule.nextFixRun,
        faqEnabled: schedule.faqEnabled,
        faqFrequency: schedule.faqFrequency,
        faqCount: schedule.faqCount,
        faqNiche: schedule.faqNiche,
        faqAutoPublish: schedule.faqAutoPublish,
        lastFaqRun: schedule.lastFaqRun,
        nextFaqRun: schedule.nextFaqRun,
      }
    });
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'فشل في جلب إعدادات الجدولة' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const {
      generateEnabled,
      generateFrequency,
      generateCount,
      generateNiche,
      generateAutoPublish,
      fixEnabled,
      fixFrequency,
      faqEnabled,
      faqFrequency,
      faqCount,
      faqNiche,
      faqAutoPublish,
    } = body;

    const now = new Date();
    const nextGenerateRun = generateEnabled ? calculateNextRun(now, generateFrequency) : null;
    const nextFixRun = fixEnabled ? calculateNextRun(now, fixFrequency) : null;
    const nextFaqRun = faqEnabled ? calculateNextRun(now, faqFrequency) : null;

    let schedule = await prisma.automation_schedules.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (schedule) {
      schedule = await prisma.automation_schedules.update({
        where: { id: schedule.id },
        data: {
          generateEnabled,
          generateFrequency,
          generateCount,
          generateNiche,
          generateAutoPublish,
          fixEnabled,
          fixFrequency,
          nextGenerateRun,
          nextFixRun,
          faqEnabled,
          faqFrequency,
          faqCount,
          faqNiche,
          faqAutoPublish,
          nextFaqRun,
          updatedAt: now,
        }
      });
    } else {
      schedule = await prisma.automation_schedules.create({
        data: {
          generateEnabled,
          generateFrequency,
          generateCount,
          generateNiche,
          generateAutoPublish,
          fixEnabled,
          fixFrequency,
          nextGenerateRun,
          nextFixRun,
          faqEnabled,
          faqFrequency,
          faqCount,
          faqNiche,
          faqAutoPublish,
          nextFaqRun,
        }
      });
    }

    console.log('✅ تم حفظ إعدادات الجدولة بنجاح');
    
    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
      schedule: {
        generateEnabled: schedule.generateEnabled,
        generateFrequency: schedule.generateFrequency,
        generateCount: schedule.generateCount,
        generateNiche: schedule.generateNiche,
        generateAutoPublish: schedule.generateAutoPublish,
        fixEnabled: schedule.fixEnabled,
        fixFrequency: schedule.fixFrequency,
        nextGenerateRun: schedule.nextGenerateRun,
        nextFixRun: schedule.nextFixRun,
        faqEnabled: schedule.faqEnabled,
        faqFrequency: schedule.faqFrequency,
        faqCount: schedule.faqCount,
        faqNiche: schedule.faqNiche,
        faqAutoPublish: schedule.faqAutoPublish,
        nextFaqRun: schedule.nextFaqRun,
      }
    });
  } catch (error: any) {
    console.error('Error saving schedule:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ إعدادات الجدولة' },
      { status: 500 }
    );
  }
}

function calculateNextRun(from: Date, frequency: string): Date {
  const next = new Date(from);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(2, 0, 0, 0);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      next.setHours(2, 0, 0, 0);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setHours(2, 0, 0, 0);
      break;
  }
  
  return next;
}
