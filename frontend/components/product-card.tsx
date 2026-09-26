import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/products'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card-link group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/25"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          priority={priority}
          unoptimized={product.image.startsWith('http')}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="product-card-image object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold tracking-tight">{product.name}</h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{product.summary}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-brand" />
          Turnaround {product.turnaround}
        </div>
      </div>
    </Link>
  )
}
