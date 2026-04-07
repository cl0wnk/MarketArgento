import { db } from '@/lib/db'
import { sendEmail } from './sender'
import { renderHighImpactAlertEmail } from '@/emails/high-impact-alert'
import type { NewsArticle } from '@/types'
import type { Impact, Sector } from '@prisma/client'

const IMPACT_WEIGHTS: Record<Impact, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 }
const CONCURRENCY_LIMIT = 5

async function processInBatches<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.allSettled(batch.map(fn))
  }
}

export async function dispatchHighImpactAlerts(article: NewsArticle): Promise<number> {
  if (!article.impact) return 0

  const articleImpactWeight = IMPACT_WEIGHTS[article.impact]

  // Find users who should receive this alert
  const preferences = await db.alertPreference.findMany({
    where: {
      enabled: true,
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  })

  const eligibleUsers = preferences.filter((pref) => {
    // Check impact threshold
    const minWeight = IMPACT_WEIGHTS[pref.minImpact]
    if (articleImpactWeight < minWeight) return false

    // Check sector filter (empty array = all sectors)
    if (pref.sectors.length > 0 && article.sector) {
      if (!pref.sectors.includes(article.sector as Sector)) return false
    }

    return true
  })

  if (eligibleUsers.length === 0) return 0

  let sentCount = 0

  await processInBatches(eligibleUsers, CONCURRENCY_LIMIT, async (pref) => {
    const { user } = pref

    // Check for duplicate alert
    const existing = await db.emailAlert.findFirst({
      where: { userId: user.id, articleId: article.id },
    })
    if (existing) return

    // Create pending alert record
    const alertRecord = await db.emailAlert.create({
      data: {
        userId: user.id,
        articleId: article.id,
        status: 'PENDING',
      },
    })

    const html = renderHighImpactAlertEmail({
      articleTitle: article.title,
      summary: article.summary ?? '',
      sentiment: article.sentiment ?? 'NEUTRAL',
      sector: article.sector ?? 'GENERAL',
      impact: article.impact ?? 'HIGH',
      articleUrl: `${process.env.NEXT_PUBLIC_APP_URL}/news/${article.slug}`,
      userName: user.name ?? 'Usuario',
    })

    const result = await sendEmail({
      to: user.email,
      subject: `🚨 Alerta de Alto Impacto: ${article.title.slice(0, 60)}...`,
      html,
    })

    await db.emailAlert.update({
      where: { id: alertRecord.id },
      data: {
        status: result.success ? 'SENT' : 'FAILED',
        sentAt: result.success ? new Date() : null,
        error: result.error ?? null,
      },
    })

    if (result.success) sentCount++
  })

  return sentCount
}
