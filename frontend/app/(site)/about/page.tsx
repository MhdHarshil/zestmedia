import type { Metadata } from 'next'
import Image from 'next/image'
import { Handshake, Leaf, Sparkles, Timer } from 'lucide-react'
import { Parallax } from '@/components/motion/parallax'
import { Reveal } from '@/components/motion/reveal'
import { BenefitsStrip } from '@/components/site/benefits-strip'
import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getWorks } from '@/lib/storefront-api'

export const metadata: Metadata = {
  title: 'About',
  description: 'Zest Media is a local print and branding studio helping small businesses look sharp.',
}

const values = [
  { icon: Sparkles, title: 'Craft first', text: 'We check colour, stock and trim on every job before it leaves the studio.' },
  { icon: Handshake, title: 'Honest advice', text: 'We recommend what suits your budget, not the most expensive option.' },
  { icon: Timer, title: 'Reliable timing', text: 'Clear turnaround times, and we tell you early if anything changes.' },
  { icon: Leaf, title: 'Thoughtful materials', text: 'Recycled and FSC stocks available on most of our products.' },
]

export default async function AboutPage() {
  const { data: works } = await getWorks()
  const gallery = works.filter((w) => w.image_url).slice(0, 4)

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A neighbourhood studio with a big press"
        description="Zest Media started with one printer and a love for good paper. Today we help hundreds of local businesses with branding, packaging and everyday print."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
          <Parallax speed={0.06} className="absolute -inset-y-8 inset-x-0">
            <Image src="/images/studio.png" alt="Inside the Zest Media print studio" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </Parallax>
        </Reveal>
        <Reveal variant="right" className="flex flex-col gap-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Our story</p>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Design, proof and print — all under one roof
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Because everything happens in our own studio, we can move fast without cutting corners. You talk to the
            same people who design your artwork and run the press.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Whether it&apos;s your first set of visiting cards or packaging for a growing product line, we treat every
            order like it&apos;s going on our own shelf.
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="values-title" className="bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionHeading id="values-title" eyebrow="What we value" title="How we work with you" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 100} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <v.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-foreground">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {gallery.length ? (
        <section aria-labelledby="about-work-title" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionHeading id="about-work-title" eyebrow="From the studio" title="A few things we've printed" link={{ href: '/work', label: 'Full portfolio' }} />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((w, i) => (
              <li key={w.id} className={i % 2 ? 'md:translate-y-8' : ''}>
                <Reveal variant="scale" delay={i * 90}>
                  <figure className="flex flex-col gap-2">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <Image src={w.image_url!} alt={w.title} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                    </div>
                    <figcaption className="text-sm font-semibold text-foreground">{w.title}</figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <BenefitsStrip />
      </div>
      <CtaBand />
    </>
  )
}
