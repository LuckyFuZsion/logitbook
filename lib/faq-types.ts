export interface FaqItem {
  id: string
  question: string
  /** Supports `\n` line breaks and `- item` bullet lines (same format as the existing section). */
  answer: string
}

export interface FaqData {
  items: FaqItem[]
  updatedAt: string
}
