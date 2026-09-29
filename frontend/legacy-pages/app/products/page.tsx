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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>
}) {
  const products = await getProducts()
  const categoryParam = (await searchParams).category
  const initialCategory = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam
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

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8 md:pt-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Made for your next big idea</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Find your print</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Explore our print and branding services. Choose a product to see options and request a custom quote.</p>
        </div>
        <ProductsExplorer key={initialCategory} products={products} initialCategory={initialCategory} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <div className="flex flex-col gap-6 rounded-2xl bg-foreground px-6 py-9 text-background sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-10">
          <h2 className="max-w-lg font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Ready to make something memorable?</h2>
          <div className="max-w-sm">
            <p className="mb-4 text-sm leading-6 text-background/70">Tell us what you have in mind and we&apos;ll help you choose the right materials, finish and quantity.</p>
            <WhatsAppQuoteButton size="lg" label="Get a custom quote" />
          </div>
        </div>
      </section>
    </>
  )
}
