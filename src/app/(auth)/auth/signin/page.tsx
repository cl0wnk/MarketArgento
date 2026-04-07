import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { SignInCard } from '@/components/auth/sign-in-card'

export const metadata: Metadata = { title: 'Ingresar' }

interface PageProps {
  searchParams: { callbackUrl?: string; error?: string }
}

export default async function SignInPage({ searchParams }: PageProps) {
  const session = await auth()
  if (session) redirect(searchParams.callbackUrl ?? '/dashboard')

  return (
    <div className="w-full max-w-sm">
      {searchParams.error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Error al iniciar sesión. Por favor intentá de nuevo.
        </div>
      )}
      <SignInCard callbackUrl={searchParams.callbackUrl ?? '/dashboard'} />
    </div>
  )
}
