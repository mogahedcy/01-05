'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { event } from '@/lib/analytics';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }

    event(metric.name, {
      category: 'Web Vitals',
      label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      non_interaction: true,
    });
  });

  return null;
}
