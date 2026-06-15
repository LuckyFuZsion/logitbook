import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile } from '@/lib/testimonials-store'
import TestimonialsPageClient from '@/components/testimonials-page-client'

export const revalidate = 300

export default async function TestimonialsPage() {
  const data = mergeTestimonialsData(await readTestimonialsFile())
  return <TestimonialsPageClient initialData={data} />
}
