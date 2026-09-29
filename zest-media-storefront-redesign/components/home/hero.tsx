import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Parallax } from '@/components/motion/parallax'
import { Button } from '@/components/ui/button'
import { whatsappUrl } from '@/lib/whatsapp'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-teal-deep text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-28 pt-12 md:px-6 md:pb-36 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-6">
          <p
            className="animate-rise inline-flex w-fit items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cream/90"
            style={{ animationDelay: '60ms' }}
          >
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Local print & branding studio
          </p>
          <h1
            id="hero-title"
            className="animate-rise text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '140ms' }}
          >
            Print that makes your brand <span className="text-primary">impossible to ignore.</span>
          </h1>
          <p
            className="animate-rise max-w-lg text-pretty text-base leading-relaxed text-cream/75 md:text-lg"
            style={{ animationDelay: '240ms' }}
          >
            Visiting cards, packaging, brochures, banners and more — designed with you, proofed before print and
            produced in our own studio.
          </p>
          <div className="animate-rise flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '340ms' }}>
            <Button
              size="lg"
              className="h-12 rounded-full px-6 text-base"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              Browse products
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-cream/30 bg-transparent px-6 text-base text-cream hover:bg-cream/10 hover:text-cream"
              render={
                <a
                  href={whatsappUrl("Hi Zest Media, I'd like to discuss a print project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <MessageCircle data-icon="inline-start" />
              Request a quote
            </Button>
          </div>
        </div>

        <div className="relative">
          <Parallax speed={0.08}>
            <div className="animate-image-in relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/30">
              <Image
                src="/images/hero-print.png"
                alt="Stacked visiting cards, gift boxes, brochures and stationery printed by Zest Media"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Parallax>
          <div
            className="animate-rise absolute -bottom-6 left-4 hidden rounded-2xl bg-card p-4 text-foreground shadow-xl sm:block md:-left-6"
            style={{ animationDelay: '700ms' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Every order</p>
            <p className="text-sm font-bold">Digital proof before print</p>
          </div>
        </div>
      </div>
    </section>
  )
}
