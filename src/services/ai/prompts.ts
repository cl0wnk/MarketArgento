export function buildAnalysisPrompt(title: string, summary: string | null): string {
  const content = summary ? `Título: ${title}\n\nResumen: ${summary}` : `Título: ${title}`

  return `Eres un analista financiero especializado en el mercado argentino. Analiza la siguiente noticia y devuelve un JSON con el análisis.

CONTEXTO: El mercado argentino incluye: el Merval (índice bursátil), el dólar blue (mercado informal), el tipo de cambio oficial, bonos soberanos, el BCRA (Banco Central), el INDEC (estadísticas), reservas internacionales, inflación, tarifas de servicios públicos, YPF (energía), empresas del agro, bancos privados y públicos.

NOTICIA:
${content}

INSTRUCCIONES: Responde ÚNICAMENTE con un objeto JSON válido con estos campos exactos:
{
  "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "impact": "LOW" | "MEDIUM" | "HIGH",
  "sector": "BANKING" | "ENERGY" | "AGRICULTURE" | "TECHNOLOGY" | "CURRENCY" | "BONDS" | "REAL_ESTATE" | "GENERAL",
  "confidence": número entre 0 y 1,
  "reasoning": "una oración en español explicando el impacto",
  "keywords": ["palabra1", "palabra2", ...]
}

CRITERIOS DE IMPACTO:
- HIGH: Afecta directamente el tipo de cambio, tasas de interés, o es una medida de política económica del gobierno/BCRA
- MEDIUM: Afecta a un sector específico o tiene implicaciones moderadas para el mercado
- LOW: Información general, datos secundarios, o noticias de bajo impacto

CRITERIOS DE SENTIMIENTO:
- POSITIVE: La noticia beneficia al mercado o la economía argentina
- NEGATIVE: La noticia perjudica al mercado o genera incertidumbre
- NEUTRAL: Información descriptiva sin claro impacto positivo o negativo`
}
