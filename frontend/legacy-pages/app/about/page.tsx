import type { Metadata } from 'next'
import Image from 'next/image'
import { Heart, Leaf, Sparkles, Handshake } from 'lucide-react'
import { Kicker, SectionHeading } from '@/components/section-heading'
import { LinkButton, WhatsAppQuoteButton } from '@/components/cta-button'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${site.name} is a local print and branding studio obsessed with tactile, high-quality work for the people who make our neighborhood.`,
}

const values = [
  { icon: Sparkles, title: 'Craft first', copy: 'We treat a business card with the same care as a full campaign. Details are the point.' },
  { icon: Handshake, title: 'Approachable', copy: 'No jargon, no minimums that shut people out. Students and startups are just as welcome.' },
  { icon: Leaf, title: 'Considered materials', copy: 'We help you pick stocks and finishes that fit the job — and waste less along the way.' },
  { icon: Heart, title: 'Local at heart', copy: 'We are part of this neighborhood, and we print like our name is on every piece. Because it is.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <Kicker>About the studio</Kicker>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
              We&apos;re a print studio, not a photocopy shop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {site.name} was born from a simple belief: that everyday print — the card you hand over, the banner above your stall, the tee your team wears — deserves to be made well. We combine design sensibility with hands-on production so your ideas land exactly how you pictured them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src="/images/about-studio.png"
              alt="Inside the studio: a designer reviewing color proofs at a wooden worktable with a large-format printer behind"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              kicker="Our story"
              title="Ten years of ink, paper and good company."
              description="What started as a small press has grown into a full studio serving local businesses, students, event organizers and individuals across the neighborhood."
            />
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                We&apos;ve printed thousands of projects — from a single wedding invitation to city-wide festival branding. Along the way, one thing has stayed the same: we care how it feels in your hands.
              </p>
              <p>
                No online checkout, no faceless order form. You talk to real people, we proof it properly, and you approve before we print. Simple, transparent, and personal.
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div><dt className="font-serif text-3xl font-semibold">2k+</dt><dd className="mt-1 text-xs text-muted-foreground">Projects</dd></div>
              <div><dt className="font-serif text-3xl font-semibold">8</dt><dd className="mt-1 text-xs text-muted-foreground">Core services</dd></div>
              <div><dt className="font-serif text-3xl font-semibold">100%</dt><dd className="mt-1 text-xs text-muted-foreground">Proofed by hand</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading kicker="What we value" title="The principles behind every print." align="center" className="mx-auto" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex size-11 items-center justify-center rounded-full bg-accent text-brand">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Let&apos;s make something worth keeping.
          </h2>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <WhatsAppQuoteButton size="lg" />
            <LinkButton href="/products" variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Browse products
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  )
}
