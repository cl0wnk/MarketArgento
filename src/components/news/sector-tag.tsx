import { cn } from '@/lib/utils'

interface SectorTagProps {
  sector: string
  className?: string
}

const SECTOR_LABELS: Record<string, string> = {
  BANKING: 'Banca',
  ENERGY: 'Energía',
  AGRICULTURE: 'Agro',
  TECHNOLOGY: 'Tech',
  CURRENCY: 'Divisas',
  BONDS: 'Bonos',
  REAL_ESTATE: 'Inmobiliario',
  GENERAL: 'General',
}

export function SectorTag({ sector, className }: SectorTagProps) {
  const label = SECTOR_LABELS[sector] ?? sector
  return (
    <span
      className={cn(
        'inline-block border border-zinc-300 text-zinc-500 text-xs font-mono uppercase tracking-wider px-2 py-0.5',
        className
      )}
    >
      {label}
    </span>
  )
}
