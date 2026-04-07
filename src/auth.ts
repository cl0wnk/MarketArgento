import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { authConfig } from '@/auth.config'
import type { Role } from '@prisma/client'

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db.alertPreference.create({
          data: {
            userId: user.id,
            enabled: true,
            minImpact: 'HIGH',
            sectors: [],
          },
        })
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: Role }).role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as Role) ?? 'USER'
      }
      return session
    },
  },
})
