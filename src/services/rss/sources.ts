import type { Source } from '@prisma/client'

export interface RSSSource {
  id: Source
  name: string
  url: string
  language: 'es' | 'en'
  category: string
}

export const RSS_SOURCES: RSSSource[] = [
  {
    id: 'AMBITO',
    name: 'Ámbito Financiero',
    url: 'https://www.ambito.com/rss/pages/economia.xml',
    language: 'es',
    category: 'economy',
  },
  {
    id: 'CRONISTA',
    name: 'El Cronista',
    url: 'https://www.cronista.com/files/rss/economia.xml',
    language: 'es',
    category: 'finance',
  },
  {
    id: 'REUTERS',
    name: 'Reuters LatAm',
    url: 'https://feeds.reuters.com/reuters/latamNews',
    language: 'en',
    category: 'international',
  },
  {
    id: 'INVESTING',
    name: 'Investing.com Argentina',
    url: 'https://ar.investing.com/rss/news.rss',
    language: 'es',
    category: 'markets',
  },
]
