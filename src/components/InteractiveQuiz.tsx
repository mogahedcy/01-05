'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InteractiveQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ usage?: string; style?: string }>({});
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const questions = isRTL ? [
    {
      title: "أين ترغب في إضافة اللمسة السحرية؟",
      options: [
        { id: "car", label: "موقف السيارة 🚗", value: "car" },
        { id: "garden", label: "الحديقة/الحوش 🌳", value: "garden" },
        { id: "roof", label: "السطح/الملحق 🏠", value: "roof" }
      ]
    },
    {
      title: "ما هو الطابع الذي تفضله؟",
      options: [
        { id: "luxury", label: "فخامة وأناقة ملكية ✨", value: "luxury" },
        { id: "modern", label: "عصري وحديث 🏢", value: "modern" },
        { id: "economy", label: "عملي واقتصادي 💰", value: "economy" }
      ]
    }
  ] : [
    {
      title: "Where do you want to add the magic touch?",
      options: [
        { id: "car", label: "Car Parking 🚗", value: "car" },
        { id: "garden", label: "Garden/Patio 🌳", value: "garden" },
        { id: "roof", label: "Roof/Annex 🏠", value: "roof" }
      ]
    },
    {
      title: "What style do you prefer?",
      options: [
        { id: "luxury", label: "Luxury & Royal ✨", value: "luxury" },
        { id: "modern", label: "Modern & Sleek 🏢", value: "modern" },
        { id: "economy", label: "Practical & Economic 💰", value: "economy" }
      ]
    }
  ];

  const handleAnswer = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const getRecommendation = () => {
    if (answers.usage === 'car') {
      return {
        title: isRTL ? 'الأنسب لك: مظلات سيارات PVC العالية الكثافة' : 'Best for you: High-density PVC Car Shades',
        desc: isRTL ? 'توفر حماية 100% لسيارتك من الشمس الحارقة بتصاميم حديثة ومضمونة.' : 'Provides 100% protection for your car from scorching sun with modern, guaranteed designs.',
        href: '/services/mazallat',
      };
    }
    if (answers.usage === 'garden') {
      if (answers.style === 'luxury') {
        return {
          title: isRTL ? 'الأنسب لك: برجولات خشبية فاخرة' : 'Best for you: Luxury Wooden Pergolas',
          desc: isRTL ? 'تضفي فخامة لا تضاهى على حديقتك وتجعلها مكاناً رائعاً لاستقبال الضيوف.' : 'Adds unparalleled luxury to your garden, making it a great place to host guests.',
          href: '/services/pergolas',
        };
      }
      return {
        title: isRTL ? 'الأنسب لك: مظلات حدائق عصرية' : 'Best for you: Modern Garden Shades',
        desc: isRTL ? 'تصميمات عملية وأنيقة تحميك من الحرارة بأفضل الأسعار.' : 'Practical and elegant designs that protect you from heat at the best prices.',
        href: '/services/pergolas',
      };
    }
    return {
      title: isRTL ? 'الأنسب لك: ساندوتش بانل عازل / بيوت شعر' : 'Best for you: Insulated Sandwich Panel / Traditional Houses',
      desc: isRTL ? 'الحل الأمثل لعزل الحرارة والصوت للأسطح والملحقات بضمان طويل.' : 'The perfect solution for thermal and sound insulation for roofs and annexes with a long warranty.',
      href: '/services/sandwich-panel',
    };
  };

  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 to-white overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-full text-sm mb-4">
              {isRTL ? 'مستشار ديار الذكي 🤖' : 'Deyar Smart Advisor 🤖'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {isRTL ? 'محتار وش تختار؟' : 'Confused what to choose?'}
            </h2>
            <p className="text-gray-500">
              {isRTL ? 'أجب على سؤالين سريعين لنرشح لك الحل الأمثل' : 'Answer two quick questions so we can recommend the perfect solution'}
            </p>
          </div>

          <div className="min-h-[250px] flex flex-col justify-center">
            {step < 2 ? (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  {questions[step].title}
                </h3>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(step === 0 ? 'usage' : 'style', opt.value)}
                      className="flex-1 py-4 px-6 bg-gray-50 hover:bg-amber-50 border-2 border-gray-100 hover:border-amber-400 rounded-2xl font-bold text-gray-700 hover:text-amber-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center animate-fade-in bg-amber-50 rounded-2xl p-8 border border-amber-200 shadow-inner">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  {getRecommendation().title}
                </h3>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  {getRecommendation().desc}
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 font-bold px-8">
                    <Link href={`https://wa.me/+966553719009?text=${encodeURIComponent(isRTL ? 'مرحباً، أود الاستفسار عن ' + getRecommendation().title : 'Hello, I want to ask about ' + getRecommendation().title)}`}>
                      {isRTL ? 'اطلب تسعيرة الآن' : 'Get a quote now'}
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => { setStep(0); setAnswers({}); }} className="font-bold">
                    {isRTL ? 'إعادة التقييم' : 'Retake'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
