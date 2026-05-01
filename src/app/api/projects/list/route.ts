import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        description: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('خطأ في جلب المشاريع:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في جلب المشاريع'
      },
      { status: 500 }
    );
  }
}
