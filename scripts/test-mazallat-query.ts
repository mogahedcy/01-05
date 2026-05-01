import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQuery() {
  console.log('🧪 اختبار استعلام المظلات من الصفحة...\n');

  try {
    // نفس الاستعلام المستخدم في الصفحة
    const projects = await prisma.projects.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: 'مظلات' } },
          { title: { contains: 'مظلة' } },
          { description: { contains: 'مظلات' } },
          { category: { contains: 'مظلات' } },
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        featured: true,
        media_items: {
          orderBy: { order: 'asc' },
          take: 1,
          select: {
            src: true,
            alt: true
          }
        },
        _count: {
          select: {
            project_views: true,
            project_likes: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: 6
    });

    console.log(`✅ تم العثور على ${projects.length} مشاريع`);
    console.log('\n📋 المشاريع:');
    projects.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.title}`);
      console.log(`   - Featured: ${p.featured}`);
      console.log(`   - Slug: ${p.slug}`);
      console.log(`   - صور: ${p.media_items.length}`);
      if (p.media_items.length > 0) {
        console.log(`   - الصورة: ${p.media_items[0].src}`);
      }
    });

  } catch (error) {
    console.error('❌ خطأ في الاستعلام:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
