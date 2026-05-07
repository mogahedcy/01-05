import ContentFactoryClient from './ContentFactoryClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مصنع المحتوى الذكي | لوحة التحكم',
};

export default function ContentFactoryPage() {
  return <ContentFactoryClient />;
}
