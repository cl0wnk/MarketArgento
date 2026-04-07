'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white border-b border-zinc-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/news" className="flex items-center gap-2 group">
          <span className="font-mono text-sm font-bold tracking-tight text-black group-hover:opacity-70 transition-opacity">
            MarketArgento
          </span>
          <span className="hidden sm:inline-block text-xs text-zinc-400 font-normal border-l border-zinc-200 pl-2 ml-0.5">
            Mercado financiero AR
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/news"
            className="text-sm text-zinc-500 hover:text-black transition-colors hidden sm:block"
          >
            Noticias
          </Link>

          {status === 'loading' ? (
            <div className="h-8 w-8 bg-zinc-100 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                  <AvatarFallback>
                    {(session.user?.name ?? 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-10 w-52 bg-white border border-zinc-200 shadow-lg z-50 py-1"
                >
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-xs font-semibold truncate">{session.user?.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/alerts"
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mis alertas
                  </Link>
                  <div className="border-t border-zinc-100 mt-1">
                    <button
                      onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="block w-full text-left px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signIn()}
            >
              Ingresar
            </Button>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
