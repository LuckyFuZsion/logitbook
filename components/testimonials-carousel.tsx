'use client'

import { useEffect, useState } from 'react'
import type { Testimonial } from '@/lib/testimonials-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { TestimonialCard } from '@/components/testimonial-card'

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (items.length === 0) {
    return <p className="text-center text-white/50 text-sm">No reviews yet.</p>
  }

  if (items.length === 1) {
    return <TestimonialCard item={items[0]} />
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-0">
              <TestimonialCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="left-0 md:-left-12 top-1/2 -translate-y-1/2 border-white/25 bg-black/60 text-white hover:bg-black/80 hover:text-white"
        />
        <CarouselNext
          variant="outline"
          className="right-0 md:-right-12 top-1/2 -translate-y-1/2 border-white/25 bg-black/60 text-white hover:bg-black/80 hover:text-white"
        />
      </Carousel>

      <div className="flex items-center justify-center gap-2 py-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === current ? 'w-6 bg-[var(--brand-red)]' : 'w-2 bg-white/30 hover:bg-white/50',
            )}
            aria-label={`Show review ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
