import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/news', label: 'NEWS' },
  { href: '/dashboard/alerts', label: 'ALERTS' },
  { href: '/dashboard/settings', label: 'SETTINGS' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <div className="sticky top-12 flex flex-col gap-12">
              <Link href="/news" className="font-display text-2xl font-black uppercase tracking-tighter">
                ARGENTO.
              </Link>
              
              <nav className="flex flex-col gap-1 border-l border-black/10 dark:border-white/10 pl-6">
                <span className="font-mono text-[9px] font-bold text-black/30 dark:text-white/30 uppercase tracking-[0.3em] mb-4">
                  DASHBOARD
                </span>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-mono text-xs font-bold uppercase tracking-widest py-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-24 pt-12 border-t border-black/5 dark:border-white/5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-black/30 dark:text-white/30">
                  REF: {session.user?.email}
                </p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
