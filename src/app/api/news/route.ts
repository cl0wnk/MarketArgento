import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NewsFiltersSchema } from '@/schemas/news.schema'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { getIpAddress } from '@/lib/security/ip'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const ip = getIpAddress(req)
  const rl = await rateLimit(ip, API_RATE_LIMIT)

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.resetAt),
        },
      }
    )
  }

  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams)
    const filters = NewsFiltersSchema.parse(searchParams)
    const skip = (filters.page - 1) * filters.limit

    const where = {
      ...(filters.sentiment && { sentiment: filters.sentiment }),
      ...(filters.impact && { impact: filters.impact }),
      ...(filters.sector && { sector: filters.sector }),
      ...(filters.source && { source: filters.source }),
    }

    const [articles, total] = await Promise.all([
      db.newsArticle.findMany({
        where,
        orderBy: [{ isImportant: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: filters.limit,
      }),
      db.newsArticle.count({ where }),
    ])

    return NextResponse.json({
      articles,
      total,
      page: filters.page,
      limit: filters.limit,
      hasMore: skip + articles.length < total,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
