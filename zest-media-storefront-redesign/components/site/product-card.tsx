import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'
import { productQuoteMessage, whatsappUrl } from '@/lib/whatsapp'

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const href = `/products/${product.slug}`
  const image = product.images?.[0] ?? product.image_url

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-deep/10">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-muted" tabIndex={-1} aria-hidden="true">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
        {categoryName ? (
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            {categoryName}
          </span>
        ) : null}
        <span className="absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-full bg-card/95 text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-bold leading-snug text-foreground">
            <Link href={href} className="hover:text-primary focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          {product.description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          ) : null}
        </div>
        {product.turnaround ? (
          <p className="mt-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5 text-primary" aria-hidden="true" />
            <span>
              <span className="sr-only">Turnaround: </span>
              {product.turnaround}
            </span>
          </p>
        ) : (
          <span className="mt-auto" />
        )}
        <Button
          className="h-10 w-full rounded-full"
          render={
            <a
              href={whatsappUrl(productQuoteMessage(product.name))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Request a quote for ${product.name} on WhatsApp`}
            />
          }
          nativeButton={false}
        >
          <MessageCircle data-icon="inline-start" />
          Request quote
        </Button>
      </div>
    </article>
  )
}
