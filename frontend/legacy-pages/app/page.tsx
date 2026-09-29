import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BadgeCheck, Clock3, PackageCheck, Printer, Truck } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { ProductCard } from '@/components/product-card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { LinkButton } from '@/components/cta-button'
import { getProducts } from '@/lib/api'

const serviceBenefits = [
  { icon: BadgeCheck, title: 'Proof first', detail: 'Approve the artwork before printing' },
  { icon: PackageCheck, title: 'Made to order', detail: 'Choose the finish and quantity' },
  { icon: Truck, title: 'Pickup or delivery', detail: 'Collect locally or get it delivered' },
  { icon: Clock3, title: 'Clear turnaround', detail: 'Know the timing before you order' },
]

export default async function HomePage() {
  const products = await getProducts()
  const featured = products.slice(0, 6)
  const categories = Array.from(
    products.reduce((groups, product) => {
      const category = groups.get(product.category)
      if (category) {
        category.count += 1
      } else {
        groups.set(product.category, { name: product.category, image: product.image, count: 1 })
      }
      return groups
    }, new Map<string, { name: string; image: string; count: number }>()).values(),
  )
  return (
    <>
      <Hero />

      <section className="relative z-10 -mt-5 rounded-t-3xl bg-background">
        <ScrollReveal className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand">Shop by category</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold sm:text-3xl">Find your kind of print</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-brand">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-[#0c696d]/50"
            >
              <div className="relative h-36 overflow-hidden bg-[#f5f1e8] sm:h-44">
                <Image
                  src={category.image || '/placeholder.svg'}
                  alt=""
                  fill
                  unoptimized={category.image.startsWith('http')}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 16vw"
                  className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-[#0c696d]">{category.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{category.count} {category.count === 1 ? 'product' : 'products'}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[#0c696d]" />
              </div>
            </Link>
          ))}
        </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-16">
        <div className="grid gap-4 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="relative isolate grid min-h-[290px] overflow-hidden rounded-lg bg-[#06383b] text-white sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 flex flex-col items-start justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#ffab45]">A little more personal</p>
              <h2 className="mt-3 max-w-sm font-sans text-2xl font-semibold leading-tight sm:text-3xl">Print that brings your brand together.</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">Thoughtful materials and finishing for the details people remember.</p>
              <LinkButton href="/work" size="sm" className="mt-5 rounded-md bg-[#ff941c] text-[#172a29] hover:bg-[#ffab45]">
                Explore our work <ArrowRight className="size-4" />
              </LinkButton>
            </div>
            <div className="relative min-h-[190px] sm:min-h-[290px]">
              <Image src="/images/work-2.png" alt="Custom printed packaging and branded stationery" fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" />
            </div>
          </div>

          <div className="relative flex min-h-[290px] flex-col overflow-hidden rounded-lg bg-[#f2e9d8] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#0c696d]">Have a bigger idea?</p>
            <h2 className="mt-3 max-w-xs font-sans text-2xl font-semibold leading-tight">Build a look that feels like you.</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-foreground/70">Tell us what you are making and we will help shape the right mix of print.</p>
            <LinkButton href="/contact" variant="ink" size="sm" className="mt-4 w-fit rounded-md">
              Plan a custom project <ArrowRight className="size-4" />
            </LinkButton>
            <Image src="/images/custom-branding.png" alt="Printed brand collateral and packaging" width={320} height={320} className="mt-4 ml-auto -mb-6 -mr-6 h-36 w-44 object-contain mix-blend-multiply sm:h-40 sm:w-48" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#f3efe7]">
        <ScrollReveal className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand">The print shop</p>
              <h2 className="mt-2 font-sans text-2xl font-semibold sm:text-3xl">Made for your next project</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Choose a product to explore finishes, sizes and options, then ask us for a tailored quote.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-brand">
              Shop all products <ArrowRight className="size-4" />
            </Link>
          </div>
          {featured.length ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product, index) => (
                <ProductCard key={product.slug} product={product} priority={index < 3} previewDelay={index * 70} />
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-lg border border-dashed border-border bg-background px-5 py-10 text-center text-sm text-muted-foreground">Products are being added. Contact the studio for a custom print quote.</p>
          )}
        </ScrollReveal>
      </section>

      <section className="bg-[#062f33] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-white/15 px-5 py-2 sm:grid-cols-4 sm:divide-y-0 md:px-8">
          {serviceBenefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-3 px-3 py-5 sm:px-4">
              <benefit.icon className="size-5 shrink-0 text-[#ff941c]" />
              <div>
                <h3 className="text-sm font-semibold">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">{benefit.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
