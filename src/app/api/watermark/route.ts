import { NextResponse } from 'next/server';
import { uploadWatermarkToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

/**
 * API لرفع الشعار إلى Cloudinary
 */
export async function POST() {
  try {
    console.log('🚀 بدء رفع الشعار إلى Cloudinary...');
    
    // التحقق من وجود بيانات Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات Cloudinary غير متوفرة في المتغيرات البيئية' 
        },
        { status: 500 }
      );
    }
    
    await uploadWatermarkToCloudinary();
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم رفع الشعار بنجاح إلى Cloudinary' 
    });
  } catch (error) {
    console.error('❌ خطأ في رفع الشعار:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET للتحقق من حالة الشعار
 */
export async function GET() {
  const isConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
  
  return NextResponse.json({
    configured: isConfigured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'not set',
    message: isConfigured 
      ? 'Cloudinary مُعَدّ بشكل صحيح' 
      : 'Cloudinary غير مُعَدّ'
  });
}
