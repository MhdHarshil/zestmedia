import type { Metadata } from 'next'
import Image from 'next/image'
import { Kicker } from '@/components/section-heading'
import { WhatsAppQuoteButton } from '@/components/cta-button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getWorks } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'A gallery of recent print and branding projects: business cards, banners, apparel, stickers, posters, brochures, invitations and full brand identities.',
}

export default async function WorkPage() {
  const gallery = await getWorks()
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Kicker>Our Work</Kicker>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              A look at what we&apos;ve put into the world.
            </h1>
            <p className="max-w-sm text-muted-foreground">
              Real projects for real neighbors — from a single card to a full identity. Every piece is chosen for the right stock, finish and feel.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {gallery.map((item) => (
            <ScrollReveal key={item.id} className="mb-5 break-inside-avoid">
            <figure
              className="group relative block break-inside-avoid overflow-hidden rounded-2xl border border-border bg-muted"
            >
              <Image
                src={item.image_url || '/placeholder.svg'}
                alt={item.title}
                width={800}
                height={item.featured ? 600 : 900}
                unoptimized={item.image_url.startsWith('http')}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-foreground/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-serif text-base font-semibold text-background">{item.title}</span>
                <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">{item.category}</span>
                {item.description && <span className="basis-full text-sm text-background/90">{item.description}</span>}
              </figcaption>
            </figure>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center md:px-8">
          <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-balance">
            Picture your project here next.
          </h2>
          <p className="max-w-md text-muted-foreground">Tell us what you&apos;re making and we&apos;ll help bring it to life.</p>
          <WhatsAppQuoteButton size="lg" />
        </div>
      </section>
    </>
  )
}
