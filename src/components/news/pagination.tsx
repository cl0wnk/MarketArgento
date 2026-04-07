'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  hasMore: boolean
  total: number
}

export function Pagination({ page, hasMore, total }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (page === 1 && !hasMore) return null

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(page - 1)}
          disabled={page <= 1}
        >
          ← Anterior
        </Button>
      </motion.div>

      <span className="text-xs font-mono text-zinc-400">
        Página {page}
      </span>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(page + 1)}
          disabled={!hasMore}
        >
          Siguiente →
        </Button>
      </motion.div>
    </div>
  )
}
