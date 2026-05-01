'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewSchema from './ReviewSchema';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function TestimonialsSection() {
  const locale = useLocale();
  const t = useTranslations('testimonials');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';

  const testimonials = [0, 1, 2, 3, 4, 5].map((index) => ({
    id: index + 1,
    name: t(`reviews.${index}.name`),
    location: t(`reviews.${index}.location`),
    service: t(`reviews.${index}.service`),
    rating: 5,
    text: t(`reviews.${index}.text`),
    date: '2024'
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const currentTestimonial = testimonials[currentIndex];

  const reviewsForSchema = testimonials.map(testimonial => ({
    author: testimonial.name,
    rating: testimonial.rating,
    reviewBody: testimonial.text,
    datePublished: `${testimonial.date}-01-01`,
    title: `${isRTL ? 'تقييم' : 'Review'} ${testimonial.service}`
  }));

  const serviceName = isRTL 
    ? "خدمات ديار جدة العالمية - مظلات وبرجولات جدة"
    : "Deyar Jeddah Professionals Services - Shades and Pergolas Jeddah";

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-accent/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <ReviewSchema
        serviceName={serviceName}
        itemType="LocalBusiness"
        serviceUrl="https://www.deyarsu.com"
        aggregateRating={{
          ratingValue: 4.9,
          reviewCount: testimonials.length
        }}
        reviews={reviewsForSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 bg-accent/10 px-6 py-3 rounded-full mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Star className="w-5 h-5 text-accent fill-current" />
            <span className="font-bold text-accent">{t('rating')}</span>
            <Star className="w-5 h-5 text-accent fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <div
            className="bg-gradient-to-br from-white to-accent/5 rounded-3xl shadow-2xl p-10 md:p-16 relative overflow-hidden border-2 border-accent/20"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className={`absolute top-0 ${isRTL ? 'left-0 -ml-20' : 'right-0 -mr-20'} w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-full -mt-20`} />
            <div className={`absolute bottom-0 ${isRTL ? 'right-0 -mr-16' : 'left-0 -ml-16'} w-32 h-32 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-full -mb-16`} />

            <div className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'} text-accent/10`}>
              <Quote className="w-20 h-20" />
            </div>

            <div className={`flex items-center justify-center mb-8 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={`star-${currentTestimonial.id}-${i}`} className="w-8 h-8 text-amber-400 fill-current drop-shadow-lg" />
              ))}
            </div>

            <blockquote className="text-2xl md:text-3xl text-center text-primary leading-relaxed mb-10 font-bold relative z-10">
              "{currentTestimonial.text}"
            </blockquote>

            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                {currentTestimonial.name.charAt(0)}
              </div>
              <div className="font-black text-xl text-primary mb-2">
                {currentTestimonial.name}
              </div>
              <div className="text-muted-foreground mb-3 font-medium">
                {currentTestimonial.location}
              </div>
              <div className="inline-flex items-center bg-gradient-to-r from-accent/20 to-amber-500/20 text-accent px-6 py-3 rounded-full text-sm font-bold border-2 border-accent/30">
                {currentTestimonial.service}
              </div>
            </div>

            <div className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-6' : 'left-6'}`}>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:bg-accent hover:text-white border-2 w-12 h-12"
                aria-label={t('prevReview')}
              >
                {isRTL ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
              </Button>
            </div>
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-6' : 'right-6'}`}>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:bg-accent hover:text-white border-2 w-12 h-12"
                aria-label={t('nextReview')}
              >
                {isRTL ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        <div className={`flex justify-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'} mb-12`} role="tablist" aria-label={t('selectReview')}>
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-accent w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${isRTL ? 'عرض تقييم' : 'Show review'} ${index + 1} ${isRTL ? 'من' : 'of'} ${testimonials.length}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 cursor-pointer hover:-translate-y-2 ${
                index === currentIndex 
                  ? 'ring-4 ring-accent shadow-2xl scale-105' 
                  : 'hover:shadow-2xl'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className={`flex items-center gap-1 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={`star-grid-${testimonial.id}-${i}`} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>

              <p className="text-base text-gray-700 mb-6 leading-relaxed font-medium min-h-[80px]">
                "{testimonial.text}"
              </p>

              <div className="border-t-2 border-gray-100 pt-5">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="font-bold text-primary text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-bold text-center">
                  {testimonial.service}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-primary mb-4">
            {t('ctaTitle')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href={`${localePath}/contact`}>
              {t('ctaButton')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
