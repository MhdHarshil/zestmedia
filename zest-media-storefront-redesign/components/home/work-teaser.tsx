import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import type { Work } from '@/lib/types'

export function WorkTeaser({ works }: { works: Work[] }) {
  const items = works.filter((w) => w.image_url).slice(0, 3)
  if (!items.length) return null

  return (
    <section aria-labelledby="work-title" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        id="work-title"
        eyebrow="Recent work"
        title="Made in our studio"
        link={{ href: '/work', label: 'See the portfolio' }}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map((w, i) => (
          <li key={w.id} className={i === 1 ? 'md:translate-y-10' : ''}>
            <Reveal delay={i * 120}>
              <figure className="group flex flex-col gap-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={w.image_url!}
                    alt={w.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{w.category}</span>
                  <span className="font-bold text-foreground">{w.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
