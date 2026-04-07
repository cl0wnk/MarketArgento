import { Sentiment } from "@prisma/client"
import { cn } from "@/lib/utils"

interface SentimentIndicatorProps {
  sentiment: Sentiment | null
  className?: string
}

export function SentimentIndicator({ sentiment, className }: SentimentIndicatorProps) {
  if (!sentiment) return null

  const config = {
    POSITIVE: { label: "+", color: "text-black dark:text-white" },
    NEGATIVE: { label: "-", color: "text-black dark:text-white" },
    NEUTRAL: { label: "=", color: "text-black/40 dark:text-white/40" },
  }

  const { label, color } = sentiment ? config[sentiment as keyof typeof config] : config.NEUTRAL

  return (
    <div className={cn(
      "flex items-center justify-center w-5 h-5 border border-black/10 dark:border-white/10 font-mono font-bold text-sm",
      color,
      className
    )}>
      {label}
    </div>
  )
}
