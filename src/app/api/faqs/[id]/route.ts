import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { normalizeCategoryName } from '@/lib/categoryNormalizer';

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verifyToken(token) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const faq = await (prisma as any).faqs.findUnique({
      where: { id }
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      faq
    });
  } catch (error: any) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (body.category) {
      const categoryValidation = normalizeCategoryName(body.category);
      if (!categoryValidation.isValid || !categoryValidation.normalizedCategory) {
        return NextResponse.json(
          { 
            success: false, 
            error: `الفئة "${body.category}" غير صالحة. الرجاء اختيار فئة من القائمة المتاحة.` 
          },
          { status: 400 }
        );
      }

      const normalizedCategory = categoryValidation.normalizedCategory;
      
      if (categoryValidation.wasTransformed) {
        console.log(`✅ تم تحويل الفئة: "${body.category}" → "${normalizedCategory}"`);
      }

      body.category = normalizedCategory;
    }

    const faq = await (prisma as any).faqs.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      faq
    });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await (prisma as any).faqs.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
