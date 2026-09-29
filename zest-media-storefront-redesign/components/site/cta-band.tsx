import { MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { whatsappUrl } from '@/lib/whatsapp'

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pb-24">
      <Reveal variant="scale">
        <div className="relative overflow-hidden rounded-3xl bg-teal-deep px-6 py-12 text-cream md:px-12 md:py-16">
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/30 blur-3xl" />
          <div aria-hidden="true" className="absolute -left-16 -top-16 size-48 rounded-full border-[28px] border-cream/5" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 id="cta-title" className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Have artwork ready — or just an idea?
              </h2>
              <p className="leading-relaxed text-cream/75">
                Send us a message with what you need. We&apos;ll reply with options, a price and a timeline.
              </p>
            </div>
            <Button
              size="lg"
              className="h-12 shrink-0 rounded-full px-6 text-base"
              render={
                <a href={whatsappUrl("Hi Zest Media, here's what I need printed:")} target="_blank" rel="noopener noreferrer" />
              }
              nativeButton={false}
            >
              <MessageCircle data-icon="inline-start" />
              Message us on WhatsApp
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
