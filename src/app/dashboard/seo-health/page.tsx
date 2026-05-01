import type { Metadata } from 'next';
import SEOHealthMonitor from './SEOHealthMonitor';

export const metadata: Metadata = {
  title: 'مراقبة صحة SEO | لوحة التحكم',
  description: 'نظام متقدم لمراقبة وتحسين صحة SEO للموقع',
  robots: 'noindex, nofollow',
};

export default function SEOHealthPage() {
  return <SEOHealthMonitor />;
}
