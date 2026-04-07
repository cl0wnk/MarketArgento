import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-sm font-bold">MarketArgento</span>
            <p className="text-xs text-zinc-400 mt-1">
              Noticias financieras argentinas con análisis de impacto en tiempo real.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <p className="text-xs text-zinc-400">Fuentes de información</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Ámbito', href: 'https://www.ambito.com' },
                { label: 'El Cronista', href: 'https://www.cronista.com' },
                { label: 'Reuters', href: 'https://www.reuters.com' },
              ].map((source) => (
                <a
                  key={source.label}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-black transition-colors underline underline-offset-2"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs text-zinc-300 text-center">
            Información con fines educativos únicamente. No constituye asesoramiento financiero.
            &copy; {new Date().getFullYear()} MarketArgento.
          </p>
        </div>
      </div>
    </footer>
  )
}
