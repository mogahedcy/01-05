import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await prisma.articles.updateMany({
      where: { status: 'DRAFT' },
      data: { status: 'PUBLISHED', publishedAt: new Date() }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم نشر جميع المقالات بنجاح!',
      updatedCount: result.count
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
