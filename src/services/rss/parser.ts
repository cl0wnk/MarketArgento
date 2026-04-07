import Parser from 'rss-parser'
import { RSS_CONFIG } from '@/config/rss.config'
import { sanitizeArticle, sanitizeUrl } from '@/lib/security/sanitize'
import type { RSSSource } from './sources'
import type { ParsedArticle } from '@/types'

const parser = new Parser({
  timeout: RSS_CONFIG.timeout,
  headers: { 'User-Agent': RSS_CONFIG.userAgent },
  customFields: {
    item: ['summary', 'description', 'content:encoded'],
  },
})

function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) return null
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return null
    return d
  } catch {
    return null
  }
}

export async function parseRSSFeed(
  xml: string,
  source: RSSSource
): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseString(xml)
    const deduplicationWindow = RSS_CONFIG.deduplicationWindowHours * 60 * 60 * 1000
    const cutoff = new Date(Date.now() - deduplicationWindow)

    const articles: ParsedArticle[] = []
    const seenUrls = new Set<string>()

    for (const item of feed.items.slice(0, RSS_CONFIG.maxArticlesPerFeed)) {
      const url = sanitizeUrl(item.link ?? item.guid ?? '')
      if (!url) continue
      if (seenUrls.has(url)) continue
      seenUrls.add(url)

      const publishedAt = parseDate(item.pubDate ?? item.isoDate)
      if (!publishedAt || publishedAt < cutoff) continue

      const rawSummary =
        item.contentSnippet ??
        item.summary ??
        item.description ??
        null

      const sanitized = sanitizeArticle({
        title: item.title ?? 'Sin título',
        summary: rawSummary,
        url,
      })

      if (!sanitized.title || !sanitized.url) continue

      articles.push({
        title: sanitized.title,
        url: sanitized.url,
        summary: sanitized.summary,
        publishedAt,
        source: source.id,
      })
    }

    return articles
  } catch (error) {
    console.error(`RSS parse error for ${source.name}:`, error)
    return []
  }
}
