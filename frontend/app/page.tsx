import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, PencilRuler, Printer, PackageCheck } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { SectionHeading } from '@/components/section-heading'
import { ProductCard } from '@/components/product-card'
import { LinkButton } from '@/components/cta-button'
import { products } from '@/lib/products'

const audiences = [
  { title: 'Local businesses', copy: 'Cards, signage and collateral that look established from day one.' },
  { title: 'Students', copy: 'Affordable posters, tees and stickers for projects, clubs and fests.' },
  { title: 'Event organizers', copy: 'Banners, invitations and badges that tie the whole day together.' },
  { title: 'Individuals', copy: 'Personal invites, prints and gifts, made with real care.' },
  { title: 'Small businesses', copy: 'Complete brand kits and packaging without an agency price tag.' },
]

const steps = [
  { icon: PencilRuler, title: 'Share your idea', copy: 'Send your brief, artwork or even a rough sketch over WhatsApp. Need design help? We do that too.' },
  { icon: Printer, title: 'We proof & print', copy: 'You approve a proof, then we produce it on the right stock and finish for the job.' },
  { icon: PackageCheck, title: 'Pick up or delivery', copy: 'Collect from the studio or have it delivered locally — fast, and done right.' },
]

const serviceStrip = ['Visiting Cards', 'Flex & Banners', 'T-Shirts', 'Stickers', 'Posters', 'Brochures', 'Invitations', 'Branding']

export default function HomePage() {
  const featured = products.slice(0, 6)
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="What we print"
            title="Everything your brand needs, on paper and beyond."
            description="Eight core products, endless combinations. Pick one to see options and get a quote."
          />
          <LinkButton href="/products" variant="ghost" size="sm" className="text-brand hover:bg-brand/10">
            View all products <ArrowRight className="size-4" />
          </LinkButton>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 3} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionHeading
            kicker="Who we work with"
            title="Made for the people who make our neighborhood."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.copy}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between rounded-2xl bg-brand p-6 text-brand-foreground">
              <h3 className="font-serif text-xl font-semibold tracking-tight">Not sure what you need?</h3>
              <p className="mt-2 text-sm opacity-90">Tell us the goal and we&apos;ll suggest the right format, stock and quantity.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">
                Talk to us <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading kicker="How it works" title="Simple from brief to pickup." />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-brand">
                <step.icon className="size-5" />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-serif text-sm font-semibold text-muted-foreground">0{i + 1}</span>
                <h3 className="font-serif text-xl font-semibold tracking-tight">{step.title}</h3>
              </div>
              <p className="mt-2 text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src="/images/work-2.png"
              alt="A branded packaging set with printed labels, tissue paper and a custom sticker seal"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              kicker="Our work"
              title="Craft you can feel in your hands."
              description="We obsess over stock weight, finish and color so the final piece feels considered — not photocopied. Take a look at recent projects."
            />
            <div className="mt-8">
              <LinkButton href="/work" variant="ink" size="lg">
                See our work <ArrowRight className="size-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
