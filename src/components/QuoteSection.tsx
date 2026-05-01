'use client';

import { useState } from 'react';
import { Calculator, MessageCircle, Phone, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  { id: 'mazallat', name: 'مظلات سيارات', price: 'تقريباً من 2000 ريال وأكثر' },
  { id: 'pergolas', name: 'برجولات حدائق', price: 'تقريباً من 3000 ريال وأكثر' },
  { id: 'sawater', name: 'سواتر خصوصية', price: 'تقريباً من 150 ريال/متر وأكثر' },
  { id: 'sandwich-panel', name: 'ساندوتش بانل', price: 'تقريباً من 200 ريال/متر وأكثر' },
  { id: 'renovation', name: 'ترميم ملحقات', price: 'حسب المشروع' },
  { id: 'landscaping', name: 'تنسيق حدائق', price: 'تقريباً من 100 ريال/متر وأكثر' },
  { id: 'byoot-shaar', name: 'بيوت شعر تراثية', price: 'تقريباً من 5000 ريال وأكثر' },
  { id: 'khayyam', name: 'خيام ملكية', price: 'تقريباً من 8000 ريال وأكثر' }
];

const areas = [
  'شمال جدة', 'وسط جدة', 'شرق جدة', 'جنوب جدة', 'غرب جدة', 'الأحياء الجديدة'
];

const benefits = [
  'زيارة مجانية لأخذ القياسات',
  'عرض سعر مفصل ودقيق',
  'استشارة فنية متخصصة',
  'ضمان شامل 10 سنوات',
  'تركيب احترافي',
  'خدمة ما بعد البيع'
];

export default function QuoteSection() {
  const [selectedService, setSelectedService] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [showEstimate, setShowEstimate] = useState(false);

  const handleGetQuote = () => {
    if (selectedService && selectedArea) {
      setShowEstimate(true);
      // يمكن إضافة منطق حساب التقدير هنا
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `السلام عليكم، أرغب في الحصول على عرض سعر:

الخدمة المطلوبة: ${services.find(s => s.id === selectedService)?.name || 'غير محدد'}
المنطقة: ${selectedArea || 'غير محددة'}
حجم المشروع: ${projectSize || 'غير محدد'}

أرجو التواصل معي لترتيب الزيارة المجانية.
شكراً لكم.`;

    return encodeURIComponent(message);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-6">
            <Calculator className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            احصل على عرض سعر مجاني الآن
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            احصل على عرض سعر مجاني ومفصل لمشروعك مع زيارة مجانية لأخذ القياسات
            والاستشارة الفنية المتخصصة من فريق ديار جدة العالمية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quote Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">
              احسب تكلفة مشروعك
            </h3>

            {/* Service Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary mb-3">
                ا��تر نوع الخدمة المطلوبة *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-accent transition-colors duration-200">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={selectedService === service.id}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="ml-3 text-accent focus:ring-accent"
                      />
                      <span className="font-medium text-primary">{service.name}</span>
                    </div>
                    <span className="text-sm text-accent font-semibold">{service.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Area Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary mb-3">
                اختر منطقة المشروع *
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-accent focus:ring-accent"
              >
                <option value="">اختر المنطقة</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Project Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary mb-3">
                حجم المشروع (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: مظلة لسيارتين، أو المساحة بالمتر المربع"
                value={projectSize}
                onChange={(e) => setProjectSize(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-accent focus:ring-accent"
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleGetQuote}
                disabled={!selectedService || !selectedArea}
                className="w-full text-lg py-6 h-auto"
              >
                احسب التكلفة التقديرية
              </Button>

              {showEstimate && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-green-600 font-bold text-lg mb-2">
                    تقدير أولي للتكلفة
                  </div>
                  <div className="text-primary font-semibold">
                    {services.find(s => s.id === selectedService)?.price}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    *التكلفة النهائية تحدد بعد المعاينة المجانية
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 py-6 h-auto">
                  <Link
                    href={`https://wa.me/+966553719009?text=${generateWhatsAppMessage()}`}
                    className="flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>واتساب</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 py-6 h-auto">
                  <Link href="tel:+966553719009" className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Phone className="w-5 h-5" />
                    <span>اتصال</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits & Features */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">
                ما تحصل عليه معنا
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={`benefit-${benefit.slice(0,15)}-${index}`} className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl p-8">
              <div className="text-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: '🏢', title: 'مشاريع تجارية' },
                    { icon: '🏠', title: 'مشاريع سكنية' },
                    { icon: '🌳', title: 'تنسيق حدائق' },
                    { icon: '⭐', title: 'تقييم ممتاز' }
                  ].map((item, idx) => (
                    <div key={`trust-${idx}`} className="bg-primary/5 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1 leading-none">{item.icon}</div>
                      <div className="text-sm font-medium text-primary">{item.title}</div>
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">تقييم العملاء 5/5</h3>
                <p className="text-muted-foreground mb-4">أكثر من 5000 عميل راضٍ عن خدماتنا</p>
                <div className="text-sm text-muted-foreground">"أفضل شركة تعاملت معها في مجال المظلات والبرجولات"</div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-bold text-primary mb-4">
                تحتاج مساعدة فورية؟
              </h3>
              <p className="text-muted-foreground mb-6">
                تحدث مع خبرائنا مباشرة للحصول على استشارة فنية فورية
              </p>
              <Button size="lg" className="w-full">
                <Link href="tel:+966553719009" className="flex items-center justify-center space-x-2 space-x-reverse">
                  <span>اتصل الآن: 966553719009+</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 bg-white rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">
            جميع عروض الأسعار والاستشارات الفنية مجانية تماماً • لا توجد التزامات مالية قبل الموافقة
          </p>
        </div>
      </div>
    </section>
  );
}
