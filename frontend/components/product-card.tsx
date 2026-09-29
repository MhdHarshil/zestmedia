import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/scroll-reveal'
import type { Product } from '@/lib/products'

export function ProductCard({ product, priority = false, previewDelay }: { product: Product; priority?: boolean; previewDelay?: number }) {
  return (
    <ScrollReveal className="h-full">
    <Link
      href={`/products/${product.slug}`}
      className={`product-card-link ${previewDelay !== undefined ? 'motion-preview' : ''} group flex h-full flex-col`}
      style={previewDelay !== undefined ? { animationDelay: `${previewDelay}ms` } : undefined}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          priority={priority}
          unoptimized={product.image.startsWith('http')}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="product-card-image object-contain p-5 mix-blend-multiply"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-brand">{product.name}</h3>
        {product.startingPrice != null && <p className="mt-1 text-sm font-semibold text-foreground">From ₹{product.startingPrice.toLocaleString('en-IN')}</p>}
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{product.summary}</p>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs">
          <span className="text-muted-foreground">Ready in {product.turnaround}</span>
          <span className="font-medium text-foreground">Request quote <span aria-hidden="true">→</span></span>
        </div>
      </div>
    </Link>
    </ScrollReveal>
  )
}
