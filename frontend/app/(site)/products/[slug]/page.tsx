import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductQuoteForm } from '@/components/products/product-quote-form'
import { ProductCard } from '@/components/site/product-card'
import { LoadNotice } from '@/components/site/load-notice'
import { SectionHeading } from '@/components/site/section-heading'
import { getCategories, getProductBySlug, getProducts } from '@/lib/storefront-api'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getProductBySlug(slug)
  return data ? { title: data.name, description: data.description ?? undefined } : { title: 'Product' }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  const product = products.data.find((p) => p.slug === slug)
  if (!product) notFound()

  const category = categories.data.find((c) => String(c.id) === String(product.category_id))
  const related = products.data
    .filter((p) => p.id !== product.id && String(p.category_id) === String(product.category_id))
    .concat(products.data.filter((p) => p.id !== product.id && String(p.category_id) !== String(product.category_id)))
    .slice(0, 4)
  const images = product.images?.length ? product.images : product.image_url ? [product.image_url] : []

  return (
    <>
      {products.error ? (
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
          <LoadNotice error={products.error} />
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            {category ? (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <Link href={`/products?category=${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
              </li>
            ) : null}
            <li className="flex items-center gap-1.5 font-medium text-foreground">
              <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={images} name={product.name} />
        </div>
        <ProductQuoteForm product={product} categoryName={category?.name} />
      </section>

      {related.length ? (
        <section aria-labelledby="related-title" className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6">
          <SectionHeading id="related-title" eyebrow="Keep browsing" title="You might also need" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <li key={p.id}>
                <Reveal delay={i * 90} className="h-full">
                  <ProductCard
                    product={p}
                    categoryName={categories.data.find((c) => String(c.id) === String(p.category_id))?.name}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
