import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function checkArticleSlugs() {
  try {
    console.log('🔍 فحص slugs المقالات...\n');

    const articles = await prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    console.log(`📊 عدد المقالات: ${articles.length}\n`);

    let hasIssues = false;

    for (const article of articles) {
      const issues: string[] = [];

      if (!article.slug) {
        console.log(`❌ مشكلة في: ${article.title}`);
        console.log(`   Slug مفقود!\n`);
        hasIssues = true;
        continue;
      }

      if (article.slug.startsWith('-')) {
        issues.push('يبدأ بـ -');
        hasIssues = true;
      }

      if (article.slug.endsWith('-')) {
        issues.push('ينتهي بـ -');
        hasIssues = true;
      }

      if (article.slug.includes('--')) {
        issues.push('يحتوي على --');
        hasIssues = true;
      }

      if (issues.length > 0) {
        console.log(`❌ مشكلة في: ${article.title}`);
        console.log(`   Slug الحالي: "${article.slug}"`);
        console.log(`   المشاكل: ${issues.join(', ')}\n`);
      } else {
        console.log(`✅ ${article.title}`);
        console.log(`   Slug: ${article.slug}\n`);
      }
    }

    if (!hasIssues) {
      console.log('\n✨ جميع slugs المقالات صحيحة!');
    } else {
      console.log('\n⚠️ يوجد مشاكل في بعض slugs المقالات.');
      console.log('💡 استخدم السكريبت fix-article-slugs.ts لإصلاحها.');
    }

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleSlugs();
