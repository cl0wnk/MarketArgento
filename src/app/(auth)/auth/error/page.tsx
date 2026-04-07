import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Error de autenticación' }

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'Error de configuración del servidor.',
  AccessDenied: 'Acceso denegado.',
  Verification: 'El enlace de verificación expiró o ya fue usado.',
  OAuthSignin: 'Error al iniciar el proceso OAuth.',
  OAuthCallback: 'Error al procesar la respuesta OAuth.',
  OAuthCreateAccount: 'No se pudo crear la cuenta OAuth.',
  EmailCreateAccount: 'No se pudo crear la cuenta de email.',
  Callback: 'Error en el proceso de autenticación.',
  OAuthAccountNotLinked: 'Esta cuenta ya está vinculada a otro proveedor.',
  Default: 'Ocurrió un error inesperado.',
}

interface PageProps {
  searchParams: { error?: string }
}

export default function AuthErrorPage({ searchParams }: PageProps) {
  const message = ERROR_MESSAGES[searchParams.error ?? 'Default'] ?? ERROR_MESSAGES.Default

  return (
    <div className="w-full max-w-sm">
      <div className="border border-zinc-200 bg-white p-8 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Error</p>
        <h1 className="text-xl font-semibold mb-3">No se pudo autenticar</h1>
        <p className="text-sm text-zinc-500 mb-8">{message}</p>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/auth/signin">Intentar de nuevo</Link>
        </Button>
      </div>
    </div>
  )
}
