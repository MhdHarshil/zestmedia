import Link from 'next/link'
import { cn } from '@/lib/utils'
import { whatsappUrl, defaultQuoteMessage, site } from '@/lib/site'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50'

const variants = {
  brand: 'bg-brand text-brand-foreground hover:bg-brand/90',
  ink: 'bg-primary text-primary-foreground hover:bg-primary/85',
  outline: 'border border-border bg-transparent text-foreground hover:bg-accent',
  ghost: 'text-foreground hover:bg-accent',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

type Variant = keyof typeof variants
type Size = keyof typeof sizes

export function ctaClasses(variant: Variant = 'brand', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

export function LinkButton({
  href,
  variant = 'brand',
  size = 'md',
  className,
  children,
}: {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}) {
  const external = href.startsWith('http')
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={ctaClasses(variant, size, className)}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={ctaClasses(variant, size, className)}>
      {children}
    </Link>
  )
}

export function WhatsAppQuoteButton({
  message = defaultQuoteMessage,
  size = 'md',
  variant = 'brand',
  className,
  label = 'Get a Quote on WhatsApp',
}: {
  message?: string
  size?: Size
  variant?: Variant
  className?: string
  label?: string
}) {
  return (
    site.whatsappNumber ? (
      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={ctaClasses(variant, size, className)}>
        <WhatsAppIcon className="size-[1.15em]" />{label}
      </a>
    ) : (
      <span aria-disabled="true" title="Configure NEXT_PUBLIC_WHATSAPP_NUMBER to enable WhatsApp quotes" className={`${ctaClasses(variant, size, className)} cursor-not-allowed opacity-60`}>
        <WhatsAppIcon className="size-[1.15em]" />WhatsApp contact not configured
      </span>
    )
  )
}
