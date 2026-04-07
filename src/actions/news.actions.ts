'use server'

import { db } from '@/lib/db'
import { NewsFiltersSchema } from '@/schemas/news.schema'
import type { NewsFilters, PaginatedNews } from '@/types'

export async function getNewsArticles(filters: NewsFilters = {}): Promise<PaginatedNews> {
  const parsed = NewsFiltersSchema.parse(filters)
  const skip = (parsed.page - 1) * parsed.limit

  const where = {
    ...(parsed.sentiment && { sentiment: parsed.sentiment }),
    ...(parsed.impact && { impact: parsed.impact }),
    ...(parsed.sector && { sector: parsed.sector }),
    ...(parsed.source && { source: parsed.source }),
  }

  const [articles, total] = await Promise.all([
    db.newsArticle.findMany({
      where,
      orderBy: [{ isImportant: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take: parsed.limit,
    }),
    db.newsArticle.count({ where }),
  ])

  return {
    articles,
    total,
    page: parsed.page,
    limit: parsed.limit,
    hasMore: skip + articles.length < total,
  }
}

export async function getArticleBySlug(slug: string) {
  return db.newsArticle.findUnique({ where: { slug } })
}

export async function getNewsStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalToday, highImpactCount] = await Promise.all([
    db.newsArticle.count({ where: { createdAt: { gte: today } } }),
    db.newsArticle.count({ where: { impact: 'HIGH', createdAt: { gte: today } } }),
  ])

  return { totalToday, highImpactCount, lastUpdated: new Date() }
}
