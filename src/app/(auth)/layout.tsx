import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="font-mono text-sm font-bold tracking-tight mb-10 hover:opacity-70 transition-opacity">
        MarketArgento
      </Link>
      {children}
    </div>
  )
}
