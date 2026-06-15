/** Trim copy to a safe length for meta descriptions (Google SERP). */
export function metaDescription(text: string, max = 155): string {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  const slice = trimmed.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

/** Trim copy for Open Graph / Twitter cards. */
export function ogDescription(text: string, max = 125): string {
  return metaDescription(text, max)
}

/** Trim page title segment before the layout template suffix (` | LOGITSHOP`). */
export function pageTitleSegment(text: string, max = 48): string {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  const slice = trimmed.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 24 ? slice.slice(0, lastSpace) : slice).trim()}…`
}
