import type { Metadata } from 'next'
import { ProductsExplorer } from '@/components/products-explorer'
import { Kicker } from '@/components/section-heading'
import { WhatsAppQuoteButton } from '@/components/cta-button'
import { getProducts } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse our print and branding products: visiting cards, flex & banners, t-shirt printing, stickers, posters, brochures, invitations and custom branding.',
}

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Kicker>Products</Kicker>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Pick a product, choose your options, get a quote.
            </h1>
            <p className="max-w-sm text-muted-foreground">
              Every product below can be customized. Select what you need and we&apos;ll price it for you on WhatsApp — no online payment required.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <ProductsExplorer products={products} />
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center md:px-8">
          <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-balance">
            Something custom in mind? We love a challenge.
          </h2>
          <WhatsAppQuoteButton size="lg" />
        </div>
      </section>
    </>
  )
}
