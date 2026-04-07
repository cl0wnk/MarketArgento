import type { Metadata } from 'next'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = { title: 'DASHBOARD' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalToday, highImpactCount, alertsSentToday, recentAlerts] = await Promise.all([
    db.newsArticle.count({ where: { createdAt: { gte: today } } }),
    db.newsArticle.count({ where: { impact: 'HIGH', createdAt: { gte: today } } }),
    db.emailAlert.count({ where: { userId: session.user.id, createdAt: { gte: today }, status: 'SENT' } }),
    db.emailAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { article: { select: { title: true, slug: true, impact: true, createdAt: true } } },
    }),
  ])

  return (
    <div className="flex flex-col gap-24 py-12 animate-mech-fade">
      {/* Header Stat row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b-[4px] border-black dark:border-white pb-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">TOTAL PROCESSED</span>
          <span className="font-display text-8xl font-black">{totalToday}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">HIGH IMPACT</span>
          <span className="font-display text-8xl font-black">{highImpactCount}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">ALERTS SENT</span>
          <span className="font-display text-8xl font-black">{alertsSentToday}</span>
        </div>
      </section>

      {/* Recent Alerts Feed */}
      <section className="flex flex-col gap-12">
        <div className="flex items-center justify-between border-b border-black dark:border-white pb-4">
          <h2 className="font-display text-4xl font-black uppercase">RECENT ALERTS</h2>
          <Link href="/news" className="font-mono text-[10px] font-bold uppercase tracking-widest hover:underline">
            VIEW ALL NEWS →
          </Link>
        </div>

        {recentAlerts.length > 0 ? (
          <div className="flex flex-col">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between border-b border-black/10 dark:border-white/10 py-6 first:pt-0"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">
                    {formatDate(alert.createdAt, true)}
                  </span>
                  <Link 
                    href={`/news/${alert.article.slug}`}
                    className="font-serif text-xl font-bold group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all inline-block px-1 -mx-1 w-fit"
                  >
                    {alert.article.title}
                  </Link>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <span className={cn(
                    "font-mono text-[10px] uppercase tracking-tighter px-2 py-0.5 border",
                    alert.status === 'SENT' ? "border-black/10 text-black/50" : "border-black bg-black text-white"
                  )}>
                    {alert.status}
                  </span>
                  <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 border border-dashed border-black/20 dark:border-white/20 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-40">NO ALERTS DISPATCHED TODAY</p>
          </div>
        )}
      </section>

      {/* Quick Actions / Future Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-[4px] border-black dark:border-white pt-12">
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-2xl font-black uppercase">SYSTEM STATUS</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-black dark:bg-white animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">OPERATIONAL</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-2xl font-black uppercase">DATA SOURCES</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed opacity-40 max-w-xs">
            AMBITO FINANCIERO, EL CRONISTA, REUTERS LATAM, INVESTING.COM.
          </p>
        </div>
      </section>
    </div>
  )
}
