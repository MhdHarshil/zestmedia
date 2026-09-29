'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, MessageCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/lib/site-config'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const quoteHref = whatsappUrl("Hi Zest Media, I'd like to get a quote for a print job.")

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled ? 'border-border bg-white/95 shadow-sm backdrop-blur-md' : 'border-transparent bg-white',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-18 md:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
                      active ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300',
                        active ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-lg"
            render={<Link href="/products" aria-label="Search products" />}
            nativeButton={false}
          >
            <Search />
          </Button>
          <Button
            size="lg"
            className="hidden h-10 rounded-full px-4 !pl-4 sm:inline-flex"
            render={<a href={quoteHref} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            <MessageCircle data-icon="inline-start" />
            Get a quote
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="icon-lg" className="lg:hidden" aria-label="Open menu" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] bg-background">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4">
                <ul className="flex flex-col gap-1">
                  {siteConfig.nav.map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <SheetClose
                          render={
                            <Link
                              href={item.href}
                              aria-current={active ? 'page' : undefined}
                              className={cn(
                                'flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                                active ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
                              )}
                            />
                          }
                          nativeButton={false}
                        >
                          {item.label}
                        </SheetClose>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className="mt-auto p-4">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full"
                  render={<a href={quoteHref} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                >
                  <MessageCircle data-icon="inline-start" />
                  Get a quote on WhatsApp
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
