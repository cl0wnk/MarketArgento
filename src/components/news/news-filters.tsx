'use client'

import { useNewsFilters } from '@/hooks/use-news-filters'
import { SharpButton } from '@/components/ui/sharp-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function NewsFilters() {
  const { filters, hasFilters, setFilter, clearFilters } = useNewsFilters()

  const filterConfigs = [
    { 
      id: 'impact', 
      label: 'IMPACT', 
      options: [
        { value: 'HIGH', label: 'HIGH' },
        { value: 'MEDIUM', label: 'MEDIUM' },
        { value: 'LOW', label: 'LOW' }
      ] 
    },
    { 
      id: 'sentiment', 
      label: 'SENTIMENT', 
      options: [
        { value: 'POSITIVE', label: 'POSITIVE' },
        { value: 'NEGATIVE', label: 'NEGATIVE' },
        { value: 'NEUTRAL', label: 'NEUTRAL' }
      ] 
    },
    { 
      id: 'sector', 
      label: 'SECTOR', 
      options: [
        { value: 'BANKING', label: 'BANKING' },
        { value: 'ENERGY', label: 'ENERGY' },
        { value: 'AGRICULTURE', label: 'AGRICULTURE' },
        { value: 'TECHNOLOGY', label: 'TECH' },
        { value: 'CURRENCY', label: 'FX' },
        { value: 'BONDS', label: 'BONDS' },
        { value: 'REAL_ESTATE', label: 'REAL ESTATE' },
        { value: 'GENERAL', label: 'GENERAL' }
      ] 
    },
    { 
      id: 'source', 
      label: 'SOURCE', 
      options: [
        { value: 'AMBITO', label: 'AMBITO' },
        { value: 'CRONISTA', label: 'CRONISTA' },
        { value: 'REUTERS', label: 'REUTERS' },
        { value: 'INVESTING', label: 'INVESTING' }
      ] 
    }
  ]

  return (
    <div className="flex flex-wrap items-center gap-4">
      {filterConfigs.map((cfg) => (
        <div key={cfg.id} className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">
            {cfg.label}:
          </span>
          <Select
            value={(filters as any)[cfg.id] ?? ''}
            onValueChange={(v) => setFilter(cfg.id as any, v || undefined)}
          >
            <SelectTrigger className="w-auto min-w-[100px] h-7 px-2 font-mono text-[10px] uppercase tracking-widest bg-transparent border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors">
              <SelectValue placeholder="ALL" />
            </SelectTrigger>
            <SelectContent className="border-black dark:border-white bg-white dark:bg-black">
              <SelectItem value="ALL" className="font-mono text-[10px] uppercase">ALL</SelectItem>
              {cfg.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-mono text-[10px] uppercase tracking-wider">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {hasFilters && (
        <SharpButton 
          variant="outline" 
          size="sm" 
          onClick={clearFilters} 
          className="h-7 px-2 text-[9px]"
        >
          CLEAR FILTERS [X]
        </SharpButton>
      )}
    </div>
  )
}
