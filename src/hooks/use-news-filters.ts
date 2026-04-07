'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export interface NewsFilterState {
  sentiment?: string
  impact?: string
  sector?: string
  source?: string
}

export function useNewsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters: NewsFilterState = {
    sentiment: searchParams.get('sentiment') ?? undefined,
    impact: searchParams.get('impact') ?? undefined,
    sector: searchParams.get('sector') ?? undefined,
    source: searchParams.get('source') ?? undefined,
  }

  const hasFilters = Object.values(filters).some(Boolean)

  const setFilter = useCallback(
    (key: keyof NewsFilterState, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return { filters, hasFilters, setFilter, clearFilters }
}
