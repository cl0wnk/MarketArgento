"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { NewsArticle } from "@/types"
import { Badge } from "@/components/ui/badge"
import { SentimentIndicator } from "./sentiment-indicator"
import { formatDate, cn } from "@/lib/utils"

interface NewsCardProProps {
  article: NewsArticle
  priority?: boolean
}

export function NewsCardPro({ article, priority = false }: NewsCardProProps) {
  const isHighImpact = article.impact === "HIGH"
  const isNeutral = article.sentiment === "NEUTRAL"
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className={cn(
        "group relative border-b border-black/10 dark:border-white/10 py-8 first:pt-0",
        isHighImpact && "py-12"
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Metadata Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
              {article.source.replace("_", " ")}
            </span>
            <span className="w-1 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
              {formatDate(article.publishedAt, true)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <SentimentIndicator sentiment={article.sentiment} />
            {article.impact && (
              <Badge variant={article.impact.toLowerCase() as any}>
                {article.impact} IMPACT
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4">
          <Link 
            href={`/news/${article.slug}`}
            className="group/title block"
          >
            <h2 className={cn(
              "font-display leading-[1.1] tracking-[-0.02em] transition-all duration-200",
              isHighImpact 
                ? "text-4xl md:text-5xl lg:text-6xl font-black uppercase" 
                : "text-2xl md:text-3xl font-bold",
              "group-hover/title:bg-black group-hover/title:text-white dark:group-hover/title:bg-white dark:group-hover/title:text-black inline-block px-1 -mx-1"
            )}>
              {article.title}
            </h2>
          </Link>
          
          {article.summary && (
            <p className={cn(
              "font-serif leading-relaxed text-black/70 dark:text-white/70 max-w-2xl",
              isHighImpact ? "text-lg md:text-xl" : "text-base"
            )}>
              {article.summary}
            </p>
          )}
        </div>

        {/* Tags / Footer */}
        {article.sector && (
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-black/60 dark:text-white/60">
              #{article.sector}
            </span>
            {article.isImportant && (
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-black text-white dark:bg-white dark:text-black">
                IMPORTANT
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interactive Overlay for whole card if needed, but we use title link mainly */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-[8px] uppercase tracking-tighter">
          READ ARTICLE →
        </span>
      </div>
    </motion.article>
  )
}
