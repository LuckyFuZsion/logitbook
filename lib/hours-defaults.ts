import type { HoursData } from '@/lib/hours-types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const DEFAULT_HOURS: HoursData = {
  schedule: DAYS.map((day) => ({
    day,
    open: day === 'Sunday' ? '' : '09:00',
    close: day === 'Sunday' ? '' : day === 'Saturday' ? '13:00' : '17:00',
    closed: day === 'Sunday',
  })),
  notes: 'Appointments recommended. Contact us for urgent callouts.',
  updatedAt: new Date(0).toISOString(),
}

export function mergeHoursData(raw: Partial<HoursData> | null | undefined): HoursData {
  if (!raw || !Array.isArray(raw.schedule) || raw.schedule.length === 0) {
    return { ...DEFAULT_HOURS, schedule: DEFAULT_HOURS.schedule.map((s) => ({ ...s })) }
  }
  return {
    schedule: raw.schedule,
    notes: raw.notes ?? DEFAULT_HOURS.notes,
    updatedAt: raw.updatedAt ?? DEFAULT_HOURS.updatedAt,
  }
}
