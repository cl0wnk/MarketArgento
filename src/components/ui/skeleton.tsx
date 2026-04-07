import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'block' | 'circle'
}

function Skeleton({ className, variant = 'block', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-zinc-100',
        variant === 'text' && 'h-4 w-full',
        variant === 'circle' && 'rounded-full',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
