import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { ImpactBadge } from '@/components/news/impact-badge'
import { SentimentBadge } from '@/components/news/sentiment-badge'
import { SectorTag } from '@/components/news/sector-tag'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

const SOURCE_LABELS: Record<string, string> = {
  AMBITO: 'Ámbito Financiero',
  CRONISTA: 'El Cronista',
  REUTERS: 'Reuters LatAm',
  INVESTING: 'Investing.com',
  OTHER: 'Otro',
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await db.newsArticle.findUnique({ where: { slug: params.slug } })
  if (!article) return { title: 'Noticia no encontrada' }
  return {
    title: article.title,
    description: article.summary ?? article.title,
    openGraph: {
      title: article.title,
      description: article.summary ?? '',
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await db.newsArticle.findUnique({ where: { slug: params.slug } })
  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-zinc-400 flex items-center gap-2">
        <Link href="/news" className="hover:text-black transition-colors">Noticias</Link>
        <span>›</span>
        <span className="truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Source & date */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-black hover:underline"
        >
          {SOURCE_LABELS[article.source] ?? article.source}
        </a>
        <span>·</span>
        <time dateTime={article.publishedAt.toISOString()}>
          {formatDate(article.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-black mb-6">
        {article.title}
      </h1>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-zinc-100">
        {article.impact && <ImpactBadge impact={article.impact} />}
        {article.sentiment && <SentimentBadge sentiment={article.sentiment} />}
        {article.sector && <SectorTag sector={article.sector} />}
      </div>

      {/* AI Analysis card */}
      {article.processed && (
        <div className="border border-zinc-200 p-5 mb-8 bg-zinc-50">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Análisis IA
          </p>
          {article.reasoning && (
            <p className="text-sm text-zinc-600 leading-relaxed mb-4">{article.reasoning}</p>
          )}
          {article.confidence !== null && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Confianza del análisis</span>
                <span className="text-xs font-mono font-semibold">{Math.round((article.confidence ?? 0) * 100)}%</span>
              </div>
              <div className="h-1 bg-zinc-200 w-full">
                <div
                  className="h-1 bg-black transition-all duration-500"
                  style={{ width: `${Math.round((article.confidence ?? 0) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.keywords.map((kw) => (
                <span key={kw} className="font-mono text-xs border border-zinc-300 text-zinc-500 px-2 py-0.5">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {article.summary && (
        <div className="prose-sm max-w-none">
          <p className="text-base text-zinc-700 leading-relaxed border-l-3 border-zinc-300 pl-4">
            {article.summary}
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 pt-8 border-t border-zinc-100">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-black border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-150"
        >
          Leer nota completa en {SOURCE_LABELS[article.source] ?? article.source} →
        </a>
      </div>
    </div>
  )
}
