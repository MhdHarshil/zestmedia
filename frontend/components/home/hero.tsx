import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappUrl } from '@/lib/whatsapp'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-cream text-foreground">
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/hero-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand-orange/10 blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-12 md:px-6 md:pb-36 md:pt-16">
        <div className="flex max-w-3xl flex-col gap-6">
          <p
            className="animate-rise inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark"
            style={{ animationDelay: '60ms' }}
          >
            <span className="size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
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
            className="animate-rise max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
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
              className="h-12 rounded-full border-border bg-white px-6 text-base text-foreground hover:border-primary hover:bg-white hover:text-primary"
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

      </div>
    </section>
  )
}
