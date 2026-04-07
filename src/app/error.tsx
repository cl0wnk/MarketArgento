'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Error</p>
      <h1 className="text-xl font-semibold text-black text-center">Algo salió mal</h1>
      <p className="mt-2 text-sm text-zinc-400 text-center max-w-sm">
        {error.message || 'Ocurrió un error inesperado. Por favor intentá de nuevo.'}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-zinc-300">{error.digest}</p>
      )}
      <Button onClick={reset} className="mt-8" variant="secondary">
        Intentar de nuevo
      </Button>
    </div>
  )
}
