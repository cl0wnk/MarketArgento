import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 100)
}

export function formatDate(date: Date | string, relative = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (relative) {
    return formatDistanceToNow(d, { addSuffix: true, locale: es })
  }
  return format(d, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function getImpactWeight(impact: string): number {
  const weights: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }
  return weights[impact] ?? 0
}

export function generateSlug(title: string): string {
  const base = slugify(title)
  const timestamp = Date.now().toString(36)
  return `${base}-${timestamp}`
}
