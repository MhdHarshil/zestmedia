import Image from 'next/image'
import { ArrowRight, BadgeCheck, MessageCircle, PackageCheck } from 'lucide-react'
import { LinkButton } from '@/components/cta-button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#062f33] text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-7 px-5 pb-8 pt-10 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-0 md:pt-0">
        <div className="relative z-10 py-2 md:py-14">
          <p className="motion-preview motion-delay-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#ff9b28]">
            <span className="h-px w-6 bg-[#ff9b28]" /> Print made personal
          </p>
          <h1 className="motion-preview motion-delay-2 mt-5 max-w-xl font-sans text-4xl font-bold leading-[1.06] text-balance sm:text-5xl md:text-6xl">
            Make your <span className="text-[#ff941c]">ideas stand out.</span>
          </h1>
          <p className="motion-preview motion-delay-3 mt-5 max-w-md text-base leading-7 text-white/75 sm:text-lg">
            Everything you need for work, events and everyday moments. Choose your print, make it yours, and get a clear quote.
          </p>
          <div className="motion-preview motion-delay-4 mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/products" size="lg" className="rounded-md bg-[#ff941c] text-[#172a29] hover:bg-[#ffab45]">
              Shop all products <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/work" variant="outline" size="lg" className="rounded-md border-white/40 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              Explore our work
            </LinkButton>
          </div>
        </div>

        <div className="motion-preview motion-delay-3 relative -mx-5 h-64 overflow-hidden sm:mx-0 sm:h-80 md:mx-0 md:h-[430px]">
          <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-none">
            <Image
              src="/images/hero.png"
              alt="A selection of custom printed cards, packaging and stationery"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062f33]/45 via-transparent to-transparent md:bg-gradient-to-r md:from-[#062f33]/30 md:via-transparent md:to-transparent" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 py-5 text-sm sm:grid-cols-3 md:px-8">
          <div className="flex items-center gap-3 text-white/85"><BadgeCheck className="size-5 shrink-0 text-[#ff941c]" /><span><strong className="block font-semibold text-white">Proof before print</strong><span className="text-xs text-white/60">Approve every detail first</span></span></div>
          <div className="flex items-center gap-3 text-white/85"><PackageCheck className="size-5 shrink-0 text-[#ff941c]" /><span><strong className="block font-semibold text-white">Made to order</strong><span className="text-xs text-white/60">Options for your project</span></span></div>
          <div className="flex items-center gap-3 text-white/85"><MessageCircle className="size-5 shrink-0 text-[#ff941c]" /><span><strong className="block font-semibold text-white">Real studio support</strong><span className="text-xs text-white/60">Get help choosing what fits</span></span></div>
        </div>
      </div>
    </section>
  )
}
