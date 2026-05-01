'use client';

import { Shield, Clock, Award, Users, Wrench, MapPin, CheckCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const featureIcons = {
  experience: Award,
  warranty: Shield,
  customers: Users,
  punctuality: Clock,
  comprehensive: Wrench,
  coverage: MapPin,
};

const featureColors = {
  experience: { color: 'text-blue-600', bgColor: 'bg-blue-50' },
  warranty: { color: 'text-green-600', bgColor: 'bg-green-50' },
  customers: { color: 'text-purple-600', bgColor: 'bg-purple-50' },
  punctuality: { color: 'text-orange-600', bgColor: 'bg-orange-50' },
  comprehensive: { color: 'text-red-600', bgColor: 'bg-red-50' },
  coverage: { color: 'text-teal-600', bgColor: 'bg-teal-50' },
};

const statsKeys = ['projects', 'experience', 'services', 'support'];
const featureKeys = ['experience', 'warranty', 'customers', 'punctuality', 'comprehensive', 'coverage'];
const trustBadgeKeys = ['expertSupervision', 'qualityMaterials', 'experiencedLabor', 'globalStandards', 'technicalTeam'];

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and non-number parts
  const numberMatch = value.match(/\d+/);
  const numberPart = numberMatch ? parseInt(numberMatch[0], 10) : 0;
  const prefix = numberMatch ? value.substring(0, numberMatch.index) : '';
  const suffix = numberMatch ? value.substring(numberMatch.index! + numberMatch[0].length) : value;

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(spring, (current) => Math.floor(current));
  
  const [currentDisplay, setCurrentDisplay] = useState(0);

  useEffect(() => {
    if (isInView && numberPart > 0) {
      spring.set(numberPart);
    }
  }, [isInView, numberPart, spring]);

  useEffect(() => {
    return displayValue.onChange((v) => setCurrentDisplay(v));
  }, [displayValue]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-amber-500 mb-2 drop-shadow-sm">
      {numberPart > 0 ? (
        <>
          {prefix}{currentDisplay}{suffix}
        </>
      ) : (
        value
      )}
    </div>
  );
}

export default function WhyChooseUsSection() {
  const locale = useLocale();
  const t = useTranslations('whyChooseUs');
  const isRTL = locale === 'ar';

  const features = featureKeys.map((key) => {
    const featureKey = key as keyof typeof featureIcons;
    return {
      key: featureKey,
      icon: featureIcons[featureKey],
      title: t(`features.${featureKey}.title`),
      description: t(`features.${featureKey}.description`),
      highlight: t(`features.${featureKey}.highlight`),
      ...featureColors[featureKey],
    };
  });

  const stats = statsKeys.map((key) => ({
    number: t(`stats.${key}.number`),
    label: t(`stats.${key}.label`),
    description: t(`stats.${key}.description`),
  }));

  const trustBadges = trustBadgeKeys.map((key) => t(`trustBadges.${key}`));

  return (
    <section className="py-24 bg-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
              <AnimatedCounter value={stat.number} />
              <div className="text-lg font-bold text-gray-900 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white hover:bg-gray-900 rounded-3xl border border-gray-100 hover:border-amber-500/40 overflow-hidden shadow-md hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500"
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${feature.color === 'text-blue-600' ? 'from-blue-400 to-blue-600' : feature.color === 'text-green-600' ? 'from-green-400 to-green-600' : feature.color === 'text-purple-600' ? 'from-purple-400 to-purple-600' : feature.color === 'text-orange-600' ? 'from-orange-400 to-orange-600' : feature.color === 'text-red-600' ? 'from-red-400 to-red-600' : 'from-teal-400 to-teal-600'}`} />

                <div className="p-8 text-center">
                  {/* Highlight badge */}
                  <div className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold ${feature.bgColor} ${feature.color}`}>
                    {feature.highlight}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${feature.color} ${feature.bgColor} group-hover:bg-amber-500/10 group-hover:text-amber-400 rounded-2xl mb-6 shadow-md group-hover:scale-110 transition-all duration-500`}>
                    <IconComponent className="w-10 h-10" />
                  </div>

                  <h3 className="text-xl font-black text-gray-900 group-hover:text-white mb-3 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-300 leading-relaxed text-sm transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="bg-gray-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
          <h3 className="text-2xl font-black text-white mb-8 relative z-10">
            {t('trustTitle')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 relative z-10">
            {trustBadges.map((badge) => (
              <div key={badge} className={`flex items-center gap-2 bg-white/5 border border-amber-500/20 px-4 py-2.5 rounded-xl text-sm`}>
                <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="font-semibold text-gray-200">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
