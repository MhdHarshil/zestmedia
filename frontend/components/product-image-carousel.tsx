'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductImageCarousel({ images, productName }: { images: string[]; productName: string }) {
  const slides = images.length ? images : ['/placeholder.svg']
  const [activeIndex, setActiveIndex] = useState(0)

  const previous = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  const next = () => setActiveIndex((current) => (current + 1) % slides.length)

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
        <Image
          src={slides[activeIndex]}
          alt={`${productName}, image ${activeIndex + 1}`}
          fill
          priority
          unoptimized={slides[activeIndex].startsWith('http')}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {slides.length > 1 && <>
          <button type="button" onClick={previous} aria-label="Show previous product image" className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition hover:bg-background">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={next} aria-label="Show next product image" className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition hover:bg-background">
            <ChevronRight className="size-5" />
          </button>
          <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground" aria-live="polite">
            {activeIndex + 1} / {slides.length}
          </span>
        </>}
      </div>
      {slides.length > 1 && <div className="flex justify-center gap-2" role="group" aria-label="Choose product image">
        {slides.map((_, index) => <button
          key={index}
          type="button"
          onClick={() => setActiveIndex(index)}
          aria-label={`Show image ${index + 1}`}
          aria-current={activeIndex === index ? 'true' : undefined}
          className={`size-2.5 rounded-full transition-colors ${activeIndex === index ? 'bg-brand' : 'bg-border hover:bg-muted-foreground'}`}
        />)}
      </div>}
    </div>
  )
}
