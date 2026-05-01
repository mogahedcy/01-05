import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// تحميل DATABASE_URL من المتغيرات البيئية
const getDatabaseUrl = () => {
  const url = process.env.NEON_DATABASE_URL || 
              process.env.DATABASE_URL || 
              process.env.POSTGRES_PRISMA_URL || 
              process.env.POSTGRES_URL;
  
  if (!url) {
    console.warn('⚠️ DATABASE_URL is not defined - using mock/fallback mode');
    return 'postgresql://localhost:5432/aldeyarksa';
  }
  
  return url;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
