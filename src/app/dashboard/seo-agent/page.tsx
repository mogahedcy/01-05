import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import SEOAgentClient from './SEOAgentClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'وكيل الذكاء الاصطناعي لتحسين SEO | لوحة التحكم',
  description: 'أدوات ذكاء اصطناعي متقدمة لتحليل وتحسين محركات البحث',
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

async function getAvailablePages() {
  const [projects, articles] = await Promise.all([
    prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        keywords: true,
      },
      where: { publishedAt: { not: null } }
    }),
    prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        keywords: true,
      },
      where: { publishedAt: { not: null } }
    })
  ]);

  return {
    projects: projects.map(p => ({
      title: p.title,
      url: `/portfolio/${p.slug}`,
      keywords: p.keywords ? p.keywords.split(',').map(k => k.trim()) : []
    })),
    articles: articles.map(a => ({
      title: a.title,
      url: `/articles/${a.slug}`,
      keywords: a.keywords ? a.keywords.split(',').map(k => k.trim()) : []
    }))
  };
}

export default async function SEOAgentPage() {
  const admin = await getAdminData();

  if (!admin) {
    redirect('/login');
  }

  const availablePages = await getAvailablePages();

  return <SEOAgentClient availablePages={availablePages} />;
}
