export interface TeamMember {
  id: string
  name: string
  /** Public image path under /public, or null for placeholder card */
  imageSrc: string | null
  qualifications: string[]
  /** About Me copy - one string per paragraph, matching source files */
  aboutParagraphs: string[]
  /** When true, show “coming soon” styling (e.g. Dan) */
  placeholder?: boolean
}
