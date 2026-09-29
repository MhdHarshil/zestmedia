import type { Metadata } from 'next'
import { ProductCatalog } from '@/components/products/product-catalog'
import { LoadNotice } from '@/components/site/load-notice'
import { PageHero } from '@/components/site/page-hero'
import { getCategories, getProducts } from '@/lib/storefront-api'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse visiting cards, packaging, brochures, banners, stickers, apparel and stationery from Zest Media.',
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category, q }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()])

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="Everything we print"
        description="Search the catalogue, filter by category and request a quote for the options you need."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {products.error || categories.error ? (
          <div className="mb-8">
            <LoadNotice error={products.error ?? categories.error} />
          </div>
        ) : null}
        <ProductCatalog
          products={products.data}
          categories={categories.data}
          initialCategory={category ?? 'all'}
          initialQuery={q ?? ''}
        />
      </div>
    </>
  )
}
