
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, Shield, Sun, Star, CheckCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دليل مظلات السيارات الشامل في جدة 2024 - أنواع وأسعار وتركيب | ديار جدة العالمية',
  description: 'دليل شامل لمظلات السيارات في جدة 2024: أفضل الأنواع، الأسعار التنافسية، طرق التركيب المحترف، نصائح الاختيار والصيانة مع ضمان 10 سنوات',
  keywords: 'مظلات سيارات جدة، أسعار مظلات السيارات، تركيب مظلات جدة، مظلات PVC، مظلات حديد، مظلات قماش، حماية السيارات',
  openGraph: {
    title: 'دليل مظلات السيارات الشامل في جدة 2024',
    description: 'أفضل دليل شامل لمظلات السيارات في جدة - الأنواع والأسعار والتركيب المحترف',
    images: ['/images/articles/mazallat-guide-main.webp']
  }
};

export default function CarShadesGuidePage() {
  const carShadeTypes = [
    {
      name: 'مظلات PVC',
      price: '180-250 ريال/م²',
      features: ['مقاومة عالية للحرارة', 'عازل للأشعة فوق البنفسجية', 'عمر افتراضي 15 سنة'],
      pros: ['سهولة التنظيف', 'خفة الوزن', 'مقاومة التقلبات الجوية'],
      cons: ['أقل متانة من الحديد', 'محدودية الألوان']
    },
    {
      name: 'مظلات حديدية',
      price: '220-350 ريال/م²',
      features: ['متانة فائقة', 'تحمل أوزان كبيرة', 'عمر افتراضي 20+ سنة'],
      pros: ['قوة ومتانة عالية', 'تصاميم متنوعة', 'مقاومة الرياح القوية'],
      cons: ['وزن أثقل', 'تحتاج صيانة دورية']
    },
    {
      name: 'مظلات قماش',
      price: '150-200 ريال/م²',
      features: ['مرونة في التصميم', 'ألوان متعددة', 'تركيب سريع'],
      pros: ['تكلفة أقل', 'سهولة الاستبدال', 'تصاميم عصرية'],
      cons: ['عمر افتراضي أقل', 'تأثر بالعوامل الجوية']
    }
  ];

  const installationSteps = [
    {
      step: 1,
      title: 'المسح والتقييم',
      description: 'فحص الموقع وقياس المساحات وتحديد نوع التربة والمتطلبات الإنشائية'
    },
    {
      step: 2,
      title: 'التصميم والتخطيط',
      description: 'إعداد التصميم المناسب واختيار المواد وحساب الأحمال الإنشائية'
    },
    {
      step: 3,
      title: 'الحفر والأساسات',
      description: 'حفر القواعد وصب الخرسانة وتركيب الأعمدة الحديدية'
    },
    {
      step: 4,
      title: 'التركيب والتشطيب',
      description: 'تركيب الهيكل المعدني وتثبيت الغطاء العلوي والتشطيبات النهائية'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "دليل مظلات السيارات الشامل في جدة 2024",
            "description": "دليل شامل لمظلات السيارات في جدة يشمل الأنواع والأسعار وطرق التركيب",
            "author": {
              "@type": "Organization",
              "name": "ديار جدة العالمية"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ديار جدة العالمية",
              "logo": "https://www.deyarsu.com/images/logo.png"
            },
            "datePublished": "2024-12-22",
            "dateModified": "2024-12-22",
            "mainEntityOfPage": "https://www.deyarsu.com/articles/complete-car-shades-guide-jeddah-2024"
          })
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-primary to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              دليل مظلات السيارات الشامل في جدة 2024
            </h1>
            <p className="text-xl mb-8">
              كل ما تحتاج معرفته عن مظلات السيارات: الأنواع، الأسعار، التركيب، والصيانة
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full">15+ سنة خبرة</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">ضمان 10 سنوات</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">1000+ مشروع</span>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">محتويات الدليل</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="#types" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Car className="w-5 h-5 text-primary ml-3" />
                <span>أنواع مظلات السيارات</span>
              </Link>
              <Link href="#prices" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Star className="w-5 h-5 text-primary ml-3" />
                <span>الأسعار والمقارنات</span>
              </Link>
              <Link href="#installation" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-primary ml-3" />
                <span>خطوات التركيب</span>
              </Link>
              <Link href="#maintenance" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Sun className="w-5 h-5 text-primary ml-3" />
                <span>نصائح الصيانة</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section id="types" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">أنواع مظلات السيارات في جدة</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {carShadeTypes.map((type, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">{type.name}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-4">{type.price}</div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">المميزات الرئيسية:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-600 mb-2">المزايا:</h5>
                      <ul className="space-y-1">
                        {type.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-gray-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-600 mb-2">العيوب:</h5>
                      <ul className="space-y-1">
                        {type.cons.map((con, i) => (
                          <li key={i} className="text-xs text-gray-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">خطوات التركيب المحترف</h2>
            <div className="space-y-8">
              {installationSteps.map((step, index) => (
                <div key={index} className="flex items-start bg-white rounded-lg p-6 shadow">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg ml-4 flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">احصل على استشارة مجانية الآن</h2>
          <p className="text-xl mb-8">فريق خبراء ديار جدة العالمية جاهز لمساعدتك في اختيار المظلة المناسبة</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              اتصل بنا الآن
            </Link>
            <Link
              href="/quote"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              احصل على عرض سعر
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">خدمات ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/services/pergolas" className="group">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <h3 className="font-bold mb-2 group-hover:text-primary">البرجولات الخشبية</h3>
                  <p className="text-gray-600 text-sm">تصاميم فاخرة للحدائق والمساحات الخارجية</p>
                </div>
              </Link>
              <Link href="/services/sawater" className="group">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <h3 className="font-bold mb-2 group-hover:text-primary">السواتر</h3>
                  <p className="text-gray-600 text-sm">حلول الخصوصية والحماية المثالية</p>
                </div>
              </Link>
              <Link href="/services/landscaping" className="group">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <h3 className="font-bold mb-2 group-hover:text-primary">تنسيق الحدائق</h3>
                  <p className="text-gray-600 text-sm">تصميم وتنفيذ مساحات خضراء جميلة</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
