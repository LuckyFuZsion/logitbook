'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { productImageAlt } from '@/lib/product-image-alt'

interface ProductImageCarouselProps {
  images: string[]
  alt: string
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
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

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="aspect-square bg-black/40 flex items-center justify-center p-6 md:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt={productImageAlt(alt)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative border-b border-[var(--charcoal-light)]">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {images.map((src, index) => (
            <CarouselItem key={`${src}-${index}`} className="pl-0">
              <div className="aspect-square bg-black/40 flex items-center justify-center p-6 md:p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={productImageAlt(alt, index, images.length)}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="left-3 top-1/2 -translate-y-1/2 border-white/25 bg-black/60 text-white hover:bg-black/80 hover:text-white disabled:opacity-30"
        />
        <CarouselNext
          variant="outline"
          className="right-3 top-1/2 -translate-y-1/2 border-white/25 bg-black/60 text-white hover:bg-black/80 hover:text-white disabled:opacity-30"
        />
      </Carousel>

      <div className="flex items-center justify-center gap-2 py-3 bg-black/20">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === current ? 'w-6 bg-[var(--brand-red)]' : 'w-2 bg-white/30 hover:bg-white/50',
            )}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
