'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { PackageSearch, Search, X } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { ProductCard } from '@/components/site/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category, Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProductCatalogProps {
  products: Product[]
  categories: Category[]
  initialCategory: string
  initialQuery: string
}

function syncUrl(category: string, query: string) {
  const params = new URLSearchParams()
  if (category !== 'all') params.set('category', category)
  if (query.trim()) params.set('q', query.trim())
  const qs = params.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

export function ProductCatalog({ products, categories, initialCategory, initialQuery }: ProductCatalogProps) {
  const [category, setCategory] = useState(
    categories.some((c) => c.slug === initialCategory) ? initialCategory : 'all',
  )
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)

  const categoryById = useMemo(() => new Map(categories.map((c) => [String(c.id), c])), [categories])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return products.filter((p) => {
      const cat = p.category_id != null ? categoryById.get(String(p.category_id)) : undefined
      if (category !== 'all' && cat?.slug !== category) return false
      if (!q) return true
      return [p.name, p.description, cat?.name, ...(p.features ?? [])].some((v) => v?.toLowerCase().includes(q))
    })
  }, [products, category, deferredQuery, categoryById])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      const slug = p.category_id != null ? categoryById.get(String(p.category_id))?.slug : undefined
      if (slug) map.set(slug, (map.get(slug) ?? 0) + 1)
    }
    return map
  }, [products, categoryById])

  const selectCategory = (slug: string) => {
    setCategory(slug)
    syncUrl(slug, query)
  }
  const updateQuery = (value: string) => {
    setQuery(value)
    syncUrl(category, value)
  }
  const reset = () => {
    setCategory('all')
    setQuery('')
    syncUrl('all', '')
  }

  const filters = [{ slug: 'all', name: 'All products', count: products.length }].concat(
    categories.map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.slug) ?? 0 })),
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="relative max-w-xl">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Search cards, boxes, banners…"
            className="h-12 rounded-full bg-card pl-11 pr-11 text-base shadow-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {categories.length ? (
          <div
            role="group"
            aria-label="Filter by category"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
          >
            {filters.map((f) => {
              const active = category === f.slug
              return (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectCategory(f.slug)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                    active
                      ? 'border-teal-deep bg-teal-deep text-cream'
                      : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
                  )}
                >
                  {f.name}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[11px] leading-none',
                      active ? 'bg-cream/15 text-cream' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {products.length} products
      </p>

      {filtered.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                <ProductCard
                  product={p}
                  categoryName={p.category_id != null ? categoryById.get(String(p.category_id))?.name : undefined}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <PackageSearch className="size-6" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-foreground">
            {products.length ? 'No products match your search' : 'The catalogue is empty right now'}
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {products.length
              ? 'Try a different keyword or category.'
              : 'Check back soon, or message us on WhatsApp for a custom job.'}
          </p>
          {products.length ? (
            <Button variant="outline" className="rounded-full" onClick={reset}>
              Clear filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
