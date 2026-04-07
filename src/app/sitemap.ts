import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const articles = await db.newsArticle.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
    take: 1000,
  })

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'never',
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    ...articleUrls,
  ]
}
