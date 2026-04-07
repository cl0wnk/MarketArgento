import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AlertPreferenceSchema } from '@/schemas/alerts.schema'
import { rateLimit, ACTION_RATE_LIMIT } from '@/lib/rate-limit'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rl = await rateLimit(session.user.id, ACTION_RATE_LIMIT)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = AlertPreferenceSchema.parse(body)

    const preference = await db.alertPreference.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { userId: session.user.id, ...data },
    })

    return NextResponse.json({ success: true, preference })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
