export interface EmailPayload {
  to: string
  subject: string
  html: string
}

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

export interface AlertEmailProps {
  articleTitle: string
  summary: string
  sentiment: string
  sector: string
  impact: string
  articleUrl: string
  userName: string
}

export interface WelcomeEmailProps {
  userName: string
}
