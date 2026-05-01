const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.projects.findMany({
    include: {
      _count: {
        select: { media_items: true }
      }
    }
  });

  const multiMediaProjects = projects.filter(p => p._count.media_items > 1);
  
  console.log(`Total projects: ${projects.length}`);
  console.log(`Projects with multiple media items: ${multiMediaProjects.length}`);
  
  if (multiMediaProjects.length > 0) {
    console.log('Sample multi-media project:');
    console.log(JSON.stringify(multiMediaProjects[0], null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
