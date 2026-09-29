'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import type { Work } from '@/lib/types'
import { cn } from '@/lib/utils'

export function WorkGallery({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState('All')
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(works.map((w) => w.category).filter((c): c is string => Boolean(c))))],
    [works],
  )
  const visible = filter === 'All' ? works : works.filter((w) => w.category === filter)

  if (!works.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <h2 className="text-lg font-bold text-foreground">No portfolio pieces yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">New work will appear here soon.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.length > 2 ? (
        <div role="group" aria-label="Filter portfolio" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                filter === c
                  ? 'border-brand-dark bg-brand-dark text-white'
                  : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((w, i) => (
          <li key={w.id} className="break-inside-avoid">
            <Reveal delay={(i % 3) * 100}>
              <figure className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className={cn('relative overflow-hidden bg-muted', i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
                  {w.image_url ? (
                    <Image
                      src={w.image_url}
                      alt={w.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <ImageOff className="size-6" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <figcaption className="flex flex-col gap-1 p-4">
                  <span className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    {w.category}
                    {w.client ? <span className="normal-case tracking-normal text-muted-foreground">for {w.client}</span> : null}
                  </span>
                  <span className="font-bold text-foreground">{w.title}</span>
                  {w.description ? <span className="text-sm leading-relaxed text-muted-foreground">{w.description}</span> : null}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
