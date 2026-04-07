import sanitizeHtml from 'sanitize-html'

export function sanitizeString(input: string, maxLength = 5000): string {
  if (typeof input !== 'string') return ''
  const clean = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} })
  return clean.trim().slice(0, maxLength)
}

export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    return parsed.toString()
  } catch {
    return null
  }
}

export function sanitizeArticle(article: {
  title: string
  summary: string | null
  url: string
  content?: string | null
}) {
  return {
    title: sanitizeString(article.title, 500),
    summary: article.summary ? sanitizeString(article.summary, 2000) : null,
    url: sanitizeUrl(article.url) ?? '',
    content: article.content ? sanitizeString(article.content, 10000) : null,
  }
}
