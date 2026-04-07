import { getOpenAI, OPENAI_MODEL, OPENAI_MAX_TOKENS, OPENAI_TEMPERATURE } from '@/config/openai.config'
import { AIAnalysisSchema } from '@/schemas/ai.schema'
import { buildAnalysisPrompt } from './prompts'
import type { AIAnalysis } from '@/types'

const RETRY_DELAYS = [500, 1000, 2000]

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function analyzeArticle(
  title: string,
  summary: string | null
): Promise<AIAnalysis | null> {
  const openai = getOpenAI()
  const prompt = buildAnalysisPrompt(title, summary)

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: OPENAI_TEMPERATURE,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('Empty OpenAI response')

      const parsed = JSON.parse(content)
      const validated = AIAnalysisSchema.safeParse(parsed)

      if (!validated.success) {
        console.error('AI response validation failed:', validated.error.flatten())
        return null
      }

      return validated.data as AIAnalysis
    } catch (error) {
      if (attempt < RETRY_DELAYS.length) {
        console.warn(`AI analysis attempt ${attempt + 1} failed, retrying...`, error)
        await sleep(RETRY_DELAYS[attempt])
      } else {
        console.error('AI analysis failed after all retries:', error)
      }
    }
  }

  return null
}
