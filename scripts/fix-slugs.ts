import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSlugs() {
  try {
    console.log('🔧 بدء إصلاح الـ slugs...');

    // جلب جميع المشاريع
    const projects = await prisma.projects.findMany({
      select: { id: true, slug: true }
    });

    console.log(`📊 عدد المشاريع: ${projects.length}`);

    // تنظيف slugs المشاريع
    let fixedProjects = 0;
    for (const project of projects) {
      if (project.slug) {
        const cleanedSlug = project.slug.replace(/^-+|-+$/g, '').trim();
        
        if (cleanedSlug !== project.slug) {
          await prisma.projects.update({
            where: { id: project.id },
            data: { slug: cleanedSlug }
          });
          console.log(`✅ تم تنظيف slug المشروع: "${project.slug}" → "${cleanedSlug}"`);
          fixedProjects++;
        }
      }
    }

    // جلب جميع المقالات
    const articles = await prisma.articles.findMany({
      select: { id: true, slug: true }
    });

    console.log(`📊 عدد المقالات: ${articles.length}`);

    // تنظيف slugs المقالات
    let fixedArticles = 0;
    for (const article of articles) {
      if (article.slug) {
        const cleanedSlug = article.slug.replace(/^-+|-+$/g, '').trim();
        
        if (cleanedSlug !== article.slug) {
          await prisma.articles.update({
            where: { id: article.id },
            data: { slug: cleanedSlug }
          });
          console.log(`✅ تم تنظيف slug المقالة: "${article.slug}" → "${cleanedSlug}"`);
          fixedArticles++;
        }
      }
    }

    console.log(`\n✨ اكتمل الإصلاح:`);
    console.log(`   - ${fixedProjects} مشروع تم إصلاحه`);
    console.log(`   - ${fixedArticles} مقالة تم إصلاحها`);

  } catch (error) {
    console.error('❌ خطأ في إصلاح الـ slugs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixSlugs()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
