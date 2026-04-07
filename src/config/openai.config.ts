import OpenAI from 'openai'

// Server-only singleton — never import in client components
let openaiInstance: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

export const OPENAI_MODEL = 'gpt-4o-mini'
export const OPENAI_MAX_TOKENS = 400
export const OPENAI_TEMPERATURE = 0.1
