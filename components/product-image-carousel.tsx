'use client'

import Link from 'next/link'
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
  /** Detail page (square) or shop card (video aspect, compact controls). */
  variant?: 'detail' | 'card'
  /** When set on card variant, clicking the image area opens the product page. */
  linkHref?: string
}

export function ProductImageCarousel({
  images,
  alt,
  variant = 'detail',
  linkHref,
}: ProductImageCarouselProps) {
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

  const isCard = variant === 'card'
  const frameClass = isCard ? 'h-full' : 'aspect-square'
  const padClass = isCard ? 'p-4 pb-9' : 'p-6 md:p-10'
  const navBtnClass =
    'top-1/2 -translate-y-1/2 border-white/25 bg-black/60 text-white hover:bg-black/80 hover:text-white disabled:opacity-30'
  const controlPrevClass = cn(navBtnClass, isCard ? 'left-2 h-8 w-8' : 'left-3')
  const controlNextClass = cn(navBtnClass, isCard ? 'right-2 h-8 w-8' : 'right-3')
  const dotsWrapClass = isCard
    ? 'absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 py-2 bg-black/30'
    : 'relative z-10 flex items-center justify-center gap-2 py-3 bg-black/20'
  const imageClass = 'h-auto w-auto max-h-full max-w-full object-contain'
  const slideClass = isCard
    ? cn('relative flex h-full min-h-0 items-center justify-center bg-black/40', padClass)
    : cn('relative flex min-h-0 items-center justify-center bg-black/40 aspect-square', padClass)
  const imageLink =
    isCard && linkHref ? (
      <Link
        href={linkHref}
        className="absolute inset-0 z-[5]"
        aria-label={`View ${alt}`}
        tabIndex={-1}
      />
    ) : null

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div
        className={cn(
          'relative flex w-full min-h-0 items-center justify-center bg-black/40',
          frameClass,
          padClass,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={productImageAlt(alt)} className={imageClass} />
        {imageLink}
      </div>
    )
  }

  const carouselClass = cn(
    'w-full',
    isCard && 'h-full [&_[data-slot=carousel-content]]:h-full',
  )

  return (
    <div className={cn('relative w-full min-h-0', frameClass, !isCard && 'border-b border-[var(--charcoal-light)]')}>
      <Carousel setApi={setApi} className={carouselClass} opts={{ loop: true }}>
        <CarouselContent className={cn('ml-0', isCard && 'h-full items-stretch')}>
          {images.map((src, index) => (
            <CarouselItem key={`${src}-${index}`} className={cn('pl-0', isCard && 'h-full min-h-0')}>
              <div className={slideClass}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={productImageAlt(alt, index, images.length)} className={imageClass} />
                {imageLink}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="outline" className={cn(controlPrevClass, isCard && 'z-10')} />
        <CarouselNext variant="outline" className={cn(controlNextClass, isCard && 'z-10')} />
      </Carousel>

      <div className={cn(dotsWrapClass)}>
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
