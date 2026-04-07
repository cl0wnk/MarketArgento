import type { NewsArticle as PrismaArticle, Source, Sentiment, Impact, Sector } from '@prisma/client'

export type { Source, Sentiment, Impact, Sector }

export type NewsArticle = PrismaArticle

export interface NewsFilters {
  sentiment?: Sentiment
  impact?: Impact
  sector?: Sector
  source?: Source
  page?: number
  limit?: number
}

export interface ParsedArticle {
  title: string
  url: string
  summary: string | null
  publishedAt: Date
  source: Source
}

export interface AIAnalysis {
  sentiment: Sentiment
  impact: Impact
  sector: Sector
  confidence: number
  reasoning: string
  keywords: string[]
}

export interface NewsStats {
  totalToday: number
  highImpactCount: number
  alertsSentToday: number
  lastUpdated: Date
}

export interface PaginatedNews {
  articles: NewsArticle[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
