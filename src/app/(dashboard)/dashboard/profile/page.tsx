import type { Metadata } from 'next'
import { auth } from '@/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const metadata: Metadata = { title: 'Perfil' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) return null

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">Perfil</p>
        <h1 className="text-xl font-bold">Tu cuenta</h1>
      </div>

      <div className="border border-zinc-200 p-6 flex items-start gap-4">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={session.user.image ?? ''} />
          <AvatarFallback className="text-sm">
            {(session.user.name ?? 'U').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold text-black">{session.user.name ?? '—'}</p>
          <p className="text-sm text-zinc-500 truncate">{session.user.email ?? '—'}</p>
          <p className="text-xs text-zinc-300 mt-1 font-mono uppercase tracking-wider">
            {session.user.role ?? 'USER'}
          </p>
        </div>
      </div>

      <div className="border border-zinc-100 p-4 bg-zinc-50">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Tu cuenta está vinculada a través de OAuth (Google o GitHub). Los datos de perfil se obtienen directamente del proveedor y no pueden modificarse aquí.
        </p>
      </div>
    </div>
  )
}
