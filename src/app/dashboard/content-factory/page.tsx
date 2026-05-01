import ContentFactoryClient from './ContentFactoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مصنع المحتوى الذكي | لوحة التحكم',
};

export default function ContentFactoryPage() {
  return <ContentFactoryClient />;
}
