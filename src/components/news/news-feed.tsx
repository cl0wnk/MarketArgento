'use client'

import { motion } from 'framer-motion'
import { NewsCardPro } from './news-card-pro'
import { EmptyState } from './empty-state'
import type { NewsArticle } from '@/types'

interface NewsFeedProps {
  articles: NewsArticle[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      ease: [0.19, 1, 0.22, 1]
    },
  },
}

export function NewsFeed({ articles }: NewsFeedProps) {
  if (articles.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col border-t border-black dark:border-white mt-12"
    >
      {articles.map((article, index) => (
        <NewsCardPro 
          key={article.id} 
          article={article} 
          priority={index < 2} 
        />
      ))}
    </motion.div>
  )
}
