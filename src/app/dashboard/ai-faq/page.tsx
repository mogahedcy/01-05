import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import AIFAQAgentClient from './AIFAQAgentClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'توليد الأسئلة الشائعة بالذكاء الاصطناعي | لوحة التحكم',
  description: 'توليد أسئلة شائعة احترافية تلقائياً باستخدام Groq AI',
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

    const admin = await prisma.admins.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        username: true,
        role: true
      }
    });

    return admin;
  } catch (error) {
    return null;
  }
}

async function getRecentFAQs() {
  const faqs = await prisma.faqs.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      question: true,
      status: true,
      category: true,
      createdAt: true
    }
  });

  return faqs;
}

async function getFAQStats() {
  const [total, published, draft] = await Promise.all([
    prisma.faqs.count(),
    prisma.faqs.count({ where: { status: 'PUBLISHED' } }),
    prisma.faqs.count({ where: { status: 'DRAFT' } })
  ]);

  return { total, published, draft };
}

export default async function AIFAQAgentPage() {
  const admin = await getAdminData();

  if (!admin) {
    redirect('/login');
  }

  const [recentFAQs, stats] = await Promise.all([
    getRecentFAQs(),
    getFAQStats()
  ]);

  return <AIFAQAgentClient recentFAQs={recentFAQs} stats={stats} />;
}
