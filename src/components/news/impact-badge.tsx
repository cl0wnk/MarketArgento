import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ImpactBadgeProps {
  impact: string
  size?: 'sm' | 'md'
}

const IMPACT_CONFIG = {
  HIGH: { label: 'Alto', variant: 'high' as const },
  MEDIUM: { label: 'Medio', variant: 'medium' as const },
  LOW: { label: 'Bajo', variant: 'low' as const },
}

export function ImpactBadge({ impact, size = 'md' }: ImpactBadgeProps) {
  const config = IMPACT_CONFIG[impact as keyof typeof IMPACT_CONFIG]
  if (!config) return null

  return (
    <Badge
      variant={config.variant}
      className={cn(size === 'sm' && 'text-xs px-1.5 py-0')}
    >
      {config.label}
    </Badge>
  )
}
