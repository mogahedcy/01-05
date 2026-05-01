import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

function cleanSlug(slug: string): string {
  return slug
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .replace(/--+/g, '-');
}

async function fixArticleSlugs() {
  try {
    console.log('🔧 إصلاح slugs المقالات...\n');

    const articles = await prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    let fixedCount = 0;

    for (const article of articles) {
      if (!article.slug) {
        console.log(`⚠️ تخطي: ${article.title} - slug مفقود\n`);
        continue;
      }

      const cleanedSlug = cleanSlug(article.slug);

      if (cleanedSlug !== article.slug) {
        console.log(`🔄 إصلاح: ${article.title}`);
        console.log(`   من: "${article.slug}"`);
        console.log(`   إلى: "${cleanedSlug}"`);

        await prisma.articles.update({
          where: { id: article.id },
          data: { slug: cleanedSlug }
        });

        fixedCount++;
        console.log(`   ✅ تم الإصلاح\n`);
      } else {
        console.log(`✓ ${article.title} - صحيح\n`);
      }
    }

    console.log(`\n✨ تم إصلاح ${fixedCount} من أصل ${articles.length} مقالة`);

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixArticleSlugs();
