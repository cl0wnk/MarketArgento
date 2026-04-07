import type { AlertEmailProps } from '@/types/email'

const SECTOR_LABELS: Record<string, string> = {
  BANKING: 'Banca',
  ENERGY: 'Energía',
  AGRICULTURE: 'Agro',
  TECHNOLOGY: 'Tecnología',
  CURRENCY: 'Divisas / USD',
  BONDS: 'Bonos',
  REAL_ESTATE: 'Inmobiliario',
  GENERAL: 'General',
}

const SENTIMENT_LABELS: Record<string, string> = {
  POSITIVE: 'Positivo',
  NEGATIVE: 'Negativo',
  NEUTRAL: 'Neutral',
}

const IMPACT_LABELS: Record<string, string> = {
  HIGH: 'ALTO',
  MEDIUM: 'MEDIO',
  LOW: 'BAJO',
}

export function renderHighImpactAlertEmail(props: AlertEmailProps): string {
  const { articleTitle, summary, sentiment, sector, impact, articleUrl, userName } = props

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Alto Impacto - MarketArgento</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #000; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border: 1px solid #000; padding: 40px; }
    .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #000; }
    .alert-tag { display: inline-block; background: #000; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; margin-top: 12px; }
    h1 { font-size: 22px; font-weight: 700; line-height: 1.3; margin-top: 20px; color: #000; }
    .meta { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
    .badge { display: inline-block; border: 1px solid #000; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; }
    .badge-filled { background: #000; color: #fff; border: 1px solid #000; }
    .summary { margin-top: 24px; font-size: 15px; line-height: 1.6; color: #333; border-left: 3px solid #000; padding-left: 16px; }
    .cta { margin-top: 32px; }
    .button { display: inline-block; background: #000; color: #fff !important; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; padding: 12px 24px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    .footer a { color: #000; }
    .greeting { font-size: 14px; color: #555; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="brand">MarketArgento</div>
        <div class="alert-tag">Alerta de Alto Impacto</div>
      </div>

      <p class="greeting">Hola, ${userName}</p>
      <h1>${articleTitle}</h1>

      <div class="meta">
        <span class="badge badge-filled">${IMPACT_LABELS[impact] ?? impact}</span>
        <span class="badge">${SECTOR_LABELS[sector] ?? sector}</span>
        <span class="badge">${SENTIMENT_LABELS[sentiment] ?? sentiment}</span>
      </div>

      ${summary ? `<p class="summary">${summary}</p>` : ''}

      <div class="cta">
        <a href="${articleUrl}" class="button">Ver artículo completo →</a>
      </div>

      <div class="footer">
        <p>Recibiste esta alerta porque tenés las notificaciones activadas en MarketArgento.</p>
        <p style="margin-top: 8px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts">Administrar alertas</a>
          &nbsp;·&nbsp;
          <a href="${process.env.NEXT_PUBLIC_APP_URL}">Ir a MarketArgento</a>
        </p>
        <p style="margin-top: 12px; color: #999; font-size: 11px;">
          Información con fines educativos. No constituye asesoramiento financiero.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}
