const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  // جلب كل الفئات الموجودة فعلياً في قاعدة البيانات
  const categories = await prisma.projects.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } }
  });
  console.log('=== فئات المشاريع في قاعدة البيانات ===');
  categories.forEach(c => {
    console.log(`"${c.category}" => ${c._count.category} مشروع`);
  });
}
main().finally(() => prisma.$disconnect());
