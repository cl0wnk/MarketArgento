import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }
  return session
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function getUserRole(): Promise<Role | null> {
  const session = await auth()
  return (session?.user?.role as Role) ?? null
}
