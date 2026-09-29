import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import type { Category, Product } from '@/lib/types'

export function CategoryTiles({ categories, products }: { categories: Category[]; products: Product[] }) {
  if (!categories.length) return null

  const imageFor = (c: Category) =>
    c.image_url ?? products.find((p) => String(p.category_id) === String(c.id))?.images?.[0] ?? null

  return (
    <section aria-labelledby="categories-title" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        id="categories-title"
        eyebrow="What we print"
        title="Shop by category"
        description="From the card in your pocket to the banner outside your shop."
        link={{ href: '/products', label: 'All products' }}
      />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {categories.map((c, i) => {
          const image = imageFor(c)
          const featured = i === 0
          return (
            <li key={c.id} className={featured ? 'col-span-2 row-span-2' : ''}>
              <Reveal variant="scale" delay={(i % 4) * 80} className="h-full">
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative flex h-full min-h-44 flex-col justify-end overflow-hidden rounded-2xl bg-teal-deep p-4 text-cream md:min-h-52 md:p-5"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                      className="object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-teal-ink via-teal-ink/40 to-transparent"
                  />
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-cream/15 backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                  <span className="relative flex flex-col gap-1">
                    <span className={featured ? 'text-2xl font-extrabold md:text-3xl' : 'text-base font-bold md:text-lg'}>
                      {c.name}
                    </span>
                    {c.description ? (
                      <span className={featured ? 'max-w-sm text-sm text-cream/80' : 'hidden text-xs text-cream/75 sm:block'}>
                        {c.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
