export interface StoryMilestone {
  id: string
  year: string
  title: string
  description: string
}

export interface StoryValue {
  id: string
  /** Lucide icon name */
  icon: string
  title: string
  description: string
}

export interface StoryData {
  paragraph1: string
  paragraph2: string
  bullets: string[]
  milestones: StoryMilestone[]
  values: StoryValue[]
  updatedAt: string
}
