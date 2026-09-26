'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    element.classList.add('scroll-reveal-pending')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.remove('scroll-reveal-pending')
      element.classList.add('scroll-reveal-visible')
      observer.disconnect()
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={elementRef} className={className}>{children}</div>
}
