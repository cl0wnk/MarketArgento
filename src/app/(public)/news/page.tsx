import type { Metadata } from 'next'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { NewsFiltersSchema } from '@/schemas/news.schema'
import { NewsFeed } from '@/components/news/news-feed'
import { NewsFilters } from '@/components/news/news-filters'
import { NewsCardSkeleton } from '@/components/news/news-card-skeleton'
import { Pagination } from '@/components/news/pagination'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Noticias — Mercado Financiero Argentino',
  description: 'Las noticias más importantes del mercado financiero argentino con análisis de impacto en tiempo real.',
}

export const revalidate = 60

interface PageProps {
  searchParams: {
    sentiment?: string
    impact?: string
    sector?: string
    source?: string
    page?: string
  }
}

async function NewsContent({ searchParams }: PageProps) {
  const filters = NewsFiltersSchema.parse(searchParams)
  const skip = (filters.page - 1) * filters.limit

  const where = {
    ...(filters.sentiment && { sentiment: filters.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }),
    ...(filters.impact && { impact: filters.impact as 'LOW' | 'MEDIUM' | 'HIGH' }),
    ...(filters.sector && { sector: filters.sector as 'BANKING' | 'ENERGY' | 'AGRICULTURE' | 'TECHNOLOGY' | 'CURRENCY' | 'BONDS' | 'REAL_ESTATE' | 'GENERAL' }),
    ...(filters.source && { source: filters.source as 'AMBITO' | 'CRONISTA' | 'REUTERS' | 'INVESTING' | 'OTHER' }),
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

  const hasMore = skip + articles.length < total

  return (
    <>
      <NewsFeed articles={articles} />
      <div className="mt-12 py-12 border-t border-black dark:border-white">
        <Pagination page={filters.page} hasMore={hasMore} total={total} />
      </div>
    </>
  )
}

function NewsSkeleton() {
  return (
    <div className="flex flex-col border-t border-black dark:border-white mt-12 animate-mech-fade">
      {Array.from({ length: 6 }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function NewsPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Manifest Header */}
        <header className="mb-24 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] px-2 py-1 bg-black text-white dark:bg-white dark:text-black">
              LIVE FEED
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
              UPDATED EVERY 60S
            </span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-black dark:text-white">
            Mercado<br />
            Argento.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-[4px] border-black dark:border-white pt-8">
            <p className="font-serif text-xl md:text-2xl leading-tight text-black dark:text-white max-w-md">
              High-impact financial news filtered by AI for immediate market decisions.
            </p>
            <div className="flex flex-col justify-end">
              <p className="font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
                Tracking: USD, MERVAL, BONDS, ENERGY & CRYPTO.
              </p>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm -mx-6 px-6 py-4 border-y border-black/10 dark:border-white/10 mb-12">
          <Suspense fallback={null}>
            <NewsFilters />
          </Suspense>
        </div>

        {/* Content */}
        <div className="relative">
          <Suspense fallback={<NewsSkeleton />}>
            <NewsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      {/* Footer Manifesto */}
      <footer className="bg-black text-white dark:bg-white dark:text-black py-24 px-6 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-display text-4xl font-black uppercase">ARGENTO.</span>
            <p className="font-serif text-lg opacity-60 max-w-xs">
              Direct. Decisive. Monochrome. The financial pulse of Argentina.
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
            <span>&copy; 2026 MARKETARGENTO.COM</span>
            <span>DATA SOURCE: REUTERS, AMBITO, CRONISTA.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
