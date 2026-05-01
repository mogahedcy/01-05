'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // فحص إذا كان المستخدم مسجل دخول بالفعل
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.log('غير مسجل دخول');
      }
    };

    checkAuthentication();
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-lg text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" dir="rtl">
      {/* خلفية مشتتة */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="hidden lg:flex items-center justify-center p-10 relative">
          <div className="text-center max-w-lg relative z-10">
            {/* Logo with glow effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl w-24 h-24 mx-auto" />
              <img src="/favicon.svg" alt="الشعار" className="relative mx-auto w-20 h-20 drop-shadow-lg" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                لوحة تحكم محترفة
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              إدارة شاملة ومتطورة للمشاريع والمحتوى مع أدوات تحليل متقدمة
            </p>
            
            {/* Features List */}
            <div className="space-y-4 text-right">
              <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">إدارة متقدمة للمشاريع</span>
              </div>
              
              <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">تقارير وإحصائيات شاملة</span>
              </div>
              
              <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">أمان متقدم وحماية البيانات</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12 relative">
          <div className="w-full max-w-md relative z-10">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl w-16 h-16 mx-auto" />
                <img src="/favicon.svg" alt="الشعار" className="relative mx-auto w-16 h-16 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                مرحباً بعودتك
              </h1>
              <p className="text-lg text-gray-600">ادخل بياناتك للوصول إلى لوحة التحكم المتقدمة</p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
                  تسجيل الدخول الآمن
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  أدخل بيانات الاعتماد الخاصة بك للمتابعة
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <LoginForm />
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-8 bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-100">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">اتصال محمي وآمن</span>
              </div>
              <p className="text-sm text-blue-600">
                جميع البيانات محمية بتشفير متقدم وبروتوكولات أمان عالية
              </p>
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-6">
              بتسجيل الدخول، فإنك توافق على 
              <a href="#" className="text-blue-600 hover:underline mx-1">شروط الاستخدام</a>
              و 
              <a href="#" className="text-blue-600 hover:underline mx-1">سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
