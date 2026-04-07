import { z } from 'zod'

const SectorEnum = z.enum([
  'BANKING',
  'ENERGY',
  'AGRICULTURE',
  'TECHNOLOGY',
  'CURRENCY',
  'BONDS',
  'REAL_ESTATE',
  'GENERAL',
])

export const AlertPreferenceSchema = z.object({
  sectors: z.array(SectorEnum).default([]),
  minImpact: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('HIGH'),
  enabled: z.boolean().default(true),
})

export type AlertPreferenceInput = z.infer<typeof AlertPreferenceSchema>
