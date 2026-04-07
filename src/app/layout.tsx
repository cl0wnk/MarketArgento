import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | MarketArgento',
    default: 'MarketArgento — Mercado Financiero Argentino',
  },
  description: 'Noticias financieras argentinas con análisis de impacto en tiempo real. Seguí el dólar, el Merval, bonos y más.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'MarketArgento',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html 
      lang="es" 
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="font-serif bg-white text-black antialiased selection:bg-black selection:text-white">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
