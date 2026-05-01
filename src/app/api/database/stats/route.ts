import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateAdmin } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);

    const databaseStats = await prisma.$queryRaw<any[]>`
      SELECT 
        pg_database.datname as database_name,
        pg_size_pretty(pg_database_size(pg_database.datname)) as size,
        pg_database_size(pg_database.datname) as size_bytes
      FROM pg_database
      WHERE datname = current_database();
    `;

    const tableStats = await prisma.$queryRaw<any[]>`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10;
    `;

    const projectsCount = await prisma.projects.count();
    const articlesCount = await prisma.articles.count();
    const commentsCount = await prisma.comments.count();
    const articleCommentsCount = await prisma.article_comments.count();
    const adminsCount = await prisma.admins.count();
    
    const mediaItemsCount = await prisma.media_items.count();
    const articleMediaCount = await prisma.article_media_items.count();

    const totalRecords = 
      projectsCount + 
      articlesCount + 
      commentsCount + 
      articleCommentsCount + 
      adminsCount + 
      mediaItemsCount + 
      articleMediaCount;

    const dbSize = Number(databaseStats[0]?.size_bytes || 0);
    const neonFreeTierLimit = 512 * 1024 * 1024;
    const usagePercentage = ((dbSize / neonFreeTierLimit) * 100).toFixed(2);

    return NextResponse.json({
      success: true,
      database: {
        name: databaseStats[0]?.database_name || 'unknown',
        size: databaseStats[0]?.size || '0 bytes',
        sizeBytes: dbSize,
        limit: '512 MB',
        limitBytes: neonFreeTierLimit,
        available: `${((neonFreeTierLimit - dbSize) / (1024 * 1024)).toFixed(2)} MB`,
        availableBytes: neonFreeTierLimit - dbSize,
        usagePercentage: Number.parseFloat(usagePercentage)
      },
      records: {
        total: totalRecords,
        projects: projectsCount,
        articles: articlesCount,
        comments: commentsCount,
        articleComments: articleCommentsCount,
        admins: adminsCount,
        mediaItems: mediaItemsCount,
        articleMedia: articleMediaCount
      },
      tables: tableStats.map((table: any) => ({
        name: table.tablename,
        size: table.size,
        sizeBytes: Number(table.size_bytes)
      }))
    });

  } catch (error: unknown) {
    const errorMessage = String(error);
    console.error('❌ Database Stats Error:', errorMessage, error);
    
    // إرجاع الخطأ الفعلي لتسهيل التشخيص بدلاً من إخفائه تحت 401
    return NextResponse.json(
      { 
        error: 'حدث خطأ في جلب إحصائيات قاعدة البيانات',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
