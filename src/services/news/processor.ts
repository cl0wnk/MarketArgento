import { db } from '@/lib/db'
import { RSS_SOURCES } from '@/services/rss/sources'
import { fetchRSSFeed } from '@/services/rss/fetcher'
import { parseRSSFeed } from '@/services/rss/parser'
import { analyzeArticle } from '@/services/ai/analyzer'
import { dispatchHighImpactAlerts } from '@/services/email/alert-dispatcher'
import { generateSlug } from '@/lib/utils'
import type { ParsedArticle } from '@/types'

const AI_DELAY_MS = 300 // Prevent OpenAI rate limiting

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface ProcessingStats {
  fetched: number
  newArticles: number
  analyzed: number
  alertsSent: number
  errors: number
}

export async function fetchAndProcessNews(): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    fetched: 0,
    newArticles: 0,
    analyzed: 0,
    alertsSent: 0,
    errors: 0,
  }

  // Step 1: Fetch all RSS feeds in parallel
  const fetchResults = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      const xml = await fetchRSSFeed(source)
      if (!xml) return []
      return parseRSSFeed(xml, source)
    })
  )

  const allParsedArticles: ParsedArticle[] = []
  for (const result of fetchResults) {
    if (result.status === 'fulfilled') {
      allParsedArticles.push(...result.value)
    } else {
      stats.errors++
    }
  }

  stats.fetched = allParsedArticles.length

  if (allParsedArticles.length === 0) return stats

  // Step 2: Deduplicate against database
  const urls = allParsedArticles.map((a) => a.url)
  const existingArticles = await db.newsArticle.findMany({
    where: { url: { in: urls } },
    select: { url: true },
  })
  const existingUrls = new Set(existingArticles.map((a) => a.url))

  const newArticles = allParsedArticles.filter((a) => !existingUrls.has(a.url))
  stats.newArticles = newArticles.length

  if (newArticles.length === 0) return stats

  // Step 3: Insert new articles (unprocessed)
  const insertedArticles = await Promise.allSettled(
    newArticles.map((article) =>
      db.newsArticle.create({
        data: {
          title: article.title,
          summary: article.summary,
          url: article.url,
          slug: generateSlug(article.title),
          publishedAt: article.publishedAt,
          source: article.source,
          keywords: [],
          processed: false,
          isImportant: false,
        },
      })
    )
  )

  const createdArticles = insertedArticles
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<typeof r extends PromiseFulfilledResult<infer T> ? T : never>).value)

  // Step 4: AI analysis + alert dispatch (sequential to respect rate limits)
  for (const article of createdArticles) {
    try {
      await sleep(AI_DELAY_MS)

      const analysis = await analyzeArticle(article.title, article.summary)

      if (!analysis) {
        await db.newsArticle.update({
          where: { id: article.id },
          data: { processed: true },
        })
        continue
      }

      const isImportant = analysis.impact === 'HIGH' ||
        (analysis.impact === 'MEDIUM' && analysis.confidence > 0.85)

      const updated = await db.newsArticle.update({
        where: { id: article.id },
        data: {
          sentiment: analysis.sentiment,
          impact: analysis.impact,
          sector: analysis.sector,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
          keywords: analysis.keywords,
          processed: true,
          isImportant,
        },
      })

      stats.analyzed++

      // Step 5: Dispatch alerts for important articles
      if (isImportant) {
        const alertsSent = await dispatchHighImpactAlerts(updated)
        stats.alertsSent += alertsSent
      }
    } catch (error) {
      console.error(`Error processing article ${article.id}:`, error)
      stats.errors++
    }
  }

  return stats
}
