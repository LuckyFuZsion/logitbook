import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile } from '@/lib/testimonials-store'
import TestimonialsPageClient from '@/components/testimonials-page-client'

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  const data = mergeTestimonialsData(await readTestimonialsFile())
  return <TestimonialsPageClient initialData={data} />
}
