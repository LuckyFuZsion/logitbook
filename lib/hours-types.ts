export interface DayHours {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface HoursData {
  schedule: DayHours[]
  notes: string
  updatedAt: string
}
