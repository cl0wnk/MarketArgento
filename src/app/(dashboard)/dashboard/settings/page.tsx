import type { Metadata } from 'next'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { SettingsForm } from '@/components/dashboard/settings-form'

export const metadata: Metadata = { title: 'SETTINGS' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) return null

  const preference = await db.alertPreference.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="flex flex-col gap-12 max-w-4xl animate-mech-fade py-12">
      <header className="flex flex-col gap-4 border-b-[4px] border-black dark:border-white pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">USER PREFERENCES</span>
        <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tight">
          Config.<br />
          System.
        </h1>
      </header>

      <section className="bg-transparent">
        {/* Pass standard preferences or defaults */}
        <SettingsForm initialData={preference as any} />
      </section>

      <footer className="mt-24 pt-12 border-t border-black/10 dark:border-white/10">
        <p className="font-mono text-[10px] uppercase tracking-widest leading-relaxed opacity-40 max-w-md">
          NOTE: CHANGES ARE COMMITTED INSTANTLY TO THE NEWS PROCESSING QUEUE. 
          HIGH IMPACT ALERTS ARE DISPATCHED VIA SES/RESEND.
        </p>
      </footer>
    </div>
  )
}
