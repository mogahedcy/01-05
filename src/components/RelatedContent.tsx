'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Image as ImageIcon, FileText, HelpCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

interface RelatedContentProps {
  serviceName: string;
  serviceSlug: string;
  projectsCount?: number;
  articlesCount?: number;
  faqsCount?: number;
}

export default function RelatedContent({
  serviceName,
  serviceSlug,
  projectsCount = 0,
  articlesCount = 0,
  faqsCount = 0
}: RelatedContentProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  
  const localePath = locale === 'ar' ? '' : '/en';
  const serviceUrl = `${localePath}/services/${serviceSlug}`;
  
  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
            {isRTL ? `محتوى متعلق بـ ${serviceName}` : `Related Content for ${serviceName}`}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشف معرض الأعمال، المقالات التفصيلية، والأسئلة الشائعة حول هذه الخدمة'
              : 'Explore our portfolio, detailed articles, and FAQs about this service'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Gallery */}
          <Link 
            href={`${serviceUrl}#projects`}
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">
                    {isRTL ? 'معرض الأعمال' : 'Portfolio Gallery'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {projectsCount > 0 
                      ? `${projectsCount} ${isRTL ? 'مشروع' : 'projects'}`
                      : isRTL ? 'شاهد أعمالنا' : 'View our work'}
                  </p>
                </div>
              </div>
              <ArrowIcon className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'صور وفيديوهات لمشاريعنا المنفذة بجودة عالية'
                : 'Photos and videos of our completed projects'}
            </p>
          </Link>

          {/* Articles */}
          <Link 
            href={`${serviceUrl}#articles`}
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">
                    {isRTL ? 'المقالات' : 'Articles'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {articlesCount > 0 
                      ? `${articlesCount} ${isRTL ? 'مقالة' : 'articles'}`
                      : isRTL ? 'دليل شامل' : 'Complete guide'}
                  </p>
                </div>
              </div>
              <ArrowIcon className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'مقالات تفصيلية عن التركيب والصيانة والأسعار'
                : 'Detailed articles about installation, maintenance, and pricing'}
            </p>
          </Link>

          {/* FAQs */}
          <Link 
            href={`${serviceUrl}#faqs`}
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">
                    {isRTL ? 'الأسئلة الشائعة' : 'FAQs'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {faqsCount > 0 
                      ? `${faqsCount} ${isRTL ? 'سؤال' : 'questions'}`
                      : isRTL ? 'إجابات سريعة' : 'Quick answers'}
                  </p>
                </div>
              </div>
              <ArrowIcon className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'أسئلة وأجوبة حول الأسعار، الضمان، والتركيب'
                : 'Questions and answers about pricing, warranty, and installation'}
            </p>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link
            href={serviceUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-300"
          >
            {isRTL ? 'شاهد جميع التفاصيل' : 'View All Details'}
            <ArrowIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
