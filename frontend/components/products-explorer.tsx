'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

export function ProductsExplorer({ products, initialCategory }: { products: Product[]; initialCategory?: string }) {
  const productCategories = ['All products', ...Array.from(new Set(products.map((product) => product.category)))]
  const [active, setActive] = useState(
    initialCategory && productCategories.includes(initialCategory) ? initialCategory : 'All products',
  )
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = active === 'All products' || product.category === active
    const text = `${product.name} ${product.category} ${product.summary}`.toLowerCase()
    return matchesCategory && text.includes(query.trim().toLowerCase())
  }), [active, products, query])

  return (
    <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:pt-1">
        <h3 className="text-sm font-semibold">Category</h3>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {productCategories.map((cat) => (
            <button key={cat} type="button" onClick={() => setActive(cat)} aria-pressed={active === cat}
              className={cn('shrink-0 rounded-full px-3 py-2 text-left text-sm transition-colors lg:rounded-lg', active === cat ? 'bg-accent font-semibold text-foreground' : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground')}>
              {cat}
            </button>
          ))}
        </div>
        <p className="mt-5 hidden text-xs leading-5 text-muted-foreground lg:block">Every piece is made to order and can be tailored to your project.</p>
      </aside>

      <div className="min-w-0">
        <label className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 focus-within:border-foreground/40">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
        <div className="mb-4 mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>
          <span className="text-xs text-muted-foreground">Select an item to customize</span>
        </div>
        {filtered.length ? (
          <div key={`${active}-${query}`} className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => <ProductCard key={product.slug} product={product} priority={index < 3} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="font-medium">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
