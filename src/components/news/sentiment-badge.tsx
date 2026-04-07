import { Badge } from '@/components/ui/badge'

interface SentimentBadgeProps {
  sentiment: string
}

const SENTIMENT_CONFIG = {
  POSITIVE: { label: 'Positivo', variant: 'positive' as const },
  NEGATIVE: { label: 'Negativo', variant: 'negative' as const },
  NEUTRAL: { label: 'Neutral', variant: 'neutral' as const },
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const config = SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG]
  if (!config) return null
  return <Badge variant={config.variant}>{config.label}</Badge>
}
