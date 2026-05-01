import type { Metadata } from 'next'
import { Shield, Eye, Lock, FileText, Users, Globe, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'
import { generateCanonicalUrl } from '@/lib/seo-utils'
import IntlProvider from '@/components/IntlProvider'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | ديار جدة العالمية',
  description: 'سياسة الخصوصية لديار جدة العالمية في جدة. نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الأمنية والقوانين السعودية.',
  keywords: 'سياسة الخصوصية، حماية البيانات، أمان المعلومات، ديار جدة العالمية',
  authors: [{ name: 'ديار جدة العالمية' }],
  robots: 'index, follow',
  alternates: {
    canonical: generateCanonicalUrl('/privacy'),
    languages: {
      'ar-SA': '/privacy',
      'x-default': '/privacy',
    },
  },
  openGraph: {
    title: 'سياسة الخصوصية | ديار جدة العالمية',
    description: 'سياسة الخصوصية لديار جدة العالمية. نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية.',
    url: generateCanonicalUrl('/privacy'),
    siteName: 'ديار جدة العالمية',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: 'https://www.deyarsu.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'سياسة الخصوصية - ديار جدة العالمية',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'سياسة الخصوصية | ديار جدة العالمية',
    description: 'حماية بياناتك وخصوصيتك أولويتنا',
    images: ['https://www.deyarsu.com/logo.png'],
  }
}

const privacyPrinciples = [
  {
    title: 'الشفافية',
    description: 'نكون واضحين حول البيانات التي نجمعها وكيفية استخدامها',
    icon: Eye
  },
  {
    title: 'الأمان',
    description: 'نستخدم أعلى معايير الأمان لحماية بياناتك من الوصول غير المصرح به',
    icon: Shield
  },
  {
    title: 'التحكم',
    description: 'نمنحك السيطرة الكاملة على بياناتك الشخصية',
    icon: Lock
  },
  {
    title: 'الالتزام',
    description: 'نلتزم بجميع القوانين واللوائح المحلية والدولية لحماية الخصوصية',
    icon: FileText
  }
];

export default function PrivacyPage() {
  return (
    <IntlProvider locale="ar">
      <Navbar />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-8">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <span>/</span>
              <span className="text-primary font-medium">سياسة الخصوصية</span>
            </nav>

            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              نحن في ديار جدة العالمية ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية
            </p>
            <div className="mt-8 text-sm text-gray-500">
              آخر تحديث: ديسمبر 2024
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {privacyPrinciples.map((principle, index) => (
                <div key={`privacy-principle-${principle.title}-${index}`} className="text-center">
                  <principle.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-8">

              {/* مقدمة */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-primary mr-3" />
                  مقدمة
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  تحدد سياسة الخصوصية هذه كيفية قيام ديار جدة العالمية ("نحن"، "لنا"، "الشركة") بجمع واستخدام وحماية
                  المعلومات التي تقدمها عند استخدام موقعنا الإلكتروني أو خدماتنا. نحن ملتزمون بضمان حماية خصوصيتك.
                </p>
              </div>

              {/* المعلومات التي نجمعها */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 text-primary mr-3" />
                  المعلومات التي نجمعها
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">المعلومات الشخصية:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                      <li>الاسم الكامل</li>
                      <li>رقم الهاتف</li>
                      <li>عنوان البريد الإلكتروني</li>
                      <li>العنوان السكني أو التجاري</li>
                      <li>تفاصيل المشروع المطلوب</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">المعلومات التقنية:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mr-4">
                      <li>عنوان IP الخاص بك</li>
                      <li>نوع المتصفح ونظام التشغيل</li>
                      <li>صفحات الموقع التي تزورها</li>
                      <li>وقت ومدة الزيارة</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* كيف نستخدم معلوماتك */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 text-primary mr-3" />
                  كيف نستخدم معلوماتك
                </h2>
                <p className="text-gray-700 mb-4">نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>تقديم خدماتنا وتنفيذ المشاريع المطلوبة</li>
                  <li>التواصل معك بخصوص مشروعك أو استفساراتك</li>
                  <li>تحسين خدماتنا وتطوير عروضنا</li>
                  <li>إرسال عروض وتحديثات (بعد موافقتك)</li>
                  <li>ضمان أمان وحماية موقعنا الإلكتروني</li>
                  <li>الامتثال للمتطلبات القانونية</li>
                </ul>
              </div>

              {/* مشاركة المعلومات */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-primary mr-3" />
                  مشاركة المعلومات
                </h2>
                <p className="text-gray-700 mb-4">نحن لا نبيع أو نؤجر أو نتاجر في معلوماتك الشخصية. قد نشارك معلوماتك في الحالات التالية فقط:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل أعمالنا</li>
                  <li>عندما يكون ذلك مطلوباً قانونياً أو لحماية حقوقنا</li>
                  <li>في حالة بيع أو دمج الشركة (بعد إشعارك)</li>
                  <li>بعد الحصول على موافقتك الصريحة</li>
                </ul>
              </div>

              {/* حماية البيانات */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-primary mr-3" />
                  حماية البيانات
                </h2>
                <p className="text-gray-700 mb-4">نطبق تدابير أمنية قوية لحماية معلوماتك:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>تشفير البيانات أثناء النقل والتخزين</li>
                  <li>التحكم في الوصول والمصادقة الثنائية</li>
                  <li>مراقبة الأنظمة والشبكات بانتظام</li>
                  <li>تحديث البرامج والأنظمة الأمنية</li>
                  <li>تدريب الموظفين على أفضل ممارسات الأمان</li>
                </ul>
              </div>

              {/* حقوقك */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-primary mr-3" />
                  حقوقك
                </h2>
                <p className="text-gray-700 mb-4">لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>الحصول على نسخة من بياناتك الشخصية</li>
                  <li>تصحيح أو تحديث معلوماتك</li>
                  <li>حذف بياناتك الشخصية (في ظروف معينة)</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                  <li>نقل بياناتك إلى خدمة أخرى</li>
                  <li>سحب موافقتك في أي وقت</li>
                </ul>
              </div>

              {/* ملفات الارتباط (Cookies) */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 text-primary mr-3" />
                  ملفات الارتباط (Cookies)
                </h2>
                <p className="text-gray-700 mb-4">
                  نستخدم ملفات الارتباط لتحسين تجربتك على موقعنا. هذه الملفات الصغيرة تساعدنا على:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>تذكر تفضيلاتك وإعداداتك</li>
                  <li>تحليل كيفية استخدام الموقع</li>
                  <li>تحسين أداء الموقع</li>
                  <li>عرض محتوى مخصص</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  يمكنك التحكم في ملفات الارتباط من خلال إعدادات المتصفح الخاص بك.
                </p>
              </div>

              {/* الاحتفاظ بالبيانات */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 text-primary mr-3" />
                  الاحتفاظ بالبيانات
                </h2>
                <p className="text-gray-700">
                  نحتفظ بمعلوماتك الشخصية فقط للمدة اللازمة لتحقيق الأغراض المذكورة في هذه السياسة،
                  أو كما هو مطلوب بموجب القانون. عادة ما نحتفظ ببيانات العملاء لمدة 7 سنوات بعد انتهاء العلاقة التجارية،
                  ما لم تطلب حذفها أو يتطلب القانون فترة احتفاظ مختلفة.
                </p>
              </div>

              {/* التغييرات على السياسة */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-primary mr-3" />
                  التغييرات على هذه السياسة
                </h2>
                <p className="text-gray-700">
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية أخرى.
                  سنقوم بإشعارك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على موقعنا الإلكتروني
                  وسنقوم بتحديث تاريخ "آخر تحديث" في أعلى هذه السياسة.
                </p>
              </div>

              {/* التواصل */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
                <p className="text-gray-700 mb-4">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى التواصل معنا:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>البريد الإلكتروني:</strong> info@deyarsu.com</p>
                  <p><strong>الهاتف:</strong> +966 55 371 9009</p>
                  <p><strong>العنوان:</strong> جدة، المملكة العربية السعودية</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </IntlProvider>
  )
}
