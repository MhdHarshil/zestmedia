import Image from 'next/image'
import { LinkButton, WhatsAppQuoteButton } from '@/components/cta-button'
import { Kicker } from '@/components/section-heading'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-14 md:grid-cols-2 md:gap-12 md:px-8 md:pb-24 md:pt-20">
        <div className="flex flex-col items-start">
          <Kicker>Print &amp; Branding Studio</Kicker>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.03] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Print that makes people <span className="text-brand">look twice</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            From visiting cards to full brand identities — we design and produce tactile, high-quality print for local businesses, students, events and everyone in between.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppQuoteButton size="lg" />
            <LinkButton href="/products" variant="outline" size="lg">
              Explore products
            </LinkButton>
          </div>
          <dl className="mt-10 grid w-full max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="font-serif text-2xl font-semibold">10+</dt>
              <dd className="mt-1 text-xs text-muted-foreground">Years in print</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl font-semibold">2k+</dt>
              <dd className="mt-1 text-xs text-muted-foreground">Projects delivered</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl font-semibold">48h</dt>
              <dd className="mt-1 text-xs text-muted-foreground">Typical turnaround</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted md:aspect-[4/4.4]">
            <Image
              src="/images/hero.png"
              alt="A curated flat-lay of freshly printed cards, brochures, stickers and posters from the studio"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-sm sm:block">
            <p className="font-serif text-sm font-semibold">No online payment</p>
            <p className="text-xs text-muted-foreground">Quote &amp; approve on WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  )
}
