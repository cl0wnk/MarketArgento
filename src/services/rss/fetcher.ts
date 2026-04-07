import { RSS_CONFIG } from '@/config/rss.config'
import type { RSSSource } from './sources'

export async function fetchRSSFeed(source: RSSSource): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RSS_CONFIG.timeout)

    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': RSS_CONFIG.userAgent,
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`RSS fetch failed for ${source.name}: HTTP ${response.status}`)
      return null
    }

    return await response.text()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`RSS fetch timeout for ${source.name}`)
    } else {
      console.error(`RSS fetch error for ${source.name}:`, error)
    }
    return null
  }
}
