import type { WelcomeEmailProps } from '@/types/email'

export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  const { userName } = props
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a MarketArgento</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #000; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border: 1px solid #000; padding: 40px; }
    .brand { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
    h1 { font-size: 24px; font-weight: 700; margin-top: 24px; }
    p { font-size: 15px; line-height: 1.6; color: #333; margin-top: 16px; }
    .feature { border-left: 3px solid #000; padding-left: 16px; margin-top: 24px; }
    .feature h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .feature p { margin-top: 4px; font-size: 14px; }
    .button { display: inline-block; background: #000; color: #fff !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; margin-top: 32px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand">MarketArgento</div>
      <h1>Bienvenido, ${userName}</h1>
      <p>Ahora tenés acceso completo a las noticias financieras argentinas con análisis de impacto en tiempo real.</p>

      <div class="feature">
        <h3>Alertas de alto impacto</h3>
        <p>Recibí emails instantáneos cuando una noticia importante afecte al mercado.</p>
      </div>

      <div class="feature">
        <h3>Análisis con IA</h3>
        <p>Cada noticia es analizada automáticamente: sentimiento, impacto y sector afectado.</p>
      </div>

      <div class="feature">
        <h3>Sin ruido</h3>
        <p>Solo lo que realmente importa. Filtrá por sector o nivel de impacto.</p>
      </div>

      <a href="${appUrl}/dashboard/alerts" class="button">Configurar mis alertas →</a>

      <div class="footer">
        <p>Información con fines educativos. No constituye asesoramiento financiero.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}
