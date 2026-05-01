import { prisma } from './prisma';

export interface CacheStatus {
  lastUpdate: string;
  hasNewContent: boolean;
  contentType: 'projects' | 'articles' | 'faqs' | 'reviews';
}

/**
 * Check if there's new content in a specific category
 * Returns the timestamp of the most recent content update
 */
export async function checkForNewContent(
  contentType: 'projects' | 'articles' | 'faqs' | 'reviews',
  categoryFilter?: any
): Promise<CacheStatus> {
  try {
    let lastUpdate: Date | null = null;

    // ✅ Extract category name from categoryFilter for non-project tables
    const categoryName = categoryFilter?.category?.contains || null;

    switch (contentType) {
      case 'projects':
        const latestProject = await prisma.projects.findFirst({
          where: {
            status: 'PUBLISHED',
            ...categoryFilter
          },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true }
        });
        lastUpdate = latestProject?.updatedAt || null;
        break;

      case 'articles':
        // ✅ Use only 'category' field for articles (not description)
        const latestArticle = await prisma.articles.findFirst({
          where: {
            status: 'PUBLISHED',
            ...(categoryName ? { category: { contains: categoryName } } : {})
          },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true }
        });
        lastUpdate = latestArticle?.updatedAt || null;
        break;

      case 'faqs':
        const latestFaq = await prisma.faqs.findFirst({
          where: {
            status: 'PUBLISHED',
            ...(categoryName ? { category: { contains: categoryName } } : {})
          },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true }
        });
        lastUpdate = latestFaq?.updatedAt || null;
        break;

      case 'reviews':
        // ✅ Comments table only has 'projectId' - don't use category filter
        const latestReview = await prisma.comments.findFirst({
          where: {
            status: 'APPROVED'
          },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });
        lastUpdate = latestReview?.createdAt || null;
        break;
    }

    return {
      lastUpdate: lastUpdate?.toISOString() || new Date().toISOString(),
      hasNewContent: !!lastUpdate,
      contentType
    };
  } catch (error) {
    console.error(`Error checking ${contentType} cache:`, error);
    return {
      lastUpdate: new Date().toISOString(),
      hasNewContent: false,
      contentType
    };
  }
}

/**
 * Get all content updates for a service page
 */
export async function getServiceContentUpdates(categoryFilter: any) {
  const [projectsUpdate, articlesUpdate, faqsUpdate, reviewsUpdate] = await Promise.all([
    checkForNewContent('projects', categoryFilter),
    checkForNewContent('articles', categoryFilter),
    checkForNewContent('faqs', categoryFilter),
    checkForNewContent('reviews', categoryFilter)
  ]);

  // Return the most recent update across all content types
  const allUpdates = [
    projectsUpdate.lastUpdate,
    articlesUpdate.lastUpdate,
    faqsUpdate.lastUpdate,
    reviewsUpdate.lastUpdate
  ];

  const mostRecentUpdate = allUpdates.sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )[0];

  return {
    mostRecentUpdate,
    projects: projectsUpdate,
    articles: articlesUpdate,
    faqs: faqsUpdate,
    reviews: reviewsUpdate
  };
}
