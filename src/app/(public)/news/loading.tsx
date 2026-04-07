import { NewsCardSkeleton } from '@/components/news/news-card-skeleton'

export default function NewsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 pb-6 border-b border-zinc-100">
        <div className="h-3 w-32 bg-zinc-100 animate-pulse mb-3" />
        <div className="h-7 w-56 bg-zinc-100 animate-pulse mb-2" />
        <div className="h-4 w-80 bg-zinc-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
