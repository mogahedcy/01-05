'use client';

import { MessageCircle, Ruler, FileText, Hammer, Clock, CheckCircle, Star, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const stepConfigs = [
  {
    key: 'step1',
    icon: MessageCircle,
    detailIcons: [Clock, MessageCircle, CheckCircle],
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    glowColor: 'shadow-blue-500/50'
  },
  {
    key: 'step2',
    icon: Ruler,
    detailIcons: [Clock, Ruler, Star],
    color: 'from-green-500 to-green-600',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
    glowColor: 'shadow-green-500/50'
  },
  {
    key: 'step3',
    icon: FileText,
    detailIcons: [Star, FileText, CheckCircle],
    color: 'from-amber-500 to-amber-600',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    glowColor: 'shadow-amber-500/50'
  },
  {
    key: 'step4',
    icon: Hammer,
    detailIcons: [Clock, Hammer, Shield],
    color: 'from-red-500 to-red-600',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    glowColor: 'shadow-red-500/50'
  }
];

interface StepCardProps {
  step: {
    number: string;
    title: string;
    description: string;
    details: { icon: React.ComponentType<{ className: string }>; text: string }[];
    color: string;
    iconBg: string;
    iconColor: string;
    glowColor: string;
    icon: React.ComponentType<{ className: string }>;
  };
  index: number;
  isRTL: boolean;
}

function StepCard({ step, index, isRTL }: StepCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = step.icon;
  const isEven = index % 2 === 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const textAlign = isRTL 
    ? (isEven ? 'md:text-right' : 'md:text-left')
    : (isEven ? 'md:text-left' : 'md:text-right');

  return (
    <div 
      ref={cardRef}
      className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-8 items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className={`flex-1 ${textAlign}`}>
        <div className="relative group">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${step.color} text-white font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {step.number}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
              {step.title}
            </h3>
            
            <p className="text-white/80 leading-relaxed mb-4 text-base md:text-lg">
              {step.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {step.details.map((detail, idx) => {
                const DetailIcon = detail.icon;
                return (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium border border-white/10 hover:bg-white/20 transition-all duration-200"
                  >
                    <DetailIcon className="w-4 h-4" />
                    {detail.text}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10`} />
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className={`relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full ${step.iconBg} backdrop-blur-md border-2 border-white/20 ${step.glowColor} shadow-2xl hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-12 h-12 md:w-16 md:h-16 ${step.iconColor}`} />
          
          {index < stepConfigs.length - 1 && (
            <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-white/30 to-transparent" />
          )}
        </div>
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function HowItWorksSection() {
  const locale = useLocale();
  const t = useTranslations('howItWorks');
  const isRTL = locale === 'ar';
  const localePath = locale === 'ar' ? '' : '/en';

  const steps = stepConfigs.map((config, index) => ({
    number: String(index + 1),
    icon: config.icon,
    title: t(`steps.${config.key}.title`),
    description: t(`steps.${config.key}.description`),
    details: config.detailIcons.map((icon, idx) => ({
      icon,
      text: t(`steps.${config.key}.details.${idx}`)
    })),
    color: config.color,
    iconBg: config.iconBg,
    iconColor: config.iconColor,
    glowColor: config.glowColor
  }));

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-accent/20 backdrop-blur-sm rounded-full mb-6 border border-accent/30">
            <span className="text-accent font-bold text-sm md:text-base">{t('badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            {t('title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-400">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-8 md:space-y-12 mb-12">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} isRTL={isRTL} />
          ))}
        </div>

        <div className="relative group">
          <div className="bg-gradient-to-br from-accent via-green-500 to-accent rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]" />
            
            <div className="relative z-10">
              <h3 className={`text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('ctaTitle')}
                <span className="text-3xl md:text-4xl animate-bounce">🚀</span>
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                {t('ctaSubtitle')}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Button asChild size="lg" className="bg-white text-accent hover:bg-gray-100 font-bold shadow-xl text-lg px-8 hover:scale-105 transition-transform duration-200">
                  <Link href="https://wa.me/+966553719009" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MessageCircle className="w-5 h-5" />
                    {t('ctaButton')}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                  <Link href={`${localePath}/contact`} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FileText className="w-5 h-5" />
                    {t('ctaSecondary')}
                  </Link>
                </Button>
              </div>
              
              <div className={`flex flex-wrap justify-center gap-4 text-sm text-white/90 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="w-5 h-5" />
                  {t('noCommitment')}
                </span>
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="w-5 h-5" />
                  {t('freeConsultation')}
                </span>
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="w-5 h-5" />
                  {t('instantQuote')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-green-500 opacity-50 group-hover:opacity-75 blur-2xl transition-opacity duration-300 -z-10" />
        </div>

        <div className="mt-8 text-center text-sm text-white/50">
          <p>
            {t('allServices')}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -250% 0;
          }
          100% {
            background-position: 250% 0;
          }
        }
      `}</style>
    </section>
  );
}
