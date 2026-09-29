'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="grid aspect-square place-items-center rounded-3xl bg-muted text-muted-foreground">
        <span className="flex flex-col items-center gap-2 text-sm">
          <ImageOff className="size-6" aria-hidden="true" /> No image yet
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="animate-image-in relative aspect-square overflow-hidden rounded-3xl bg-muted">
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={i === active ? `${name} — image ${i + 1} of ${images.length}` : ''}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={cn(
              'object-cover transition-all duration-500',
              i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            )}
          />
        ))}
      </div>
      {images.length > 1 ? (
        <div role="group" aria-label="Product images" className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                'relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all md:size-24',
                i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
