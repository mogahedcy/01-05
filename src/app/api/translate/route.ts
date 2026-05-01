import { type NextRequest, NextResponse } from 'next/server';
import { translateProjectToEnglish } from '@/lib/ai-translator';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * API لترجمة محتوى المشروع من العربية إلى الإنجليزية
 * مع تحسين SEO والبيانات الوصفية
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      title,
      description,
      category,
      location,
      metaTitle,
      metaDescription,
      keywords,
      tags,
      materials,
      imageCount = 0,
      videoCount = 0
    } = data;

    // التحقق من البيانات المطلوبة
    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'العنوان والوصف مطلوبان'
        },
        { status: 400 }
      );
    }

    // تنفيذ الترجمة مع تحسين SEO
    const translation = await translateProjectToEnglish(
      {
        title,
        description,
        category,
        location,
        metaTitle,
        metaDescription,
        keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map((k: string) => k.trim())) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : undefined,
        materials: materials ? (Array.isArray(materials) ? materials : materials.split(',').map((m: string) => m.trim())) : undefined
      },
      Number(imageCount),
      Number(videoCount)
    );

    return NextResponse.json({
      success: true,
      translation
    });

  } catch (error) {
    console.error('❌ خطأ في API الترجمة:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في الترجمة',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
