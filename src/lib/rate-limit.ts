// Simple in-memory rate limiter with optional Upstash Redis backend
interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  limit: number
  resetAt: number
}

function cleanupStore() {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 20, windowMs: 60_000 }
): Promise<RateLimitResult> {
  // Try Upstash if configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
      const limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.limit, `${config.windowMs}ms`),
      })
      const result = await limiter.limit(identifier)
      return {
        success: result.success,
        remaining: result.remaining,
        limit: result.limit,
        resetAt: result.reset,
      }
    } catch {
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  if (store.size > 10000) cleanupStore()

  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    const newEntry = { count: 1, resetAt: now + config.windowMs }
    store.set(identifier, newEntry)
    return { success: true, remaining: config.limit - 1, limit: config.limit, resetAt: newEntry.resetAt }
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, limit: config.limit, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: config.limit - entry.count, limit: config.limit, resetAt: entry.resetAt }
}

export const API_RATE_LIMIT: RateLimitConfig = { limit: 20, windowMs: 60_000 }
export const ACTION_RATE_LIMIT: RateLimitConfig = { limit: 10, windowMs: 60_000 }
export const CRON_RATE_LIMIT: RateLimitConfig = { limit: 2, windowMs: 60_000 }
