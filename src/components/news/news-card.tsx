'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ImpactBadge } from './impact-badge'
import { SentimentBadge } from './sentiment-badge'
import { SectorTag } from './sector-tag'
import { formatDate } from '@/lib/utils'
import type { NewsArticle } from '@/types'

const SOURCE_LABELS: Record<string, string> = {
  AMBITO: 'Ámbito',
  CRONISTA: 'El Cronista',
  REUTERS: 'Reuters',
  INVESTING: 'Investing',
  OTHER: 'Otro',
}

interface NewsCardProps {
  article: NewsArticle
  index?: number
}

export function NewsCard({ article, index = 0 }: NewsCardProps) {
  const isImportant = article.isImportant

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
    >
      <Link href={`/news/${article.slug}`} className="block group">
        <article
          className={`
            relative bg-white border transition-shadow duration-200 p-5
            ${isImportant
              ? 'border-l-[3px] border-l-black border-t-zinc-200 border-r-zinc-200 border-b-zinc-200 shadow-sm hover:shadow-md'
              : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
            }
          `}
        >
          {isImportant && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-black">
                Importante
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <span className="font-medium text-zinc-600">{SOURCE_LABELS[article.source] ?? article.source}</span>
            <span>·</span>
            <time dateTime={article.publishedAt.toISOString()}>
              {formatDate(article.publishedAt, true)}
            </time>
          </div>

          <h2 className="text-base font-semibold leading-snug text-black group-hover:text-zinc-700 transition-colors line-clamp-2 mb-2">
            {article.title}
          </h2>

          {article.summary && (
            <p className="text-sm text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
              {article.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {article.impact && <ImpactBadge impact={article.impact} size="sm" />}
            {article.sentiment && <SentimentBadge sentiment={article.sentiment} />}
            {article.sector && <SectorTag sector={article.sector} />}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
