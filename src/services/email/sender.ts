import { Resend } from 'resend'
import type { EmailResult } from '@/types/email'

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<EmailResult> {
  try {
    const resend = getResend()
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'alerts@marketargento.com'

    const result = await resend.emails.send({
      from: `MarketArgento <${fromEmail}>`,
      to,
      subject,
      html,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Email send error:', message)
    return { success: false, error: message }
  }
}
