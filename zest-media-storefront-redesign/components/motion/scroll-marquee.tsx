'use client'

import { useEffect, useRef } from 'react'

// Horizontal strip that slides as the page scrolls, instead of looping on a timer.
export function ScrollMarquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const offset = (window.innerHeight - rect.top) * 0.35
      el.style.transform = `translate3d(${(-offset).toFixed(1)}px, 0, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const row = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-card py-5" aria-hidden="true">
      <div ref={track} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {item}
            <span className="size-2.5 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </div>
  )
}
