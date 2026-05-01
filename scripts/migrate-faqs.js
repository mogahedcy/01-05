const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function migrateFAQs() {
  try {
    console.log('🔄 Generating Prisma Client...');
    await execAsync('bunx prisma generate');
    console.log('✅ Prisma Client generated successfully');
    
    console.log('🔄 Pushing schema to database...');
    const { stdout, stderr } = await execAsync('bunx prisma db push --accept-data-loss');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Database schema updated successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrateFAQs();
