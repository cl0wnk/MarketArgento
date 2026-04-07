import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/api/user') ||
        nextUrl.pathname.startsWith('/api/alerts')
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL('/auth/signin', nextUrl))
      }
      return true
    },
  },
}
