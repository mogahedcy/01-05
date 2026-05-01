'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
          <h1 className="text-6xl font-black text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-6">الصفحة غير موجودة</h2>
          <p className="text-slate-500 mb-8 text-center max-w-md">
            عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
          </p>
          <Link 
            href="/ar"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </body>
    </html>
  );
}
