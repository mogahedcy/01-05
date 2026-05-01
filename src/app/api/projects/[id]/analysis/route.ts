import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { aiAnalysis, suggestedKeywords } = body;

    if (!aiAnalysis || typeof aiAnalysis !== 'object') {
      return NextResponse.json(
        { success: false, error: 'بيانات التحليل غير صحيحة' },
        { status: 400 }
      );
    }

    const keywordsString = Array.isArray(suggestedKeywords) 
      ? suggestedKeywords.join(', ') 
      : (suggestedKeywords || '');

    const updatedProject = await prisma.projects.update({
      where: { id },
      data: {
        aiAnalysis: JSON.stringify(aiAnalysis),
        suggestedKeywords: keywordsString,
        lastAnalyzedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      project: updatedProject
    });

  } catch (error: any) {
    console.error('خطأ في حفظ التحليل:', error);
    
    let errorMessage = 'حدث خطأ في حفظ التحليل';
    let statusCode = 500;
    
    if (error.code === 'P2025') {
      errorMessage = 'المشروع غير موجود';
      statusCode = 404;
    } else if (error.code === 'P2002') {
      errorMessage = 'بيانات مكررة';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    );
  }
}
