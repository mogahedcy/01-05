import type { Metadata } from 'next';
import CommentsManagementClient from './CommentsManagementClient';

export const metadata: Metadata = {
  title: 'إدارة التعليقات | لوحة التحكم',
  description: 'إدارة التعليقات والتقييمات على المشاريع',
};

export default function CommentsManagementPage() {
  return <CommentsManagementClient />;
}
