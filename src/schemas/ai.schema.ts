import { z } from 'zod'

export const AIAnalysisSchema = z.object({
  sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  sector: z.enum([
    'BANKING',
    'ENERGY',
    'AGRICULTURE',
    'TECHNOLOGY',
    'CURRENCY',
    'BONDS',
    'REAL_ESTATE',
    'GENERAL',
  ]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().max(500),
  keywords: z.array(z.string().max(50)).max(10),
})

export type AIAnalysisOutput = z.infer<typeof AIAnalysisSchema>
