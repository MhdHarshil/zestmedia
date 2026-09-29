import Link from 'next/link'
import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react'
import type { Category } from '@/lib/types'
import { siteConfig } from '@/lib/site-config'
import { whatsappUrl } from '@/lib/whatsapp'
import { Logo } from './logo'

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="bg-teal-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">
            A local print and branding studio. We help small businesses look sharp on paper, packaging and everything
            in between.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-cream">Explore</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="transition-colors hover:text-primary">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-cream">Categories</h2>
          {categories.length ? (
            <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
              {categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="transition-colors hover:text-primary">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-cream/70">
              <Link href="/products" className="hover:text-primary">
                Browse all products
              </Link>
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-cream">Get in touch</h2>
          <ul className="flex flex-col gap-3 text-sm text-cream/70">
            <li>
              <a
                href={whatsappUrl('Hi Zest Media!')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-primary"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2.5 hover:text-primary">
                <Mail className="size-4 shrink-0" aria-hidden="true" /> {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0" aria-hidden="true" /> {siteConfig.hours}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {siteConfig.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Zest Media. All rights reserved.</p>
          <p>Printed with care, locally.</p>
        </div>
      </div>
    </footer>
  )
}
