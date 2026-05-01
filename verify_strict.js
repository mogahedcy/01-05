const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// نفس منطق getServiceMapping من services-categories-mapping.ts
const MAPPINGS = {
  sawater:        ['سواتر', 'ساتر', 'سواتر خصوصية', 'سواتر حديد'],
  mazallat:       ['مظلات سيارات', 'مظلات', 'مظلة سيارات', 'مظلة'],
  pergolas:       ['برجولات', 'برجولة', 'برجول'],
  'sandwich-panel': ['ساندوتش بانل', 'ساندويش بانل', 'عزل حراري'],
};

async function main() {
  for (const [slug, categories] of Object.entries(MAPPINGS)) {
    const projects = await prisma.projects.count({
      where: { status: 'PUBLISHED', category: { in: categories } }
    });
    const articles = await prisma.articles.count({
      where: { status: 'PUBLISHED', category: { in: categories } }
    });
    console.log(`[${slug}] => Projects: ${projects}, Articles: ${articles}`);
  }
}
main().finally(() => prisma.$disconnect());
