import Link from 'next/link'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { site } from '@/lib/site'
import { products } from '@/lib/products'
import { WhatsAppQuoteButton } from '@/components/cta-button'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-10 border-b border-border pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Got a project in mind? Let&apos;s make it real.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Send us the details and we&apos;ll get you a quick, honest quote — no account, no online payment, just a real conversation.
            </p>
          </div>
          <WhatsAppQuoteButton size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-brand font-serif text-lg font-semibold text-brand-foreground">
                i
              </span>
              <span className="font-serif text-lg font-semibold tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{site.tagline}. Crafted print and branding for the people who make our neighborhood.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Products</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {products.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Studio</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/work" className="text-muted-foreground transition-colors hover:text-foreground">Our Work</Link></li>
              <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link></li>
              {site.socials.instagram && <li><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">Instagram</a></li>}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold">Visit &amp; contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {site.address && <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" />{site.address}</li>}
              {site.phoneDisplay && <li className="flex items-start gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-brand" /><a href={`tel:${site.phoneDisplay.replace(/\s/g, '')}`} className="transition-colors hover:text-foreground">{site.phoneDisplay}</a></li>}
              {site.email && <li className="flex items-start gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-brand" /><a href={`mailto:${site.email}`} className="transition-colors hover:text-foreground">{site.email}</a></li>}
              {site.hours && <li className="flex items-start gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-brand" />{site.hours}</li>}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Designed &amp; printed with care.</p>
        </div>
      </div>
    </footer>
  )
}
