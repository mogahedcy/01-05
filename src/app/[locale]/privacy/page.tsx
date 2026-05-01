import type { Metadata } from 'next';
import { Shield, Eye, Lock, FileText, Users, Globe, AlertCircle, CheckCircle } from 'lucide-react';
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
    title: isArabic ? 'سياسة الخصوصية | ديار جدة العالمية' : 'Privacy Policy | Aldeyar Global Professionals',
    description: isArabic
      ? 'سياسة الخصوصية لديار جدة العالمية في جدة. نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الأمنية والقوانين السعودية.'
      : 'Privacy policy for Aldeyar Global Professionals in Jeddah. We are committed to protecting your privacy and personal data according to high security standards.',
    keywords: isArabic
      ? 'سياسة الخصوصية، حماية البيانات، أمان المعلومات، ديار جدة العالمية'
      : 'privacy policy, data protection, information security, Aldeyar Global Professionals',
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals' }],
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        'ar': '/ar/privacy',
        'en': '/en/privacy',
        'x-default': '/ar/privacy'
      }
    },
    openGraph: {
      title: isArabic ? 'سياسة الخصوصية | ديار جدة العالمية' : 'Privacy Policy | Aldeyar Global Professionals',
      description: isArabic ? 'سياسة الخصوصية لديار جدة العالمية. نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية.' : 'Our commitment to protecting your privacy and personal data.',
      url: `https://www.deyarsu.com/${locale}/privacy`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: 'https://www.deyarsu.com/logo.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'سياسة الخصوصية - ديار جدة العالمية' : 'Privacy Policy - Aldeyar Global Professionals'
        }
      ]
    }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isArabic = locale === 'ar';

  const privacyPrinciples = [
    {
      title: isArabic ? 'الشفافية' : 'Transparency',
      description: isArabic ? 'نكون واضحين حول البيانات التي نجمعها وكيفية استخدامها' : 'We are clear about the data we collect and how we use it',
      icon: Eye
    },
    {
      title: isArabic ? 'الأمان' : 'Security',
      description: isArabic ? 'نستخدم أعلى معايير الأمان لحماية بياناتك من الوصول غير المصرح به' : 'We use high security standards to protect your data from unauthorized access',
      icon: Shield
    },
    {
      title: isArabic ? 'التحكم' : 'Control',
      description: isArabic ? 'نمنحك السيطرة الكاملة على بياناتك الشخصية' : 'We give you full control over your personal data',
      icon: Lock
    },
    {
      title: isArabic ? 'الالتزام' : 'Compliance',
      description: isArabic ? 'نلتزم بجميع القوانين واللوائح المحلية والدولية لحماية الخصوصية' : 'We adhere to all local and international laws and regulations for privacy protection',
      icon: FileText
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
              <span className="text-primary font-medium">{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            </nav>

            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {isArabic ? 'نحن في ديار جدة العالمية ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية' : 'At Aldeyar Global Professionals, we are committed to protecting your privacy and ensuring the security of your personal data'}
            </p>
            <div className="mt-8 text-sm text-gray-500">
              {isArabic ? 'آخر تحديث: ديسمبر 2024' : 'Last Updated: December 2024'}
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {privacyPrinciples.map((principle, index) => (
                <div key={index} className="text-center">
                  <principle.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Content */}
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
                      تحدد سياسة الخصوصية هذه كيفية قيام ديار جدة العالمية بجمع واستخدام وحماية المعلومات التي تقدمها عند استخدام موقعنا الإلكتروني أو خدماتنا. نحن ملتزمون بضمان حماية خصوصيتك.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="w-6 h-6 text-primary ml-3" />
                      المعلومات التي نجمعها
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                      <li>الاسم الكامل ورقم الهاتف</li>
                      <li>عنوان البريد الإلكتروني</li>
                      <li>تفاصيل المشروع والموقع</li>
                      <li>معلومات تقنية حول زيارتك للموقع</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Lock className="w-6 h-6 text-primary ml-3" />
                      حماية البيانات
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      نحن نطبق تدابير أمنية صارمة لحماية بياناتك من الوصول غير المصرح به أو الكشف عنها، بما في ذلك التشفير والرقابة المستمرة على الأنظمة.
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
                      This Privacy Policy outlines how Aldeyar Global Professionals collects, uses, and protects the information you provide when using our website or services. We are committed to ensuring your privacy is protected.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="w-6 h-6 text-primary mr-3" />
                      Information We Collect
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Full name and phone number</li>
                      <li>Email address</li>
                      <li>Project details and location</li>
                      <li>Technical information about your visit</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Lock className="w-6 h-6 text-primary mr-3" />
                      Data Protection
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      We implement strict security measures to protect your data from unauthorized access or disclosure, including encryption and continuous system monitoring.
                    </p>
                  </div>
                </>
              )}

              {/* Contact Info Footer inside Content */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{isArabic ? 'تواصل معنا' : 'Contact Us'}</h2>
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
