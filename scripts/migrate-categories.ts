import { PrismaClient } from '@prisma/client';
import { normalizeCategoryName, normalizeArticleCategoryName } from '../src/lib/categoryNormalizer';

const prisma = new PrismaClient();

interface MigrationResult {
  table: string;
  totalRecords: number;
  updated: number;
  unchanged: number;
  errors: number;
  details: Array<{
    id: string;
    oldCategory: string;
    newCategory: string;
  }>;
}

async function migrateCategories() {
  console.log('🚀 بدء ترحيل الفئات إلى النظام الموحد...\n');
  
  const results: MigrationResult[] = [];

  try {
    console.log('📊 جلب جميع السجلات من قاعدة البيانات...\n');

    const projects = await prisma.projects.findMany({
      select: { id: true, category: true, title: true }
    });

    const articles = await prisma.articles.findMany({
      select: { id: true, category: true, title: true }
    });

    const faqs = await prisma.faqs.findMany({
      select: { id: true, category: true, question: true }
    });

    console.log(`✅ تم جلب ${projects.length} مشروع`);
    console.log(`✅ تم جلب ${articles.length} مقالة`);
    console.log(`✅ تم جلب ${faqs.length} سؤال شائع\n`);

    console.log('🔄 جاري تحديث المشاريع...');
    const projectsResult = await migrateTable(
      'projects',
      projects,
      async (id: string, newCategory: string) => {
        await prisma.projects.update({
          where: { id },
          data: { category: newCategory }
        });
      }
    );
    results.push(projectsResult);
    console.log(`✅ تم تحديث ${projectsResult.updated} مشروع\n`);

    console.log('🔄 جاري تحديث المقالات...');
    const articlesResult = await migrateArticlesTable(articles);
    results.push(articlesResult);
    console.log(`✅ تم تحديث ${articlesResult.updated} مقالة\n`);

    console.log('🔄 جاري تحديث الأسئلة الشائعة...');
    const faqsResult = await migrateTable(
      'faqs',
      faqs,
      async (id: string, newCategory: string) => {
        await prisma.faqs.update({
          where: { id },
          data: { category: newCategory }
        });
      }
    );
    results.push(faqsResult);
    console.log(`✅ تم تحديث ${faqsResult.updated} سؤال شائع\n`);

    printSummary(results);

  } catch (error) {
    console.error('❌ خطأ في عملية الترحيل:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateTable(
  tableName: string,
  records: Array<{ id: string; category: string; [key: string]: any }>,
  updateFn: (id: string, newCategory: string) => Promise<void>
): Promise<MigrationResult> {
  const result: MigrationResult = {
    table: tableName,
    totalRecords: records.length,
    updated: 0,
    unchanged: 0,
    errors: 0,
    details: []
  };

  for (const record of records) {
    try {
      const validation = normalizeCategoryName(record.category);
      
      if (!validation.isValid) {
        console.warn(`⚠️ فئة غير صالحة في ${tableName}: "${record.category}" (ID: ${record.id})`);
        result.errors++;
        continue;
      }

      if (validation.wasTransformed && validation.normalizedCategory) {
        await updateFn(record.id, validation.normalizedCategory);
        result.updated++;
        result.details.push({
          id: record.id,
          oldCategory: record.category,
          newCategory: validation.normalizedCategory
        });
        console.log(`  ✓ ${record.category} → ${validation.normalizedCategory} (${record.id})`);
      } else {
        result.unchanged++;
      }
    } catch (error) {
      console.error(`  ❌ خطأ في تحديث ${record.id}:`, error);
      result.errors++;
    }
  }

  return result;
}

async function migrateArticlesTable(
  records: Array<{ id: string; category: string; [key: string]: any }>
): Promise<MigrationResult> {
  const result: MigrationResult = {
    table: 'articles',
    totalRecords: records.length,
    updated: 0,
    unchanged: 0,
    errors: 0,
    details: []
  };

  for (const record of records) {
    try {
      const validation = normalizeArticleCategoryName(record.category);
      
      if (!validation.isValid) {
        console.warn(`⚠️ فئة غير صالحة في articles: "${record.category}" (ID: ${record.id})`);
        result.errors++;
        continue;
      }

      if (validation.wasTransformed && validation.normalizedCategory) {
        await prisma.articles.update({
          where: { id: record.id },
          data: { category: validation.normalizedCategory }
        });
        result.updated++;
        result.details.push({
          id: record.id,
          oldCategory: record.category,
          newCategory: validation.normalizedCategory
        });
        console.log(`  ✓ ${record.category} → ${validation.normalizedCategory} (${record.id})`);
      } else {
        result.unchanged++;
      }
    } catch (error) {
      console.error(`  ❌ خطأ في تحديث ${record.id}:`, error);
      result.errors++;
    }
  }

  return result;
}

function printSummary(results: MigrationResult[]) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 ملخص عملية الترحيل');
  console.log('='.repeat(60) + '\n');

  let totalRecords = 0;
  let totalUpdated = 0;
  let totalUnchanged = 0;
  let totalErrors = 0;

  for (const result of results) {
    console.log(`\n${getTableNameAr(result.table)}:`);
    console.log(`  • إجمالي السجلات: ${result.totalRecords}`);
    console.log(`  • تم التحديث: ${result.updated}`);
    console.log(`  • بدون تغيير: ${result.unchanged}`);
    console.log(`  • أخطاء: ${result.errors}`);

    if (result.details.length > 0) {
      console.log(`\n  التغييرات التفصيلية:`);
      for (const detail of result.details.slice(0, 10)) {
        console.log(`    - "${detail.oldCategory}" → "${detail.newCategory}"`);
      }
      if (result.details.length > 10) {
        console.log(`    ... و ${result.details.length - 10} تغيير آخر`);
      }
    }

    totalRecords += result.totalRecords;
    totalUpdated += result.updated;
    totalUnchanged += result.unchanged;
    totalErrors += result.errors;
  }

  console.log('\n' + '-'.repeat(60));
  console.log('الإجمالي:');
  console.log(`  • إجمالي السجلات: ${totalRecords}`);
  console.log(`  • تم التحديث: ${totalUpdated}`);
  console.log(`  • بدون تغيير: ${totalUnchanged}`);
  console.log(`  • أخطاء: ${totalErrors}`);
  console.log('='.repeat(60));

  if (totalErrors === 0 && totalUpdated > 0) {
    console.log('\n✅ تمت عملية الترحيل بنجاح!');
  } else if (totalErrors > 0) {
    console.log('\n⚠️ تمت عملية الترحيل مع وجود بعض الأخطاء. يرجى مراجعة السجلات أعلاه.');
  } else {
    console.log('\n✅ جميع الفئات موحدة بالفعل! لا حاجة للتحديث.');
  }
}

function getTableNameAr(tableName: string): string {
  const names: Record<string, string> = {
    projects: 'المشاريع',
    articles: 'المقالات',
    faqs: 'الأسئلة الشائعة'
  };
  return names[tableName] || tableName;
}

migrateCategories()
  .then(() => {
    console.log('\n✨ اكتمل التنفيذ');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ فشل التنفيذ:', error);
    process.exit(1);
  });
