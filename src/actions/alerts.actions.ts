'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AlertPreferenceSchema, type AlertPreferenceInput } from '@/schemas/alerts.schema'
import { redirect } from 'next/navigation'

export async function getAlertPreferences() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  return db.alertPreference.findUnique({
    where: { userId: session.user.id },
  })
}

export async function upsertAlertPreferences(
  data: AlertPreferenceInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validated = AlertPreferenceSchema.parse(data)
    await db.alertPreference.upsert({
      where: { userId: session.user.id },
      update: validated,
      create: { userId: session.user.id, ...validated },
    })
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar',
    }
  }
}

export async function getAlertHistory(page = 1, limit = 20) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const skip = (page - 1) * limit

  return db.emailAlert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      article: {
        select: { title: true, slug: true, impact: true, source: true },
      },
    },
  })
}
