import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 فحص بيانات المظلات في قاعدة البيانات...\n');

  try {
    const projects = await prisma.projects.findMany({
      where: {
        OR: [
          { title: { contains: 'مظلات' } },
          { category: { contains: 'مظلات' } },
        ]
      },
      include: {
        media_items: true,
      }
    });

    const articles = await prisma.articles.findMany({
      where: {
        OR: [
          { title: { contains: 'مظلات' } },
          { category: { contains: 'مظلات' } },
        ]
      }
    });

    const faqs = await prisma.faqs.findMany({
      where: {
        category: 'مظلات'
      }
    });

    console.log('📊 النتائج:');
    console.log(`   - عدد المشاريع: ${projects.length}`);
    console.log(`   - عدد المقالات: ${articles.length}`);
    console.log(`   - عدد الأسئلة الشائعة: ${faqs.length}\n`);

    if (projects.length > 0) {
      console.log('📁 المشاريع:');
      projects.forEach(p => {
        console.log(`   ✓ ${p.title} - الحالة: ${p.status} - الصور: ${p.media_items.length}`);
      });
    }

    if (articles.length > 0) {
      console.log('\n📝 المقالات:');
      articles.forEach(a => {
        console.log(`   ✓ ${a.title} - الحالة: ${a.status}`);
      });
    }

    if (faqs.length > 0) {
      console.log('\n❓ الأسئلة الشائعة:');
      faqs.forEach(f => {
        console.log(`   ✓ ${f.question.substring(0, 50)}... - الحالة: ${f.status}`);
      });
    }

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
