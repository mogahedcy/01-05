import { type NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ success: false, message: 'رابط Webhook غير مهيأ' }, { status: 400 });
    }

    const testData = {
      title: "اختبار اتصال n8n",
      description: "هذا اختبار للتحقق من صحة الربط بين الموقع و n8n",
      category: "اختبار",
      location: "جدة",
      projectLink: "https://deyarsu.com",
      media: [{ url: "https://www.deyarsu.com/logo.png" }],
      isTest: true,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'تم إرسال بيانات الاختبار بنجاح إلى n8n',
        status: response.status 
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ 
        success: false, 
        message: `فشل الاتصال بـ n8n: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ داخلي في الخادم',
      error: error.message 
    }, { status: 500 });
  }
}
