import { PrismaClient, Source, Sentiment, Impact, Sector } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const articles = [
    {
      title: 'El dólar blue alcanza nuevo máximo histórico en Argentina',
      summary: 'El tipo de cambio informal superó los $1.500 pesos en las casas de cambio de Buenos Aires, generando presión sobre el mercado oficial.',
      url: 'https://example.com/dolar-blue-nuevo-maximo',
      slug: 'el-dolar-blue-alcanza-nuevo-maximo-historico-en-argentina',
      publishedAt: new Date(),
      source: Source.AMBITO,
      sentiment: Sentiment.NEGATIVE,
      impact: Impact.HIGH,
      sector: Sector.CURRENCY,
      confidence: 0.95,
      reasoning: 'El aumento del dólar blue genera incertidumbre en el mercado financiero.',
      keywords: ['dólar blue', 'tipo de cambio', 'BCRA', 'inflación'],
      processed: true,
      isImportant: true,
    },
    {
      title: 'BCRA anuncia nuevas medidas para fortalecer las reservas internacionales',
      summary: 'El Banco Central de la República Argentina implementará restricciones adicionales a las importaciones para acumular divisas.',
      url: 'https://example.com/bcra-reservas-internacionales',
      slug: 'bcra-anuncia-nuevas-medidas-para-fortalecer-las-reservas',
      publishedAt: new Date(Date.now() - 3600000),
      source: Source.CRONISTA,
      sentiment: Sentiment.NEUTRAL,
      impact: Impact.MEDIUM,
      sector: Sector.BANKING,
      confidence: 0.82,
      reasoning: 'Las medidas del BCRA tienen impacto moderado sobre el mercado.',
      keywords: ['BCRA', 'reservas', 'importaciones', 'banco central'],
      processed: true,
      isImportant: false,
    },
    {
      title: 'Merval sube 3% impulsado por acciones bancarias',
      summary: 'El índice bursátil argentino registró una fuerte suba liderada por los principales bancos del país tras datos positivos de inflación.',
      url: 'https://example.com/merval-sube-acciones-bancarias',
      slug: 'merval-sube-3-impulsado-por-acciones-bancarias',
      publishedAt: new Date(Date.now() - 7200000),
      source: Source.REUTERS,
      sentiment: Sentiment.POSITIVE,
      impact: Impact.HIGH,
      sector: Sector.BANKING,
      confidence: 0.88,
      reasoning: 'La suba del Merval refleja optimismo en el sector bancario.',
      keywords: ['Merval', 'acciones', 'banco', 'bolsa', 'mercado'],
      processed: true,
      isImportant: true,
    },
  ]

  for (const article of articles) {
    await prisma.newsArticle.upsert({
      where: { url: article.url },
      update: {},
      create: article,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
