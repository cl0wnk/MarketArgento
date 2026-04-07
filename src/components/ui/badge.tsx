import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-widest transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-black text-white px-2 py-0.5',
        outline: 'border border-black text-black px-2 py-0.5 dark:border-white dark:text-white',
        high: 'bg-black text-white px-2.5 py-1 dark:bg-white dark:text-black',
        medium: 'border-[1.5px] border-black text-black px-2.5 py-1 dark:border-white dark:text-white',
        low: 'border border-black/20 text-black/50 px-2.5 py-1 dark:border-white/20 dark:text-white/50',
        sentiment_pos: 'bg-black text-white px-1.5 py-0.5 dark:bg-white dark:text-black',
        sentiment_neg: 'border border-black text-black px-1.5 py-0.5 dark:border-white dark:text-white',
        sentiment_neu: 'text-black/40 px-1.5 py-0.5 dark:text-white/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ borderRadius: 0 }}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
