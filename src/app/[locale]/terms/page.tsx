import type { Metadata } from 'next';
import { FileText, Scale, Handshake, AlertTriangle, CheckCircle, Shield, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IntlProvider from '@/components/IntlProvider';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'شروط الخدمة | ديار جدة العالمية - الشروط والأحكام' : 'Terms of Service | Aldeyar Global Professionals',
    description: isArabic
      ? 'شروط وأحكام الخدمة لديار جدة العالمية في جدة. تعرف على الشروط والأحكام، الضمانات، وسياسات الدفع والتركيب التي تحكم استخدام خدماتنا.'
      : 'Terms and conditions of service for Aldeyar Global Professionals in Jeddah. Learn about terms, warranties, payment policies, and installation.',
    keywords: isArabic
      ? 'شروط الخدمة، الأحكام والشروط، سياسات الخدمة، ديار جدة العالمية'
      : 'terms of service, terms and conditions, service policies, Aldeyar Global Professionals',
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals' }],
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        'ar': '/ar/terms',
        'en': '/en/terms',
        'x-default': '/ar/terms'
      }
    },
    openGraph: {
      title: isArabic ? 'شروط الخدمة | ديار جدة العالمية' : 'Terms of Service | Aldeyar Global Professionals',
      description: isArabic ? 'شروط وأحكام الخدمة لديار جدة العالمية. تعرف على الشروط والأحكام التي تحكم استخدام خدماتنا.' : 'Terms and conditions governing the use of our services.',
      url: `https://www.deyarsu.com/${locale}/terms`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: 'https://www.deyarsu.com/logo.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'شروط الخدمة - ديار جدة العالمية' : 'Terms of Service - Aldeyar Global Professionals'
        }
      ]
    }
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isArabic = locale === 'ar';

  const keyTerms = [
    {
      title: isArabic ? 'الشفافية' : 'Transparency',
      description: isArabic ? 'جميع الشروط والأحكام واضحة ومفهومة' : 'All terms and conditions are clear and understandable',
      icon: FileText
    },
    {
      title: isArabic ? 'العدالة' : 'Fairness',
      description: isArabic ? 'شروط عادلة ومتوازنة لجميع الأطراف' : 'Fair and balanced terms for all parties',
      icon: Scale
    },
    {
      title: isArabic ? 'الالتزام' : 'Commitment',
      description: isArabic ? 'نلتزم بجميع الشروط والقوانين المعمول بها' : 'We adhere to all applicable terms and laws',
      icon: Handshake
    },
    {
      title: isArabic ? 'الحماية' : 'Protection',
      description: isArabic ? 'حماية حقوق جميع الأطراف وضمان المصالح' : 'Protecting the rights of all parties and ensuring interests',
      icon: Shield
    }
  ];

  return (
    <IntlProvider locale={locale}>
      <Navbar />

      <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className={`flex justify-center items-center ${isArabic ? 'space-x-2 space-x-reverse' : 'space-x-2'} text-sm text-gray-600 mb-8`}>
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">{isArabic ? 'الرئيسية' : 'Home'}</Link>
              <span>/</span>
              <span className="text-primary font-medium">{isArabic ? 'شروط الخدمة' : 'Terms of Service'}</span>
            </nav>

            <Scale className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {isArabic ? 'الشروط والأحكام التي تحكم استخدام خدمات ديار جدة العالمية' : 'Terms and conditions governing the use of Aldeyar Global Professionals services'}
            </p>
            <div className="mt-8 text-sm text-gray-500">
              {isArabic ? 'آخر تحديث: ديسمبر 2024' : 'Last Updated: December 2024'}
            </div>
          </div>
        </section>

        {/* Key Terms */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyTerms.map((term, index) => (
                <div key={index} className="text-center">
                  <term.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{term.title}</h3>
                  <p className="text-gray-600 text-sm">{term.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-8">

              {isArabic ? (
                <>
                  {/* Arabic Content */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-6 h-6 text-primary ml-3" />
                      مقدمة
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      مرحباً بكم في موقع ديار جدة العالمية. هذه الشروط والأحكام ("الشروط") تحكم استخدامكم لموقعنا الإلكتروني
                      وخدماتنا المقدمة من قبل ديار جدة العالمية ("نحن"، "لنا"، "الشركة").
                      باستخدام خدماتنا، فإنكم توافقون على الالتزام بهذه الشروط والأحكام.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-primary ml-3" />
                      قبول الشروط
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      من خلال الوصول إلى موقعنا الإلكتروني أو استخدام خدماتنا، فإنك توافق على:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                      <li>الالتزام بجميع الشروط والأحكام المذكورة هنا</li>
                      <li>احترام حقوق الملكية الفكرية الخاصة بنا</li>
                      <li>استخدام خدماتنا بطريقة قانونية ومناسبة</li>
                      <li>تقديم معلومات صحيحة ودقيقة</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Handshake className="w-6 h-6 text-primary ml-3" />
                      وصف الخدمات
                    </h2>
                    <p className="text-gray-700 mb-4">نقدم الخدمات التالية:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                      <li>تصميم وتركيب المظلات بجميع أنواعها</li>
                      <li>تركيب السواتر الخصوصية والحمايه</li>
                      <li>إنشاء البرجولات والهناجر</li>
                      <li>تركيب الخيام الملكية</li>
                      <li>بناء بيوت الشعر التراثية</li>
                      <li>تركيب ساندوتش بانل</li>
                      <li>تنسيق الحدائق والمساحات الخضراء</li>
                      <li>ترميم الملحقات والمباني</li>
                    </ul>
                  </div>
                  {/* ... Add other sections similarly ... */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-primary ml-3" />
                      الضمان
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      نقدم ضماناً شاملاً يصل إلى 10 سنوات على جميع أعمالنا، يغطي العيوب الفنية وعيوب التركيب والمواد المستخدمة.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* English Content */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-6 h-6 text-primary mr-3" />
                      Introduction
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to Aldeyar Global Professionals. These Terms and Conditions ("Terms") govern your use of our website and services provided by Aldeyar Global Professionals ("we", "us", "the Company"). By using our services, you agree to be bound by these Terms and Conditions.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-primary mr-3" />
                      Acceptance of Terms
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      By accessing our website or using our services, you agree to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Adhere to all terms and conditions mentioned here</li>
                      <li>Respect our intellectual property rights</li>
                      <li>Use our services in a legal and appropriate manner</li>
                      <li>Provide correct and accurate information</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Handshake className="w-6 h-6 text-primary mr-3" />
                      Description of Services
                    </h2>
                    <p className="text-gray-700 mb-4">We provide the following services:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Design and installation of all types of shades</li>
                      <li>Installation of privacy and protection fences</li>
                      <li>Construction of pergolas and hangars</li>
                      <li>Installation of royal tents</li>
                      <li>Building traditional hair houses</li>
                      <li>Sandwich panel installation</li>
                      <li>Landscaping and green spaces</li>
                      <li>Renovation of annexes and buildings</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-primary mr-3" />
                      Warranty
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      We offer a comprehensive warranty of up to 10 years on all our works, covering technical defects, installation errors, and materials used.
                    </p>
                  </div>
                </>
              )}

              {/* Contact Info Footer inside Content */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{isArabic ? 'معلومات التواصل' : 'Contact Information'}</h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>{isArabic ? 'البريد الإلكتروني:' : 'Email:'}</strong> info@deyarsu.com</p>
                  <p><strong>{isArabic ? 'الهاتف:' : 'Phone:'}</strong> +966 55 371 9009</p>
                  <p><strong>{isArabic ? 'العنوان:' : 'Address:'}</strong> {isArabic ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia'}</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </IntlProvider>
  );
}
