import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import AIArticleAgentClient from './AIArticleAgentClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'توليد المقالات بالذكاء الاصطناعي | لوحة التحكم',
  description: 'توليد مقالات كاملة مع صور تلقائياً باستخدام Groq AI',
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

async function getRecentArticles() {
  const articles = await prisma.articles.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      createdAt: true,
      article_media_items: {
        select: {
          id: true,
          src: true
        },
        take: 1
      }
    }
  });

  return articles;
}

export default async function AIArticleAgentPage() {
  const admin = await getAdminData();

  if (!admin) {
    redirect('/login');
  }

  const recentArticles = await getRecentArticles();

  return <AIArticleAgentClient recentArticles={recentArticles} />;
}
