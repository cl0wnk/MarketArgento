import type { Metadata } from 'next'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AlertPreferencesForm } from '@/components/dashboard/alert-preferences-form'
import { upsertAlertPreferences } from '@/actions/alerts.actions'

export const metadata: Metadata = { title: 'Configurar alertas' }

export default async function AlertsPage() {
  const session = await auth()
  if (!session?.user) return null

  const preference = await db.alertPreference.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">Alertas</p>
        <h1 className="text-xl font-bold">Configurar alertas</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Personalizá cuándo y sobre qué noticias recibir alertas por email.
        </p>
      </div>

      <AlertPreferencesForm
        initialData={preference}
        onSubmit={upsertAlertPreferences}
      />
    </div>
  )
}
