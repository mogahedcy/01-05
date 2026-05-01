import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import AutomationClient from './AutomationClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأتمتة الذكية | ديار جدة العالمية',
  description: 'توليد المقالات وإصلاح SEO تلقائياً بالذكاء الاصطناعي',
  robots: 'noindex, nofollow',
};

async function getAdminData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token) as any;
    return { adminId: decoded.adminId };
  } catch (error) {
    return null;
  }
}

export default async function AutomationPage() {
  const admin = await getAdminData();

  if (!admin) {
    redirect('/login');
  }

  return <AutomationClient />;
}
