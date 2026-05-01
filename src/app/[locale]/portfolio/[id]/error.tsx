'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import IntlProvider from '@/components/IntlProvider';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale as string || 'ar';

  useEffect(() => {
    console.error('خطأ في تحميل المشروع:', error);
  }, [error]);

  return (
    <IntlProvider locale={locale}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            عذراً، حدث خطأ غير متوقع
          </h1>
          <p className="text-gray-600 mb-8">
            حدث خطأ أثناء محاولة تحميل تفاصيل المشروع. نعتذر عن الإزعاج.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              حاول مرة أخرى
            </Button>
            <Button
              onClick={() => window.location.href = '/portfolio'}
              variant="outline"
            >
              العودة إلى المشاريع
            </Button>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    </IntlProvider>
  );
}
