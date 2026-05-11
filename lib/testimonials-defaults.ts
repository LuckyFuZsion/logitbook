import type { TestimonialsData } from '@/lib/testimonials-types'

export const DEFAULT_TESTIMONIALS: TestimonialsData = {
  items: [
    {
      id: 't-01',
      name: 'James Hargreaves',
      role: 'PADI Divemaster',
      text: "Log-It have been servicing my regulators for years. Exceptional attention to detail — always explained what was done and why. My equipment always comes back performing like new.",
      rating: 5,
      featured: true,
      date: '2025-11',
    },
    {
      id: 't-02',
      name: 'Sarah Mitchell',
      role: 'Technical Diver',
      text: "Had both my cylinders PIAT tested and they turned around faster than expected. The video documentation of the inspection gave me total peace of mind. Highly recommended.",
      rating: 5,
      featured: true,
      date: '2025-10',
    },
    {
      id: 't-03',
      name: 'Mark Thompson',
      role: 'Recreational Diver',
      text: "Sent my BCD and regs in by post — seamlessly easy process, and the service report was thorough. Great communication throughout.",
      rating: 5,
      featured: true,
      date: '2026-01',
    },
  ],
  updatedAt: new Date(0).toISOString(),
}

export function mergeTestimonialsData(
  raw: Partial<TestimonialsData> | null | undefined,
): TestimonialsData {
  if (!raw || !Array.isArray(raw.items)) return { ...DEFAULT_TESTIMONIALS }
  return {
    items: raw.items,
    updatedAt: raw.updatedAt ?? DEFAULT_TESTIMONIALS.updatedAt,
  }
}
