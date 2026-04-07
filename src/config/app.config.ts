export const APP_CONFIG = {
  name: 'MarketArgento',
  description: 'Noticias financieras argentinas con análisis de impacto en tiempo real',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  pagination: {
    default: 20,
    max: 100,
  },
  news: {
    revalidateSeconds: 60,
    cronIntervalSeconds: 60,
    maxAgeHours: 48,
  },
} as const

export const SECTORS = [
  { value: 'BANKING', label: 'Banca' },
  { value: 'ENERGY', label: 'Energía' },
  { value: 'AGRICULTURE', label: 'Agro' },
  { value: 'TECHNOLOGY', label: 'Tecnología' },
  { value: 'CURRENCY', label: 'Divisas / USD' },
  { value: 'BONDS', label: 'Bonos' },
  { value: 'REAL_ESTATE', label: 'Inmobiliario' },
  { value: 'GENERAL', label: 'General' },
] as const

export const SOURCES = [
  { value: 'AMBITO', label: 'Ámbito Financiero' },
  { value: 'CRONISTA', label: 'El Cronista' },
  { value: 'REUTERS', label: 'Reuters LatAm' },
  { value: 'INVESTING', label: 'Investing.com' },
  { value: 'OTHER', label: 'Otro' },
] as const
