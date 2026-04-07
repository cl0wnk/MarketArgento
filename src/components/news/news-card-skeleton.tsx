import { Skeleton } from '@/components/ui/skeleton'

export function NewsCardSkeleton() {
  return (
    <div className="border-b border-black/10 dark:border-white/10 py-8 first:pt-0 space-y-6">
      {/* Metadata Row Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-2 w-20 bg-black/5 dark:bg-white/5" />
          <div className="w-1 h-1 bg-black/5 dark:bg-white/5 rounded-full" />
          <Skeleton className="h-2 w-24 bg-black/5 dark:bg-white/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-black/5 dark:bg-white/5" />
          <Skeleton className="h-5 w-24 bg-black/5 dark:bg-white/5" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-black/5 dark:bg-white/5" />
        <Skeleton className="h-12 w-3/4 bg-black/5 dark:bg-white/5" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full bg-black/5 dark:bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-black/5 dark:bg-white/5" />
        </div>
      </div>

      {/* Tags Footer Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 bg-black/5 dark:bg-white/5" />
        <Skeleton className="h-6 w-20 bg-black/5 dark:bg-white/5" />
      </div>
    </div>
  )
}
