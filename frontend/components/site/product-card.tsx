import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'
import { productQuoteMessage, whatsappUrl } from '@/lib/whatsapp'

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const href = `/products/${product.slug}`
  const image = product.images?.[0] ?? product.image_url

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-transparent shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-t-[1.4rem] bg-transparent" tabIndex={-1} aria-hidden="true">
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
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
            {categoryName}
          </span>
        ) : null}
      </Link>

      <div className="relative -mt-6 flex flex-1 flex-col rounded-t-[1.35rem] bg-card px-4 pb-5 pt-4 shadow-[0_-2px_5px_rgba(0,0,0,0.04)] sm:px-5 sm:pb-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
            <Link href={href} className="hover:text-primary focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {product.options?.slice(0, 2).map((option) => (
              <span key={option.id} className="rounded border border-foreground/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {option.choices[0]?.label ?? option.name}
              </span>
            ))}
            {product.options?.length === 0 && product.turnaround ? (
              <span className="rounded border border-foreground/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{product.turnaround}</span>
            ) : null}
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Price</p>
            <p className="text-base font-extrabold leading-tight text-foreground">
              {product.starting_price != null ? `₹${Number(product.starting_price).toLocaleString('en-IN')}` : 'Get a quote'}
            </p>
            {product.starting_price != null ? <p className="text-[10px] text-muted-foreground">Starting price</p> : null}
          </div>
          <Button
            className="h-10 min-w-0 flex-1 rounded-xl px-3 sm:max-w-[58%]"
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
      </div>
    </article>
  )
}
