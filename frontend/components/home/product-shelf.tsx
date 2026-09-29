import { Reveal } from '@/components/motion/reveal'
import { ProductCard } from '@/components/site/product-card'
import { SectionHeading } from '@/components/site/section-heading'
import type { Category, Product } from '@/lib/types'

export function ProductShelf({ products, categories }: { products: Product[]; categories: Category[] }) {
  if (!products.length) return null
  const nameFor = (id: Product['category_id']) => categories.find((c) => String(c.id) === String(id))?.name

  return (
    <section aria-labelledby="popular-title" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        id="popular-title"
        eyebrow="Popular right now"
        title="Print products our clients love"
        description="Pick a product, choose your options and send it straight to us on WhatsApp."
        link={{ href: '/products', label: 'View all' }}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, 8).map((p, i) => (
          <li key={p.id}>
            <Reveal delay={(i % 4) * 90} className="h-full">
              <ProductCard product={p} categoryName={nameFor(p.category_id)} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
