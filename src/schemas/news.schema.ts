import { z } from 'zod'

export const NewsFiltersSchema = z.object({
  sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  sector: z
    .enum(['BANKING', 'ENERGY', 'AGRICULTURE', 'TECHNOLOGY', 'CURRENCY', 'BONDS', 'REAL_ESTATE', 'GENERAL'])
    .optional(),
  source: z.enum(['AMBITO', 'CRONISTA', 'REUTERS', 'INVESTING', 'OTHER']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const ParsedArticleSchema = z.object({
  title: z.string().min(1).max(500),
  url: z.string().url(),
  summary: z.string().max(2000).nullable(),
  publishedAt: z.date(),
  source: z.enum(['AMBITO', 'CRONISTA', 'REUTERS', 'INVESTING', 'OTHER']),
})

export type NewsFiltersInput = z.infer<typeof NewsFiltersSchema>
export type ParsedArticleInput = z.infer<typeof ParsedArticleSchema>
