import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, API_RATE_LIMIT, CRON_RATE_LIMIT } from '@/lib/rate-limit'

const { auth } = NextAuth(authConfig)

export default auth(async (req: any) => {
  const { nextUrl, ip = '127.0.0.1' } = req

  // 1. CRON Security
  if (nextUrl.pathname.startsWith('/api/cron')) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized Cron Access', { status: 401 })
    }

    // Rate limit cron to prevent abuse
    const { success } = await rateLimit(`cron-${ip}`, CRON_RATE_LIMIT)
    if (!success) {
      return new NextResponse('Cron Rate Limit Exceeded', { status: 429 })
    }
  }

  // 2. Global API Rate Limiting
  if (nextUrl.pathname.startsWith('/api/') && !nextUrl.pathname.startsWith('/api/auth')) {
    const { success, remaining, resetAt } = await rateLimit(`api-${ip}`, API_RATE_LIMIT)
    
    if (!success) {
      return new NextResponse('API Rate Limit Exceeded', { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': API_RATE_LIMIT.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAt.toString(),
        }
      })
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|icons).*)',
  ],
}
