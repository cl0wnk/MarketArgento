import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <p className="font-mono text-8xl font-bold text-zinc-100">404</p>
      <h1 className="mt-4 text-xl font-semibold text-black">Página no encontrada</h1>
      <p className="mt-2 text-sm text-zinc-400">La página que buscás no existe o fue movida.</p>
      <Link
        href="/news"
        className="mt-8 text-sm underline underline-offset-4 text-black hover:opacity-60 transition-opacity"
      >
        Volver a las noticias
      </Link>
    </div>
  )
}
