import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Clock, Users } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { QuoteForm } from '@/components/quote-form'
import { ProductCard } from '@/components/product-card'
import { Kicker } from '@/components/section-heading'
import { ProductImageCarousel } from '@/components/product-image-carousel'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = (await getProducts()).find((item) => item.slug === slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.summary,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find((item) => item.slug === slug)
  if (!product) notFound()

  const descriptions = product.description.length > 0
    ? product.description
    : product.summary ? [product.summary] : []
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-8">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> All products
        </Link>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <ProductImageCarousel
              key={product.slug}
              images={product.images?.length ? product.images : [product.image]}
              productName={product.name}
            />

            <div className="mt-8">
              <Kicker>{product.category}</Kicker>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">{product.name}</h1>
              <p className="mt-3 text-lg text-brand">{product.tagline}</p>
              {descriptions.length > 0 && <div className="mt-6 space-y-4 text-muted-foreground">
                {descriptions.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>}

              {product.features.length > 0 && <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    {f}
                  </div>
                ))}
              </div>}

              <div className="mt-8 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
                <div className="flex items-center gap-2.5">
                  <Clock className="size-4 text-brand" />
                  <span className="text-muted-foreground">Turnaround</span>
                  <span className="font-medium">{product.turnaround}</span>
                </div>
                {product.audiences.length > 0 && <div className="flex items-center gap-2.5">
                  <Users className="size-4 text-brand" />
                  <span className="text-muted-foreground">Great for</span>
                  <span className="font-medium">{product.audiences.join(', ')}</span>
                </div>}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <QuoteForm product={product} />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl font-semibold tracking-tight">You might also need</h2>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline">
              All products <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
