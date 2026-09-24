'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { products, productCategories } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

export function ProductsExplorer() {
  const [active, setActive] = useState<(typeof productCategories)[number]>('All')

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {productCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active === cat
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div key={active} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 3} />
        ))}
      </div>
    </div>
  )
}
