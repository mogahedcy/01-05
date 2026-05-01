import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IntlProvider from '@/components/IntlProvider';

export default function NotFound() {
  return (
    <IntlProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />

      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* أيقونة البحث */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
          </div>

          {/* العنوان والوصف */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            المشروع غير موجود
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            عذراً، لم نتمكن من العثور على المشروع المطلوب. قد يكون تم حذفه أو أن الرابط غير صحيح.
          </p>

          {/* أزرار الإجراء */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة للمعرض
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                <Home className="h-5 w-5 ml-2" />
                الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          {/* اقتراحات */}
          <div className="mt-12 text-right">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              يمكنك أيضاً:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• تصفح <Link href="/portfolio" className="text-blue-600 hover:underline">جميع المشاريع</Link></li>
              <li>• زيارة <Link href="/services" className="text-blue-600 hover:underline">صفحة الخدمات</Link></li>
              <li>• <Link href="/contact" className="text-blue-600 hover:underline">التواصل معنا</Link> للمساعدة</li>
            </ul>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
