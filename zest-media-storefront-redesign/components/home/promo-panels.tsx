import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Parallax } from '@/components/motion/parallax'
import { Reveal } from '@/components/motion/reveal'
import type { Category } from '@/lib/types'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function PromoPanels({ categories }: { categories: Category[] }) {
  return (
    <section aria-label="Featured services" className="mx-auto grid max-w-7xl gap-4 px-4 md:px-6 lg:grid-cols-2">
      {siteConfig.promos.map((promo, i) => {
        const exists = categories.some((c) => c.slug === promo.categorySlug)
        const href = exists ? `/products?category=${promo.categorySlug}` : '/products'
        const teal = promo.tone === 'teal'
        return (
          <Reveal key={promo.title} variant={i === 0 ? 'left' : 'right'} className="h-full">
            <article
              className={cn(
                'relative flex h-full min-h-80 flex-col overflow-hidden rounded-3xl md:min-h-96 md:flex-row',
                teal ? 'bg-teal-deep text-cream' : 'bg-primary text-primary-foreground',
              )}
            >
              <div className="relative z-10 flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
                <div className="flex flex-col gap-3">
                  <p
                    className={cn(
                      'text-xs font-bold uppercase tracking-[0.18em]',
                      teal ? 'text-primary' : 'text-primary-foreground/80',
                    )}
                  >
                    {promo.eyebrow}
                  </p>
                  <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
                    {promo.title}
                  </h2>
                  <p className={cn('max-w-sm text-sm leading-relaxed', teal ? 'text-cream/75' : 'text-primary-foreground/85')}>
                    {promo.text}
                  </p>
                </div>
                <Link
                  href={href}
                  className={cn(
                    'group inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                    teal ? 'bg-cream text-teal-deep hover:bg-primary hover:text-primary-foreground' : 'bg-teal-deep text-cream hover:bg-teal-ink',
                  )}
                >
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative h-56 overflow-hidden md:h-auto md:w-[45%]">
                <Parallax speed={0.1} className="absolute -inset-y-10 inset-x-0">
                  <Image src={promo.image} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
                </Parallax>
              </div>
            </article>
          </Reveal>
        )
      })}
    </section>
  )
}
