const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const pCount = await prisma.projects.count({where: {category: {contains: 'سواتر'}}});
  const aCount = await prisma.articles.count({where: {category: {contains: 'سواتر'}}});
  console.log(`Projects: ${pCount}, Articles: ${aCount}`);
}
main().finally(() => prisma.$disconnect());
